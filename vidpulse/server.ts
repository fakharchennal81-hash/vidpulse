import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to extract Video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  // Fallback: check if the string itself is just a valid 11-character video ID
  const trimmed = url.trim();
  if (trimmed.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

// Lazy initializer for Gemini client
const getAiClient = (customKey?: string) => {
  const key = customKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("Gemini API key is required but was not found in the environment. Please configure it or enter it manually.");
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Check API status endpoint
app.get("/api/config-status", (req, res) => {
  res.json({
    hasEnvGeminiKey: !!process.env.GEMINI_API_KEY,
    hasEnvYoutubeKey: !!process.env.YOUTUBE_API_KEY,
  });
});

// Main YouTube Video Analysis Endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const { videoUrl, customYoutubeKey, customGeminiKey } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: "YouTube Video URL is required." });
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({ error: "Invalid YouTube Video URL or Video ID." });
    }

    // Resolve which YouTube Data API key to use
    const youtubeKey = customYoutubeKey || process.env.YOUTUBE_API_KEY;
    if (!youtubeKey) {
      return res.status(400).json({
        error: "YouTube API Key is missing. Please enter your YouTube API Key in the settings panel or provide it in the input area.",
      });
    }

    // Query YouTube Data API v3 for video snippet & statistics
    const ytUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${youtubeKey}`;
    const ytResponse = await fetch(ytUrl);
    if (!ytResponse.ok) {
      const errText = await ytResponse.text();
      let parsedError = "";
      try {
        const parsed = JSON.parse(errText);
        parsedError = parsed.error?.message || "";
      } catch {
        // Not JSON
      }
      return res.status(ytResponse.status).json({
        error: `YouTube API returned an error: ${parsedError || ytResponse.statusText || errText}`,
      });
    }

    const ytData = await ytResponse.json();
    if (!ytData.items || ytData.items.length === 0) {
      return res.status(404).json({
        error: "YouTube video not found. Ensure the video URL is correct, and the video is public.",
      });
    }

    const videoItem = ytData.items[0];
    const snippet = videoItem.snippet || {};
    const statistics = videoItem.statistics || {};

    const videoDetails = {
      id: videoId,
      title: snippet.title || "",
      description: snippet.description || "",
      tags: snippet.tags || [],
      viewCount: parseInt(statistics.viewCount || "0", 10),
      likeCount: parseInt(statistics.likeCount || "0", 10),
      commentCount: parseInt(statistics.commentCount || "0", 10),
      publishedAt: snippet.publishedAt || "",
      channelTitle: snippet.channelTitle || "",
      channelId: snippet.channelId || "",
      thumbnails: snippet.thumbnails || {},
    };

    // Instantiate Gemini Client
    let aiClient;
    try {
      aiClient = getAiClient(customGeminiKey);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }

    const prompt = `Analyze this YouTube video title: "${videoDetails.title}"
The current video tags are: ${videoDetails.tags.join(", ") || "None public"}
The video has ${videoDetails.viewCount.toLocaleString()} views and ${videoDetails.likeCount.toLocaleString()} likes.

Act as an expert YouTube growth strategist and SEO engineer. Generate 5 alternative, highly-clickable, and SEO-optimized video titles that target the same audience but have higher CTR potential. Keep them under 60 characters. Provide a deep analysis of the current title and SEO setup. Return the response as JSON adhering strictly to the schema provided.`;

    const aiResponse = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.OBJECT,
              properties: {
                titleQualityScore: {
                  type: Type.INTEGER,
                  description: "Score from 0 to 100 representing current title's quality, search friendliness, and CTR potential.",
                },
                titleLengthFeedback: {
                  type: Type.STRING,
                  description: "Critique of the current title length and general optimization recommendations.",
                },
                seoStrengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of positive aspects of the current title and tag configuration.",
                },
                seoOpportunities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of actionable areas for improving current video search ranking and click engagement.",
                },
              },
              required: ["titleQualityScore", "titleLengthFeedback", "seoStrengths", "seoOpportunities"],
            },
            suggestedTitles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "High-CTR, SEO-optimized title under 60 characters.",
                  },
                  estimatedCtrBoost: {
                    type: Type.STRING,
                    description: "Estimated percentage increase in CTR compared to the original title (e.g. '+35%').",
                  },
                  strategyType: {
                    type: Type.STRING,
                    description: "Formula or hook type used (e.g. 'Curiosity Gap', 'Benefit-Driven', 'Urgency', 'Question hook').",
                  },
                  whyItWorks: {
                    type: Type.STRING,
                    description: "Psychological explanation of why this title drives higher click rate and search ranking.",
                  },
                  keyKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "High-volume search terms integrated into this title suggestion.",
                  },
                },
                required: ["title", "estimatedCtrBoost", "strategyType", "whyItWorks", "keyKeywords"],
              },
            },
          },
          required: ["analysis", "suggestedTitles"],
        },
      },
    });

    const geminiText = aiResponse.text;
    if (!geminiText) {
      throw new Error("Empty response from Gemini AI model.");
    }

    const analysisResult = JSON.parse(geminiText.trim());

    res.json({
      success: true,
      videoDetails,
      analysisResult,
    });
  } catch (error: any) {
    console.error("API error:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred during YouTube video SEO analysis." });
  }
});

// Setup Vite Development Middleware or Serve Production Bundle
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import { AnalysisResponse } from "./types";

export interface PresetDemo {
  id: string;
  name: string;
  url: string;
  data: AnalysisResponse;
}

export const PRESETS: PresetDemo[] = [
  {
    id: "tech-unboxing",
    name: "Tech Unboxing (High CTR)",
    url: "https://www.youtube.com/watch?v=fT2EwtV7P9c",
    data: {
      success: true,
      videoDetails: {
        id: "fT2EwtV7P9c",
        title: "I Bought the Most Expensive Futuristic Phone of 2026! 📱💸",
        description: "Checking out the brand new, triple-folding, holographic smart device. Is it actually worth the ridiculous $3,500 price tag, or is it just another gimmick? Let's unbox and find out!",
        tags: [
          "future tech",
          "unboxing",
          "holographic phone",
          "triple fold phone",
          "most expensive phone",
          "tech review",
          "smartphones"
        ],
        viewCount: 1420500,
        likeCount: 94200,
        commentCount: 8430,
        publishedAt: "2026-06-15T15:00:00Z",
        channelTitle: "TechPulse Labs",
        channelId: "UCtechpulselabs123",
        thumbnails: {
          high: {
            url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60",
            width: 800,
            height: 450
          }
        }
      },
      analysisResult: {
        analysis: {
          titleQualityScore: 82,
          titleLengthFeedback: "The current title is 54 characters long, which falls into the optimal 20-60 character sweet-spot. The inclusion of emojis (📱💸) and high-emotion words ('Most Expensive', 'Futuristic') helps increase initial visual standout on the feeds.",
          seoStrengths: [
            "Excellent length (54 characters) preventing search snippet truncation.",
            "Strong emotional hook using high spending curiosity ('Most Expensive').",
            "Targets popular keywords: 'Futuristic Phone', 'Most Expensive Phone', '2026'."
          ],
          seoOpportunities: [
            "The term 'Futuristic' has slightly lower search volume than 'Folding Phone' or 'Holographic Phone'.",
            "Could benefit from a curiosity gap (e.g., 'I was wrong about this...').",
            "Tag density can be improved to target more long-tail queries."
          ]
        },
        suggestedTitles: [
          {
            title: "I spent $3,500 on a Holographic Phone (Is it real?) 🤯",
            estimatedCtrBoost: "+38%",
            strategyType: "Curiosity Gap & Price Hook",
            whyItWorks: "Putting the concrete price tag ($3,500) next to a mind-blowing technology (Holographic) triggers intense viewer intrigue, and the parenthesis question creates an unresolved loophole.",
            keyKeywords: ["$3500 phone", "Holographic Phone", "expensive tech"]
          },
          {
            title: "This Triple-Folding Phone is actually ridiculous. 📱",
            estimatedCtrBoost: "+27%",
            strategyType: "Benefit & Disbelief Hook",
            whyItWorks: "Uses informal casual phrasing ('actually ridiculous') which matches how viewers speak, triggering a highly personal and unfiltered review expectation.",
            keyKeywords: ["Triple-Folding Phone", "folding phone", "smartphone review"]
          },
          {
            title: "Why 2026 Phones Are Already Mind-Blowing",
            estimatedCtrBoost: "+15%",
            strategyType: "Authority & Future Trends",
            whyItWorks: "Positions the video as a forward-looking industry analysis, attracting tech enthusiasts interested in next-generation innovation.",
            keyKeywords: ["2026 phones", "future tech", "smartphones"]
          },
          {
            title: "The $3,500 Holographic Phone: Gimmick or Future?",
            estimatedCtrBoost: "+31%",
            strategyType: "A/B Dilemma Hook",
            whyItWorks: "Forces the viewer to choose between two opposing viewpoints ('Gimmick' or 'Future'), driving them to watch the video to form their opinion.",
            keyKeywords: ["Holographic Phone", "futuristic phone", "tech unboxing"]
          },
          {
            title: "I unboxed a holographic phone. Here's the truth.",
            estimatedCtrBoost: "+42%",
            strategyType: "Radical Honesty Hook",
            whyItWorks: "The phrase 'Here's the truth' suggests an insider, non-sponsored perspective, which is one of the highest CTR drivers in tech media.",
            keyKeywords: ["holographic phone unboxing", "the truth about holographic", "TechPulse"]
          }
        ]
      }
    }
  },
  {
    id: "coding-saas",
    name: "Coding SaaS Tutorial (Education)",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    data: {
      success: true,
      videoDetails: {
        id: "dQw4w9WgXcQ",
        title: "How to Build a Full-Stack SaaS in 2 Hours! (Next.js, Supabase & Tailwind) 🚀",
        description: "Step by step tutorial showing you how to build a production-ready Software-as-a-Service from absolute scratch. Learn authentication, database design, Stripe subscriptions, and modern deployment pipelines.",
        tags: [
          "nextjs tutorial",
          "supabase",
          "tailwind css",
          "saas boilerplate",
          "build a saas",
          "full stack web development",
          "stripe integration",
          "react js"
        ],
        viewCount: 485000,
        likeCount: 38200,
        commentCount: 2940,
        publishedAt: "2026-04-02T16:15:00Z",
        channelTitle: "CodeCraft Academy",
        channelId: "UCcodecraftacademy789",
        thumbnails: {
          high: {
            url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
            width: 800,
            height: 450
          }
        }
      },
      analysisResult: {
        analysis: {
          titleQualityScore: 78,
          titleLengthFeedback: "The current title is 74 characters long. While highly descriptive, it will likely be cut off on mobile devices (where titles truncate around 55-60 characters). The stack names in parentheses are great, but are pushed too far to the end.",
          seoStrengths: [
            "Targets very high-volume keywords: 'Build a SaaS', 'Next.js', 'Supabase'.",
            "Clear time frame benefit ('in 2 Hours') which increases commitment appeal.",
            "Includes rocket emoji 🚀 for click-through attention."
          ],
          seoOpportunities: [
            "Shorten the title to prevent truncation on mobile screens.",
            "Shift core technology stack keywords closer to the beginning of the title.",
            "Incorporate a financial benefit (e.g. 'Build a SaaS that actually makes money')."
          ]
        },
        suggestedTitles: [
          {
            title: "Build a Full-Stack SaaS in 2 Hours (Next.js & Supabase)",
            estimatedCtrBoost: "+18%",
            strategyType: "Mobile-Truncation Safe",
            whyItWorks: "Maintains all powerful keywords but trims wordiness to ensure the complete tech stack remains visible on mobile feeds.",
            keyKeywords: ["SaaS Next.js", "Supabase tutorial", "Full-Stack SaaS"]
          },
          {
            title: "I Built a SaaS in 2 Hours. Here is the Blueprint.",
            estimatedCtrBoost: "+32%",
            strategyType: "Case Study & Authority",
            whyItWorks: "Switches the perspective from a manual tutorial to an authoritative 'blueprint' case study, attracting advanced developers.",
            keyKeywords: ["Build SaaS", "SaaS blueprint", "Next.js dev"]
          },
          {
            title: "How to Build a SaaS in 2026 (The Easy Way) ⚡",
            estimatedCtrBoost: "+24%",
            strategyType: "Simplification & Date Hook",
            whyItWorks: "Appeals to beginners by promising 'The Easy Way' and updates relevance with 'in 2026' temporal tagging.",
            keyKeywords: ["How to build a SaaS", "SaaS 2026", "web development"]
          },
          {
            title: "Stop Building Mock Apps. Build a Real SaaS in 2 Hours.",
            estimatedCtrBoost: "+45%",
            strategyType: "Frustration & Direct Callout",
            whyItWorks: "Triggers emotional resonance by addressing a common developer frustration ('tutorial hell' / building mock apps) and offering a direct solution.",
            keyKeywords: ["real SaaS", "Nextjs tutorial", "learn Supabase"]
          },
          {
            title: "From $0 to SaaS: Code a Web App in 2 Hours 💻",
            estimatedCtrBoost: "+29%",
            strategyType: "Outcome & Value Driven",
            whyItWorks: "Hooks the viewer with the ultimate transformation ($0 to active Software-as-a-Service), adding direct financial incentive to code.",
            keyKeywords: ["Code a web app", "SaaS development", "Next.js Stripe"]
          }
        ]
      }
    }
  },
  {
    id: "productivity-habits",
    name: "AI Productivity Habits (Lifestyle/Business)",
    url: "https://www.youtube.com/watch?v=XvK_w0Y3Zt8",
    data: {
      success: true,
      videoDetails: {
        id: "XvK_w0Y3Zt8",
        title: "How I Use AI to Automate 80% of My Daily Work Life 🤖📈",
        description: "A complete guide to my personal AI automation stack. I'll share the custom prompts, GPT agents, automated schedulers, and note-taking integrations that save me 25+ hours every single week.",
        tags: [
          "AI productivity",
          "work automation",
          "automate my life",
          "productive routines",
          "artificial intelligence tools",
          "save time with AI",
          "chatgpt workflows"
        ],
        viewCount: 890000,
        likeCount: 61000,
        commentCount: 4200,
        publishedAt: "2026-05-10T14:30:00Z",
        channelTitle: "Vibe & Velocity",
        channelId: "UCvibeandvelocity456",
        thumbnails: {
          high: {
            url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&auto=format&fit=crop&q=60",
            width: 800,
            height: 450
          }
        }
      },
      analysisResult: {
        analysis: {
          titleQualityScore: 89,
          titleLengthFeedback: "Extremely strong title (49 characters) that is highly readable on both desktop and mobile. The percentage stat 'Automate 80%' is concrete and acts as an immediate click magnet.",
          seoStrengths: [
            "Ideal length (49 characters) which maximizes visibility on mobile search results.",
            "Very clear, concrete promise ('Automate 80% of my work life').",
            "Great use of trending keyword pairing: 'AI' + 'Automate'."
          ],
          seoOpportunities: [
            "Could target the passive income / time saving angle deeper in the title.",
            "Can leverage curiosity gaps (e.g. 'I let AI run my life for 7 days...').",
            "Missing explicit references to popular AI platforms like Gemini or ChatGPT."
          ]
        },
        suggestedTitles: [
          {
            title: "I Let AI Run My Life for 7 Days (Here's what happened) 🤖",
            estimatedCtrBoost: "+41%",
            strategyType: "Experiment & Extreme Challenge",
            whyItWorks: "Frames the content as an entertaining experiential challenge ('Let AI run my life') rather than just a dry checklist of tips.",
            keyKeywords: ["AI run my life", "artificial intelligence experiment", "productivity"]
          },
          {
            title: "5 AI Automations That Save Me 25 Hours a Week",
            estimatedCtrBoost: "+33%",
            strategyType: "Listicle & Precise Benefit",
            whyItWorks: "Gives a concrete count of automations (5) and a highly desirable time-saving payoff (25 Hours a Week), making it low-effort and high-value to click.",
            keyKeywords: ["AI automations", "save hours with AI", "AI tools list"]
          },
          {
            title: "The Ultimate AI Stack to Automate Your Daily Work",
            estimatedCtrBoost: "+12%",
            strategyType: "Authority & Resource Hub",
            whyItWorks: "Appeals to viewers looking for direct, actionable utility resources by calling it 'The Ultimate AI Stack'.",
            keyKeywords: ["AI stack", "automate daily work", "work automation"]
          },
          {
            title: "Stop working so hard. Let AI do 80% of it. 🚀",
            estimatedCtrBoost: "+36%",
            strategyType: "Contrarian Advice",
            whyItWorks: "Starts with an unconventional, reassuring command ('Stop working so hard') which instantly captures attention of tired or burnt-out professionals.",
            keyKeywords: ["AI productivity hack", "automate life", "AI tools"]
          },
          {
            title: "I replaced myself with AI. (And you should too)",
            estimatedCtrBoost: "+52%",
            strategyType: "Hyperbolic & High Stakes",
            whyItWorks: "A highly provocative claim ('replaced myself') which creates immense suspense. The parenthesis command acts as an direct challenge to the reader.",
            keyKeywords: ["replaced by AI", "artificial intelligence productivity", "work automation"]
          }
        ]
      }
    }
  }
];

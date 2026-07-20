import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Search,
  Youtube,
  Key,
  Copy,
  Check,
  ExternalLink,
  TrendingUp,
  Video,
  MessageSquare,
  ThumbsUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Flame,
  LineChart,
  Info,
  HelpCircle
} from "lucide-react";
import { PRESETS, PresetDemo } from "./presets";
import { AnalysisResponse, ConfigStatus } from "./types";

export default function App() {
  // Input URL
  const [videoUrl, setVideoUrl] = useState("");
  
  // Custom API keys (loaded from localStorage on mount)
  const [customYoutubeKey, setCustomYoutubeKey] = useState("");
  const [customGeminiKey, setCustomGeminiKey] = useState("");
  
  // App state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  
  // UI States
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [copiedTagsString, setCopiedTagsString] = useState(false);
  const [copiedTitles, setCopiedTitles] = useState<Record<string, boolean>>({});
  const [copiedSingleTag, setCopiedSingleTag] = useState<string | null>(null);

  // Load custom keys and configuration status on mount
  useEffect(() => {
    const savedYtKey = localStorage.getItem("vidpulse_youtube_key") || "";
    const savedGeminiKey = localStorage.getItem("vidpulse_gemini_key") || "";
    setCustomYoutubeKey(savedYtKey);
    setCustomGeminiKey(savedGeminiKey);

    // Load first preset by default to make the initial view lively and beautiful
    setResult(PRESETS[0].data);
    setActivePresetId(PRESETS[0].id);

    // Fetch config status from backend
    fetch("/api/config-status")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load environment configuration status");
      })
      .then((data: ConfigStatus) => {
        setConfigStatus(data);
      })
      .catch((err) => {
        console.error("Config status error:", err);
      });
  }, []);

  // Save custom keys to localStorage when changed
  const saveCustomKeys = (ytKey: string, geminiKey: string) => {
    localStorage.setItem("vidpulse_youtube_key", ytKey);
    localStorage.setItem("vidpulse_gemini_key", geminiKey);
    setCustomYoutubeKey(ytKey);
    setCustomGeminiKey(geminiKey);
    setShowConfigDrawer(false);
  };

  // Clear custom keys
  const clearCustomKeys = () => {
    localStorage.removeItem("vidpulse_youtube_key");
    localStorage.removeItem("vidpulse_gemini_key");
    setCustomYoutubeKey("");
    setCustomGeminiKey("");
  };

  // Perform Analysis
  const handleAnalyze = async (e?: React.FormEvent, targetUrl?: string) => {
    if (e) e.preventDefault();
    
    const urlToAnalyze = targetUrl || videoUrl;
    if (!urlToAnalyze.trim()) {
      setError("Please paste a YouTube Video URL first.");
      return;
    }

    setLoading(true);
    setError(null);
    setActivePresetId(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoUrl: urlToAnalyze,
          customYoutubeKey: customYoutubeKey || undefined,
          customGeminiKey: customGeminiKey || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      setResult(data);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  // Load Preset Demo
  const handleLoadPreset = (preset: PresetDemo) => {
    setLoading(true);
    setError(null);
    // Add micro-delay for realistic visual feedback
    setTimeout(() => {
      setResult(preset.data);
      setActivePresetId(preset.id);
      setVideoUrl(preset.url);
      setLoading(false);
    }, 400);
  };

  // Copy helper
  const copyToClipboard = (text: string, type: "tags" | "title" | "single_tag", tagValue?: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        if (type === "tags") {
          setCopiedTagsString(true);
          setTimeout(() => setCopiedTagsString(false), 2000);
        } else if (type === "title") {
          setCopiedTitles((prev) => ({ ...prev, [text]: true }));
          setTimeout(() => {
            setCopiedTitles((prev) => ({ ...prev, [text]: false }));
          }, 2000);
        } else if (type === "single_tag" && tagValue) {
          setCopiedSingleTag(tagValue);
          setTimeout(() => setCopiedSingleTag(null), 1500);
        }
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return { text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" };
    if (score >= 70) return { text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" };
    return { text: "text-rose-400", border: "border-rose-500/30", bg: "bg-rose-500/10" };
  };

  const isYtActive = configStatus?.hasEnvYoutubeKey || !!customYoutubeKey;
  const isGeminiActive = configStatus?.hasEnvGeminiKey || !!customGeminiKey;

  return (
    <div id="vidpulse-container" className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 antialiased">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Notification / Warning if API key is missing */}
      {configStatus && (!isYtActive || !isGeminiActive) && (
        <div id="api-status-banner" className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/20 px-4 py-2 text-center text-xs text-amber-300 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {!isYtActive && !isGeminiActive
              ? "Both YouTube and Gemini API credentials are required to analyze your own URLs. Open 'API Credentials' to set them up."
              : !isYtActive
              ? "YouTube API Key is missing. Live custom analysis will fail. Please click 'API Credentials' to configure."
              : "Gemini API Key is missing. AI Title Generation will fail. Please click 'API Credentials' to configure."}
          </span>
          <button
            id="open-credentials-banner-btn"
            onClick={() => setShowConfigDrawer(true)}
            className="underline font-semibold hover:text-white ml-2 cursor-pointer transition-colors"
          >
            Configure Credentials
          </button>
        </div>
      )}

      {/* Main App Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* Header Block */}
        <header id="main-header" className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-slate-800/60 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/10">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                VidPulse
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-300">
                SEO v3.5
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              Extract competitor tags, audit title CTR mechanics, and generate optimized titles powered by Google Gemini.
            </p>
          </div>

          {/* Credentials Status Control Button */}
          <div className="flex items-center gap-3">
            <button
              id="credentials-drawer-toggle-btn"
              onClick={() => setShowConfigDrawer(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50 text-slate-200 hover:text-white transition-all text-sm cursor-pointer shadow-sm"
            >
              <Key className="w-4 h-4 text-indigo-400" />
              <span>API Credentials</span>
              <div className="flex gap-1 ml-1.5">
                <span className={`w-2 h-2 rounded-full ${isYtActive ? "bg-emerald-400" : "bg-rose-400"}`} />
                <span className={`w-2 h-2 rounded-full ${isGeminiActive ? "bg-emerald-400" : "bg-rose-400"}`} />
              </div>
            </button>
          </div>
        </header>

        {/* Input Bar and Presets Row */}
        <section id="url-submission-section" className="mb-10 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <form onSubmit={(e) => handleAnalyze(e)} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="youtube-url-input"
                type="text"
                placeholder="Paste competitor YouTube video link (e.g., https://www.youtube.com/watch?v=...) or paste an 11-char ID"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner font-sans"
              />
            </div>
            <button
              id="submit-analysis-btn"
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Video...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>Run SEO Audit</span>
                </>
              )}
            </button>
          </form>

          {/* Preset Chips */}
          <div id="preset-selector-container" className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-800/50 pt-4">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Try Premium Demos:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  id={`preset-btn-${preset.id}`}
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    activePresetId === preset.id
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-300 shadow-md"
                      : "bg-slate-950 border-slate-800/60 hover:border-slate-700 text-slate-300 hover:text-white"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Global Loading Spinner / Status screen */}
        {loading && (
          <div id="global-loading-screen" className="py-20 flex flex-col items-center justify-center">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">VidPulse AI Engine Working</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-sm text-center">
              Querying live metadata metrics and preparing growth-driven SEO titles with Gemini 3.5...
            </p>
          </div>
        )}

        {/* Error Callout */}
        {error && !loading && (
          <div id="error-callout-panel" className="mb-8 border border-rose-500/20 bg-rose-500/5 rounded-2xl p-5 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-rose-300">Analysis Error Encountered</h4>
              <p className="text-sm text-rose-200/85 mt-1">{error}</p>
              <div className="mt-4 flex gap-3">
                <button
                  id="error-fix-credentials-btn"
                  onClick={() => setShowConfigDrawer(true)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs font-semibold cursor-pointer transition-all"
                >
                  Configure Keys
                </button>
                <button
                  id="error-retry-btn"
                  onClick={() => handleAnalyze()}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-all"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audit Report Stage */}
        <AnimatePresence mode="wait">
          {result && !loading && (
            <motion.div
              id="analysis-dashboard-stage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* LEFT COLUMN: Profile & Metrics Panel (5 Cols) */}
              <div id="left-metrics-column" className="lg:col-span-5 space-y-8">
                
                {/* 1. Video Profile Card */}
                <div id="video-profile-card" className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-lg overflow-hidden">
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-slate-800">
                    {result.videoDetails.thumbnails?.high?.url ? (
                      <img
                        src={result.videoDetails.thumbnails.high.url}
                        alt={result.videoDetails.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-600">
                        <Video className="w-12 h-12 mb-2" />
                        <span className="text-xs">No preview image</span>
                      </div>
                    )}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-300 backdrop-blur-sm border border-slate-800">
                      ID: {result.videoDetails.id}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold line-clamp-2 text-slate-100 font-sans tracking-tight leading-snug">
                    {result.videoDetails.title}
                  </h3>

                  <div className="flex items-center justify-between mt-3 text-xs border-t border-slate-800/60 pt-3">
                    <span className="text-indigo-300 font-medium">{result.videoDetails.channelTitle}</span>
                    <a
                      id="youtube-external-watch-link"
                      href={`https://www.youtube.com/watch?v=${result.videoDetails.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Watch Competitor</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 2. Stats Grid Card */}
                <div id="video-stats-grid-card" className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 shadow-md">
                  <h4 className="text-xs font-mono tracking-wider uppercase text-slate-500 mb-4 flex items-center gap-1.5">
                    <LineChart className="w-3.5 h-3.5" />
                    Performance Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                      <span className="text-[11px] text-slate-400 block font-mono">TOTAL VIEWS</span>
                      <span className="text-xl font-display font-bold text-slate-100 block mt-1">
                        {result.videoDetails.viewCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                      <span className="text-[11px] text-slate-400 block font-mono">TOTAL LIKES</span>
                      <span className="text-xl font-display font-bold text-slate-100 block mt-1">
                        {result.videoDetails.likeCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                      <span className="text-[11px] text-slate-400 block font-mono">COMMENTS</span>
                      <span className="text-xl font-display font-bold text-slate-100 block mt-1">
                        {result.videoDetails.commentCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                      <span className="text-[11px] text-slate-400 block font-mono">PUBLISHED</span>
                      <span className="text-sm font-semibold text-slate-100 block mt-2 font-mono">
                        {new Date(result.videoDetails.publishedAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Title Length & Score Card */}
                <div id="seo-score-audit-card" className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-mono tracking-wider uppercase text-slate-500">
                      AI SEO Quality Rating
                    </h4>
                    <span className="text-xs font-semibold text-slate-400">Original Title</span>
                  </div>

                  <div className="flex items-center gap-5 bg-slate-950/50 p-4 rounded-xl border border-slate-850">
                    {/* Ring score visualization */}
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-800"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={
                            result.analysisResult.analysis.titleQualityScore >= 85
                              ? "text-emerald-500"
                              : result.analysisResult.analysis.titleQualityScore >= 70
                              ? "text-amber-500"
                              : "text-rose-500"
                          }
                          strokeWidth="3.5"
                          strokeDasharray={`${result.analysisResult.analysis.titleQualityScore}, 100`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-base font-display font-bold text-white">
                        {result.analysisResult.analysis.titleQualityScore}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getScoreColor(result.analysisResult.analysis.titleQualityScore).bg} ${getScoreColor(result.analysisResult.analysis.titleQualityScore).text} border ${getScoreColor(result.analysisResult.analysis.titleQualityScore).border}`}>
                          {result.analysisResult.analysis.titleQualityScore >= 85
                            ? "Excellent Potential"
                            : result.analysisResult.analysis.titleQualityScore >= 70
                            ? "Moderate Potential"
                            : "Weak CTR Strength"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        Weighted optimization score representing readability, search ranking index, and click-trigger potential.
                      </p>
                    </div>
                  </div>

                  {/* Character check */}
                  <div className="mt-4 p-4 bg-slate-950/40 rounded-xl border border-slate-850/60">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-medium">Title length check:</span>
                      <span className={`font-mono font-semibold ${
                        result.videoDetails.title.length <= 60 && result.videoDetails.title.length >= 20
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}>
                        {result.videoDetails.title.length} characters
                      </span>
                    </div>
                    {result.videoDetails.title.length <= 60 && result.videoDetails.title.length >= 20 ? (
                      <div className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Length is highly optimized. Fits fully in mobile and desktop feeds without cutting off.</span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 text-xs text-slate-300">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>Suboptimal length. Search platforms cut off titles beyond 60 chars. This limits mobile CTR.</span>
                      </div>
                    )}
                    <div className="text-[11px] text-slate-400 mt-3 border-t border-slate-800/40 pt-2">
                      <span className="font-semibold block text-slate-300">Auditor Critique:</span>
                      {result.analysisResult.analysis.titleLengthFeedback}
                    </div>
                  </div>
                </div>

                {/* 4. Competitor Tags Card */}
                <div id="competitor-tags-card" className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-mono tracking-wider uppercase text-slate-500">
                      🏷️ Competitor Meta Tags
                    </h4>
                    {result.videoDetails.tags.length > 0 && (
                      <button
                        id="copy-all-tags-btn"
                        onClick={() => copyToClipboard(result.videoDetails.tags.join(", "), "tags")}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedTagsString ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Tag String</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {result.videoDetails.tags.length > 0 ? (
                    <div>
                      <p className="text-xs text-slate-400 mb-3">
                        Integrate these tags in your video details. Click any individual tag below to copy.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.videoDetails.tags.map((tag, idx) => (
                          <button
                            id={`tag-btn-${idx}`}
                            key={idx}
                            onClick={() => copyToClipboard(tag, "single_tag", tag)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer flex items-center gap-1 ${
                              copiedSingleTag === tag
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-300"
                                : "bg-slate-950/60 border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white"
                            }`}
                          >
                            <span>{tag}</span>
                            {copiedSingleTag === tag ? (
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 text-center">
                      <Info className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-300 font-medium">No Public Tags Identified</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        This creator has either disabled tags, or does not use public tags. Their search targeting is managed purely by title and description algorithms.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: AI Optimization Engine (7 Cols) */}
              <div id="right-optimizer-column" className="lg:col-span-7 space-y-8 animate-fade-in">
                
                {/* 1. Strengths & Opportunities (Bento Box) */}
                <div id="strengths-opportunities-panel" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 shadow-sm">
                    <h4 className="text-xs font-mono tracking-wider uppercase text-emerald-400 mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      SEO Strengths
                    </h4>
                    <ul className="space-y-2.5">
                      {result.analysisResult.analysis.seoStrengths.map((strength, index) => (
                        <li key={index} className="flex gap-2.5 items-start text-xs text-slate-300 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 shadow-sm">
                    <h4 className="text-xs font-mono tracking-wider uppercase text-amber-400 mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Optimizing Opportunities
                    </h4>
                    <ul className="space-y-2.5">
                      {result.analysisResult.analysis.seoOpportunities.map((opportunity, index) => (
                        <li key={index} className="flex gap-2.5 items-start text-xs text-slate-300 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span>{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 2. Main AI Generated Title Recommendations */}
                <div id="ai-recommendations-panel" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  {/* Subtle decorative glow in card */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/60 mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-lg font-display font-bold text-white">
                        AI Title Recommendations
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Optimized for highest Click-Through Rate
                    </span>
                  </div>

                  {/* Original Title Reference */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 mb-6 text-xs">
                    <span className="font-mono text-[10px] text-slate-500 block uppercase tracking-wider mb-1">
                      CURRENT TITLE (COMPETITOR)
                    </span>
                    <span className="text-slate-300 font-medium">
                      "{result.videoDetails.title}"
                    </span>
                  </div>

                  {/* Suggested Title Cards List */}
                  <div className="space-y-5">
                    {result.analysisResult.suggestedTitles.map((suggestion, index) => {
                      const isCopied = !!copiedTitles[suggestion.title];
                      return (
                        <div
                          id={`suggestion-card-${index}`}
                          key={index}
                          className="group relative bg-slate-950/80 hover:bg-slate-950/100 border border-slate-850 hover:border-indigo-500/40 rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/2"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                            {/* Strategy Tag & Stats */}
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-900/50 text-indigo-300">
                                {suggestion.strategyType}
                              </span>
                              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono font-bold">
                                <TrendingUp className="w-3 h-3" />
                                <span>{suggestion.estimatedCtrBoost} Est. CTR</span>
                              </div>
                            </div>

                            {/* Click Copy button */}
                            <button
                              id={`copy-suggestion-btn-${index}`}
                              onClick={() => copyToClipboard(suggestion.title, "title")}
                              className={`sm:opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-xs font-medium ${
                                isCopied
                                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                                  : "bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300"
                              }`}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Title</span>
                                </>
                              )}
                            </button>
                          </div>

                          <h4 className="text-sm font-semibold text-slate-100 tracking-tight leading-snug pr-0 sm:pr-24">
                            {suggestion.title}
                          </h4>

                          {/* Targeted Keywords inside this title */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-3">
                            <span className="text-[10px] text-slate-500 font-mono">TARGETING:</span>
                            {suggestion.keyKeywords.map((kw, kwIdx) => (
                              <span key={kwIdx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800/40">
                                {kw}
                              </span>
                            ))}
                          </div>

                          {/* Psychological Breakdown */}
                          <p className="text-xs text-slate-400 italic mt-3 bg-slate-950 p-2.5 rounded border border-slate-900 leading-relaxed">
                            💡 <span className="font-semibold text-slate-300 not-italic">Strategy logic:</span> {suggestion.whyItWorks}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* CREDENTIALS CONFIGURATION SIDEBAR / DRAWER */}
      <AnimatePresence>
        {showConfigDrawer && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              id="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfigDrawer(false)}
              className="fixed inset-0 bg-black z-40 cursor-pointer"
            />

            {/* Content Container */}
            <motion.div
              id="credentials-drawer-container"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 p-6 sm:p-8 overflow-y-auto z-50 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-indigo-400" />
                    API Credentials Config
                  </h3>
                  <button
                    id="close-drawer-btn"
                    onClick={() => setShowConfigDrawer(false)}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  VidPulse uses the <strong>YouTube Data API v3</strong> to retrieve competitor tags and metrics, and <strong>Google Gemini API (gemini-3.5-flash)</strong> to perform strategies and title optimization.
                </p>

                {/* API Status Badges */}
                <div className="space-y-4 mb-6">
                  {/* YouTube Badge */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Youtube className="w-4 h-4 text-rose-500" />
                        YouTube Data API Key
                      </span>
                      {isYtActive ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {configStatus?.hasEnvYoutubeKey 
                        ? "Active key detected in the system backend environment variables." 
                        : "Custom key or system variable required to fetch live YouTube titles and views."}
                    </p>
                  </div>

                  {/* Gemini Badge */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        Google Gemini API Key
                      </span>
                      {isGeminiActive ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {configStatus?.hasEnvGeminiKey
                        ? "Active key detected in the system backend environment variables."
                        : "Required to connect to gemini-3.5-flash for the AI Generator."}
                    </p>
                  </div>
                </div>

                {/* Manual override input fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Enter YouTube API Key (Optional Override)
                    </label>
                    <input
                      id="youtube-api-key-drawer-input"
                      type="password"
                      placeholder={configStatus?.hasEnvYoutubeKey ? "••••••••••••••••••••••••••••••••••••" : "Paste custom AI/Data Studio Key..."}
                      value={customYoutubeKey}
                      onChange={(e) => setCustomYoutubeKey(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Enter Gemini API Key (Optional Override)
                    </label>
                    <input
                      id="gemini-api-key-drawer-input"
                      type="password"
                      placeholder={configStatus?.hasEnvGeminiKey ? "••••••••••••••••••••••••••••••••••••" : "Paste custom Google AI Studio Key..."}
                      value={customGeminiKey}
                      onChange={(e) => setCustomGeminiKey(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Custom keys will be saved locally inside your browser's secure cache (localStorage).
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer actions */}
              <div className="pt-6 border-t border-slate-800 mt-8 flex flex-col gap-2">
                <button
                  id="save-credentials-btn"
                  onClick={() => saveCustomKeys(customYoutubeKey, customGeminiKey)}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer text-center"
                >
                  Save Credentials
                </button>
                {(customYoutubeKey || customGeminiKey) && (
                  <button
                    id="clear-custom-credentials-btn"
                    onClick={clearCustomKeys}
                    className="w-full py-3 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-400 hover:text-white font-semibold text-xs transition-all cursor-pointer text-center"
                  >
                    Clear Override Keys
                  </button>
                )}
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                  <a
                    href="https://console.cloud.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-400 underline flex items-center gap-0.5"
                  >
                    Get YouTube Key
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href="https://aistudio.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-400 underline flex items-center gap-0.5"
                  >
                    Get Gemini Key
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Humble credit info footer */}
      <footer id="app-footer" className="text-center text-xs text-slate-600 py-10 border-t border-slate-900 mt-16">
        <p>© 2026 VidPulse SEO Suite. Powered by Gemini-3.5-Flash & YouTube Metadata Services.</p>
      </footer>
    </div>
  );
}

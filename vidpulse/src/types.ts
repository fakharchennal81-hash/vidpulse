export interface VideoDetails {
  id: string;
  title: string;
  description: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  channelTitle: string;
  channelId: string;
  thumbnails: {
    default?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
}

export interface SuggestedTitle {
  title: string;
  estimatedCtrBoost: string;
  strategyType: string;
  whyItWorks: string;
  keyKeywords: string[];
}

export interface SEOAnalysis {
  titleQualityScore: number;
  titleLengthFeedback: string;
  seoStrengths: string[];
  seoOpportunities: string[];
}

export interface AnalysisResponse {
  success: boolean;
  videoDetails: VideoDetails;
  analysisResult: {
    analysis: SEOAnalysis;
    suggestedTitles: SuggestedTitle[];
  };
}

export interface ConfigStatus {
  hasEnvGeminiKey: boolean;
  hasEnvYoutubeKey: boolean;
}

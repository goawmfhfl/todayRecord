export type Entry = {
  id: string;
  type: "insight" | "emotion" | "feedback";
  content: string;
  timestamp: Date;
};

export type DailyFeedback = {
  date: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendation: string;
};

export type PeriodSummary = {
  period: string;
  type: "weekly" | "monthly";
  dateRange: string;
  totalEntries: number;
  overview: string;
  keyInsights: string[];
  emotionalTrends: string;
  growthAreas: string[];
  highlights: string[];
  nextSteps: string;
};

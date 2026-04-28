export interface ReplacementMetric {
  subject: string;
  A: number;
  fullMark: number;
}

export interface PivotPath {
  title: string;
  salary: string;
  demand: 'High' | 'Medium' | 'Low';
}

export interface NetworkingGroup {
  name: string;
  location: string;
  timing: string;
  code: string;
}

export interface RoadmapTask {
  text: string;
  done: boolean;
}

export interface RoadmapWeek {
  week: number;
  title: string;
  type: 'Analysis' | 'Technical' | 'Social';
  description: string;
  tasks: (string | RoadmapTask)[];
}

export interface MarketMetrics {
  capability_growth: string;
  certainty_score: number;
  demand_growth: string;
}

export interface ReportData {
  risk_score: number;
  analysis_summary: string;
  replacement_map: ReplacementMetric[];
  pivot_paths: PivotPath[];
  local_networking: NetworkingGroup[];
  roadmap: RoadmapWeek[];
  metrics: MarketMetrics;
}

export interface Assessment {
  id: string;
  created_at: string;
  job_title: string;
  skills: string;
  location: string;
  risk_score: number;
  report_data: ReportData;
  is_unlocked?: boolean;
}

export interface MarketPulse {
  sentiment: 'Caution' | 'Bullish' | 'Volatile' | 'Stable';
  sentiment_summary: string;
  stability_warning: string;
  news: {
    title: string;
    summary: string;
    time: string;
    impact: 'High' | 'Medium' | 'Positive';
    source?: string;
  }[];
  growth_rate: string;
}

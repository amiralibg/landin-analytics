export interface AnalysisMetrics {
  url: string;
  technical: {
    https: boolean;
    pageSize: number;
    responsive: boolean;
    isLandin: boolean;
    imageOptimization: number;
    pageSpeed: number;
    score: number;
  };
  seo: {
    hasTitle: boolean;
    titleLength: number;
    titleScore: number;
    hasMetaDesc: boolean;
    metaDescLength: number;
    metaDescScore: number;
    h1Count: number;
    h2Count: number;
    headingStructureScore: number;
    altTagsScore: number;
    urlScore: number;
    score: number;
  };
  ux: {
    ctas: any[];
    ctaScore: number;
    contrastScore: number;
    whitespaceScore: number;
    mobileFriendly: boolean;
    score: number;
  };
  conversion: {
    forms: Array<{ fieldCount: number }>;
    formScore: number;
    socialProofElements: any[];
    socialProof: number;
    trustSignals: any[];
    trustScore: number;
    contactInfo: number;
    contactScore: number;
    uspScore: number;
    score: number;
  };
}

export interface AnalysisFeedback {
  positive: string[];
  warning: string[];
  negative: string[];
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface AnalysisResult {
  url: string;
  metrics: AnalysisMetrics;
  finalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  feedback: AnalysisFeedback;
  chartData: ChartData;
}

export interface AnalysisFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

export interface ResultsProps {
  results: AnalysisResult;
  onReset: () => void;
}

export interface ScoreChartProps {
  data: ChartData;
}

export interface CircularProgressProps {
  score: number;
  label: string;
  color?: string;
}
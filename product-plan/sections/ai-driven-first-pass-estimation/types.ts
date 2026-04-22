// AI-Driven First-Pass Estimation — Types

export type EstimateStatus = "generating" | "completed" | "failed";
export type GenerationStepStatus = "pending" | "in_progress" | "completed" | "failed";
export type Complexity = "low" | "medium" | "high" | "very_high";
export type RiskCategory = "scope" | "technical" | "dependency" | "team" | "timeline";
export type Likelihood = "low" | "medium" | "high";
export type Impact = "low" | "medium" | "high";
export type ImpactLevel = "low" | "medium" | "high";
export type Seniority = "junior" | "mid" | "senior";

export interface HourRange {
  low: number;
  likely: number;
  high: number;
}

export interface GenerationStep {
  id: string;
  label: string;
  status: GenerationStepStatus;
  durationMs: number;
}

export interface EstimateSummary {
  rationale: string;
  keyAssumptions: string[];
}

export interface EstimateFeature {
  id: string;
  name: string;
  description: string;
  complexity: Complexity;
  hours: HourRange;
  confidence: number;
  assumptions: string[];
  dependencies: string[];
}

export interface EstimateRisk {
  id: string;
  category: RiskCategory;
  title: string;
  likelihood: Likelihood;
  impact: Impact;
  mitigation: string;
}

export interface TeamRole {
  role: string;
  count: number;
  seniority: Seniority;
  reasoning: string;
}

export interface TeamRecommendation {
  totalHeadcount: number;
  roles: TeamRole[];
  reasoning: string;
}

export interface ComparableProject {
  id: string;
  name: string;
  industry: string;
  techStack: string[];
  teamSize: number;
  estimatedHours: number;
  actualHours: number;
  durationWeeks: number;
  similarityRationale: string;
}

export interface EstimateQuestion {
  id: string;
  question: string;
  affectedScope: string;
  impactLevel: ImpactLevel;
  resolved: boolean;
  answer: string | null;
}

export interface Estimate {
  id: string;
  requestId: string;
  projectName: string;
  status: EstimateStatus;
  totalHours: HourRange;
  estimatedDurationWeeks: number;
  overallComplexity: Complexity;
  overallConfidence: number;
  createdAt: string;
  generationDurationMs: number;
  summary: EstimateSummary;
  features: EstimateFeature[];
  risks: EstimateRisk[];
  teamRecommendation: TeamRecommendation;
  comparableProjects: ComparableProject[];
  questions: EstimateQuestion[];
}

export interface AiDrivenFirstPassEstimationProps {
  estimate: Estimate | null;
  generationSteps: GenerationStep[];
  isGenerating: boolean;

  /** Start or restart the AI estimation process */
  onGenerate?: () => void;
  /** Regenerate the estimate from scratch */
  onRegenerate?: () => void;
  /** Proceed to the Human Review & Adjustment section */
  onContinueToReview?: () => void;
  /** Expand a feature row to see assumptions and dependencies */
  onExpandFeature?: (featureId: string) => void;
  /** Collapse an expanded feature row */
  onCollapseFeature?: (featureId: string) => void;
}

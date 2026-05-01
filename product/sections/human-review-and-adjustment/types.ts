// Human Review & Adjustment — Types

export type Complexity = "low" | "medium" | "high" | "very_high";
export type RiskCategory = "scope" | "technical" | "dependency" | "team" | "timeline";
export type Likelihood = "low" | "medium" | "high";
export type Impact = "low" | "medium" | "high";
export type Seniority = "junior" | "mid" | "senior";
export type ReviewItemStatus = "pending" | "accepted" | "adjusted";
export type AdjustmentAction = "accept" | "adjust" | "add" | "remove";

export interface HourRange {
  low: number;
  likely: number;
  high: number;
}

export interface FeatureAdjustment {
  featureId: string;
  status: ReviewItemStatus;
  originalHours: HourRange;
  adjustedHours: HourRange;
  originalComplexity: Complexity;
  adjustedComplexity: Complexity;
  originalConfidence: number;
  adjustedConfidence: number;
  reasoning: string | null;
  adjustedAt: string | null;
}

export interface ReviewFeature {
  id: string;
  name: string;
  description: string;
  complexity: Complexity;
  hours: HourRange;
  confidence: number;
  assumptions: string[];
  dependencies: string[];
  adjustment: FeatureAdjustment;
}

export interface RiskAdjustment {
  riskId: string;
  status: ReviewItemStatus;
  action: AdjustmentAction;
  reasoning: string | null;
}

export interface ReviewRisk {
  id: string;
  category: RiskCategory;
  title: string;
  likelihood: Likelihood;
  impact: Impact;
  mitigation: string;
  originalLikelihood: Likelihood;
  originalImpact: Impact;
  originalMitigation: string;
  adjustment: RiskAdjustment;
  isNew: boolean;
}

export interface TeamRole {
  role: string;
  count: number;
  seniority: Seniority;
  reasoning: string;
}

export interface TeamAdjustment {
  status: ReviewItemStatus;
  originalHeadcount: number;
  adjustedHeadcount: number;
  originalRoles: TeamRole[];
  adjustedRoles: TeamRole[];
  reasoning: string | null;
}

export interface ImpactSummary {
  originalTotalHours: HourRange;
  adjustedTotalHours: HourRange;
  hoursDeltaLikely: number;
  hoursDeltaPercent: number;
  originalDurationWeeks: number;
  adjustedDurationWeeks: number;
  originalConfidence: number;
  adjustedConfidence: number;
  originalHeadcount: number;
  adjustedHeadcount: number;
  totalFeatures: number;
  featuresReviewed: number;
  featuresAccepted: number;
  featuresAdjusted: number;
  risksReviewed: number;
  risksAdjusted: number;
}

export interface ReviewEstimate {
  id: string;
  estimateId: string;
  projectName: string;
  reviewerName: string;
  reviewStatus: "in_progress" | "approved";
  startedAt: string;
  approvedAt: string | null;
  overallConfidence: number;
  overallConfidenceReasoning: string;
  features: ReviewFeature[];
  risks: ReviewRisk[];
  teamAdjustment: TeamAdjustment;
  impactSummary: ImpactSummary;
}

export interface HumanReviewAdjustmentProps {
  review: ReviewEstimate;

  /** Accept a feature as-is */
  onAcceptFeature?: (featureId: string) => void;
  /** Adjust a feature with new values and reasoning */
  onAdjustFeature?: (featureId: string, adjustment: Partial<FeatureAdjustment>) => void;
  /** Accept a risk as-is */
  onAcceptRisk?: (riskId: string) => void;
  /** Adjust a risk with new values and reasoning */
  onAdjustRisk?: (riskId: string, changes: Partial<ReviewRisk>) => void;
  /** Add a new risk */
  onAddRisk?: () => void;
  /** Remove a risk */
  onRemoveRisk?: (riskId: string) => void;
  /** Update team recommendation */
  onAdjustTeam?: (adjustment: Partial<TeamAdjustment>) => void;
  /** Set overall confidence */
  onSetOverallConfidence?: (confidence: number, reasoning: string) => void;
  /** Save draft without approving */
  onSaveDraft?: () => void;
  /** Approve and continue to export */
  onApproveAndExport?: () => void;
  /** Expand a feature row */
  onExpandFeature?: (featureId: string) => void;
  /** Collapse an expanded feature row */
  onCollapseFeature?: (featureId: string) => void;
}

// Calibration — Types

export type Complexity = "low" | "medium" | "high" | "very_high";
export type CalibrationStatus = "draft" | "completed";
export type FeatureCalibrationStatus = "pending" | "calibrated";
export type Seniority = "junior" | "mid" | "senior";

export interface HourRange {
  low: number;
  likely: number;
  high: number;
}

export interface FeatureCalibration {
  featureId: string;
  featureName: string;
  description: string;
  estimatedComplexity: Complexity;
  estimatedHours: HourRange;
  estimatedConfidence: number;
  actualHours: number | null;
  actualComplexity: Complexity;
  feedback: string;
  status: FeatureCalibrationStatus;
  assumptions: string[];
  dependencies: string[];
}

export interface TechEffortEntry {
  id: string;
  technology: string;
  percentage: number;
}

export interface OriginalTeamRole {
  role: string;
  count: number;
  seniority: Seniority;
  reasoning: string;
}

export interface CalibrationSummary {
  actualTotalHours: number | null;
  actualDurationWeeks: number | null;
  actualTeamSize: number | null;
  actualComplexity: Complexity;
  estimatedTotalHours: HourRange;
  estimatedDurationWeeks: number;
  estimatedComplexity: Complexity;
  estimatedConfidence: number;
  estimatedHeadcount: number;
}

export interface Calibration {
  id: string;
  estimateId: string;
  projectName: string;
  calibratorName: string;
  status: CalibrationStatus;
  createdAt: string;
  completedAt: string | null;
  summary: CalibrationSummary;
  features: FeatureCalibration[];
  teamFeedback: string;
  originalTeamRoles: OriginalTeamRole[];
  techEffortBreakdown: TechEffortEntry[];
  effortBreakdownReasoning: string;
}

export interface CalibrationWorkbenchProps {
  calibration: Calibration;
  expandedFeatureIds: Set<string>;
  onUpdateSummary?: (updates: Partial<CalibrationSummary>) => void;
  onUpdateFeatureActuals?: (featureId: string, actualHours: number | null) => void;
  onUpdateFeatureComplexity?: (featureId: string, complexity: Complexity) => void;
  onUpdateFeatureFeedback?: (featureId: string, feedback: string) => void;
  onUpdateTeamFeedback?: (feedback: string) => void;
  onUpdateTechEffort?: (id: string, percentage: number) => void;
  onUpdateEffortReasoning?: (reasoning: string) => void;
  onSaveDraft?: () => void;
  onMarkComplete?: () => void;
  onExpandFeature?: (featureId: string) => void;
  onCollapseFeature?: (featureId: string) => void;
}

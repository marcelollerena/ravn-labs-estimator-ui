// =============================================================================
// UI Data Shapes — Combined Reference
//
// These types define the data that UI components expect to receive as props.
// They are a frontend contract, not a database schema. How you model, store,
// and fetch this data is an implementation decision.
// =============================================================================

// -----------------------------------------------------------------------------
// From: sections/prd-ingestion
// -----------------------------------------------------------------------------

/** Source format of the uploaded/provided PRD */
export type SourceFormat = 'pdf' | 'docx' | 'markdown' | 'text' | 'form'

/** Lifecycle status of an estimation request */
export type EstimationRequestStatus = 'draft' | 'parsing' | 'confirmed' | 'estimating' | 'complete'

/** A discrete feature extracted from a PRD */
export interface RequestFeature {
  id: string
  name: string
  description: string
}

/** A parsed PRD serving as input to the estimation pipeline */
export interface EstimationRequest {
  id: string
  title: string
  rawContent: string
  sourceFormat: SourceFormat
  status: EstimationRequestStatus
  projectOverview: string
  technicalConstraints: string[]
  ambiguities: string[]
  implicitRequirements: string[]
  features: RequestFeature[]
  createdAt: string
  updatedAt: string
}

/** Structured form input (fallback input method) */
export interface StructuredFormInput {
  title: string
  description: string
  features: { name: string; description: string }[]
  constraints: string[]
}

// -----------------------------------------------------------------------------
// From: sections/ai-driven-first-pass-estimation
// -----------------------------------------------------------------------------

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

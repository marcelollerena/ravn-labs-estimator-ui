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

export type SourceFormat = 'pdf' | 'docx' | 'markdown' | 'text' | 'form'
export type EstimationRequestStatus = 'draft' | 'parsing' | 'confirmed' | 'estimating' | 'complete'

export interface RequestFeature {
  id: string
  name: string
  description: string
}

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

export interface StructuredFormInput {
  title: string
  description: string
  features: { name: string; description: string }[]
  constraints: string[]
}

// -----------------------------------------------------------------------------
// From: sections/ai-driven-first-pass-estimation
// -----------------------------------------------------------------------------

export type EstimateStatus = "generating" | "completed" | "failed"
export type GenerationStepStatus = "pending" | "in_progress" | "completed" | "failed"
export type Complexity = "low" | "medium" | "high" | "very_high"
export type RiskCategory = "scope" | "technical" | "dependency" | "team" | "timeline"
export type Likelihood = "low" | "medium" | "high"
export type Impact = "low" | "medium" | "high"
export type ImpactLevel = "low" | "medium" | "high"
export type Seniority = "junior" | "mid" | "senior"

export interface HourRange {
  low: number
  likely: number
  high: number
}

export interface GenerationStep {
  id: string
  label: string
  status: GenerationStepStatus
  durationMs: number
}

export interface EstimateSummary {
  rationale: string
  keyAssumptions: string[]
}

export interface EstimateFeature {
  id: string
  name: string
  description: string
  complexity: Complexity
  hours: HourRange
  confidence: number
  assumptions: string[]
  dependencies: string[]
}

export interface EstimateRisk {
  id: string
  category: RiskCategory
  title: string
  likelihood: Likelihood
  impact: Impact
  mitigation: string
}

export interface TeamRole {
  role: string
  count: number
  seniority: Seniority
  reasoning: string
}

export interface TeamRecommendation {
  totalHeadcount: number
  roles: TeamRole[]
  reasoning: string
}

export interface ComparableProject {
  id: string
  name: string
  industry: string
  techStack: string[]
  teamSize: number
  estimatedHours: number
  actualHours: number
  durationWeeks: number
  similarityRationale: string
}

export interface EstimateQuestion {
  id: string
  question: string
  affectedScope: string
  impactLevel: ImpactLevel
  resolved: boolean
  answer: string | null
}

export interface Estimate {
  id: string
  requestId: string
  projectName: string
  status: EstimateStatus
  totalHours: HourRange
  estimatedDurationWeeks: number
  overallComplexity: Complexity
  overallConfidence: number
  createdAt: string
  generationDurationMs: number
  summary: EstimateSummary
  features: EstimateFeature[]
  risks: EstimateRisk[]
  teamRecommendation: TeamRecommendation
  comparableProjects: ComparableProject[]
  questions: EstimateQuestion[]
}

// -----------------------------------------------------------------------------
// From: sections/human-review-and-adjustment
// -----------------------------------------------------------------------------

export type ReviewItemStatus = "pending" | "accepted" | "adjusted"
export type AdjustmentAction = "accept" | "adjust" | "add" | "remove"

export interface FeatureAdjustment {
  featureId: string
  status: ReviewItemStatus
  originalHours: HourRange
  adjustedHours: HourRange
  originalComplexity: Complexity
  adjustedComplexity: Complexity
  originalConfidence: number
  adjustedConfidence: number
  reasoning: string | null
  adjustedAt: string | null
}

export interface ReviewFeature {
  id: string
  name: string
  description: string
  complexity: Complexity
  hours: HourRange
  confidence: number
  assumptions: string[]
  dependencies: string[]
  adjustment: FeatureAdjustment
}

export interface RiskAdjustment {
  riskId: string
  status: ReviewItemStatus
  action: AdjustmentAction
  reasoning: string | null
}

export interface ReviewRisk {
  id: string
  category: RiskCategory
  title: string
  likelihood: Likelihood
  impact: Impact
  mitigation: string
  originalLikelihood: Likelihood
  originalImpact: Impact
  originalMitigation: string
  adjustment: RiskAdjustment
  isNew: boolean
}

export interface TeamAdjustment {
  status: ReviewItemStatus
  originalHeadcount: number
  adjustedHeadcount: number
  originalRoles: TeamRole[]
  adjustedRoles: TeamRole[]
  reasoning: string | null
}

export interface ImpactSummaryData {
  originalTotalHours: HourRange
  adjustedTotalHours: HourRange
  hoursDeltaLikely: number
  hoursDeltaPercent: number
  originalDurationWeeks: number
  adjustedDurationWeeks: number
  originalConfidence: number
  adjustedConfidence: number
  originalHeadcount: number
  adjustedHeadcount: number
  totalFeatures: number
  featuresReviewed: number
  featuresAccepted: number
  featuresAdjusted: number
  risksReviewed: number
  risksAdjusted: number
}

export interface ReviewEstimate {
  id: string
  estimateId: string
  projectName: string
  reviewerName: string
  reviewStatus: "in_progress" | "approved"
  startedAt: string
  approvedAt: string | null
  overallConfidence: number
  overallConfidenceReasoning: string
  features: ReviewFeature[]
  risks: ReviewRisk[]
  teamAdjustment: TeamAdjustment
  impactSummary: ImpactSummaryData
}

// -----------------------------------------------------------------------------
// From: sections/estimate-output-and-export
// -----------------------------------------------------------------------------

export type ExportProfile = "internal" | "client"
export type ExportFormat = "pdf" | "markdown" | "web_link"
export type ExportStatus = "idle" | "generating" | "completed" | "failed"

export interface ExportSection {
  id: string
  label: string
  description: string
  includedInInternal: boolean
  includedInClient: boolean
  clientSafe: boolean
}

export interface ExportMetadata {
  estimateId: string
  projectName: string
  version: number
  reviewerName: string
  approvedAt: string
  status: "approved" | "exported"
  totalHoursLikely: number
  totalFeatures: number
  overallConfidence: number
}

export interface ExportAction {
  id: string
  format: ExportFormat
  profile: ExportProfile
  status: ExportStatus
  generatedAt: string | null
  fileUrl: string | null
  fileName: string | null
}

export interface ExportHistoryEntry {
  id: string
  format: ExportFormat
  profile: ExportProfile
  exportedAt: string
  exportedBy: string
  fileName: string
  fileUrl: string
}

export interface ProfileNotes {
  internal: string
  client: string
}

export interface ContentSummary {
  sectionsIncluded: number
  totalSections: number
  featuresIncluded: number
  totalFeatures: number
  estimatedPages: number
  totalHoursDisplayed: number
}

export interface PreviewFeature {
  id: string
  name: string
  description: string
  complexity: string
  hoursLikely: number
  hoursLow: number | null
  hoursHigh: number | null
  confidence: number | null
  assumptions: string[]
  wasAdjusted: boolean
  adjustmentReasoning: string | null
}

export interface PreviewRisk {
  id: string
  category: string
  title: string
  likelihood: string
  impact: string
  mitigation: string
}

export interface PreviewTeamRole {
  role: string
  count: number
  seniority: string
}

export interface PreviewData {
  projectName: string
  projectSummary: string
  features: PreviewFeature[]
  risks: PreviewRisk[]
  teamRoles: PreviewTeamRole[]
  teamHeadcount: number
  totalHours: { low: number; likely: number; high: number }
  durationWeeks: number
  confidence: number
  assumptions: string[]
  disclaimers: string[]
}

export interface ExportDashboard {
  metadata: ExportMetadata
  sections: ExportSection[]
  activeProfile: ExportProfile
  actions: ExportAction[]
  history: ExportHistoryEntry[]
  notes: ProfileNotes
  contentSummary: ContentSummary
  internalPreview: PreviewData
  clientPreview: PreviewData
}

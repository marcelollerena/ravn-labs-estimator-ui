// Projects & Pipeline Overview — Types

export type ProjectStatus =
  | "draft"
  | "extracting"
  | "estimating"
  | "in_review"
  | "estimated"
  | "archived";

export type PipelinePhase = "ingestion" | "estimation" | "review" | "export";
export type PhaseState = "completed" | "current" | "upcoming";

export interface HourRange {
  low: number;
  likely: number;
  high: number;
}

export interface PipelineProgress {
  ingestion: PhaseState;
  estimation: PhaseState;
  review: PhaseState;
  export: PhaseState;
}

export interface EstimationProject {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;

  /** Which pipeline phase the project is currently in */
  currentPhase: PipelinePhase;
  /** State of each pipeline phase */
  pipelineProgress: PipelineProgress;

  /** Number of features extracted (0 if still in draft) */
  featureCount: number;
  /** Hour range — null until AI estimation completes */
  totalHours: HourRange | null;
  /** Confidence 0-100 — null until AI estimation completes */
  overallConfidence: number | null;
  /** Complexity — null until AI estimation completes */
  overallComplexity: "low" | "medium" | "high" | "very_high" | null;
  /** Duration in weeks — null until AI estimation completes */
  estimatedDurationWeeks: number | null;

  /** Foreign key to the EstimationRequest entity */
  estimationRequestId: string;
  /** Foreign key to the Estimate entity — null if not yet generated */
  estimateId: string | null;
  /** Foreign key to the ReviewEstimate entity — null if not yet reviewed */
  reviewId: string | null;
  /** Foreign key to the ExportDashboard entity — null if not yet exported */
  exportId: string | null;

  /** Source format of the original PRD */
  sourceFormat: "pdf" | "docx" | "markdown" | "text" | "form";
  /** Display name of the user who created the project */
  createdBy: string;
  /** ISO 8601 timestamp */
  createdAt: string;
  /** ISO 8601 timestamp — updated on every save */
  updatedAt: string;
  /** ISO 8601 timestamp — null if not archived */
  archivedAt: string | null;
}

export type StatusFilter = ProjectStatus | "all";
export type SortField = "name" | "status" | "updatedAt" | "totalHoursLikely";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface ProjectsListViewProps {
  /** Filtered and sorted projects to display */
  projects: EstimationProject[];
  /** Total active (non-archived) project count */
  activeCount: number;
  /** Total archived project count */
  archivedCount: number;

  /** Currently selected tab */
  activeTab: "active" | "archived";
  /** Current search query */
  searchQuery: string;
  /** Current status filter */
  statusFilter: StatusFilter;
  /** Current sort configuration */
  sortConfig: SortConfig;

  /** Switch between Active and Archived tabs */
  onTabChange?: (tab: "active" | "archived") => void;
  /** Update search query */
  onSearch?: (query: string) => void;
  /** Change status filter */
  onFilterStatus?: (status: StatusFilter) => void;
  /** Change sort column (toggles direction if same column) */
  onSort?: (field: SortField) => void;

  /** Navigate to project's current phase */
  onProjectClick?: (projectId: string) => void;
  /** Resume a draft project */
  onResume?: (projectId: string) => void;
  /** View a completed project */
  onView?: (projectId: string) => void;
  /** Duplicate a project as a new draft */
  onDuplicate?: (projectId: string) => void;
  /** Archive a project */
  onArchive?: (projectId: string) => void;
  /** Restore an archived project */
  onUnarchive?: (projectId: string) => void;
  /** Delete a draft project */
  onDelete?: (projectId: string) => void;
  /** Navigate to PRD Ingestion to start a new estimate */
  onNewEstimate?: () => void;
}

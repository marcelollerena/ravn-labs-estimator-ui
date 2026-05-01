// Estimate Output & Export — Types

export type ExportProfile = "internal" | "client";
export type ExportFormat = "pdf" | "markdown" | "web_link";
export type ExportStatus = "idle" | "generating" | "completed" | "failed";

export interface ExportSection {
  id: string;
  label: string;
  description: string;
  includedInInternal: boolean;
  includedInClient: boolean;
  clientSafe: boolean;
}

export interface ExportMetadata {
  estimateId: string;
  projectName: string;
  version: number;
  reviewerName: string;
  approvedAt: string;
  status: "approved" | "exported";
  totalHoursLikely: number;
  totalFeatures: number;
  overallConfidence: number;
}

export interface ExportAction {
  id: string;
  format: ExportFormat;
  profile: ExportProfile;
  status: ExportStatus;
  generatedAt: string | null;
  fileUrl: string | null;
  fileName: string | null;
}

export interface ExportHistoryEntry {
  id: string;
  format: ExportFormat;
  profile: ExportProfile;
  exportedAt: string;
  exportedBy: string;
  fileName: string;
  fileUrl: string;
}

export interface ProfileNotes {
  internal: string;
  client: string;
}

export interface ContentSummary {
  sectionsIncluded: number;
  totalSections: number;
  featuresIncluded: number;
  totalFeatures: number;
  estimatedPages: number;
  totalHoursDisplayed: number;
}

export interface PreviewFeature {
  id: string;
  name: string;
  description: string;
  complexity: string;
  hoursLikely: number;
  hoursLow: number | null;
  hoursHigh: number | null;
  confidence: number | null;
  assumptions: string[];
  wasAdjusted: boolean;
  adjustmentReasoning: string | null;
}

export interface PreviewRisk {
  id: string;
  category: string;
  title: string;
  likelihood: string;
  impact: string;
  mitigation: string;
}

export interface PreviewTeamRole {
  role: string;
  count: number;
  seniority: string;
}

export interface PreviewData {
  projectName: string;
  projectSummary: string;
  features: PreviewFeature[];
  risks: PreviewRisk[];
  teamRoles: PreviewTeamRole[];
  teamHeadcount: number;
  totalHours: { low: number; likely: number; high: number };
  durationWeeks: number;
  confidence: number;
  assumptions: string[];
  disclaimers: string[];
}

export interface ExportDashboard {
  metadata: ExportMetadata;
  sections: ExportSection[];
  activeProfile: ExportProfile;
  actions: ExportAction[];
  history: ExportHistoryEntry[];
  notes: ProfileNotes;
  contentSummary: ContentSummary;
  internalPreview: PreviewData;
  clientPreview: PreviewData;
}

export interface EstimateOutputAndExportProps {
  dashboard: ExportDashboard;

  /** Switch active export profile */
  onSwitchProfile?: (profile: ExportProfile) => void;
  /** Toggle a section's inclusion for the active profile */
  onToggleSection?: (sectionId: string, profile: ExportProfile, included: boolean) => void;
  /** Update cover notes for a profile */
  onUpdateNotes?: (profile: ExportProfile, notes: string) => void;
  /** Trigger an export action */
  onExport?: (format: ExportFormat, profile: ExportProfile) => void;
  /** Copy shareable link */
  onCopyLink?: (url: string) => void;
  /** Download a previously exported file */
  onDownload?: (historyEntryId: string) => void;
}

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

/** Props for the PRD Ingestion section */
export interface PrdIngestionProps {
  /** Current estimation request being viewed/edited (null for empty/upload state) */
  estimationRequest: EstimationRequest | null

  /** List of recent estimation requests for the sidebar/list view */
  estimationRequests: EstimationRequest[]

  /** Called when user uploads a file for parsing */
  onUploadFile?: (file: File) => void

  /** Called when user submits pasted text for parsing */
  onPasteText?: (text: string) => void

  /** Called when user submits the structured form */
  onSubmitForm?: (input: StructuredFormInput) => void

  /** Called when user retries parsing on the current request */
  onRetryParse?: (requestId: string) => void

  /** Called when user edits the title */
  onUpdateTitle?: (requestId: string, title: string) => void

  /** Called when user edits the project overview */
  onUpdateOverview?: (requestId: string, overview: string) => void

  /** Called when user adds a feature */
  onAddFeature?: (requestId: string, feature: { name: string; description: string }) => void

  /** Called when user updates an existing feature */
  onUpdateFeature?: (requestId: string, featureId: string, updates: Partial<RequestFeature>) => void

  /** Called when user removes a feature */
  onRemoveFeature?: (requestId: string, featureId: string) => void

  /** Called when user updates the technical constraints list */
  onUpdateConstraints?: (requestId: string, constraints: string[]) => void

  /** Called when user updates the ambiguities list */
  onUpdateAmbiguities?: (requestId: string, ambiguities: string[]) => void

  /** Called when user updates the implicit requirements list */
  onUpdateImplicitRequirements?: (requestId: string, implicitRequirements: string[]) => void

  /** Called when user confirms the extraction — transitions status to "confirmed" */
  onConfirm?: (requestId: string) => void
}

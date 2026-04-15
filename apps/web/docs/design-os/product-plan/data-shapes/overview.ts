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
export type SourceFormat = 'pdf' | 'docx' | 'markdown' | 'text' | 'form';

/** Lifecycle status of an estimation request */
export type EstimationRequestStatus = 'draft' | 'parsing' | 'confirmed' | 'estimating' | 'complete';

/** A discrete feature extracted from a PRD */
export interface RequestFeature {
  id: string;
  name: string;
  description: string;
}

/** A parsed PRD serving as input to the estimation pipeline */
export interface EstimationRequest {
  id: string;
  title: string;
  rawContent: string;
  sourceFormat: SourceFormat;
  status: EstimationRequestStatus;
  projectOverview: string;
  technicalConstraints: string[];
  ambiguities: string[];
  implicitRequirements: string[];
  features: RequestFeature[];
  createdAt: string;
  updatedAt: string;
}

/** Structured form input (fallback input method) */
export interface StructuredFormInput {
  title: string;
  description: string;
  features: { name: string; description: string }[];
  constraints: string[];
}

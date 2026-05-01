# PRD Ingestion

## Overview

The entry point into the estimation workflow. Users provide a PRD document via file upload (PDF, DOCX, Markdown), text paste, or a structured fallback form. The system parses the document and uses AI to extract a structured representation — title, project overview, feature list, technical constraints, ambiguities, and implicit requirements. The user reviews, edits, and confirms this extraction before it feeds into the estimation pipeline.

## User Flows

- User lands on the ingestion page and sees three input methods: file upload, text paste, structured form
- File upload accepts PDF, DOCX, and Markdown via drag-and-drop or file picker
- Text paste provides a textarea for raw PRD content
- Structured form provides fields for title, description, feature list, and constraints as a fallback
- User selects one method and submits content for parsing
- System shows a parsing progress state while AI processes the document
- On success, transitions to the review screen with all extracted fields populated
- User reviews the AI-extracted structure: title, project overview, features, technical constraints, ambiguities, implicit requirements
- All fields are editable inline — features can be added, removed, renamed, and rewritten
- Ambiguities and implicit requirements are visually tagged as AI-inferred
- User confirms the reviewed extraction, then proceeds to estimation

## Components Provided

- `IntakeView` — Three-method input view (file upload with drag-drop, text paste, structured form)
- `ParsingView` — Step-by-step progress view during AI parsing
- `ExtractionReview` — Full review and edit interface for extracted PRD data
- `FeatureList` — Editable feature table with add/edit/remove
- `EditableStringList` — Reusable inline-editable string list for constraints, ambiguities, etc.

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onUploadFile` | User submits a file for parsing |
| `onPasteText` | User submits pasted text for parsing |
| `onSubmitForm` | User submits the structured form |
| `onRetryParse` | User retries parsing |
| `onConfirm` | User confirms the extraction |
| `onUpdateTitle` | User edits the project title |
| `onUpdateOverview` | User edits the project overview |
| `onAddFeature` | User adds a new feature |
| `onUpdateFeature` | User edits an existing feature |
| `onRemoveFeature` | User removes a feature |
| `onUpdateConstraints` | User modifies the constraints list |
| `onUpdateAmbiguities` | User modifies the ambiguities list |
| `onUpdateImplicitRequirements` | User modifies implicit requirements |

## Data Shapes

**Entities:** EstimationRequest, RequestFeature, StructuredFormInput

See `types.ts` for full interface definitions.

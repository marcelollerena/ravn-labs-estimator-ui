# PRD Ingestion

## Overview

The entry point into the estimation workflow. Users provide a PRD document via file upload (PDF, DOCX, Markdown), text paste, or a structured fallback form. The system parses the document and uses AI to extract a structured representation — title, project overview, feature list, technical constraints, ambiguities, and implicit requirements. The user reviews, edits, and confirms this extraction before it feeds into the estimation pipeline.

## User Flows

### Upload / Input Flow
- User lands on the ingestion page and sees three input methods: file upload, text paste, structured form
- File upload accepts PDF, DOCX, and Markdown via drag-and-drop or file picker
- Text paste provides a monospace textarea for raw PRD content
- Structured form provides fields for title, description, feature list, and constraints as a fallback
- User selects one method and submits content for parsing

### Parsing / Extraction Flow
- System shows a parsing progress state while AI processes the document
- Six extraction steps shown with real-time status (pending/active/complete/error)
- On success, transitions to the review screen
- On failure, shows error state with retry or back options

### Review / Edit Flow
- User reviews all AI-extracted fields in a dense panel layout
- Title and overview are click-to-edit
- Features displayed in a numbered table with inline edit, add, remove
- Technical constraints as an editable string list
- Ambiguities (amber tint) and implicit requirements (violet tint) visually distinct with "AI-inferred" badges
- Confirm button in page header transitions status to "confirmed"

## Design Decisions

- Three input methods as equal-weight cards (not tabs or dropdown) — makes all options discoverable
- Parsing progress shows named steps rather than a generic spinner — builds user confidence
- Feature list uses numbered rows with grip handles — communicates order and editability
- AI-inferred sections (ambiguities, implicit requirements) use distinct background tints — clearly separates explicit vs inferred content
- PageHeader includes both "Re-parse" and "Confirm Extraction" — allows recovery without leaving the screen

## Data Shapes

**Entities:** EstimationRequest, RequestFeature

**From global entities:** EstimationRequest and RequestFeature from data-shape.md

## Components Provided

- `IntakeView` — Three input method cards with upload zone, paste textarea, structured form
- `ParsingView` — Step-by-step extraction progress with cancel/retry
- `ExtractionReview` — Dense review screen with all editable fields (hero screen)
- `FeatureList` — Numbered feature table with inline edit/add/remove
- `EditableStringList` — Reusable editable string list

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onUploadFile` | User submits a file for parsing |
| `onPasteText` | User submits pasted text |
| `onSubmitForm` | User submits the structured form |
| `onRetryParse` | User retries parsing |
| `onUpdateTitle` | User edits the title |
| `onUpdateOverview` | User edits the overview |
| `onAddFeature` | User adds a feature |
| `onUpdateFeature` | User edits a feature |
| `onRemoveFeature` | User removes a feature |
| `onUpdateConstraints` | User modifies constraints |
| `onUpdateAmbiguities` | User modifies ambiguities |
| `onUpdateImplicitRequirements` | User modifies implicit requirements |
| `onConfirm` | User confirms the extraction |

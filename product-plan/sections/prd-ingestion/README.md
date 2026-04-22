# PRD Ingestion

## Overview

The entry point into the estimation workflow. Users provide a PRD document via file upload (PDF, DOCX, Markdown), text paste, or a structured fallback form. The system parses the document and uses AI to extract a structured representation — title, project overview, feature list, technical constraints, ambiguities, and implicit requirements. The user reviews, edits, and confirms this extraction before it feeds into the estimation pipeline.

## User Flows

### Upload / Input Flow
- User lands on the ingestion page and sees three input methods: file upload, text paste, structured form
- File upload accepts PDF, DOCX, and Markdown via drag-and-drop or file picker
- Text paste provides a textarea for raw PRD content
- Structured form provides fields for title, description, feature list, and constraints
- User selects one method and submits content for parsing

### Parsing / Extraction Flow
- System shows a parsing progress state while AI processes the document
- On success, transitions to the review screen with all extracted fields populated
- On failure, shows an error state with the option to retry or switch input method

### Review / Edit Flow
- User reviews the AI-extracted structure: title, project overview, features, technical constraints, ambiguities, implicit requirements
- All fields are editable inline
- Features can be added, removed, renamed, and rewritten
- Ambiguities and implicit requirements are visually tagged as AI-inferred

### Confirmation Flow
- User confirms the reviewed extraction — status changes from "draft" to "confirmed"
- Confirmed extraction becomes the input for AI estimation

## Design Decisions

- Three input methods are presented as cards (not a dropdown) for immediate visibility
- File upload includes drag-and-drop with format badges (PDF, DOCX, MD)
- Parsing view shows labeled step progress, not a blank spinner
- Review screen uses structured card panels for each extracted section
- Ambiguities get an amber visual treatment, implicit requirements get violet
- Both AI-inferred sections are tagged with a "Sparkles" icon badge

## Data Shapes

**Entities:** EstimationRequest, RequestFeature, StructuredFormInput

**From global entities:** EstimationRequest, RequestFeature

## Visual Reference

See `screenshot.png` for the target UI design (if available).

## Components Provided

- `IntakeView` — Three-tab input screen for upload, paste, and structured form
- `ParsingView` — Step-by-step progress view during document parsing
- `ExtractionReview` — Full review and edit screen for extracted data
- `FeatureList` — Table-style feature list with inline edit, add, remove
- `EditableStringList` — Editable bullet list for constraints, ambiguities, requirements

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onUploadFile` | User uploads a file for parsing |
| `onPasteText` | User submits pasted text |
| `onSubmitForm` | User submits structured form |
| `onRetryParse` | User retries parsing |
| `onUpdateTitle` | User edits the title |
| `onUpdateOverview` | User edits the project overview |
| `onAddFeature` | User adds a feature |
| `onUpdateFeature` | User updates a feature |
| `onRemoveFeature` | User removes a feature |
| `onUpdateConstraints` | User updates constraints list |
| `onUpdateAmbiguities` | User updates ambiguities list |
| `onUpdateImplicitRequirements` | User updates implicit requirements list |
| `onConfirm` | User confirms the extraction |

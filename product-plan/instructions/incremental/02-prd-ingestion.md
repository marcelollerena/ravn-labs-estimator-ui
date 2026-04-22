# Milestone 2: PRD Ingestion

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Goal

Implement the PRD Ingestion feature — the entry point into the estimation workflow where users upload, parse, and review PRD documents.

## Overview

Users provide a PRD document via file upload (PDF, DOCX, Markdown), text paste, or a structured fallback form. The system parses the document using AI to extract a structured representation — title, project overview, feature list, technical constraints, ambiguities, and implicit requirements. The user reviews, edits, and confirms this extraction before it feeds into the estimation pipeline.

**Key Functionality:**
- Accept PRD input via three methods: file upload, text paste, or structured form
- Show step-by-step parsing progress while AI processes the document
- Display AI-extracted structure for review: title, overview, features, constraints, ambiguities, implicit requirements
- Allow inline editing of all extracted fields
- Add, remove, rename, and rewrite features
- Confirm the extraction to transition to estimation

## Components Provided

Copy the section components from `product-plan/sections/prd-ingestion/components/`:

- `IntakeView` — Three-tab input screen for upload, paste, and structured form
- `ParsingView` — Step-by-step progress view during document parsing
- `ExtractionReview` — Full review and edit screen for all extracted data
- `FeatureList` — Table-style feature list with inline edit, add, and remove
- `EditableStringList` — Reusable editable bullet list for constraints, ambiguities, requirements

## Props Reference

The components expect these data shapes (see `types.ts` for full definitions):

**Data props:**

- `EstimationRequest` — The parsed PRD with title, overview, features, constraints, ambiguities, implicit requirements, status, and source format
- `RequestFeature` — A feature with id, name, and description
- `StructuredFormInput` — Form fallback: title, description, features array, constraints array

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onUploadFile` | User uploads a file for parsing |
| `onPasteText` | User submits pasted text for parsing |
| `onSubmitForm` | User submits the structured form |
| `onRetryParse` | User retries parsing after an error |
| `onUpdateTitle` | User edits the project title |
| `onUpdateOverview` | User edits the project overview |
| `onAddFeature` | User adds a new feature |
| `onUpdateFeature` | User updates a feature's name or description |
| `onRemoveFeature` | User removes a feature |
| `onUpdateConstraints` | User modifies the constraints list |
| `onUpdateAmbiguities` | User modifies the ambiguities list |
| `onUpdateImplicitRequirements` | User modifies the implicit requirements list |
| `onConfirm` | User confirms the extraction |

## Expected User Flows

### Flow 1: Upload and Parse a PRD

1. User lands on the ingestion page and sees three input methods as cards
2. User drags a PDF onto the upload zone (or clicks "browse")
3. User clicks "Parse PRD" to submit
4. **Outcome:** Parsing begins, transition to progress view

### Flow 2: Review and Edit Extraction

1. User sees the extraction review screen with all AI-extracted data
2. User clicks on the title to edit it inline
3. User edits features — adds one, removes one, renames another
4. User reviews ambiguities (amber) and implicit requirements (violet)
5. User clicks "Confirm Extraction"
6. **Outcome:** Status changes to "confirmed", ready for estimation

### Flow 3: Handle Parsing Error

1. Parsing fails at a step
2. User sees error message with "Back" and "Retry" buttons
3. User clicks "Retry" to re-parse, or "Back" to return to input
4. **Outcome:** Parsing restarts or user returns to input selection

## Empty States

- **No estimation request:** Show IntakeView with three input method cards and upload zone
- **Empty extraction:** Extraction review with placeholder text ("Untitled", "No overview extracted") and "Add feature" button

## Testing

See `product-plan/sections/prd-ingestion/tests.md` for UI behavior test specs covering:
- Upload, paste, and form submission flows
- Parsing progress and error states
- Extraction review editing flows
- Empty state rendering
- Component interaction edge cases

## Files to Reference

- `product-plan/sections/prd-ingestion/README.md` — Feature overview and design intent
- `product-plan/sections/prd-ingestion/tests.md` — UI behavior test specs
- `product-plan/sections/prd-ingestion/components/` — React components
- `product-plan/sections/prd-ingestion/types.ts` — TypeScript interfaces
- `product-plan/sections/prd-ingestion/sample-data.json` — Test data

## Done When

- [ ] Components render with real data
- [ ] Three input methods work: file upload, text paste, structured form
- [ ] Parsing progress view shows step-by-step progress
- [ ] Error state displays with retry and back actions
- [ ] Extraction review allows inline editing of all fields
- [ ] Features can be added, edited, and removed
- [ ] Confirm button transitions status to "confirmed"
- [ ] Empty state displays properly when no request exists
- [ ] Responsive on mobile
- [ ] Dark mode works correctly

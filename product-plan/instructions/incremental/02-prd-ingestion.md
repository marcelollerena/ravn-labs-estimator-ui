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

Implement the PRD Ingestion feature — accept raw PRD documents via upload, paste, or form, extract structured project data using AI, and let users review and confirm before estimation begins.

## Overview

Users provide a PRD document through one of three input methods. The system uses AI to extract structured data (title, overview, features, constraints, ambiguities, implicit requirements). Users review and edit the extraction, then confirm it as input for the estimation pipeline.

**Key Functionality:**
- File upload with drag-and-drop (PDF, DOCX, Markdown)
- Text paste with character count
- Structured form fallback with feature and constraint repeaters
- AI parsing progress with step-by-step visualization
- Full review and inline editing of extracted data
- Confirmation to proceed to estimation

## Components Provided

Copy the section components from `product-plan/sections/prd-ingestion/components/`:

- `IntakeView` — Three-method input view with file upload, text paste, and form
- `ParsingView` — Step-by-step progress view during AI parsing
- `ExtractionReview` — Full review and edit interface for extracted data
- `FeatureList` — Editable feature table with add/edit/remove
- `EditableStringList` — Reusable inline-editable string list

## Props Reference

See `types.ts` for full definitions. Key interfaces:

- `EstimationRequest` — The parsed PRD with all extracted fields
- `RequestFeature` — A discrete feature with name and description
- `StructuredFormInput` — Form input with title, description, features, constraints

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onUploadFile` | User submits a file for parsing |
| `onPasteText` | User submits pasted text |
| `onSubmitForm` | User submits structured form |
| `onConfirm` | User confirms the extraction |
| `onRetryParse` | User retries parsing |
| `onUpdateTitle` | User edits the title |
| `onAddFeature` | User adds a feature |
| `onUpdateFeature` | User edits a feature |
| `onRemoveFeature` | User removes a feature |

## Expected User Flows

### Flow 1: Upload and Parse a PRD
1. User navigates to PRD Ingestion
2. User drags a PDF onto the upload zone (or clicks browse)
3. User clicks "Parse PRD"
4. System shows parsing progress with steps
5. **Outcome:** Extraction review screen appears with populated data

### Flow 2: Review and Edit Extraction
1. User sees extracted title, overview, features, constraints
2. User clicks on the title to edit it inline
3. User adds a missing feature via "Add feature"
4. User removes an ambiguity that's not relevant
5. **Outcome:** Extraction reflects the user's corrections

### Flow 3: Confirm and Proceed
1. User reviews all extracted data
2. User clicks "Confirm Extraction"
3. **Outcome:** Status changes to "confirmed", user proceeds to estimation

## Testing

See `product-plan/sections/prd-ingestion/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/prd-ingestion/README.md` — Feature overview
- `product-plan/sections/prd-ingestion/tests.md` — UI behavior tests
- `product-plan/sections/prd-ingestion/components/` — React components
- `product-plan/sections/prd-ingestion/types.ts` — TypeScript interfaces
- `product-plan/sections/prd-ingestion/sample-data.json` — Test data

## Done When

- [ ] Three input methods work (upload, paste, form)
- [ ] File upload accepts PDF, DOCX, MD with drag-and-drop
- [ ] Parsing progress shows step-by-step
- [ ] Extraction review displays all fields
- [ ] All fields are editable inline
- [ ] Features can be added, edited, removed
- [ ] Ambiguities and implicit requirements show AI-inferred badge
- [ ] Confirm button disabled without title and at least one feature
- [ ] Confirmed extraction feeds into estimation step
- [ ] Responsive on mobile

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

Implement the PRD Ingestion feature — the entry point into the estimation workflow where users provide a PRD, the system extracts structured data, and users review and confirm the extraction.

## Overview

Users upload a PRD document (PDF, DOCX, or Markdown), paste raw text, or fill a structured form. The system uses AI (Claude Sonnet) to parse the document and extract a structured representation: project title, overview, feature list, technical constraints, ambiguities, and implicit requirements. Users then review the extraction, edit any field inline, and confirm it as the input for estimation.

**Key Functionality:**
- Upload PRD files (PDF, DOCX, Markdown) via drag-and-drop or file picker
- Paste raw PRD text with character count
- Fill a structured fallback form with title, description, features, and constraints
- View real-time parsing progress with step-by-step extraction status
- Review all AI-extracted fields with inline editing
- Add, remove, rename, and rewrite extracted features
- Edit technical constraints, ambiguities, and implicit requirements
- Confirm the final extraction to trigger estimation

## Components Provided

Copy the section components from `product-plan/sections/prd-ingestion/components/`:

- `IntakeView.tsx` — Upload/paste/form input screen with three method cards
- `ParsingView.tsx` — Step-by-step extraction progress with cancel/retry
- `ExtractionReview.tsx` — Dense review screen with all editable fields (the hero screen)
- `FeatureList.tsx` — Numbered feature table with inline edit, add, remove
- `EditableStringList.tsx` — Reusable editable string list for constraints/ambiguities/requirements
- `index.ts` — Barrel exports

## Props Reference

The components expect these data shapes (see `types.ts` for full definitions):

**Data props:**

```typescript
interface EstimationRequest {
  id: string
  title: string
  rawContent: string
  sourceFormat: 'pdf' | 'docx' | 'markdown' | 'text' | 'form'
  status: 'draft' | 'parsing' | 'confirmed' | 'estimating' | 'complete'
  projectOverview: string
  technicalConstraints: string[]
  ambiguities: string[]
  implicitRequirements: string[]
  features: RequestFeature[]
  createdAt: string
  updatedAt: string
}

interface RequestFeature {
  id: string
  name: string
  description: string
}
```

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onUploadFile` | User submits a file for parsing |
| `onPasteText` | User submits pasted text for parsing |
| `onSubmitForm` | User submits the structured form |
| `onRetryParse` | User retries parsing after error or poor quality |
| `onUpdateTitle` | User edits the project title |
| `onUpdateOverview` | User edits the project overview |
| `onAddFeature` | User adds a new feature |
| `onUpdateFeature` | User edits a feature name or description |
| `onRemoveFeature` | User deletes a feature |
| `onUpdateConstraints` | User modifies the technical constraints list |
| `onUpdateAmbiguities` | User modifies the ambiguities list |
| `onUpdateImplicitRequirements` | User modifies the implicit requirements list |
| `onConfirm` | User confirms the extraction (status → "confirmed") |

## Expected User Flows

When fully implemented, users should be able to complete these flows:

### Flow 1: Upload and Parse a PRD

1. User navigates to PRD Ingestion
2. User sees three input method cards: Upload File, Paste Text, Structured Form
3. User selects "Upload File" (default active)
4. User drags a PDF onto the drop zone (or clicks "browse" to select)
5. File name and size appear in the drop zone
6. User clicks "Parse PRD"
7. **Outcome:** System begins AI extraction, transitions to parsing view

### Flow 2: Monitor Parsing Progress

1. User sees the parsing screen with file name and source format badge
2. Progress bar advances as steps complete
3. Steps show status: extracting text → identifying scope → extracting features → analyzing constraints → detecting ambiguities → structuring output
4. On completion, transitions automatically to extraction review
5. **Outcome:** User arrives at the review screen with all fields populated

### Flow 3: Review and Edit Extraction

1. User sees the extraction review screen with all AI-extracted data
2. User clicks the project title to edit it inline
3. User clicks the overview text to edit it in a textarea
4. User edits a feature name/description via the pencil icon
5. User adds a new feature via "Add feature"
6. User removes a feature via the X icon
7. User adds a new technical constraint
8. User reviews amber-tinted ambiguities (marked "AI-inferred")
9. User reviews violet-tinted implicit requirements (marked "AI-inferred")
10. User clicks "Confirm Extraction"
11. **Outcome:** Status changes to "confirmed", user is navigated to estimation

### Flow 4: Handle Parsing Failure

1. During parsing, an error occurs (e.g., unreadable PDF)
2. Error step shows red with error message
3. User clicks "Retry" to re-attempt parsing
4. Or user clicks "Back" to return to intake and try a different method
5. **Outcome:** User can recover without losing their intent

## Empty States

- **No file selected:** Drop zone shows upload icon with "Drag and drop your PRD, or browse" and format badges (PDF, DOCX, MD)
- **Empty paste textarea:** Placeholder text "Paste your PRD content here..." with 0 chars indicator
- **Empty form:** Pre-populated with one empty feature row and one empty constraint row
- **No features extracted:** Feature table shows empty state with "Add feature" button
- **No ambiguities/requirements:** Lists show empty state with respective "Add" button

## Testing

See `product-plan/sections/prd-ingestion/tests.md` for UI behavior test specs covering:
- Intake method selection and submission
- Parsing progress and error states
- Extraction review editing and confirmation
- Empty state rendering

## Files to Reference

- `product-plan/sections/prd-ingestion/README.md` — Feature overview and design intent
- `product-plan/sections/prd-ingestion/tests.md` — UI behavior test specs
- `product-plan/sections/prd-ingestion/components/` — React components
- `product-plan/sections/prd-ingestion/types.ts` — TypeScript interfaces
- `product-plan/sections/prd-ingestion/sample-data.json` — Test data

## Done When

- [ ] All three intake methods work (upload, paste, form)
- [ ] File upload accepts PDF, DOCX, MD with drag-and-drop
- [ ] Parsing progress shows real-time step status
- [ ] Error state allows retry or back navigation
- [ ] Extraction review displays all fields from AI parsing
- [ ] All fields are editable inline (title, overview, features, constraints, ambiguities, implicit requirements)
- [ ] Features can be added, edited, and removed
- [ ] Ambiguities and implicit requirements are visually distinct (amber/violet tints, "AI-inferred" badge)
- [ ] Confirm button transitions status to "confirmed"
- [ ] Empty states display properly
- [ ] Responsive on mobile

# Test Specs: PRD Ingestion

These test specs are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

PRD Ingestion is the entry point to the estimation pipeline. Users provide a PRD via upload, paste, or form. The system extracts structured data via AI. Users review, edit, and confirm the extraction. The key functionality to test: input method selection, file handling, parsing progress, extraction review editing, and confirmation flow.

---

## User Flow Tests

### Flow 1: Upload a PRD File

**Scenario:** User uploads a PDF file and triggers parsing

#### Success Path

**Setup:**
- IntakeView rendered with no existing request
- Upload method is selected by default

**Steps:**
1. User sees three input method cards: "Upload File", "Paste Text", "Structured Form"
2. "Upload File" card has blue border indicating active state
3. User drags a PDF file onto the drop zone
4. Drop zone shows file name and file size (e.g., "proposal.pdf", "142.3 KB")
5. "Parse PRD" button becomes enabled
6. User clicks "Parse PRD"

**Expected Results:**
- [ ] `onUploadFile` callback is called with the File object
- [ ] File name displays in the drop zone after selection
- [ ] File size displays in KB with monospace font
- [ ] "Remove file" link appears below file info
- [ ] "Parse PRD" button is disabled when no file is selected

#### Failure Path: Invalid File Type

**Steps:**
1. User drops a `.jpg` file onto the drop zone

**Expected Results:**
- [ ] File is not accepted (drop zone does not change)
- [ ] "Parse PRD" button remains disabled

#### Remove Selected File

**Steps:**
1. User selects a file
2. User clicks "Remove file"

**Expected Results:**
- [ ] Drop zone returns to empty state with upload icon
- [ ] "Parse PRD" button becomes disabled again

---

### Flow 2: Paste PRD Text

**Scenario:** User pastes raw text and triggers parsing

**Steps:**
1. User clicks "Paste Text" card
2. Card shows blue active border, upload zone is replaced by textarea
3. User types or pastes text into the monospace textarea
4. Character count updates in real-time (e.g., "4,523 chars")
5. User clicks "Parse PRD"

**Expected Results:**
- [ ] `onPasteText` callback is called with the trimmed text string
- [ ] Character count updates as user types
- [ ] "Parse PRD" button is disabled when textarea is empty or whitespace-only
- [ ] Textarea has monospace font (JetBrains Mono)

---

### Flow 3: Structured Form Input

**Scenario:** User fills the fallback form manually

**Steps:**
1. User clicks "Structured Form" card
2. User fills "Project Title" field
3. User fills "Description" textarea
4. User fills the first feature's name and description
5. User clicks "Add feature" to add a second feature row
6. User fills a constraint field
7. User clicks "Parse PRD"

**Expected Results:**
- [ ] `onSubmitForm` callback is called with `{ title, description, features, constraints }`
- [ ] "Parse PRD" is disabled when title is empty
- [ ] "Add feature" adds a new row with empty name and description
- [ ] Feature rows have X button to remove (except when only 1 row)
- [ ] Constraint rows have X button to remove (except when only 1 row)

---

### Flow 4: Parsing Progress

**Scenario:** System is extracting data from the uploaded PRD

**Steps:**
1. ParsingView renders with file name, source format, and 6 steps
2. Steps progress from pending → active → complete
3. Progress bar advances as steps complete
4. Step counter shows "N/6 steps"

**Expected Results:**
- [ ] File name and format badge display in header area
- [ ] Each step shows correct icon: checkmark (complete), spinner (active), circle (pending), X (error)
- [ ] Active step has blue-tinted background
- [ ] Progress bar width matches (completedSteps / totalSteps) percentage
- [ ] Cancel button is visible and calls `onCancel` when clicked

#### Failure Path: Parsing Error

**Setup:**
- One step has status "error", error message provided

**Expected Results:**
- [ ] Error step shows red X icon and red-tinted background
- [ ] Error message displays in a red-bordered box below steps
- [ ] Progress bar turns red
- [ ] "Retry" button appears (calls `onRetry`)
- [ ] "Back" button appears (calls `onCancel`)

---

### Flow 5: Review and Edit Extraction

**Scenario:** User reviews the AI-extracted structure and edits fields

#### Edit Title

**Steps:**
1. User clicks on the project title text
2. Title becomes an editable input field
3. User modifies the title
4. User presses Enter

**Expected Results:**
- [ ] `onUpdateTitle` is called with request ID and new title
- [ ] Input field appears with blue border on click
- [ ] Pressing Escape cancels the edit (reverts to original)

#### Edit Overview

**Steps:**
1. User clicks on the project overview text
2. Text becomes an editable textarea
3. User modifies the overview
4. User clicks "Save"

**Expected Results:**
- [ ] `onUpdateOverview` is called with request ID and new overview
- [ ] "Cancel" button reverts to original text
- [ ] Click-to-edit cursor appears on hover

#### Edit Feature

**Steps:**
1. User hovers over a feature row
2. Pencil icon appears on the right
3. User clicks pencil icon
4. Name and description become editable fields
5. User modifies and clicks checkmark

**Expected Results:**
- [ ] `onUpdateFeature` is called with request ID, feature ID, and updates
- [ ] Feature row shows numbered index (01, 02, etc.)
- [ ] Grip handle icon appears on hover (left side)
- [ ] X button appears on hover (remove)

#### Add Feature

**Steps:**
1. User clicks "Add feature" at bottom of feature list
2. Empty name input and description textarea appear
3. User fills both and clicks checkmark

**Expected Results:**
- [ ] `onAddFeature` is called with request ID and `{ name, description }`
- [ ] New row appears with next sequential number
- [ ] Pressing Escape cancels the add

#### Remove Feature

**Steps:**
1. User hovers over a feature row
2. User clicks the X icon

**Expected Results:**
- [ ] `onRemoveFeature` is called with request ID and feature ID
- [ ] Feature is removed from the list
- [ ] Remaining features re-number

#### Edit String Lists (Constraints, Ambiguities, Implicit Requirements)

**Steps:**
1. User hovers over a list item
2. Pencil and X icons appear
3. User clicks pencil to edit, or X to remove
4. User clicks "Add constraint" / "Add ambiguity" / "Add requirement" to add new items

**Expected Results:**
- [ ] Respective `onUpdate*` callback is called with the full updated array
- [ ] Each item shows a bullet point marker
- [ ] Edit mode shows textarea with blue border
- [ ] Items can be added, edited, and removed

---

### Flow 6: Confirm Extraction

**Scenario:** User confirms the reviewed extraction

**Steps:**
1. User reviews all fields
2. User clicks "Confirm Extraction" in the page header

**Expected Results:**
- [ ] `onConfirm` is called with the request ID
- [ ] Button is disabled when title is empty or no features exist
- [ ] "Re-parse" button is available next to confirm (calls `onRetryParse`)

---

## Empty State Tests

### IntakeView — No File Selected

**Setup:**
- IntakeView rendered, upload method active, no file selected

**Expected Results:**
- [ ] Drop zone shows upload icon and "Drag and drop your PRD, or browse"
- [ ] Format badges visible: PDF, DOCX, MD
- [ ] "Parse PRD" button is disabled
- [ ] "browse" is a clickable label that opens file picker

### IntakeView — Empty Paste

**Setup:**
- Paste method active, textarea empty

**Expected Results:**
- [ ] Placeholder text: "Paste your PRD content here..."
- [ ] Character count shows "0 chars"
- [ ] "Parse PRD" button is disabled

### ExtractionReview — No Features

**Setup:**
- EstimationRequest with `features: []`

**Expected Results:**
- [ ] Feature section shows "Add feature" button
- [ ] "Confirm Extraction" button is disabled (requires at least 1 feature)
- [ ] Feature count shows "0"

### ExtractionReview — Empty Ambiguities/Requirements

**Setup:**
- EstimationRequest with `ambiguities: []` and `implicitRequirements: []`

**Expected Results:**
- [ ] Amber section shows only "Add ambiguity" button
- [ ] Violet section shows only "Add requirement" button
- [ ] "AI-inferred" badges still display in section headers

---

## Component Interaction Tests

### IntakeView Method Switching

- [ ] Clicking "Paste Text" card switches to paste textarea
- [ ] Clicking "Structured Form" card switches to form fields
- [ ] Clicking back to "Upload File" restores the drop zone
- [ ] Selected file persists when switching away and back
- [ ] Pasted text persists when switching away and back

### ExtractionReview Status Badges

- [ ] Draft status shows gray badge "Draft"
- [ ] Confirmed status shows green badge "Confirmed"
- [ ] Source format badge shows correct format (PDF, DOCX, MD, TXT, Form)

### PageHeader Integration

- [ ] Title renders in the page header
- [ ] Description shows "Extracted from [format] source"
- [ ] Status and format badges render next to title
- [ ] Actions (Re-parse, Confirm) render right-aligned

---

## Edge Cases

- [ ] Very long project title truncates or wraps gracefully
- [ ] Feature with very long description wraps within the table cell
- [ ] 20+ features render without performance issues
- [ ] 10+ constraints/ambiguities/requirements render correctly
- [ ] Empty title shows placeholder text "Untitled"
- [ ] Empty overview shows placeholder text "No overview extracted"
- [ ] Rapid click on "Add feature" doesn't create duplicates
- [ ] Editing multiple features concurrently (only one edit mode at a time)

---

## Accessibility Checks

- [ ] All interactive elements are keyboard accessible (Tab navigation)
- [ ] Form fields have associated labels
- [ ] Edit/remove buttons have accessible names (title attributes on collapsed sidebar)
- [ ] Focus moves to input field when entering edit mode
- [ ] Escape key cancels edit mode in all editable fields
- [ ] Status badges have meaningful text (not just color)

---

## Sample Test Data

Use the data from `sample-data.json` or create variations:

```typescript
// Populated state (8 features, 6 constraints, 5 ambiguities, 5 implicit reqs)
const mockRequest: EstimationRequest = {
  id: "er-001",
  title: "Mobile Banking App",
  rawContent: "...",
  sourceFormat: "pdf",
  status: "draft",
  projectOverview: "A consumer-facing mobile banking application...",
  technicalConstraints: ["React Native for cross-platform mobile"],
  ambiguities: ["No mention of offline mode"],
  implicitRequirements: ["Session timeout and automatic logout"],
  features: [
    { id: "rf-001", name: "Account Dashboard", description: "Overview screen..." }
  ],
  createdAt: "2026-04-10T14:30:00Z",
  updatedAt: "2026-04-10T15:45:00Z",
};

// Empty state
const mockEmptyRequest: EstimationRequest = {
  id: "er-006",
  title: "",
  rawContent: "",
  sourceFormat: "pdf",
  status: "draft",
  projectOverview: "",
  technicalConstraints: [],
  ambiguities: [],
  implicitRequirements: [],
  features: [],
  createdAt: "2026-04-13T11:00:00Z",
  updatedAt: "2026-04-13T11:00:00Z",
};

// Parsing steps
const mockParsingSteps = [
  { label: "Extracting text", description: "Reading document content", status: "complete" },
  { label: "Identifying project scope", description: "Extracting title and overview", status: "complete" },
  { label: "Extracting features", description: "Breaking down requirements", status: "active" },
  { label: "Analyzing constraints", description: "Identifying technical constraints", status: "pending" },
  { label: "Detecting ambiguities", description: "Surfacing unanswered questions", status: "pending" },
  { label: "Structuring output", description: "Compiling estimation request", status: "pending" },
];
```

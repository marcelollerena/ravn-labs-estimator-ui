# Test Specs: PRD Ingestion

These test specs are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

PRD Ingestion is the entry point into the estimation workflow. Users provide a PRD via file upload, text paste, or structured form. The system parses it with AI and presents an extraction for review. Users edit and confirm the extraction before it feeds into estimation.

---

## User Flow Tests

### Flow 1: Upload a File for Parsing

**Scenario:** User uploads a PDF PRD and submits it for parsing

#### Success Path

**Setup:**
- No existing estimation request (intake view is shown)
- Upload method is selected by default

**Steps:**
1. User sees three input method cards: "Upload File", "Paste Text", "Structured Form"
2. "Upload File" card is selected (highlighted with blue border)
3. User drags a PDF file onto the drop zone
4. Drop zone shows the file name, size in KB, and a "Remove file" link
5. User clicks "Parse PRD" button

**Expected Results:**
- [ ] `onUploadFile` callback is called with the File object
- [ ] Drop zone transitions from dashed border to emerald/green border with file icon
- [ ] File name and size are displayed
- [ ] "Parse PRD" button becomes enabled after file is added

#### Failure Path: No File Selected

**Steps:**
1. User sees the upload drop zone but does not add a file
2. User attempts to click "Parse PRD"

**Expected Results:**
- [ ] "Parse PRD" button is disabled (opacity-40, cursor-not-allowed)
- [ ] No callback is fired

---

### Flow 2: Paste Text for Parsing

**Scenario:** User pastes raw PRD text and submits it

#### Success Path

**Steps:**
1. User clicks the "Paste Text" card
2. Card highlights with blue border
3. User types or pastes text into the monospace textarea
4. Character count updates in the bottom-right corner
5. User clicks "Parse PRD"

**Expected Results:**
- [ ] `onPasteText` callback is called with the trimmed text string
- [ ] Character count reflects the actual content length
- [ ] "Parse PRD" button is enabled when text is non-empty

#### Failure Path: Empty Text

**Steps:**
1. User selects "Paste Text" and leaves textarea empty
2. User clicks "Parse PRD"

**Expected Results:**
- [ ] "Parse PRD" button is disabled
- [ ] No callback is fired

---

### Flow 3: Submit Structured Form

**Scenario:** User fills out the structured form and submits it

#### Success Path

**Steps:**
1. User clicks the "Structured Form" card
2. User enters "Mobile Banking App" in the "Project Title" field
3. User enters a description in the "Description" textarea
4. User fills in the first feature name and description
5. User clicks "Add feature" to add another feature row
6. User adds a technical constraint
7. User clicks "Parse PRD"

**Expected Results:**
- [ ] `onSubmitForm` callback is called with `{ title, description, features, constraints }`
- [ ] "Parse PRD" button is enabled once title is non-empty
- [ ] Features repeater allows adding and removing rows
- [ ] Constraints repeater allows adding and removing rows

---

### Flow 4: Review and Edit Extraction

**Scenario:** User reviews and edits the AI-extracted data

#### Success Path

**Setup:**
- EstimationRequest exists with status "draft", title "Mobile Banking App", populated features, constraints, ambiguities, and implicit requirements

**Steps:**
1. User sees the extraction review screen with PageHeader showing title and "Draft" badge
2. User clicks on the title text to edit it inline
3. User changes title and presses Enter to save
4. User clicks on the project overview text to edit it
5. User edits the overview and clicks "Save"
6. User clicks the pencil icon on a feature to edit it
7. User changes the feature name and presses Cmd+Enter to save
8. User clicks "Add feature" at the bottom of the feature list
9. User fills in name and description, clicks the checkmark
10. User clicks the X icon on a feature to remove it
11. User edits a technical constraint by clicking the pencil icon
12. User adds a new ambiguity in the ambiguities section
13. User clicks "Confirm Extraction"

**Expected Results:**
- [ ] `onUpdateTitle` called with request ID and new title
- [ ] `onUpdateOverview` called with request ID and new overview
- [ ] `onUpdateFeature` called with request ID, feature ID, and updates
- [ ] `onAddFeature` called with request ID and new feature data
- [ ] `onRemoveFeature` called with request ID and feature ID
- [ ] `onUpdateConstraints` called with request ID and updated array
- [ ] `onUpdateAmbiguities` called with request ID and updated array
- [ ] `onConfirm` called with request ID

#### Failure Path: Confirm Without Title or Features

**Setup:**
- EstimationRequest with empty title and no features

**Expected Results:**
- [ ] "Confirm Extraction" button is disabled (opacity-40)
- [ ] Button requires at least a title and one feature

---

### Flow 5: Parsing Progress

**Scenario:** User sees parsing progress after submitting a document

#### Success Path

**Setup:**
- Parsing is in progress with some steps complete

**Steps:**
1. User sees the parsing view with file name and source format badge
2. Progress bar fills as steps complete
3. Step counter shows "2/4 steps"
4. Completed steps show green checkmarks
5. Active step shows spinning loader
6. Pending steps show empty circles

**Expected Results:**
- [ ] Progress bar width matches completed/total ratio
- [ ] Step status icons match their respective states
- [ ] File name and format are displayed in the header

#### Failure Path: Parsing Error

**Setup:**
- Parsing failed at step 3

**Steps:**
1. User sees the error state with red progress bar
2. Error step shows red X icon
3. Error message is displayed below the steps
4. "Back" and "Retry" buttons appear

**Expected Results:**
- [ ] Error message is visible and descriptive
- [ ] "Back" button calls `onCancel`
- [ ] "Retry" button calls `onRetry`
- [ ] Badge in PageHeader shows "Error" in red

---

## Empty State Tests

### Primary Empty State

**Scenario:** User has no estimation requests (first-time experience)

**Setup:**
- No estimation request selected (null)
- Intake view is shown

**Expected Results:**
- [ ] IntakeView is displayed with three input method cards
- [ ] "Upload File" is selected by default
- [ ] Drop zone shows "Drag and drop your PRD, or browse"
- [ ] Format badges (PDF, DOCX, MD) are visible
- [ ] "Parse PRD" button is disabled until input is provided

---

## Component Interaction Tests

### IntakeView

**Renders correctly:**
- [ ] Shows three input method cards with icons and descriptions
- [ ] Only one method is active at a time
- [ ] Active card has blue border and ring styling

**User interactions:**
- [ ] Clicking a method card switches the active input area
- [ ] Drag-and-drop changes drop zone styling (dragActive state)
- [ ] File picker opens when clicking "browse" label
- [ ] "Remove file" link clears the selected file

### FeatureList

**Renders correctly:**
- [ ] Shows column headers: Feature, Description
- [ ] Shows numbered rows with feature name and description
- [ ] Row numbers are zero-padded (01, 02, etc.)

**User interactions:**
- [ ] Hovering a row reveals edit (pencil) and delete (X) buttons
- [ ] Clicking pencil enters inline edit mode with input fields
- [ ] Pressing Cmd+Enter in edit mode saves changes
- [ ] Pressing Escape in edit mode cancels changes
- [ ] Clicking X removes the feature
- [ ] "Add feature" shows a new empty row with input fields

### EditableStringList

**Renders correctly:**
- [ ] Shows bullet-point items with text
- [ ] Each item has hover-reveal edit and delete buttons

**User interactions:**
- [ ] Clicking pencil enters edit mode with textarea
- [ ] Pressing Enter (not Shift+Enter) saves the edit
- [ ] Pressing Escape cancels the edit
- [ ] Clicking X removes the item
- [ ] "Add" button shows a new textarea for input

---

## Edge Cases

- [ ] Handles very long file names with truncation
- [ ] Handles empty features list (only "Add feature" button shown)
- [ ] Handles features with very long names and descriptions
- [ ] Handles 0 ambiguities or 0 implicit requirements gracefully
- [ ] Switching input methods preserves data entered in each method
- [ ] Drag-and-drop rejects unsupported file types gracefully
- [ ] Large pasted text (10,000+ chars) shows correct character count

---

## Accessibility Checks

- [ ] All interactive elements are keyboard accessible
- [ ] Form fields have associated labels
- [ ] Input method cards are operable via keyboard
- [ ] Edit/delete actions in feature list are focusable
- [ ] Focus is managed appropriately after adding/removing items

---

## Sample Test Data

```typescript
import type { EstimationRequest } from './types'

// Populated state
const mockRequest: EstimationRequest = {
  id: "er-001",
  title: "Mobile Banking App",
  rawContent: "# Mobile Banking App PRD...",
  sourceFormat: "pdf",
  status: "draft",
  projectOverview: "A consumer-facing mobile banking application...",
  technicalConstraints: ["React Native for cross-platform mobile"],
  ambiguities: ["No mention of offline mode"],
  implicitRequirements: ["Session timeout and automatic logout"],
  features: [
    { id: "rf-001", name: "Account Dashboard", description: "Overview screen showing all linked accounts..." },
    { id: "rf-002", name: "Fund Transfers", description: "Transfer money between own accounts..." }
  ],
  createdAt: "2026-04-10T14:30:00Z",
  updatedAt: "2026-04-10T15:45:00Z"
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
  updatedAt: "2026-04-13T11:00:00Z"
};
```

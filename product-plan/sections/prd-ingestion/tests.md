# Test Specs: PRD Ingestion

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview

PRD Ingestion accepts documents via upload, paste, or form, extracts structured data via AI, and lets users review and confirm before estimation.

---

## User Flow Tests

### Flow 1: Upload a File

**Setup:** No current estimation request

**Steps:**
1. User sees three input methods: "Upload File", "Paste Text", "Structured Form"
2. "Upload File" is selected by default
3. User drags a PDF file onto the drop zone
4. File name and size appear in the drop zone
5. User clicks "Parse PRD"

**Expected Results:**
- [ ] Drop zone shows file name and file size in KB
- [ ] "Parse PRD" button becomes enabled after file selection
- [ ] "Remove file" link is visible

### Flow 2: Paste Text

**Steps:**
1. User clicks "Paste Text" tab
2. User types or pastes content into the textarea
3. Character count updates in real-time
4. User clicks "Parse PRD"

**Expected Results:**
- [ ] Textarea is monospace font
- [ ] Character count shows correct count (e.g., "1,234 chars")
- [ ] "Parse PRD" button enabled when text is non-empty

### Flow 3: Review Extraction

**Setup:** EstimationRequest with status "draft", populated fields

**Steps:**
1. User sees title, overview, features, constraints, ambiguities, implicit requirements
2. User clicks on the title to edit it inline
3. User presses Enter to save
4. User clicks "Add feature" and enters name + description
5. User clicks "Confirm Extraction"

**Expected Results:**
- [ ] Title shows as editable text (click to edit)
- [ ] Features table shows feature count in header
- [ ] "Confirm Extraction" button is disabled when title is empty or no features exist
- [ ] Ambiguities section has "AI-inferred" badge
- [ ] Implicit Requirements section has "AI-inferred" badge

---

## Empty State Tests

### No Features

**Setup:** EstimationRequest with empty features array

**Expected Results:**
- [ ] "Add feature" button is visible
- [ ] "Confirm Extraction" button is disabled
- [ ] Feature count shows "0"

---

## Component Tests

### EditableStringList
- [ ] Clicking edit icon opens inline textarea
- [ ] Pressing Enter saves the edit
- [ ] Pressing Escape cancels the edit
- [ ] Clicking X removes the item
- [ ] "Add" button opens inline input

### FeatureList
- [ ] Each row shows sequential number (01, 02, ...)
- [ ] Edit mode shows name input + description textarea
- [ ] Cmd/Ctrl+Enter saves in edit mode

---

## Edge Cases

- [ ] Very long feature names truncate properly
- [ ] File upload rejects unsupported formats
- [ ] Empty paste text disables Parse PRD button

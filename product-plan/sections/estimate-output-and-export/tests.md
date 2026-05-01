# Test Specs: Estimate Output & Export

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview

Generate, preview, and export estimate documents in internal (full detail) and client-ready (clean) variants.

---

## User Flow Tests

### Flow 1: Switch Export Profile

**Steps:**
1. User sees two profile cards: "Internal" and "Client-Ready"
2. User clicks "Client-Ready"
3. Preview panel updates to client view
4. Section toggles update (internal-only sections become locked)

**Expected Results:**
- [ ] Client-Ready card gets emerald border and ring
- [ ] Internal card loses its violet border
- [ ] Preview header changes from "Internal Document" (violet) to "Client-Ready Document" (emerald)
- [ ] Client-unsafe sections show padlock icon and are disabled
- [ ] Section toggle count updates

### Flow 2: Toggle Sections

**Steps:**
1. User unchecks "Risk Assessment" in the section toggles
2. Section count decreases by 1
3. Preview updates to exclude risks

**Expected Results:**
- [ ] Checkbox unchecks with visual feedback
- [ ] Included count decreases (e.g., "9/10" → "8/10")
- [ ] Client-unsafe sections cannot be toggled in client profile

### Flow 3: Export to PDF

**Steps:**
1. User clicks "Generate" next to PDF
2. Button shows "Generating..." with spinner
3. Export completes, shows "Generated" checkmark
4. "Download" button appears

**Expected Results:**
- [ ] Button changes from "Generate" to loading state
- [ ] On completion, shows green "Generated" text with checkmark
- [ ] Download button/link appears
- [ ] Entry appears in Export History

---

## Component Tests

### ExportMetadataBar
- [ ] Shows estimate ID, version, reviewer name, approval date
- [ ] Confidence is color-coded
- [ ] Status badge shows "approved" or "exported"

### DocumentPreview (Internal)
- [ ] Shows hour ranges (low/likely/high) per feature
- [ ] Shows confidence percentages
- [ ] Adjusted features have pencil icon indicator
- [ ] Shows 4 summary metric cards including confidence

### DocumentPreview (Client)
- [ ] Shows only likely hours (no ranges)
- [ ] No confidence percentages
- [ ] No adjustment indicators
- [ ] Shows 3 summary metric cards (no confidence)
- [ ] Disclaimers section appears at bottom

### SectionToggles
- [ ] Client-unsafe sections show lock icon
- [ ] Locked sections are visually dimmed (opacity)
- [ ] Click on locked section does nothing

### ExportHistory
- [ ] Shows format icon (PDF/Markdown/Link)
- [ ] Shows profile badge (internal=violet, client=emerald)
- [ ] Shows date, time, and exporter name
- [ ] Download button for each entry

---

## Edge Cases

- [ ] Empty export history shows nothing (section hidden)
- [ ] Failed export shows "Retry" button
- [ ] Web link export shows "Copy Link" instead of "Download"
- [ ] Cover notes textarea preserves content per profile when switching

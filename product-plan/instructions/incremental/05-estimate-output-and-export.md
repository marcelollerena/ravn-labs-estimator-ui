# Milestone 5: Estimate Output & Export

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 4 (Human Review & Adjustment) complete

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

Implement the Estimate Output & Export feature — generate internal (full detail) and client-ready (clean) estimate documents with PDF, Markdown, and web link export options.

## Overview

Users generate, preview, and export estimate documents in two variants. Internal shows full detail including AI attribution, adjustment reasoning, and comparable projects. Client-ready hides internal data and shows only likely hours with professional framing.

**Key Functionality:**
- Profile selector: Internal vs Client-Ready with distinct visual treatment
- Section toggles controlling what's included (client-unsafe sections auto-locked)
- Document preview adapting to selected profile
- Export actions: PDF, Markdown, Web Link with loading/success/error states
- Version metadata (estimate ID, version, reviewer, approval date)
- Export history with re-download capability
- Cover notes/disclaimers per profile

## Components Provided

Copy from `product-plan/sections/estimate-output-and-export/components/`:

- `ExportDashboardView` — Main layout with profile selector, sidebar + preview
- `ExportMetadataBar` — Version and status metadata
- `SectionToggles` — Section inclusion checklist with lock indicators
- `ExportActions` — Export buttons with status states
- `DocumentPreview` — Rendered preview (adapts to profile)
- `ExportHistory` — Past export log
- `CoverNotes` — Editable notes per profile

## Props Reference

See `types.ts` for full definitions. Key interfaces:

- `ExportDashboard` — Top-level dashboard with all data
- `ExportSection` — Toggleable section with per-profile inclusion
- `ExportMetadata` — Version, status, reviewer info
- `ExportAction` — Export action with format, status, file URL
- `PreviewData` — Rendered preview content per profile

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onSwitchProfile` | User switches Internal ↔ Client |
| `onToggleSection` | User toggles section inclusion |
| `onUpdateNotes` | User edits cover notes |
| `onExport` | User triggers export |
| `onCopyLink` | User copies shareable link |
| `onDownload` | User downloads previous export |

## Expected User Flows

### Flow 1: Preview Internal Document
1. User arrives with approved estimate
2. "Internal" profile is selected by default
3. Preview shows full detail: hour ranges, confidence, adjustments
4. **Outcome:** User can review the complete internal document

### Flow 2: Switch to Client-Ready
1. User clicks "Client-Ready" profile card
2. Preview updates: only likely hours, no confidence, no internal notes
3. Client-unsafe sections (comparable projects, adjustment history) lock
4. Disclaimers section appears in preview
5. **Outcome:** Client-appropriate document ready for review

### Flow 3: Export to PDF
1. User clicks "Generate" next to PDF
2. Button shows generating state
3. Export completes with confirmation
4. User clicks "Download"
5. **Outcome:** PDF downloaded, entry added to history

## Empty States

- **No export history:** History section is hidden
- **Failed export:** Shows "Retry" button on the failed action

## Testing

See `product-plan/sections/estimate-output-and-export/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/estimate-output-and-export/README.md`
- `product-plan/sections/estimate-output-and-export/tests.md`
- `product-plan/sections/estimate-output-and-export/components/`
- `product-plan/sections/estimate-output-and-export/types.ts`
- `product-plan/sections/estimate-output-and-export/sample-data.json`

## Done When

- [ ] Profile selector switches between Internal and Client-Ready
- [ ] Preview adapts content based on active profile
- [ ] Internal shows full detail (ranges, confidence, adjustments)
- [ ] Client-Ready hides internal data, shows only likely hours
- [ ] Section toggles work; client-unsafe sections are locked
- [ ] Export to PDF, Markdown, Web Link with status feedback
- [ ] Export history shows past exports with download
- [ ] Cover notes persist per profile
- [ ] Metadata bar shows estimate info and status
- [ ] Responsive on mobile

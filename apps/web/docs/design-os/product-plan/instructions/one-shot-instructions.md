# Estimator — Complete Implementation Instructions

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

## Testing

Each section includes a `tests.md` file with UI behavior test specs. These are **framework-agnostic** — adapt them to your testing setup.

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

---

## Product Overview

An internal Ravn tool that accelerates project estimation by combining AI-generated first-pass estimates with senior engineer review. Upload a PRD, get a structured estimate in under 60 seconds, review and adjust with mandatory reasoning, and build Ravn's collective estimation intelligence over time.

**Planned Sections:**
1. PRD Ingestion
2. AI-Driven First-Pass Estimation
3. Human Review & Adjustment
4. Estimate Output & Export
5. Historical Projects & Calibration

**Design System:** blue/slate/zinc palette, Inter + JetBrains Mono typography

**Product Entities:** EstimationRequest, RequestFeature, Estimate, EstimateFeature, EstimateRisk, EstimateQuestion, Adjustment, Project, CalibrationEntry

---

# Milestone 1: Shell

> **Prerequisites:** None

## Goal

Set up the design tokens and application shell — the persistent chrome that wraps all sections.

## What to Implement

### 1. Design Tokens

Configure your styling system:
- **Colors:** blue (primary), slate (secondary), zinc (neutral)
- **Fonts:** Inter (heading + body), JetBrains Mono (mono)
- See `product-plan/design-system/` for tokens.css, tailwind-colors.md, and fonts.md

### 2. Application Shell

Copy shell components from `product-plan/shell/components/`:
- `AppShell.tsx` — Main layout wrapper (232px sidebar + content area)
- `MainNav.tsx` — Grouped sidebar navigation (6 items, 3 groups)
- `UserMenu.tsx` — User menu with avatar and dropdown
- `PageHeader.tsx` — Page title, description, status, and action bar

**Navigation:** Dashboard, PRD Ingestion | Estimates, Reviews | Projects, Calibration

**Layout:** Fixed dark sidebar (zinc-950), responsive content area. Tablet: icon-only sidebar. Mobile: hamburger sheet.

## Done When

- [ ] Design tokens configured
- [ ] Shell renders with grouped sidebar
- [ ] Navigation links to correct routes
- [ ] User menu with settings and logout
- [ ] PageHeader renders title/description/status/actions
- [ ] Responsive across desktop/tablet/mobile
- [ ] Light and dark mode supported

---

# Milestone 2: PRD Ingestion

> **Prerequisites:** Milestone 1 (Shell) complete

## Goal

Implement the PRD Ingestion feature — upload/parse PRDs, review AI extraction, confirm for estimation.

## Overview

Users provide a PRD (upload PDF/DOCX/MD, paste text, or fill a form). AI extracts structured data: title, overview, features, constraints, ambiguities, implicit requirements. Users review, edit inline, and confirm.

## Components

Copy from `product-plan/sections/prd-ingestion/components/`:
- `IntakeView.tsx` — Three input method cards, drag-and-drop, paste, form
- `ParsingView.tsx` — Step-by-step extraction progress
- `ExtractionReview.tsx` — Dense review screen (hero)
- `FeatureList.tsx` — Feature table with inline edit
- `EditableStringList.tsx` — Editable string list

## Key Data Shape

```typescript
interface EstimationRequest {
  id: string; title: string; rawContent: string
  sourceFormat: 'pdf' | 'docx' | 'markdown' | 'text' | 'form'
  status: 'draft' | 'parsing' | 'confirmed' | 'estimating' | 'complete'
  projectOverview: string
  technicalConstraints: string[]; ambiguities: string[]; implicitRequirements: string[]
  features: { id: string; name: string; description: string }[]
}
```

## Expected User Flows

1. **Upload & Parse:** Select file → see progress → review extraction
2. **Paste & Parse:** Paste text → parse → review
3. **Form Input:** Fill structured form → parse → review
4. **Review & Edit:** Edit title/overview/features/constraints/ambiguities inline
5. **Confirm:** Click "Confirm Extraction" → status becomes "confirmed"
6. **Error Recovery:** Retry or go back on parsing failure

## Design Notes

- AI-inferred sections use distinct tints: amber for ambiguities, violet for implicit requirements
- Feature list is numbered with inline edit/add/remove
- PageHeader shows status badge (Draft/Confirmed) and source format badge (PDF/DOCX/MD/TXT/Form)

## Testing

See `product-plan/sections/prd-ingestion/tests.md` for comprehensive UI behavior specs.

## Done When

- [ ] Three intake methods work (upload, paste, form)
- [ ] File upload with drag-and-drop for PDF/DOCX/MD
- [ ] Parsing progress with step-by-step status
- [ ] Error state with retry/back
- [ ] All extraction fields editable inline
- [ ] Features: add, edit, remove
- [ ] Ambiguities/implicit requirements visually distinct
- [ ] Confirm transitions status to "confirmed"
- [ ] Empty states handled
- [ ] Responsive

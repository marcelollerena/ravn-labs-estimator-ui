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

# Estimator — Product Overview

## Summary

An internal Ravn tool that accelerates project estimation by combining AI-generated first-pass estimates with senior engineer review. Upload a PRD, get a structured estimate in under 60 seconds, review and adjust with mandatory reasoning, and build Ravn's collective estimation intelligence over time.

## Planned Sections

1. **PRD Ingestion** — Accept raw PRD documents via upload, paste, or form — extract structured project data using AI and let users review and confirm before estimation begins.
2. **AI-Driven First-Pass Estimation** — Generate a complete estimate from the confirmed extraction: per-feature breakdown, project summary, team recommendation, risks, comparable projects, and clarification questions.
3. **Human Review & Adjustment** — Senior engineers review the AI estimate, accept or adjust features with mandatory reasoning, modify risks and team composition, and set overall confidence.
4. **Estimate Output & Export** — Generate internal (full detail) and client-ready (clean) estimate documents with PDF, Markdown, and web link export options.
5. **Historical Projects & Calibration** — Seed and manage past project data, enter actuals post-project, track estimation accuracy, and surface AI improvement trends and human adjustment patterns.

## Product Entities

- **EstimationRequest** — A parsed PRD serving as input to the estimation pipeline
- **RequestFeature** — A discrete feature extracted from a PRD during ingestion
- **Estimate** — The AI-generated (and later human-reviewed) estimate for a project
- **EstimateFeature** — A single feature within an estimate with complexity, hours, and confidence
- **EstimateRisk** — A risk identified for an estimate with likelihood, impact, and mitigation
- **EstimateQuestion** — An ambiguity or clarification question affecting the estimate
- **Adjustment** — A human modification to an AI estimate with mandatory reasoning
- **Project** — A historical Ravn project used for comparable retrieval
- **CalibrationEntry** — A post-project accuracy record comparing estimated vs. actual hours

## Design System

**Colors:**
- Primary: blue
- Secondary: slate
- Neutral: zinc

**Typography:**
- Heading: Inter
- Body: Inter
- Mono: JetBrains Mono

## Implementation Sequence

Build this product in milestones:

1. **Shell** — Set up design tokens and application shell (sidebar navigation, page header, user menu)
2. **PRD Ingestion** — File upload, text paste, structured form, AI extraction review
3. **AI-Driven First-Pass Estimation** — Generation progress, estimation workbench with feature breakdown
4. **Human Review & Adjustment** — Review console with accept/adjust workflow, impact tracking
5. **Estimate Output & Export** — Export dashboard with internal/client profiles, document preview

Each milestone has a dedicated instruction document in `product-plan/instructions/`.

---

# Milestone 1: Shell

## Goal

Set up the design tokens and application shell — the persistent chrome that wraps all sections.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Colors:** blue (primary), slate (secondary), zinc (neutral)
**Fonts:** Inter (headings + body), JetBrains Mono (code/numbers)

### 2. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with sidebar + content
- `MainNav.tsx` — Navigation with grouped items and icons
- `UserMenu.tsx` — User menu with avatar, settings, sign out
- `PageHeader.tsx` — Page header with title, description, status, actions

**Wire Up Navigation:**

- Dashboard → `/` — Overview metrics and recent activity
- PRD Ingestion → `/ingestion` — Upload, parse, and review PRDs
- Estimates → `/estimates` — AI-generated estimate list and detail
- Reviews → `/reviews` — Human review queue
- Projects → `/projects` — Historical project database
- Calibration → `/calibration` — Accuracy dashboard

**User Menu:**

The user menu expects:
- User name (string)
- Avatar URL (optional)
- Logout callback
- Settings callback

**Dependencies:** The shell uses `@/components/ui/sheet` and `@/components/ui/dropdown-menu` — install these from shadcn/ui or provide equivalent components.

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (colors, fonts)
- [ ] Shell renders with sidebar navigation
- [ ] Navigation links to correct routes
- [ ] User menu shows user info and dropdown
- [ ] Responsive: full sidebar on desktop, icon-only on tablet, hamburger on mobile
- [ ] Dark mode works correctly

---

# Milestone 2: PRD Ingestion

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

---

# Milestone 3: AI-Driven First-Pass Estimation

## Goal

Implement the AI-Driven First-Pass Estimation feature — generate a complete estimate from a confirmed PRD extraction with per-feature breakdown, project summary, team recommendation, risks, comparable projects, and clarification questions.

## Overview

The system generates a full estimate in under 60 seconds. Users watch step-by-step progress, then review a dense estimation workbench. They can regenerate if unsatisfied or proceed to human review.

**Key Functionality:**
- Step-by-step generation progress with elapsed time per step
- Summary header with total hours (low/likely/high), duration, complexity, confidence
- Sortable per-feature breakdown with expandable detail rows
- Project summary with AI rationale and key assumptions
- Team recommendation with roles, headcount, seniority, reasoning
- Risk assessment with category, likelihood, impact, mitigation
- Comparable projects with estimated vs actual hours and variance
- Clarification questions with impact level and resolution status

## Components Provided

Copy from `product-plan/sections/ai-driven-first-pass-estimation/components/`:

- `GenerationProgress` — Progress view during generation
- `EstimationWorkbenchView` — Main layout orchestrating all panels
- `SummaryHeader` — Key metrics bar
- `FeatureBreakdown` — Sortable, expandable feature table
- `ProjectSummary` — AI rationale and assumptions
- `TeamRecommendation` — Roles table
- `RisksPanel` — Risk cards
- `ComparableProjects` — Historical project cards
- `ClarificationQuestions` — Questions checklist

## Props Reference

See `types.ts` for full definitions. Key interfaces:

- `Estimate` — The complete estimate with all nested data
- `EstimateFeature` — Feature with complexity, hours (low/likely/high), confidence
- `EstimateRisk` — Risk with category, likelihood, impact, mitigation
- `TeamRecommendation` — Roles array with headcount and reasoning
- `GenerationStep` — Step with label, status, duration

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onRegenerate` | User clicks "Regenerate" |
| `onContinueToReview` | User clicks "Continue to Review" |
| `onExpandFeature` | User expands a feature row |
| `onCollapseFeature` | User collapses a feature row |

## Expected User Flows

### Flow 1: Generate Estimate
1. User arrives from PRD Ingestion with confirmed extraction
2. Generation starts automatically showing step progress
3. Steps complete with checkmarks and duration
4. **Outcome:** Estimation workbench renders with full data

### Flow 2: Review Estimate Details
1. User scans summary header (hours, duration, complexity, confidence)
2. User clicks a feature row to expand assumptions and dependencies
3. User reviews risks, team recommendation, comparable projects
4. **Outcome:** User has full understanding of the estimate

### Flow 3: Proceed to Review
1. User clicks "Continue to Review"
2. **Outcome:** Navigates to Human Review & Adjustment section

## Testing

See `product-plan/sections/ai-driven-first-pass-estimation/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/ai-driven-first-pass-estimation/README.md`
- `product-plan/sections/ai-driven-first-pass-estimation/tests.md`
- `product-plan/sections/ai-driven-first-pass-estimation/components/`
- `product-plan/sections/ai-driven-first-pass-estimation/types.ts`
- `product-plan/sections/ai-driven-first-pass-estimation/sample-data.json`

## Done When

- [ ] Generation progress shows steps with status indicators
- [ ] Summary header displays hours, duration, complexity, confidence
- [ ] Feature breakdown is sortable by all columns
- [ ] Feature rows expand to show assumptions and dependencies
- [ ] AI-generated content has visual distinction (blue tint/badge)
- [ ] Risks show color-coded likelihood and impact
- [ ] Comparable projects show variance metrics
- [ ] Clarification questions show resolution status
- [ ] "Regenerate" restarts the process
- [ ] "Continue to Review" navigates to human review
- [ ] Responsive on mobile

---

# Milestone 4: Human Review & Adjustment

## Goal

Implement the Human Review & Adjustment feature — senior engineers review the AI estimate, accept or adjust features with mandatory reasoning, modify risks and team composition, and set overall confidence before proceeding to export.

## Overview

Every AI-generated value can be accepted as-is or adjusted. Adjustments require mandatory reasoning, creating an audit trail for institutional learning. The interface shows real-time impact of changes and tracks review progress.

**Key Functionality:**
- Impact summary bar with real-time deltas (hours, duration, team, confidence)
- Feature-by-feature review with accept/adjust actions
- Three-state indicators: pending (gray), accepted (green), adjusted (amber)
- AI-original vs adjusted values shown side-by-side
- Mandatory reasoning for material adjustments
- Risk review with accept/adjust/add capabilities
- Team recommendation editing
- Overall confidence setting with reasoning
- Progress tracking (X of Y reviewed)
- Approve gate — all items must be reviewed before export

## Components Provided

Copy from `product-plan/sections/human-review-and-adjustment/components/`:

- `ReviewConsoleView` — Main layout with header, impact bar, and all panels
- `ReviewImpactBar` — Real-time impact summary
- `FeatureReviewTable` — Sortable feature table with accept/adjust
- `RiskReviewPanel` — Risk review with severity changes
- `TeamReviewPanel` — Team comparison (original vs adjusted)
- `OverallConfidencePanel` — Confidence display with bar and reasoning

## Props Reference

See `types.ts` for full definitions. Key interfaces:

- `ReviewEstimate` — The review session with all features, risks, team, impact
- `ReviewFeature` — Feature with AI-original + adjusted values
- `FeatureAdjustment` — Adjustment record with before/after and reasoning
- `ReviewRisk` — Risk with original/adjusted severity
- `TeamAdjustment` — Original vs adjusted team composition
- `ImpactSummary` — Cumulative impact metrics

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onAcceptFeature` | Accept a feature as-is |
| `onAdjustFeature` | Adjust a feature (triggers reasoning requirement) |
| `onAcceptRisk` | Accept a risk as-is |
| `onAdjustRisk` | Adjust a risk |
| `onAddRisk` | Add a new risk |
| `onAdjustTeam` | Modify team recommendation |
| `onSetOverallConfidence` | Set confidence with reasoning |
| `onSaveDraft` | Save review without approving |
| `onApproveAndExport` | Approve and proceed to export |

## Expected User Flows

### Flow 1: Accept Features
1. User scans impact bar showing AI-original totals
2. User clicks checkmark on a feature to accept it
3. Feature shows green "Accepted" badge
4. Impact bar progress updates
5. **Outcome:** Feature is confirmed without changes

### Flow 2: Adjust a Feature
1. User clicks pencil icon on a feature
2. User modifies hours, complexity, or confidence
3. System requires mandatory reasoning text
4. User enters reasoning and saves
5. **Outcome:** Feature shows amber "Adjusted" badge with reasoning, impact bar updates

### Flow 3: Approve and Export
1. User reviews all features, risks, team
2. All items show "Accepted" or "Adjusted" (none "Pending")
3. User clicks "Approve & Export"
4. **Outcome:** Review is approved, navigates to Export section

## Testing

See `product-plan/sections/human-review-and-adjustment/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/human-review-and-adjustment/README.md`
- `product-plan/sections/human-review-and-adjustment/tests.md`
- `product-plan/sections/human-review-and-adjustment/components/`
- `product-plan/sections/human-review-and-adjustment/types.ts`
- `product-plan/sections/human-review-and-adjustment/sample-data.json`

## Done When

- [ ] Impact bar shows real-time deltas as adjustments are made
- [ ] Features can be accepted (one-click) or adjusted (with reasoning)
- [ ] Three-state indicators work: pending/accepted/adjusted
- [ ] AI-original values displayed alongside adjusted values
- [ ] Mandatory reasoning required for material adjustments
- [ ] Risks can be accepted, adjusted, or added
- [ ] Team recommendation is editable
- [ ] Overall confidence settable with reasoning
- [ ] "Approve & Export" only enabled when all items reviewed
- [ ] Warning shown when items are still pending
- [ ] Responsive on mobile

---

# Milestone 5: Estimate Output & Export

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

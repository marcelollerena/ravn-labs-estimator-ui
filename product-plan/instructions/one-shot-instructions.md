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

### Planned Sections

1. **PRD Ingestion** — Accept raw PRD documents via upload, paste, or form — extract structured project data using AI and let users review and confirm before estimation begins.
2. **AI-Driven First-Pass Estimation** — Generate a complete estimate from the confirmed extraction: per-feature breakdown, project summary, team recommendation, risks, comparable projects, and clarification questions.
3. **Human Review & Adjustment** — Senior engineers review the AI estimate, accept or adjust features with mandatory reasoning, modify risks and team composition, and set overall confidence.
4. **Estimate Output & Export** — Generate internal (full detail) and client-ready (clean) estimate documents with PDF, Markdown, and web link export options.
5. **Historical Projects & Calibration** — Seed and manage past project data, enter actuals post-project, track estimation accuracy, and surface AI improvement trends and human adjustment patterns.

### Product Entities

- **EstimationRequest** — A parsed PRD that serves as the input to the estimation pipeline.
- **RequestFeature** — A discrete feature extracted from a PRD during ingestion.
- **Estimate** — The AI-generated (and later human-reviewed) estimate for a project.
- **EstimateFeature** — A single feature within an estimate, with complexity, hour range, confidence, assumptions, and dependencies.
- **EstimateRisk** — A risk identified for an estimate with likelihood, impact, and mitigation.
- **EstimateQuestion** — An ambiguity or clarification question surfaced during estimation.
- **Adjustment** — A human modification to an AI estimate, recording the action and mandatory reasoning.
- **Project** — A historical Ravn project used for comparable retrieval.
- **CalibrationEntry** — A post-project accuracy record comparing estimated vs. actual hours.

### Design System

**Colors:**
- Primary: blue
- Secondary: slate
- Neutral: zinc

**Typography:**
- Heading: Inter
- Body: Inter
- Mono: JetBrains Mono

### Implementation Sequence

Build this product in milestones:

1. **Shell** — Set up design tokens and application shell
2. **PRD Ingestion** — Upload, parse, and review PRDs
3. **AI-Driven First-Pass Estimation** — Generate AI estimates with feature breakdown, risks, and team recommendation

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

**Colors:**
- Primary: `blue` — buttons, links, active nav items, key accents
- Secondary: `slate` — tags, badges, secondary elements
- Neutral: `zinc` — backgrounds, text, borders, sidebar

**Typography:**
- Heading & Body: Inter (400-700 weight)
- Code/Mono: JetBrains Mono (400-500 weight)

### 2. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with sidebar and content area
- `MainNav.tsx` — Navigation component with grouped items and active state
- `PageHeader.tsx` — Page header with title, description, status badge, and actions
- `UserMenu.tsx` — User menu with avatar initials and dropdown

**Wire Up Navigation:**

Connect navigation to your routing:

| Label | Route | Icon | Group |
|-------|-------|------|-------|
| Dashboard | `/` | LayoutDashboard | Main |
| PRD Ingestion | `/ingestion` | FileUp | Main |
| Estimates | `/estimates` | FileText | Estimation |
| Reviews | `/reviews` | ClipboardCheck | Estimation |
| Projects | `/projects` | FolderOpen | Data |
| Calibration | `/calibration` | BarChart3 | Data |

**User Menu:**

The user menu expects:
- User name (displayed as initials in avatar)
- Avatar URL (optional — falls back to initials)
- Logout callback
- Settings callback

All users are Ravn employees (WorkOS AuthKit).

## Layout Details

- Fixed sidebar (232px) on the left, scrollable content on the right
- Sidebar always dark (zinc-950), content area respects light/dark theme
- Tablet (768-1023px): Sidebar collapses to icon-only (56px)
- Mobile (<768px): Sidebar hidden, top bar with hamburger, overlay nav

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (Inter + JetBrains Mono fonts, blue/slate/zinc colors)
- [ ] Shell renders with sidebar navigation
- [ ] Navigation links to correct routes
- [ ] Active nav item is highlighted
- [ ] User menu shows user info with dropdown
- [ ] Responsive: tablet shows collapsed sidebar, mobile shows hamburger menu
- [ ] Dark mode works correctly

---

# Milestone 2: PRD Ingestion

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

---

# Milestone 3: AI-Driven First-Pass Estimation

## Goal

Implement the AI-Driven First-Pass Estimation feature — generate a complete estimate from a confirmed PRD extraction in under 60 seconds, then display a dense estimation workbench for review.

## Overview

This section generates a complete AI-driven first-pass estimate from a confirmed EstimationRequest. The user watches step-by-step progress during generation, then reviews a dense workbench layout with per-feature breakdowns, project summary, team recommendation, risks, comparable projects, and clarification questions before proceeding to Human Review & Adjustment.

**Key Functionality:**
- Show step-by-step generation progress with elapsed time per step
- Display summary metrics: total hours (low/likely/high), duration, complexity, confidence
- Show sortable per-feature breakdown table with expandable detail rows
- Display project summary with rationale and key assumptions
- Show team recommendation with roles, headcount, seniority, and reasoning
- Display color-coded risks with category, likelihood, impact, and mitigation
- Show comparable historical projects with estimate vs. actual variance
- List clarification questions with impact levels and resolution status
- Allow regeneration or continuation to human review

## Components Provided

Copy the section components from `product-plan/sections/ai-driven-first-pass-estimation/components/`:

- `GenerationProgress` — Step-by-step progress view during AI estimation
- `EstimationWorkbenchView` — Main workbench layout composing all panels
- `SummaryHeader` — Compact metric bar (hours, duration, complexity, confidence, gen time)
- `FeatureBreakdown` — Sortable table with expandable feature rows
- `ProjectSummary` — Rationale and key assumptions panel
- `TeamRecommendation` — Role table with headcount, seniority, and reasoning
- `RisksPanel` — Risk display with category, likelihood, impact, and mitigation
- `ComparableProjects` — Historical project comparison cards
- `ClarificationQuestions` — Checklist of unresolved questions with impact levels

## Props Reference

The components expect these data shapes (see `types.ts` for full definitions):

**Data props:**

- `Estimate` — Complete estimate with hours, complexity, confidence, features, risks, team, comparables, questions
- `EstimateFeature` — Feature with complexity, hour range (low/likely/high), confidence, assumptions, dependencies
- `EstimateRisk` — Risk with category, likelihood, impact, and mitigation
- `TeamRecommendation` — Headcount, roles with seniority, and overall reasoning
- `ComparableProject` — Historical project with estimated vs. actual hours and similarity rationale
- `EstimateQuestion` — Question with affected scope, impact level, and resolution status
- `GenerationStep` — Step with label, status, and duration

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onGenerate` | User starts the estimation process |
| `onRegenerate` | User regenerates the estimate from scratch |
| `onContinueToReview` | User proceeds to Human Review & Adjustment |
| `onExpandFeature` | User expands a feature row to see details |
| `onCollapseFeature` | User collapses an expanded feature row |

## Expected User Flows

### Flow 1: Generate an Estimate

1. User arrives from PRD Ingestion with a confirmed extraction
2. User triggers estimation — generation progress view appears
3. Steps complete one by one with elapsed time displayed
4. Progress bar fills, step counter updates
5. **Outcome:** All steps complete, workbench view loads automatically

### Flow 2: Review the Estimate Workbench

1. User sees summary header with total hours, duration, complexity, confidence
2. User expands feature rows to inspect assumptions and dependencies
3. User sorts features by complexity or likely hours
4. User reviews team recommendation and risks
5. User checks comparable projects for validation
6. User reviews clarification questions
7. User clicks "Continue to Review"
8. **Outcome:** Navigates to Human Review & Adjustment section

### Flow 3: Regenerate Estimate

1. User is unsatisfied with the estimate
2. User clicks "Regenerate" in the page header
3. **Outcome:** Returns to generation progress, new estimate is generated

## Empty States

- **No estimate yet:** Generation can be triggered via `onGenerate`
- **No risks identified:** Risks panel shows "0" count, renders empty
- **No comparable projects:** Comparables panel shows "0" count, renders empty
- **All questions resolved:** Questions show "0 unresolved", all items have green checkmarks

## Testing

See `product-plan/sections/ai-driven-first-pass-estimation/tests.md` for UI behavior test specs covering:
- Generation progress and failure states
- Workbench review with all panels
- Feature sorting and expansion
- Color-coded severity indicators
- Empty state rendering

## Files to Reference

- `product-plan/sections/ai-driven-first-pass-estimation/README.md` — Feature overview and design intent
- `product-plan/sections/ai-driven-first-pass-estimation/tests.md` — UI behavior test specs
- `product-plan/sections/ai-driven-first-pass-estimation/components/` — React components
- `product-plan/sections/ai-driven-first-pass-estimation/types.ts` — TypeScript interfaces
- `product-plan/sections/ai-driven-first-pass-estimation/sample-data.json` — Test data

## Done When

- [ ] Generation progress view shows step-by-step progress with duration
- [ ] Workbench displays all panels: summary, features, project summary, team, risks, comparables, questions
- [ ] Feature table is sortable by name, complexity, likely hours, confidence
- [ ] Feature rows expand to show description, assumptions, and dependencies
- [ ] Risks are color-coded by severity (critical risks highlighted)
- [ ] Comparable projects show estimate vs. actual variance
- [ ] Questions show resolved/unresolved status with impact badges
- [ ] "Regenerate" and "Continue to Review" actions work
- [ ] Empty states render correctly
- [ ] Responsive on mobile
- [ ] Dark mode works correctly

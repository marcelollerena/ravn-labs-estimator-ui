# Design OS User Manual for Estimator

This manual explains how a new developer should use Design OS in this repository to turn a PRD and feature plan into accurate, exportable UI designs.

The goal is simple: a developer should be able to read this file, follow the workflow, and produce section designs that stay aligned with the PRD, the roadmap, and the existing project constraints.

## What Design OS Is

Design OS is not the final Estimator application.

It is the planning and UI design workspace used before implementation. In this repo, Design OS is responsible for:

- defining the product overview, roadmap, and data shape
- defining the design system and shell
- shaping each feature section
- generating exportable React screen designs
- exporting a handoff package for implementation in another codebase

This distinction matters:

- `src/` contains the Design OS preview app and the generated design components
- `product/` contains the product definition and feature specs
- `product-plan/` contains the exported handoff package for implementation

## Who Should Read This

Read this manual if you are:

- a new developer joining the Estimator design workflow
- updating or adding feature designs based on a PRD
- preparing the exported handoff package for Claude or another coding agent

## Source of Truth

When you work in this repo, use this order of authority:

1. The PRD and any approved feature plan
2. The current product definition in `product/`
3. The Design OS rules in `AGENTS.md`
4. The existing section specs and generated designs

Do not start by editing screens directly if the roadmap, data shape, or section spec is outdated. Fix the product definition first, then regenerate or update designs.

## Non-Negotiable Design OS Rules

These rules come from the project instructions and should be treated as hard constraints:

- Design OS is a planning tool, not the production app codebase.
- Section screen designs must not include navigation chrome. The shell owns navigation.
- Exportable section components must be props-based. Never import data directly inside them.
- All section designs must support mobile responsiveness with Tailwind responsive classes.
- All section designs must support light and dark mode.
- Product screen designs should use the product design tokens when available.
- Tailwind CSS v4 is required.
- Do not create or rely on `tailwind.config.js`.
- Use Tailwind built-in utility classes and built-in color scales.

## Current Estimator Product Context

The current product definition describes Estimator as an internal Ravn tool for turning PRDs into structured estimates with AI plus human review.

The current roadmap is:

1. PRD Ingestion
2. AI-Driven First-Pass Estimation
3. Human Review & Adjustment
4. Estimate Output & Export
5. Historical Projects & Calibration

At the moment, this repo already includes generated section work for:

- `prd-ingestion`
- `ai-driven-first-pass-estimation`

If your new work belongs to one of those sections, update that section rather than inventing a new one. If the PRD introduces a truly new product area, update the roadmap first.

## File Map You Need to Understand

These are the main files you will touch or review while using Design OS:

| Area | Purpose |
| --- | --- |
| `product/product-overview.md` | Product summary, problems, solutions, features |
| `product/product-roadmap.md` | Ordered list of product sections |
| `product/data-shape/data-shape.md` | Core entities and relationships |
| `product/design-system/` | Product color and typography tokens |
| `product/shell/spec.md` | App shell definition |
| `product/sections/[section-id]/spec.md` | Section scope, user flows, UI requirements |
| `product/sections/[section-id]/data.json` | Sample data for previews |
| `product/sections/[section-id]/types.ts` | UI data contracts for the section |
| `src/shell/` | Shell preview components |
| `src/sections/[section-id]/` | Generated screen designs and preview wrappers |
| `product-plan/` | Exported implementation handoff |

## End-to-End Workflow

Use this workflow whenever a new developer needs to generate or update feature designs from a PRD.

### 1. Start the Workspace

Install dependencies and run the local Design OS app:

```bash
npm install
npm run dev
claude
```

Open the local app in the browser and run Design OS slash commands from Claude in this repo.

### 2. Gather the Right Inputs Before Prompting

Before running any command, collect:

- the latest PRD
- any approved feature plan, milestone plan, or implementation notes
- constraints that affect UI or flows
- examples of wording that should be preserved
- any decisions about what is explicitly out of scope

Treat the PRD as source material. Design OS does not magically infer the product from the repo alone. You need to provide the PRD content to Claude during the slash-command workflow.

### 3. Define or Refresh the Product Foundation

Use `/product-vision` when:

- starting the product from scratch
- the PRD changes the overall product scope
- the roadmap and data shape no longer match the real plan

`/product-vision` should produce:

- `product/product-overview.md`
- `product/product-roadmap.md`
- `product/data-shape/data-shape.md`

If the product foundation already exists and only needs focused changes, use:

- `/product-roadmap` to add, remove, rename, or reorder sections
- `/data-shape` to update entities and relationships

### 4. Define the Product Design System

Use `/design-tokens` to set:

- primary, secondary, and neutral Tailwind color families
- heading, body, and mono fonts

Do this before generating screens. Otherwise Claude tends to produce generic UI decisions that later need rework.

### 5. Define the App Shell

Use `/design-shell` to define:

- the navigation pattern
- the page framing and layout
- user menu behavior
- responsive shell behavior

Remember that shell navigation belongs here, not inside individual section screens.

### 6. Work Section by Section

For each roadmap section, follow this exact sequence:

1. `/shape-section`
2. `/sample-data` if the generated data or types need refinement
3. `/design-screen`
4. `/screenshot-design` when you want visual documentation

Do not jump straight to `/design-screen` without shaping the section first.

### 7. Export the Handoff Package

When the designed sections are in good shape, run:

```text
/export-product
```

This generates:

- `product-plan/`
- `product-plan.zip`

Use the export whenever you want to hand work to Claude for implementation in another codebase.

## How to Work From a PRD and Feature Plan

This is the recommended operational pattern for this repo.

### Step A: Translate the PRD into Product Structure

When you start with a PRD, first identify:

- the product goal
- the top-level feature areas
- the nouns the UI works with
- the critical user flows
- the constraints that must appear in the interface

Then use `/product-vision` to convert that into:

- product overview
- roadmap sections
- data shape

Do not try to encode every screen detail at this step. Keep it at product architecture level.

### Step B: Translate the Feature Plan into Roadmap Sections

If you already have an implementation or milestone plan, map it to the roadmap.

A good roadmap section is:

- meaningful on its own
- visible to the user
- coherent as a UI area
- large enough to justify its own spec and screens

For Estimator, examples of correct section boundaries are already present in `product/product-roadmap.md`.

### Step C: Translate Each PRD Slice into a Section Spec

Once a section is selected, use `/shape-section` to define:

- what the section does
- the main user flows
- the UI requirements
- the scope boundaries
- whether it lives inside the shell

Your prompt should preserve PRD wording when the wording is product-significant. For example, if the PRD distinguishes explicit features, ambiguities, and implicit requirements, keep those as separate UI concepts.

### Step D: Generate Realistic UI Data

Use the generated `data.json` and `types.ts` as design contracts.

Good sample data should:

- include enough records to prove the layout
- show edge cases
- reflect the actual PRD terminology
- match the actions and states described in the section spec

If the generated data is too shallow, run `/sample-data` before touching screens.

### Step E: Generate Screens That Match the Spec

Use `/design-screen` only after the spec and sample data are strong.

Your screen-generation prompt should emphasize:

- exact user flows from the spec
- density level and layout expectations
- responsive behavior
- dark mode
- no shell navigation inside the section
- props-based exportable components

### Step F: Review Before Moving On

Before you call a section done, verify:

- the screen reflects the spec, not just the sample data
- the UI supports the important states and actions
- the layout feels intentionally designed for the product
- the language stays aligned with the PRD
- nothing important was hidden behind a generic card grid or dashboard pattern

## Recommended Command Sequence for New Work

Use this decision guide.

| Situation | Command |
| --- | --- |
| Brand-new product setup | `/product-vision` |
| Existing product, roadmap changed | `/product-roadmap` |
| Existing product, data model changed | `/data-shape` |
| New or revised section spec | `/shape-section` |
| Sample data or UI types need correction | `/sample-data` |
| Generate or revise a section screen | `/design-screen` |
| Capture a visual reference | `/screenshot-design` |
| Produce implementation handoff | `/export-product` |

## Prompting Principles for Claude

Use these rules when you prompt Claude inside Design OS:

- Paste the relevant PRD excerpt into the conversation.
- State what section you are working on.
- Say what must be preserved from the PRD.
- Say what is intentionally out of scope.
- Ask Claude to ask clarifying questions before generating if the PRD is ambiguous.
- Tell Claude to optimize for product-specific UI, not generic dashboard UI.
- Remind Claude about Design OS constraints when needed.

Good prompts describe:

- the problem
- the user flow
- the important objects and labels
- the UI density and interaction style
- the constraints

Weak prompts usually just say:

- "make this screen"
- "design a dashboard"
- "use the PRD to build the section"

Those tend to produce shallow or generic results.

## Prompt Templates for Design OS Commands

Use these as starting points. Replace the placeholders with your real content.

### `/product-vision`

```text
/product-vision

I am using Design OS for the Estimator product.

Here is the PRD summary:
[paste the key PRD content]

Here is the approved feature plan / milestone plan:
[paste the plan]

Please define the product overview, roadmap, and data shape.

Important constraints:
- Preserve the PRD terminology where it affects the UI or product meaning.
- Prefer roadmap sections that map to real user-facing areas.
- Keep backend implementation details out of the product definition.
- Ask clarifying questions before finalizing anything ambiguous.
```

### `/product-roadmap`

```text
/product-roadmap

Update the Estimator roadmap based on this new feature plan:
[paste updated plan]

Please:
- keep existing sections that still make sense
- add new sections only if they represent distinct user-facing areas
- reorder sections by design and delivery priority
- explain any merge or split decisions before writing the final roadmap
```

### `/data-shape`

```text
/data-shape

Update the Estimator data shape using these PRD changes:
[paste the relevant PRD excerpt]

Please:
- define the core UI-facing entities
- keep names consistent with the PRD
- focus on nouns and relationships, not database schema
- call out anything ambiguous before finalizing
```

### `/shape-section`

```text
/shape-section

I want to shape the [SECTION NAME] section.

Use this PRD excerpt:
[paste the section-specific PRD]

Use this implementation or feature plan context:
[paste the relevant plan]

Please define:
- overview
- user flows
- UI requirements
- scope boundaries

Important:
- keep this section inside the shell unless I say otherwise
- do not invent backend behavior that is not implied by the PRD
- preserve important labels and distinctions from the PRD
- ask clarifying questions if the workflow is underspecified
```

### `/sample-data`

```text
/sample-data

Update the sample data and UI types for [SECTION NAME].

Please make the data:
- realistic for Estimator
- rich enough to exercise the layout
- aligned with the section spec
- inclusive of edge cases and state variation

Avoid placeholder-only content such as generic names or repetitive descriptions.
```

### `/design-screen`

```text
/design-screen

Design the [VIEW NAME] for the [SECTION NAME] section.

Use the existing section spec, sample data, and types as the source of truth.

Design requirements:
- mobile responsive
- full dark mode support
- use product design tokens
- no navigation chrome inside the section
- exportable components must be props-based
- use Tailwind CSS v4 utilities only

Interaction and layout expectations:
[describe density, hierarchy, emphasis, tables, panels, forms, etc.]

Please avoid generic dashboard patterns if the spec implies a more specialized internal-tool layout.
```

### `/screenshot-design`

```text
/screenshot-design

Capture a screenshot for the [VIEW NAME] in [SECTION NAME] after confirming the latest design is the correct one to document.
```

### `/export-product`

```text
/export-product

Generate a fresh handoff package for the current Estimator designs so the implementation agent can build from the latest product definition, shell, sections, sample data, and tests.
```

## How to Prompt Claude After Export

Once `product-plan/` exists, use the exported prompts as your baseline:

- `product-plan/prompts/one-shot-prompt.md`
- `product-plan/prompts/section-prompt.md`

These are already designed to make Claude:

- read the right files
- ask clarifying questions
- plan before coding

You should still add project-specific notes above or below the exported prompt.

## Recommended Add-On Prompt for Claude Implementation

Append this kind of note when handing the export to Claude:

```text
Implementation notes for this project:

- Treat the exported UI as the source of truth. Wire it up; do not redesign it.
- Preserve the naming and distinctions from the PRD and the Design OS specs.
- Ask clarifying questions before changing flows, labels, or scope.
- Keep implementation consistent with the existing stack and conventions.
- If something in the handoff appears underspecified, pause and ask rather than inventing product behavior.
```

## Section-Specific Guidance for Estimator

When generating designs for Estimator, keep these product-specific expectations in mind.

### PRD Ingestion

The UI should emphasize:

- multiple input methods
- parsing progress with clear status
- editable structured extraction
- strong distinction between explicit and AI-inferred information
- confirmation as the gate to estimation

### AI-Driven First-Pass Estimation

The UI should emphasize:

- dense internal-tool scanning
- feature-by-feature estimate review
- summary metrics with confidence and status
- risks, comparable projects, and clarification questions
- clear progression into human review

If Claude starts drifting toward a polished marketing dashboard, correct it. This section should feel like an estimation workbench.

## Quality Checklist Before Export

Before running `/export-product`, confirm:

- `product/product-overview.md` matches the current PRD direction
- `product/product-roadmap.md` reflects the current section plan
- `product/data-shape/data-shape.md` matches the nouns used in the screens
- each designed section has a strong `spec.md`
- sample data and types support the intended UI
- generated screens follow the section specs
- screenshots exist for important views if visual documentation is useful

## Common Failure Modes

Watch for these problems:

- updating screens without updating the underlying spec
- creating a new section when the feature belongs in an existing section
- letting Claude invent backend concepts during product-definition steps
- accepting generic sample data that does not stress the UI
- forgetting dark mode or mobile states
- adding navigation into section screens
- rewriting exported components instead of wiring them up in implementation

## Definition of Done

A section is ready when:

- the PRD slice has been translated into a clear section spec
- sample data and types reflect the section behavior
- the screen design covers the important flows and states
- the design follows Design OS constraints
- the section can be exported as part of `product-plan/`

The full Design OS workflow is complete when:

- product definition is current
- relevant sections are designed
- the handoff package has been regenerated
- Claude can read the exported files and implement without re-discovering the product from scratch

## Recommended Reading Order for New Developers

If you are new to this repo, read these files in this order:

1. `AGENTS.md`
2. `docs/getting-started.md`
3. `docs/usage.md`
4. `docs/design-os-user-manual.md`
5. `product/product-overview.md`
6. `product/product-roadmap.md`
7. `product/data-shape/data-shape.md`
8. the specific section spec you plan to update

That order will give you the workflow rules first and the product context second.

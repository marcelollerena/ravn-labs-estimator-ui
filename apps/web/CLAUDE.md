@docs/design-os/product-plan/README.md
@docs/design-os/product-plan/instructions/incremental/01-shell.md
@docs/design-os/product-plan/instructions/incremental/02-prd-ingestion.md
@docs/design-os/product-plan/sections/prd-ingestion/README.md
@docs/design-os/product-plan/sections/prd-ingestion/tests.md
@docs/design-os/product-plan/design-system/tokens.css

# Web UI Instructions

- For UI work, use the Design OS `product-plan` as the UI handoff and inspiration layer.
- The PRD remains the source of truth for product behavior and scope.
- Source priority for web work:
  1. PRD and approved feature specs
  2. Design OS product-plan
  3. Existing app code
- Reuse the exported layout structure, hierarchy, states, and component ideas where they fit the current codebase.
- Do not copy generated code blindly if it conflicts with TanStack Start, project conventions, or test-first workflow.
- Prefer incremental implementation using the exported incremental instructions.
- For PRD Ingestion UI, start from the shell handoff and the PRD Ingestion section docs.

# Web Project Structure & Architecture

This frontend follows a feature-based architecture.

## General Rules

- Organize product code by feature, not by technical type alone.
- Every new product flow or business module should live inside `features/`.
- Keep each feature self-contained as much as possible.
- Prefer local feature ownership before promoting code to shared folders.
- Only move code to `common/` when it is truly reusable across multiple features.
- Use `core/` for application-wide integrations and infrastructure concerns, not for feature UI code.

## Feature Structure

Each feature should live under:

`features/<feature-name>/`

A feature may contain folders such as:

- `pages/` — route-level screens and page compositions for that feature
- `components/` — feature-specific UI components
- `hooks/` — feature-specific React hooks
- `lib/` — feature-specific services, adapters, and orchestration helpers
- `utils/` — small pure helpers for the feature
- `schema/` — validation schemas, DTO shaping, and parsing logic
- `store/` — feature state management only when local component state is not enough

Example:

`features/prd-ingestion/pages/intake`
`features/prd-ingestion/components`
`features/prd-ingestion/hooks`
`features/prd-ingestion/lib`
`features/prd-ingestion/utils`
`features/prd-ingestion/schema`
`features/prd-ingestion/store`

## Folder Responsibilities

- `pages/` should compose screens using feature components and hooks
- `components/` should focus on UI rendering and interaction
- `hooks/` should contain reusable feature behavior and UI state logic
- `lib/` should contain feature services, data transformation flows, and coordination logic
- `utils/` should remain small and mostly pure
- `schema/` should define input/output contracts and validation rules
- `store/` should only be used when state must be shared across multiple components in the feature

## Core Layer

Use `core/` for cross-application technical concerns such as:

- API clients
- endpoint connectors
- request utilities
- shared data access helpers
- authentication wiring
- infrastructure-level abstractions

Do not place feature-specific UI or business flows in `core/`.

## Common Layer

Use `common/` only for reusable cross-feature building blocks such as:

- shared UI components
- shared hooks
- shared utilities
- shared libraries

If something is only used by one feature, keep it inside that feature.

## Data Consistency

Use a mapper pattern between backend responses and frontend domain/view models.

Rules:

- Never spread raw backend responses directly across UI components
- Map API responses into stable frontend-friendly shapes
- Keep mapping logic close to the feature unless it is truly cross-feature
- Use mappers to normalize naming, nullability, defaults, and derived fields

## Architectural Intent

This project is feature-based.
Each feature should own its pages, components, state, validation, and internal logic.
Shared code should stay minimal and intentional.

## Implementation Rules

- Prefer feature-local code first
- Avoid premature abstraction
- Do not create shared components too early
- Keep page files thin
- Keep business shaping logic out of UI components
- Prefer mappers over ad-hoc response handling in pages
- Prefer schemas and typed transformations at the boundaries

## Code Style Conventions

- Use `kebab-case` for newly created file and folder names in `apps/web`.
- Route-level screens and page-level components should use function declarations.
- Lower-level UI components should use arrow functions.
- Do not use `export default`; use named exports only.
- Group imports in this order, with a blank line between groups:
  1. Native/framework imports (`react`, `@tanstack/*`, and external React libraries)
  2. `core` imports
  3. `utils`, `lib`, and `hooks`
  4. Components

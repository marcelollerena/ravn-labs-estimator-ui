# The Estimator — AI Agent Instructions

# priority: gates > rules > workflow > agents > skills

AI-Enhanced Project Scoping tool for Ravn. Monorepo with pnpm workspaces + Turborepo.
Architecture: Feature-based NestJS API + TanStack Start frontend + shared functional core.

## Structure

```
packages/shared     — Functional core: domain types, Zod schemas, pure utilities (zod, date-fns, neverthrow, remeda)
apps/api            — Imperative shell: NestJS REST API (PostgreSQL, Prisma, Claude AI, WorkOS auth)
apps/web            — Imperative shell: TanStack Start frontend (React 19, ShadCN, Tailwind)
tooling/eslint      — Shared ESLint flat config (10+ plugins, zero warnings)
tooling/typescript  — Shared tsconfig bases (node, react)
tooling/testing     — Shared Vitest configs (unit + integration)
```

## Commands

| Command                       | What it does                                      |
| ----------------------------- | ------------------------------------------------- |
| `pnpm turbo lint`             | ESLint across all workspaces (`--max-warnings=0`) |
| `pnpm turbo typecheck`        | TypeScript type-check all workspaces              |
| `pnpm turbo test:unit`        | Unit tests with coverage (Vitest)                 |
| `pnpm turbo test:integration` | Integration tests (Vitest)                        |
| `pnpm turbo test:e2e`         | E2E tests (Playwright for web)                    |
| `pnpm turbo build`            | Build all workspaces                              |
| `pnpm turbo dev`              | Dev servers for all apps                          |

<gates>

GATE-1 TDD-first:
trigger: new or changed `src/**/*.ts` files excluding `*.test.ts`, `*.d.ts`, and generated files (`routeTree.gen.ts`)
does-not-apply: config files, documentation, tooling changes, test-only changes
action: write a failing test BEFORE implementing — confirm it fails for the right reason
exception: purely mechanical changes (renames, import path updates) that do not alter behavior
verification: `pnpm turbo lint && pnpm turbo typecheck && pnpm turbo test:unit`
banned: production code without a corresponding failing test

GATE-2 Zero suppression:
trigger: editing any file
banned: `eslint-disable` | `@ts-ignore` | `@ts-expect-error` | `any` type | `console.log` in production
action: refactor to comply — use `unknown` + type guards or generics instead of `any`, use NestJS Logger in api, remove console from web

GATE-3 Zero warnings:
trigger: lint or typecheck run
action: `--max-warnings=0` enforced — warnings ARE errors
verification: exit code 0 from `pnpm turbo lint`

GATE-4 Format before commit:
trigger: about to commit code
action: run `pnpm exec prettier --write` on changed files, then stage
verification: `pnpm exec prettier --check` passes on staged files
note: pre-commit hook runs lint-staged (ESLint + Prettier) — they do not conflict when configured correctly

</gates>

<rules>

ARCHITECTURE:
pattern: Feature-based (vertical slices) with Functional Core / Imperative Shell
core:
  location: packages/shared/src/
  constraints:
  - pure functions only — no I/O, no side effects, no throwing
  - Zod: `.safeParse()` only — never `.parse()` (it throws)
  - return `Result<T, E>` via neverthrow for all fallible operations
  - NO imports from apps/*, NestJS, Prisma, or React
  enforced-by: ESLint no-restricted-imports
shell:
  location: apps/{api|web}/src/
  constraints:
  - orchestrates I/O: HTTP, database, logging, fetch
  - Zod: `.parse()` allowed — wrap in try/catch or pipes at boundaries
  - calls core functions for domain logic — never contains business rules
  - generates side effects (IDs, timestamps) and passes them to core
error-handling:
  core: always `Result<T, E>` — never throw
  shell-nestjs: exception filters catch; services unwrap Results
  shell-web: `.parse()` allowed for API responses; wrap fetches in try/catch

FRAMEWORK PATTERNS:
nestjs (api):
  - feature modules in `src/<feature>/<feature>.module.ts`
  - controller → service → repository (one file each per feature)
  - validation via ZodValidationPipe (no class-validator DTOs)
  - Zod schemas in `src/<feature>/<feature>.schema.ts`
  - auth via WorkOS AuthKit guard
  - global exception filter, response envelope interceptor
  - Prisma via shared PrismaService (injected into repositories)
tanstack-start (web):
  - routes in `src/routes/`, components in `src/components/`
  - data loading via route loaders (`createFileRoute`)
  - ShadCN + Tailwind for UI components
  - no global state management — use route loader data

DEPENDENCIES:
- prefer existing deps over new packages
- new packages require clear justification
- pin exact versions in apps, use ranges in packages/shared

ENVIRONMENT:
- env vars validated via Zod schema at app startup
- secrets never hardcoded — use `.env` files (gitignored)
- `.env.example` maintained with all required keys (no values)

TESTING:
trigger: production code changed (per GATE-1 scope)
action: corresponding test files MUST also be modified
exception: purely mechanical changes that do not alter behavior
structure: colocated — `src/feature/feature.test.ts` (unit), `src/feature/feature.integration.test.ts` (integration), `tests/e2e/` (E2E)
thresholds: Lines 85% | Branches 80% | Functions 85% | Statements 85%

COMMITS:
format: `type(scope): description`
types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
scopes: shared, api, web, eslint, typescript, testing, ci, deps, release
enforcement: commitlint + husky pre-commit (lint-staged runs ESLint + Prettier)

</rules>

## Development Workflow — TDD First

1. **Write a failing test** — describe the expected behavior
2. **Run the test** — confirm it fails for the right reason
3. **Implement** — minimum code to make the test pass
4. **Refactor** — clean up while keeping tests green
5. **Format** — `pnpm exec prettier --write` on changed files
6. **Verify** — `pnpm turbo lint && pnpm turbo typecheck && pnpm turbo test:unit`

## Tech Stack

- **TypeScript 6** strict mode, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- **ESLint 10** flat config — typescript-eslint, unicorn, sonarjs, security, promise, regexp
- **Vitest 4** unit + integration, **Playwright** E2E
- **NestJS** (api) — feature-based modules, DI, guards, pipes, interceptors
- **Prisma** ORM with PostgreSQL + pgvector
- **TanStack Start** (web) — full-stack React 19 + Vite
- **ShadCN + Tailwind CSS** — UI components
- **Claude API** — AI estimation (Sonnet for speed, Opus for complexity)
- **WorkOS AuthKit** — authentication (Ravn employees)
- **Zod 4** validation, **neverthrow** error handling, **remeda** utilities
- **pnpm** workspaces + **Turborepo** orchestration

## Agents

AGENT: implementer
trigger: clear, well-specified implementation task
action: write minimum code to satisfy spec → run verification suite
verification: typecheck + lint + tests MANDATORY after every implementation
may: research APIs and run verification as sub-steps of implementation
banned: restructuring working code, bonus features, standalone research reports or code reviews

AGENT: researcher
trigger: documentation lookup, API research, or technical investigation
action: gather information → cite sources → flag conflicting sources with recency preference
boundary: read-only — NEVER write production code or fix bugs (explain root cause only)
max-sources: 5 per question

AGENT: reviewer
trigger: code review request or pre-merge check
action: report as `[SEVERITY] file_path:line_number — description`
priority: correctness > security > testing > performance > api-contracts
boundary: read-only — NEVER edit code
skip: linter-handled issues, minor naming, missing comments

AGENT: verifier
trigger: post-implementation verification or pre-commit check
action: run all checks in order (typecheck → lint → tests) regardless of earlier failures
boundary: NEVER fix code, NEVER propose changes — only report results
report: PASS/FAIL/TIMEOUT per check
verdict: ALL PASS (all green) | PARTIAL (mixed) | ISSUES FOUND (all failed)

# The Estimator

AI-Enhanced Project Scoping tool for Ravn. Upload a PRD, get a structured AI estimate, review with reasoning, and track accuracy over time.

## Tech Stack

- **API**: NestJS, Prisma, PostgreSQL + pgvector, Claude API, WorkOS AuthKit
- **Web**: TanStack Start, React 19, ShadCN, Tailwind CSS
- **Shared**: Zod, neverthrow, remeda, date-fns
- **Tooling**: TypeScript 6, ESLint 10, Vitest 4, Playwright, pnpm + Turborepo

## Getting Started

```bash
pnpm install
pnpm turbo dev
```

## Commands

| Command | What it does |
|---------|-------------|
| `pnpm turbo dev` | Start all dev servers |
| `pnpm turbo build` | Build all workspaces |
| `pnpm turbo lint` | ESLint (zero warnings) |
| `pnpm turbo typecheck` | TypeScript check |
| `pnpm turbo test:unit` | Unit tests with coverage |
| `pnpm turbo test:integration` | Integration tests |
| `pnpm turbo test:e2e` | E2E tests (Playwright) |

# Technical Design Document: The Estimator

**Project:** The Estimator
**Author:** [Name]
**Date:** 10/04/2026
**Status:** Draft
**Reviewers:** [Names]

---

## 1. Overview

The Estimator is an internal Ravn tool that accelerates project estimation by combining AI-generated first-pass estimates with senior engineer review. A user uploads a PRD, Claude parses it and generates a structured estimate (feature breakdown, hour ranges, risks, team recommendations, comparable past projects), a senior engineer reviews and adjusts with mandatory reasoning, and the system learns from the delta over time — building Ravn's collective estimation intelligence.

The tool addresses three core problems: inconsistent estimates across partners, no institutional learning from past estimates, and the high cost of senior engineer time spent on estimation (4-8 hours per project).

---

## 2. Goals & Non-Goals

### Goals

- Build a functional MVP that demonstrates the full estimation loop: PRD ingestion, AI estimation, human review with reasoning, export, and calibration.
- Deliver AI-generated first-pass estimates in under 60 seconds.
- Capture human adjustment reasoning as structured training data for future AI improvement.
- Provide comparable project retrieval via vector similarity search over Ravn's historical project data.
- Generate both internal (full detail) and client-ready (clean) estimate documents with PDF export.
- Track estimation accuracy over time through a calibration dashboard.

### Non-Goals

- **Project management** — no task tracking, sprints, or execution management.
- **Real-time time tracking** — actuals are entered manually post-project.
- **Resource scheduling** — we recommend team composition but don't assign people.
- **Contract/SOW generation** — we produce estimates, not legal documents.
- **Model fine-tuning** — we collect feedback data that enables future training, but training itself is out of scope.
- **Google Docs/Notion integration** — stretch goal, not MVP.
- **Multi-agent model comparison** — stretch goal, not MVP.

---

## 3. Background / Context

### Prior Work

- Estimation at Ravn is currently manual: senior engineers read PRDs, break down features, and produce hour ranges in spreadsheets. This takes 4-8 hours per project and results in inconsistent estimates across partners.
- Historical project data (estimates vs. actuals) is scattered across spreadsheets, Jira, and individual memory. Nothing is systematized.
- This project uses an existing TypeScript monorepo template with pnpm workspaces + Turborepo, ESLint 10 (strict, zero warnings), TypeScript 6, Vitest, and Playwright already configured.

### Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend framework | NestJS | Team consensus; enforced conventions, built-in DI, guards, pipes, interceptors |
| Frontend framework | TanStack Start | Already in template; React 19, SSR, file-based routing, Vite |
| ORM | Prisma | Schema-first, generated types, migration tooling, pgvector support via extension |
| Validation | Zod schemas (no DTO classes) | Already in template; single source of truth for shape + validation + type inference |
| Data access | Repository pattern | Clean separation of queries from business logic; testable services |
| Architecture | Feature-based (vertical slices) | Cohesion by business capability; bounded changes; deletability |
| UI framework | ShadCN + Tailwind CSS | Component library matching Ravn Design System; Linear/Notion-like UX |
| Auth | WorkOS AuthKit | All users are Ravn employees; SSO-ready |
| AI | Claude API (Sonnet for speed, Opus for complexity) | PRD parsing, estimation, risk identification, clarification questions |
| Vector search | pgvector (PostgreSQL extension) | Comparable project retrieval; no separate vector DB needed |

---

## 4. Proposed Design

### 4.1 Architecture Overview

Monorepo with three workspaces following a Functional Core / Imperative Shell pattern:

```
packages/shared          — Functional core: domain types, Zod schemas, pure utilities
apps/api                 — Imperative shell: NestJS REST API
apps/web                 — Imperative shell: TanStack Start frontend
tooling/{eslint,typescript,testing}  — Shared configs
```

#### High-Level Data Flow

```
                    ┌──────────────────────────────────────────────┐
                    │                  apps/web                    │
                    │          TanStack Start + ShadCN             │
                    │                                              │
                    │  Upload PRD ──▶ Review Extraction ──▶        │
                    │  View Estimate ──▶ Human Review ──▶ Export   │
                    └──────────────┬───────────────────────────────┘
                                   │ HTTP (REST)
                    ┌──────────────▼───────────────────────────────┐
                    │                  apps/api                    │
                    │                  NestJS                      │
                    │                                              │
                    │  ┌───────────┐ ┌───────────┐ ┌────────────┐ │
                    │  │ Ingestion │ │ Estimates  │ │  Projects  │ │
                    │  │  Module   │ │  Module    │ │  Module    │ │
                    │  └─────┬─────┘ └─────┬─────┘ └─────┬──────┘ │
                    │        │             │             │         │
                    │  ┌─────▼─────┐ ┌─────▼─────┐ ┌────▼──────┐ │
                    │  │  Review   │ │  Export    │ │Calibration│ │
                    │  │  Module   │ │  Module    │ │  Module   │ │
                    │  └───────────┘ └───────────┘ └───────────┘ │
                    │                                              │
                    │         Common: Auth, Prisma, AI Client      │
                    └──────────────┬───────────────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                     ▼
        ┌──────────┐      ┌──────────────┐      ┌─────────────┐
        │PostgreSQL │      │   Claude API  │      │   WorkOS    │
        │+ pgvector │      │ (Sonnet/Opus) │      │  AuthKit    │
        └──────────┘      └──────────────┘      └─────────────┘
```

### 4.2 API Structure (NestJS — Feature-Based)

```
apps/api/src/
├── main.ts                              # Bootstrap, CORS, global pipes/filters
├── app.module.ts                        # Root module — imports all feature modules
│
├── common/                              # Cross-cutting concerns
│   ├── prisma/
│   │   ├── prisma.module.ts             # Global Prisma module
│   │   └── prisma.service.ts            # PrismaClient lifecycle
│   ├── ai/
│   │   ├── ai.module.ts                 # Claude API client module
│   │   └── ai.service.ts               # Claude API wrapper (Sonnet/Opus routing)
│   ├── auth/
│   │   ├── auth.module.ts               # WorkOS AuthKit integration
│   │   └── auth.guard.ts               # JWT validation guard
│   ├── filters/
│   │   └── all-exceptions.filter.ts     # Global error → { error: { code, message } }
│   ├── interceptors/
│   │   └── response-envelope.interceptor.ts  # Wrap responses in { data: ... }
│   ├── pipes/
│   │   └── zod-validation.pipe.ts       # Zod schema validation pipe
│   └── logger/
│       └── logger.service.ts            # Pino logger integration
│
├── ingestion/                           # Feature: PRD upload & parsing
│   ├── ingestion.module.ts
│   ├── ingestion.controller.ts          # POST /ingestion/parse
│   ├── ingestion.service.ts             # Document parsing orchestration
│   ├── ingestion.repository.ts          # Persist parsed estimation requests
│   ├── ingestion.schema.ts              # Zod: upload input, EstimationRequest output
│   └── parsers/
│       ├── pdf.parser.ts                # PDF extraction (pdf-parse or Anthropic native)
│       ├── docx.parser.ts               # DOCX extraction (mammoth)
│       └── markdown.parser.ts           # Markdown parsing (native)
│
├── estimates/                           # Feature: AI estimation + storage
│   ├── estimates.module.ts
│   ├── estimates.controller.ts          # POST /estimates, GET /estimates/:id
│   ├── estimates.service.ts             # AI estimation orchestration
│   ├── estimates.repository.ts          # Estimate CRUD + feature breakdown
│   └── estimates.schema.ts              # Zod: estimate input/output, feature schemas
│
├── review/                              # Feature: Human review & adjustments
│   ├── review.module.ts
│   ├── review.controller.ts             # POST /estimates/:id/review
│   ├── review.service.ts               # Adjustment logic, reason validation
│   ├── review.repository.ts            # Persist adjustments with reasoning
│   └── review.schema.ts                # Zod: adjustment input (action + reason required)
│
├── export/                              # Feature: Estimate output generation
│   ├── export.module.ts
│   ├── export.controller.ts             # GET /estimates/:id/export?format=pdf|md
│   ├── export.service.ts               # Internal vs client view generation
│   └── templates/
│       ├── internal.template.ts         # Full detail + AI vs human diff
│       └── client.template.ts           # Clean client-facing output
│
├── projects/                            # Feature: Historical projects & comparables
│   ├── projects.module.ts
│   ├── projects.controller.ts           # CRUD /projects
│   ├── projects.service.ts              # Project management + embedding generation
│   ├── projects.repository.ts           # pgvector similarity queries
│   └── projects.schema.ts              # Zod: project input/output
│
└── calibration/                         # Feature: Accuracy tracking & dashboard
    ├── calibration.module.ts
    ├── calibration.controller.ts        # POST /calibration, GET /calibration/dashboard
    ├── calibration.service.ts           # Accuracy calculation, trend analysis
    ├── calibration.repository.ts        # Calibration data queries
    └── calibration.schema.ts            # Zod: actuals input, dashboard output
```

### 4.3 Frontend Structure (TanStack Start)

```
apps/web/src/
├── routes/
│   ├── __root.tsx                       # Root layout, auth provider, sidebar
│   ├── index.tsx                        # Dashboard / home
│   ├── estimates/
│   │   ├── index.tsx                    # Estimates list
│   │   ├── new.tsx                      # PRD upload + parsing flow
│   │   └── $estimateId/
│   │       ├── index.tsx                # Estimate detail (AI result)
│   │       ├── review.tsx               # Human review interface
│   │       └── export.tsx               # Export preview + download
│   ├── projects/
│   │   ├── index.tsx                    # Historical projects list
│   │   └── $projectId.tsx              # Project detail + actuals entry
│   └── calibration/
│       └── index.tsx                    # Calibration dashboard
│
├── components/
│   ├── ui/                              # ShadCN components (button, card, dialog, etc.)
│   ├── estimates/
│   │   ├── estimation-request-form.tsx  # Structured form input for PRD
│   │   ├── feature-breakdown.tsx        # Feature list with complexity/hours
│   │   ├── risk-assessment.tsx          # Risk table with likelihood/impact
│   │   └── team-recommendation.tsx      # Team composition display
│   ├── review/
│   │   ├── adjustment-panel.tsx         # Accept/adjust/split/merge controls
│   │   ├── reason-input.tsx             # Mandatory reasoning textarea
│   │   └── confidence-selector.tsx      # High/medium/low confidence
│   ├── export/
│   │   ├── internal-view.tsx            # Full detail view
│   │   └── client-view.tsx              # Client-ready view
│   └── calibration/
│       ├── accuracy-chart.tsx           # AI accuracy trend over time
│       └── adjustment-patterns.tsx      # Common correction patterns
│
├── lib/
│   ├── api.ts                           # Generic API client (request<T>)
│   └── config.ts                        # Web config (API URL, auth)
```

### 4.4 Data Models (Prisma Schema)

```prisma
// apps/api/prisma/schema.prisma

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [vector]
}

// ─── Historical Projects ───

model Project {
  id             String    @id @default(uuid())
  name           String
  type           String                          // e.g. "web-app", "mobile", "api"
  techStack      String[]
  teamSize       Int
  estimatedHours Int
  actualHours    Int?
  features       String[]                        // feature descriptions
  challenges     String[]
  lessonsLearned String[]
  embedding      Unsupported("vector(1536)")?    // pgvector embedding
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  comparisons    EstimateComparable[]
}

// ─── Estimation Request (parsed PRD) ───

model EstimationRequest {
  id                String    @id @default(uuid())
  title             String
  rawContent        String                        // original PRD text
  sourceFormat      String                        // "pdf", "docx", "markdown", "form"
  projectOverview   String
  technicalConstraints String[]
  ambiguities       String[]                      // unanswered questions
  implicitRequirements String[]                   // AI-inferred requirements
  status            String    @default("draft")   // draft, confirmed, estimating, complete
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  features          RequestFeature[]
  estimate          Estimate?
}

model RequestFeature {
  id                  String            @id @default(uuid())
  name                String
  description         String
  estimationRequestId String
  estimationRequest   EstimationRequest @relation(fields: [estimationRequestId], references: [id])
}

// ─── Estimate (AI + Human) ───

model Estimate {
  id                  String            @id @default(uuid())
  estimationRequestId String            @unique
  estimationRequest   EstimationRequest @relation(fields: [estimationRequestId], references: [id])

  // AI-generated summary
  totalHoursLow       Int
  totalHoursLikely    Int
  totalHoursHigh      Int
  overallComplexity   String                      // simple, moderate, complex, very_complex
  timelineWeeks       Int?
  effortBreakdown     Json                        // { frontend: %, backend: %, infra: %, testing: % }

  // Team recommendation
  headcount           Int
  roleMix             Json                        // [{ role, seniority, count, reasoning }]

  // Review metadata
  reviewStatus        String    @default("pending") // pending, in_review, approved
  reviewerConfidence  String?                       // high, medium, low
  reviewerNotes       String?
  reviewedAt          DateTime?

  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  features            EstimateFeature[]
  risks               EstimateRisk[]
  comparables         EstimateComparable[]
  questions           EstimateQuestion[]
  adjustments         Adjustment[]
}

model EstimateFeature {
  id             String   @id @default(uuid())
  estimateId     String
  estimate       Estimate @relation(fields: [estimateId], references: [id])

  name           String
  description    String
  complexity     String                           // simple, moderate, complex, very_complex
  hoursLow       Int
  hoursLikely    Int
  hoursHigh      Int
  confidence     String                           // high, medium, low
  assumptions    String[]
  dependencies   String[]

  adjustments    Adjustment[]
}

model EstimateRisk {
  id          String   @id @default(uuid())
  estimateId  String
  estimate    Estimate @relation(fields: [estimateId], references: [id])

  category    String                              // scope, technical, dependency, team, timeline
  description String
  likelihood  String                              // low, medium, high
  impact      String                              // low, medium, high
  mitigation  String
  addedBy     String   @default("ai")             // ai, human
}

model EstimateComparable {
  id             String   @id @default(uuid())
  estimateId     String
  estimate       Estimate @relation(fields: [estimateId], references: [id])
  projectId      String
  project        Project  @relation(fields: [projectId], references: [id])

  similarityScore Float
  keyLearnings    String
}

model EstimateQuestion {
  id          String   @id @default(uuid())
  estimateId  String
  estimate    Estimate @relation(fields: [estimateId], references: [id])

  question    String
  impact      String                              // how this affects the estimate
  resolved    Boolean  @default(false)
  answer      String?
}

// ─── Human Review ───

model Adjustment {
  id               String          @id @default(uuid())
  estimateId       String
  estimate         Estimate        @relation(fields: [estimateId], references: [id])
  featureId        String?
  feature          EstimateFeature? @relation(fields: [featureId], references: [id])

  action           String                         // accept, adjust, split, merge, add, remove
  reason           String                         // REQUIRED — this is the training data
  previousValue    Json?                          // what the AI had
  newValue         Json?                          // what the human set
  adjustedBy       String                         // user identifier
  createdAt        DateTime        @default(now())
}

// ─── Calibration ───

model CalibrationEntry {
  id               String   @id @default(uuid())
  estimateId       String
  projectName      String
  estimatedHours   Int
  actualHours      Int
  variancePercent  Float                          // (actual - estimated) / estimated * 100
  featureActuals   Json?                          // per-feature actuals if available
  notes            String?
  createdAt        DateTime @default(now())
}
```

### 4.5 API Contracts (Key Endpoints)

#### Ingestion

```
POST /ingestion/parse
  Content-Type: multipart/form-data | application/json
  Body: { file?: File, text?: string, structured?: { title, description, features[], constraints } }
  Response: { data: EstimationRequest }

POST /ingestion/:requestId/confirm
  Body: { features: RequestFeature[] }     // user-adjusted extraction
  Response: { data: EstimationRequest }
```

#### Estimates

```
POST /estimates
  Body: { estimationRequestId: string }
  Response: { data: Estimate }             // full AI estimate with features, risks, team, questions

GET /estimates/:id
  Response: { data: Estimate }             // includes features, risks, comparables, questions

GET /estimates
  Query: ?status=pending|in_review|approved&page=1&limit=20
  Response: { data: Estimate[], meta: { total, page, limit } }
```

#### Review

```
POST /estimates/:id/review
  Body: {
    adjustments: [{ featureId?, action, reason, previousValue?, newValue? }],
    riskAdjustments?: [{ riskId, likelihood?, impact?, mitigation? }],
    newRisks?: [{ category, description, likelihood, impact, mitigation }],
    teamAdjustments?: { headcount?, roleMix?, reasoning },
    confidence: "high" | "medium" | "low",
    notes?: string
  }
  Response: { data: Estimate }             // updated estimate with adjustments
```

#### Export

```
GET /estimates/:id/export
  Query: ?format=pdf|md&view=internal|client
  Response: application/pdf | text/markdown
```

#### Projects

```
GET /projects
  Response: { data: Project[] }

POST /projects
  Body: { name, type, techStack[], teamSize, estimatedHours, actualHours?, features[], ... }
  Response: { data: Project }

GET /projects/:id/comparables
  Query: ?limit=5
  Response: { data: ComparableProject[] }  // vector similarity results
```

#### Calibration

```
POST /calibration
  Body: { estimateId, actualHours, featureActuals?, notes? }
  Response: { data: CalibrationEntry }

GET /calibration/dashboard
  Response: {
    data: {
      aiAccuracyTrend: [{ period, avgVariance, sampleSize }],
      adjustmentPatterns: [{ pattern, frequency, avgCorrection }],
      accuracyByEstimator: [{ estimator, avgVariance, estimateCount }]
    }
  }
```

### 4.6 AI Integration Design

```
┌──────────────────────────────────────────────────────────┐
│                     ai.service.ts                        │
│                                                          │
│  parsePRD(content, format)                               │
│    → Claude Sonnet                                       │
│    → Extracts: overview, features[], constraints,        │
│       ambiguities, implicit requirements                 │
│                                                          │
│  generateEstimate(estimationRequest, comparables[])      │
│    → Claude Opus (complex reasoning)                     │
│    → Generates: per-feature breakdown, project summary,  │
│       team recommendation, risks, questions              │
│    → Prompt includes comparable project data as context   │
│                                                          │
│  generateEmbedding(text)                                 │
│    → Embedding model                                     │
│    → Returns: number[] for pgvector storage/search       │
└──────────────────────────────────────────────────────────┘
```

Model routing:
- **Sonnet**: PRD parsing, embedding generation — speed-sensitive, structured extraction.
- **Opus**: Full estimation generation — requires deep reasoning about complexity, risks, and team composition.

### 4.7 Key Business Logic

#### Estimation Request Confirmation Flow

1. User uploads PRD (PDF/DOCX/MD) or fills structured form.
2. Claude Sonnet parses and extracts structured `EstimationRequest`.
3. User reviews extracted features, constraints, and ambiguities.
4. User confirms (adjusts if needed) → status moves to `confirmed`.
5. System triggers full estimation with Claude Opus.

#### Adjustment Reason Enforcement

Every human adjustment **must include a reason**. This is enforced at the Zod schema level:

```ts
export const adjustmentInputSchema = z.object({
  featureId: z.string().uuid().optional(),
  action: z.enum(['accept', 'adjust', 'split', 'merge', 'add', 'remove']),
  reason: z.string().min(10).max(1000),  // REQUIRED — minimum 10 chars
  previousValue: z.unknown().optional(),
  newValue: z.unknown().optional(),
});
```

#### Comparable Project Retrieval

1. Generate embedding from estimation request content.
2. Query pgvector for top-N similar projects by cosine distance.
3. Return projects with similarity score, estimated vs. actual hours, and key learnings.
4. Pass comparables as context to Claude for estimation.

---

## 5. Dependencies

### Runtime Dependencies

| Package | Purpose | Workspace |
|---------|---------|-----------|
| `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` | API framework | api |
| `prisma`, `@prisma/client` | ORM + generated client | api |
| `@anthropic-ai/sdk` | Claude API (estimation, parsing) | api |
| `@workos-inc/node` | WorkOS AuthKit (SSO/auth) | api |
| `pino`, `pino-pretty` | Structured logging | api |
| `pdf-parse` | PDF document parsing | api |
| `mammoth` | DOCX document parsing | api |
| `@react-pdf/renderer` | PDF export generation | api |
| `@tanstack/react-router`, `@tanstack/react-start` | Frontend framework + SSR | web |
| `react`, `react-dom` | UI library | web |
| `tailwindcss` | Utility-first CSS | web |
| `shadcn/ui` components | UI component library | web |
| `zod` | Schema validation (shared across all) | shared |
| `neverthrow` | Result type for shared pure functions | shared |
| `date-fns` | Date formatting | shared |

### Infrastructure

| Service | Purpose |
|---------|---------|
| PostgreSQL + pgvector | Primary database + vector search |
| WorkOS | Authentication (SSO for Ravn employees) |
| Claude API (Anthropic) | AI estimation, PRD parsing |
| Vercel | Frontend hosting |
| Railway or Render | API hosting |
| Neon or Supabase | Managed PostgreSQL |

### Development Dependencies

Already configured in template: TypeScript 6, ESLint 10, Vitest 4, Playwright, Prettier, Husky, Commitlint, Turborepo.

---

## 6. Open Questions / Unknowns

| # | Question | Impact | Status |
|---|----------|--------|--------|
| 1 | Which embedding model to use for pgvector? Claude embeddings, OpenAI `text-embedding-3-small`, or Voyage? | Affects vector dimensions (1536 vs 1024) and cost | Open |
| 2 | Should we use Anthropic's native PDF support instead of `pdf-parse`? | Simplifies parsing pipeline, but may be slower/costlier | Open |
| 3 | How should the 15-20 seed projects be structured and imported? | Affects initial calibration quality | Open |
| 4 | What's the Ravn Design System token set (colors, spacing, typography)? | ShadCN theme configuration | Open |
| 5 | Do we need real-time updates (WebSockets) during AI estimation, or is polling sufficient? | Architecture complexity — NestJS has built-in WebSocket gateway | Open |
| 6 | How should the `roleMix` JSON structure be standardized across estimates? | Affects review UI and calibration analysis | Open |
| 7 | Authentication flow: WorkOS redirect-based or embedded widget? | Affects frontend auth implementation | Open |
| 8 | Rate limits and cost budgets for Claude API calls per estimation? | Affects AI service design (queueing, retries) | Open |

---

## 7. Alternatives Considered

### Backend Framework: Hono vs NestJS

**Hono** was the default in the template. Lightweight (~14KB), multi-runtime, minimal boilerplate.

**NestJS was chosen** because:
- Team consensus on preferring enforced conventions over flexibility.
- Built-in dependency injection eliminates manual wiring in the composition root.
- Guards, pipes, interceptors, and exception filters provide a standardized middleware pipeline.
- Larger ecosystem for enterprise patterns (throttling, caching, task scheduling).

**Tradeoff**: More boilerplate (modules, decorators, DI registration). Requires `experimentalDecorators` and `emitDecoratorMetadata`, which forces `verbatimModuleSyntax: false` in the API workspace.

### Validation: class-validator + DTO Classes vs Zod Schemas

**class-validator** is NestJS's default recommendation — validation via decorators on DTO classes.

**Zod was chosen** because:
- Already in the template and shared package.
- Single declaration produces both runtime validation and TypeScript types (`z.infer`).
- No class/decorator boilerplate — schemas are plain objects.
- Works identically in shared (functional core) and api (imperative shell).

**Tradeoff**: Requires a custom `ZodValidationPipe` instead of NestJS's built-in `ValidationPipe`.

### Data Access: Direct PrismaService vs Repository Pattern

**Direct injection** of `PrismaService` into services is simpler and fewer files.

**Repository pattern was chosen** because:
- Services stay focused on business logic; repositories encapsulate query details.
- Complex queries (pgvector `$queryRaw`, multi-table transactions) stay isolated.
- Testability: services mock repository interfaces, not Prisma internals.
- As the codebase grows, query reuse across services is straightforward.

**Tradeoff**: One extra file per feature.

### Frontend: TanStack Start vs Next.js

**Next.js** is the more established React meta-framework.

**TanStack Start was kept** because:
- Already configured in the template with working routing and SSR.
- Lighter-weight than Next.js — no vendor lock-in to Vercel's deployment model.
- File-based routing with type-safe loaders.
- React 19 support with streaming.

**Tradeoff**: Smaller community and ecosystem than Next.js. Fewer deployment guides and third-party integrations.

---

## 8. Risks & Tradeoffs

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Claude API latency exceeds 60s for complex PRDs | Medium | High — fails green-light demo criteria | Stream responses, break estimation into stages, cache intermediate results |
| pgvector similarity search quality with small seed dataset (15-20 projects) | High | Medium — comparables may not be useful | Curate seed data carefully; show similarity scores so users can judge relevance |
| NestJS + TypeScript 6 compatibility issues (`experimentalDecorators`) | Low | Medium — blocks development | API workspace overrides tsconfig; isolated from shared/web |
| Zod + NestJS integration friction (no built-in support) | Low | Low — well-documented pattern | Custom `ZodValidationPipe` is ~10 lines; nestjs-zod package available as fallback |
| Scope creep from PRD's stretch goals (diff view, practice mode, leaderboard) | Medium | Medium — delays MVP | Strict adherence to MVP scope; stretch goals are explicitly post-demo |
| TanStack Start maturity for production SSR | Medium | Medium — potential edge cases | Fallback to client-side rendering for complex pages if SSR issues arise |
| 2-dev team velocity for full MVP scope | Medium | High — may not hit demo day | Prioritize the demo flow: upload → estimate → review → export. Calibration dashboard can be simplified |

---

## 9. Milestones / Phases

### Phase 1 — Foundation (Week 1)

- [ ] Replace Hono with NestJS in `apps/api` (bootstrap, modules, global pipes/filters/interceptors)
- [ ] Set up Prisma with PostgreSQL (schema, migrations, seed script skeleton)
- [ ] Set up Tailwind CSS + ShadCN in `apps/web`
- [ ] WorkOS AuthKit integration (auth guard, login flow)
- [ ] CI pipeline: typecheck → lint → test → build

### Phase 2 — Ingestion + AI Core (Week 2)

- [ ] Ingestion module: PDF/DOCX/Markdown parsing
- [ ] AI service: Claude integration (PRD parsing with Sonnet)
- [ ] Estimation request flow: upload → parse → user review → confirm
- [ ] Frontend: upload page, parsed PRD review UI

### Phase 3 — Estimation + Projects (Week 3)

- [ ] Estimates module: AI first-pass estimation (Claude Opus)
- [ ] Projects module: seed database, CRUD, pgvector similarity search
- [ ] Comparable project retrieval integrated into estimation pipeline
- [ ] Frontend: estimate detail view (features, risks, team, comparables, questions)

### Phase 4 — Review + Export (Week 4)

- [ ] Review module: adjustment flow with mandatory reasoning
- [ ] Export module: internal + client views, PDF generation
- [ ] Frontend: review interface (adjust/split/merge), export preview + download
- [ ] Calibration module: actuals entry, accuracy calculation

### Phase 5 — Polish + Demo (Week 5)

- [ ] Calibration dashboard (accuracy trends, adjustment patterns)
- [ ] End-to-end testing with real PRD
- [ ] Performance optimization (estimation under 60s)
- [ ] Demo preparation: real Ravn PRD with known actuals

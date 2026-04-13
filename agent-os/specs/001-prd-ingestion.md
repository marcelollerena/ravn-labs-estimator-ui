# Feature Spec: PRD Ingestion & Parsing

**Feature:** 001 — PRD Ingestion & Parsing
**Status:** Draft
**Created:** 2026-04-13
**PRD Reference:** docs/estimator_prd.md — "Must-Have Feature #1"

---

## Overview

This is the entry point to The Estimator. It accepts a raw PRD document, extracts structured data using Claude AI, and produces a confirmed **Estimation Request** that feeds into the AI estimation pipeline. Nothing else in the system works without this feature.

---

## User Flow

```
User uploads PRD (PDF/DOCX/MD) or pastes text or fills form
  │
  ▼
System extracts plain text from document
  │
  ▼
Claude Sonnet parses text → structured extraction
  (overview, features, constraints, ambiguities, implicit requirements)
  │
  ▼
User reviews AI-extracted structure (status: draft)
  User can: edit overview, add/remove/rename features, modify constraints
  │
  ▼
User confirms → status moves to "confirmed" → triggers estimation
```

---

## Functional Requirements

### Input Acceptance (3 methods)

| Method          | Format                                                  | Notes                        |
| --------------- | ------------------------------------------------------- | ---------------------------- |
| File upload     | PDF, DOCX, Markdown                                     | Drag-and-drop or file picker |
| Paste text      | Plain text                                              | Textarea input               |
| Structured form | Title, description, feature list, constraints, timeline | Manual entry                 |

### Document Parsing (text extraction)

| Source    | Parser                              | Package             |
| --------- | ----------------------------------- | ------------------- |
| PDF       | `pdf-parse` or Anthropic native PDF | TBD (open question) |
| DOCX      | `mammoth`                           | `mammoth`           |
| Markdown  | Passthrough (already text)          | None                |
| Text/Form | Passthrough                         | None                |

### AI Extraction (Claude Sonnet)

Claude receives the extracted text and returns a structured object:

| Field                  | Type                      | Description                                    |
| ---------------------- | ------------------------- | ---------------------------------------------- |
| `title`                | `string`                  | Project name extracted from PRD                |
| `projectOverview`      | `string`                  | What the project is about                      |
| `features`             | `{ name, description }[]` | Discrete feature list                          |
| `technicalConstraints` | `string[]`                | Tech stack, platform, performance requirements |
| `ambiguities`          | `string[]`                | Unanswered questions in the PRD                |
| `implicitRequirements` | `string[]`                | Things not stated but likely needed            |

### User Review & Confirmation

- Display all AI-extracted fields for review
- Inline editing of all fields
- Add, remove, rename, re-describe features
- Modify constraints, ambiguities, implicit requirements
- Confirm button transitions status: `draft` → `confirmed`

### API Endpoints

```
POST /ingestion/parse
  Content-Type: multipart/form-data | application/json
  Body: { file?: File, text?: string, structured?: { title, description, features[], constraints } }
  Response: { data: EstimationRequest }  (status: draft)

POST /ingestion/:requestId/confirm
  Content-Type: application/json
  Body: { title?, projectOverview?, features: RequestFeature[], technicalConstraints?, ambiguities?, implicitRequirements? }
  Response: { data: EstimationRequest }  (status: confirmed)
```

### Data Model

```
EstimationRequest
  id                    String (UUID)
  title                 String
  rawContent            String (original PRD text)
  sourceFormat          "pdf" | "docx" | "markdown" | "text" | "form"
  projectOverview       String
  technicalConstraints  String[]
  ambiguities           String[]
  implicitRequirements  String[]
  status                "draft" | "confirmed" | "estimating" | "complete"
  createdAt             DateTime
  updatedAt             DateTime
  features              RequestFeature[]

RequestFeature
  id                    String (UUID)
  name                  String
  description           String
  estimationRequestId   String (FK → EstimationRequest)
```

---

## Edge Cases

1. **Corrupt/unreadable files** — scanned-image PDFs (no extractable text), password-protected PDFs, malformed DOCX
2. **Empty or near-empty content** — 1-line file, whitespace-only paste
3. **Extremely large documents** — 100+ page PRD, hits Claude context limits or >60s latency
4. **Non-PRD content** — user uploads a resume, contract, or unrelated document
5. **Mixed-format content** — embedded images, tables, diagrams with critical info lost in text extraction
6. **Duplicate uploads** — same PRD uploaded multiple times
7. **Claude extraction quality** — misidentified features, merged distinct features, hallucinated features
8. **Partial form input** — structured form with empty feature list
9. **Very short/vague PRDs** — "Build an app like Uber" — Claude infers almost everything
10. **Multi-language PRDs** — PRD written in Spanish or Portuguese

---

## Open Questions

1. **PDF parsing approach:** `pdf-parse` (local, fast, text-only) vs Anthropic native PDF support (sends PDF to Claude, handles layout better, costlier)
2. **File size limits:** Max upload size? Claude context window constraints?
3. **Streaming vs polling:** Real-time progress during Claude parsing, or poll for completion?
4. **Structured form granularity:** Fallback for when parsing fails, or first-class input with full validation?
5. **Edit scope on confirmation:** Can user edit project overview and constraints, or only the feature list?
6. **Raw content storage:** Store extracted text or original binary for file uploads?
7. **Feature granularity guidance:** What happens when Claude extracts 3 coarse vs 30 fine-grained features?
8. **Authentication:** Is ingestion behind WorkOS auth from day one?
9. **Error recovery:** If Claude fails mid-parse, can user retry without re-uploading?

---

## Architecture

Follows Functional Core / Imperative Shell per CLAUDE.md:

```
packages/shared/src/ingestion/    ← Pure domain: schemas, types, utilities (no I/O)
apps/api/src/ingestion/           ← Imperative shell: parsers, AI calls, persistence, HTTP
apps/web/src/routes/estimates/    ← Imperative shell: upload UI, review UI
```

---

## Tasks

### Task 1 — Domain Types & Zod Schemas

- **Description:** Define shared Zod schemas and TypeScript types for the ingestion domain in `packages/shared/src/ingestion/`. Enums for `SourceFormat`, `EstimationRequestStatus`, `Complexity`. Schemas for `RequestFeature`, `EstimationRequest`, `ParsePRDInput`, `ConfirmRequestInput`. All types inferred via `z.infer`.
- **Input:** PRD spec requirements
- **Output:** Exported schemas + types from `packages/shared/src/ingestion/index.ts`, re-exported from `packages/shared/src/index.ts`
- **Dependencies:** None (uses existing `zod` in shared)

### Task 2 — Pure Parsing Utilities

- **Description:** Pure functions in `packages/shared/src/ingestion/` for text normalization, content length validation, MIME-to-format detection, and Claude prompt construction. No I/O. Returns `Result` types for fallible operations.
- **Input:** Raw text strings, MIME type strings
- **Output:** `normalizeText()`, `validateContentLength()`, `detectSourceFormat()`, `buildParsePrompt()`
- **Dependencies:** Task 1 (uses `SourceFormat` enum)

### Task 3 — PDF Text Extraction Parser

- **Description:** Imperative shell parser in `apps/api/src/ingestion/parsers/pdf.parser.ts` that wraps `pdf-parse` to extract plain text from PDF buffers. Returns `Result<string, ParseError>`.
- **Input:** `Buffer` (PDF file content)
- **Output:** `PdfParser` with `extract(buffer): Promise<Result<string, ParseError>>`
- **Dependencies:** Task 1 (uses error types), `pdf-parse` package (to install)

### Task 4 — DOCX Text Extraction Parser

- **Description:** Imperative shell parser in `apps/api/src/ingestion/parsers/docx.parser.ts` that wraps `mammoth` to extract plain text from DOCX buffers. Returns `Result<string, ParseError>`.
- **Input:** `Buffer` (DOCX file content)
- **Output:** `DocxParser` with `extract(buffer): Promise<Result<string, ParseError>>`
- **Dependencies:** Task 1 (uses error types), `mammoth` package (to install)

### Task 5 — Markdown Parser + Parser Registry

- **Description:** Trivial markdown/text passthrough parser + a registry factory in `apps/api/src/ingestion/parsers/` that maps `SourceFormat` to the correct parser. Defines the `DocumentParser` interface.
- **Input:** `Buffer` + `SourceFormat`
- **Output:** `MarkdownParser`, `DocumentParser` interface, `getParser(format): DocumentParser`
- **Dependencies:** Tasks 1, 3, 4 (registry wires all parsers together)

### Task 6 — Claude AI Service for PRD Parsing

- **Description:** Service in `apps/api/src/common/ai/` that calls Claude Sonnet with PRD text and returns structured extraction (title, overview, features, constraints, ambiguities, implicit requirements). Validates response against Zod schema.
- **Input:** Normalized PRD text + source format
- **Output:** `parsePRD(content, format): Promise<Result<PRDExtraction, AIError>>`
- **Dependencies:** Task 1 (schemas for validation), Task 2 (`buildParsePrompt`), `@anthropic-ai/sdk` (to install)

### Task 7 — Prisma Schema + Migration

- **Description:** Set up Prisma in `apps/api`, define `EstimationRequest` and `RequestFeature` models in `schema.prisma`, create `PrismaService`, run first migration.
- **Input:** Domain model shape from Task 1
- **Output:** Prisma schema, generated client, `PrismaService` for DI, migration file
- **Dependencies:** Task 1 (model shape), `prisma` + `@prisma/client` (to install), running PostgreSQL

### Task 8 — Ingestion Repository

- **Description:** Data access layer in `apps/api/src/ingestion/ingestion.repository.ts` with CRUD operations for `EstimationRequest` via Prisma. Repository pattern per TDD.
- **Input:** Domain types from shared, Prisma client
- **Output:** `create()`, `findById()`, `updateStatus()`, `updateConfirmed()` — all returning domain entities
- **Dependencies:** Tasks 1, 7 (Prisma schema + service)

### Task 9 — Ingestion Service (Orchestration)

- **Description:** Service in `apps/api/src/ingestion/ingestion.service.ts` orchestrating: receive input → extract text via parser → normalize → call Claude → validate → persist. Also handles confirmation flow.
- **Input:** File buffer or text + source format (parse), request ID + adjustments (confirm)
- **Output:** `parse(): Promise<Result<EstimationRequest, IngestionError>>`, `confirm(): Promise<Result<EstimationRequest, IngestionError>>`
- **Dependencies:** Tasks 2, 5, 6, 8 (utilities, parser registry, AI service, repository)

### Task 10 — Ingestion Controller (HTTP)

- **Description:** NestJS controller in `apps/api/src/ingestion/ingestion.controller.ts` exposing `POST /ingestion/parse` (multipart + JSON) and `POST /ingestion/:requestId/confirm`. Delegates to service.
- **Input:** HTTP requests (file upload or JSON body)
- **Output:** `{ data: EstimationRequest }` responses, 400/404 errors
- **Dependencies:** Task 9 (ingestion service), Zod validation pipe

### Task 11 — NestJS Module Wiring

- **Description:** `IngestionModule` in `apps/api/src/ingestion/ingestion.module.ts` registering controller, service, repository, parsers. Import into root `AppModule`.
- **Input:** All ingestion components from Tasks 3-10
- **Output:** Working NestJS module bootstrapping without errors
- **Dependencies:** Tasks 3-10 (all API-side ingestion components)

### Task 12 — Web: PRD Upload Page

- **Description:** TanStack Start route at `apps/web/src/routes/estimates/new.tsx` with file dropzone (PDF/DOCX/MD), text paste textarea, and structured form. Submits to `POST /ingestion/parse`, shows loading state, navigates to review on success.
- **Input:** User interaction (file, text, or form)
- **Output:** Rendered upload page, API call on submit, navigation to review page with `requestId`
- **Dependencies:** Task 1 (shared types for form validation), ShadCN components

### Task 13 — Web: Review & Confirm Page

- **Description:** TanStack Start route showing AI-extracted structure. User can edit overview, add/remove/rename features, modify constraints and ambiguities. Confirm sends `POST /ingestion/:requestId/confirm`.
- **Input:** `EstimationRequest` loaded via route loader
- **Output:** Rendered review page with inline editing, confirm navigates to estimation view
- **Dependencies:** Tasks 1, 12 (shared types, upload page provides navigation)

---

## Task Dependency Graph

```
Task 1 (shared schemas) ──────┬──► Task 2 (pure utils) ──► Task 6 (AI service) ──┐
                               │                                                    │
                               ├──► Task 3 (PDF parser) ──┐                        │
                               ├──► Task 4 (DOCX parser) ─┼──► Task 5 (registry) ─┤
                               │                           │                        │
                               ├──► Task 7 (Prisma) ──► Task 8 (repository) ───────┤
                               │                                                    │
                               │                    Task 9 (service) ◄──────────────┘
                               │                         │
                               │                    Task 10 (controller)
                               │                         │
                               │                    Task 11 (module wiring)
                               │                         │
                               ├──► Task 12 (upload UI) ──► Task 13 (review UI)
```

**Parallelizable:** Tasks 2, 3, 4, 7 can all start after Task 1. Tasks 12-13 can start once schemas exist.

---

## Verification

1. `pnpm turbo typecheck` — zero errors
2. `pnpm turbo lint` — zero warnings
3. `pnpm turbo test:unit` — all pass, coverage thresholds met
4. `pnpm turbo test:integration` — repository tests pass against real DB
5. **Manual E2E:** upload a sample PDF PRD → see extracted features → edit a feature → confirm → record persisted with status `confirmed`

---
title: "Estimator"
status: active
created: 2026-04-08
updated: 2026-04-08
author: "@0x7067"
cycles: ["2026-04"]
---
# Labs PRD: Estimator (AI-Enhanced Project Scoping)

## The Deal (Roster & Budget)

*Before reading the specs, understand the commitment.*

* **Roster Size:** 2 Developers
* **Green Light Goal:** A working demo where a Partner uploads a real PRD, the AI generates a structured first-pass estimate in under 60 seconds, a senior engineer reviews and adjusts with explicit reasoning, and calibration data proves that human corrections are making the AI measurably better over time.

---

## The Vision

### The Problem

Estimation is the hardest problem in software development. At Ravn, we do it constantly — every new engagement, every SOW, every sprint plan. Here's what's broken:

**Estimates are inconsistent.** Partner A quotes 800 hours. Partner B quotes 1,200 for the same project. Neither is wrong — they're using different mental models, assumptions, and risk tolerances. There's no shared "Ravn way" of estimating. Knowledge stays locked in individual heads.

**We don't learn from our estimates.** We estimate 600 hours. It takes 900. What went wrong? That insight dies. The next similar project, we repeat the same mistakes. Years of project data — estimates vs. actuals — sit scattered across spreadsheets, Jira, and people's memories. Nothing is systematized.

**Estimation is slow and expensive.** A proper estimate for a medium project demands reading the PRD, breaking down features, sizing each one, identifying risks, thinking about team composition, and comparing to past work. That takes 4-8 hours of senior engineer time — for a sales opportunity that might not close.

### The Solution (The "One-Liner")

**Estimator** lets you feed in a PRD. The AI generates a structured first-pass estimate (complexity, hours, team, risks, comparables). A senior engineer validates and adjusts with reasoning. The system learns from the delta — building Ravn's collective estimation intelligence over time.

---

## Scope of Work (The MVP)

*The core loop is: ingest PRD, generate estimate, human review, export, calibrate. Every adjustment requires a reason — that's the training data.*

### Must-Have Features (The "Green Light" Requirements)

**1. PRD Ingestion & Parsing**

* Accept PRDs via upload (PDF, DOCX, Markdown), paste text, or structured form input (project name, description, feature list, constraints, timeline).
* Claude extracts: project overview, discrete feature list, technical constraints, unanswered questions in the PRD, and implicit requirements not stated but likely needed.
* Output: a structured **Estimation Request** for AI and humans to work from. User reviews and adjusts the extracted structure before estimation begins.

**2. AI-Driven First-Pass Estimation**

* For each feature: complexity rating (simple / moderate / complex / very complex), hour range (low / likely / high), confidence level, key assumptions, and dependencies.
* Project summary: total hour range, overall complexity, timeline at a given team size, effort breakdown (frontend / backend / infra / testing).
* Team recommendation: headcount, role mix, seniority level, specialist needs — with reasoning.
* Risk assessment: 5+ risks (scope, technical, dependency, team, timeline). Each with likelihood, impact, and mitigation.
* Comparable projects from Ravn's database via vector search (similarity score, estimated vs. actual hours, key learnings).
* Clarification questions: 3+ ambiguities that significantly affect the estimate, surfaced as blockers.

**3. Human Review & Adjustment**

* For each feature: accept, adjust (hours/complexity), split, merge, add, or remove.
* **Every adjustment requires a reason.** "Increased from 16 to 32 hours — this integration has no documented API." These reasons train the system.
* Reviewer adjusts AI risks (likelihood, impact, mitigation) and adds missed risks.
* Reviewer modifies team recommendation with reasoning.
* Reviewer sets confidence level (high / medium / low) and adds context notes.

**4. Estimate Output & Export**

* **Internal:** Feature breakdown, hour ranges, risks, team recommendation, comparable projects, AI vs. human changes (what and why), confidence level.
* **Client:** Feature list with descriptions, hour/cost range, timeline, assumptions and exclusions, risks in client-friendly framing.
* Export as web link, PDF, or Markdown. Copy to clipboard for sharing.

**5. Historical Projects & Calibration**

* Seed database with 15-20 past Ravn projects (name, type, tech stack, team size, estimated vs. actual hours, features, challenges, lessons learned). Generate embeddings for vector similarity.
* Post-project: enter actual hours (total and per-feature if available). System calculates estimate accuracy and variance.
* Calibration dashboard: AI accuracy trend, human adjustment patterns ("AI underestimates integrations by 40%"), accuracy by estimator, Ravn-wide trends.
* Adjustment reasons and outcomes inform AI reasoning for future estimates.

---

## Bonus Features (Stretch Goals)

* **Google Docs / Notion integration** for PRD import.
* **Diff view:** Side-by-side comparison of AI first-pass vs. final human-reviewed estimate.
* **Practice mode:** Junior engineers estimate independently, then compare against senior review — safe way to learn estimation.
* **AI learnings loop:** System uses past corrections in future reasoning ("Based on Ravn history, add 30% to integration estimates").
* **Estimator leaderboard:** Track and display individual estimation accuracy over time.
* **Multi-agent comparison:** Same PRD estimated by different AI models for calibration.

---

## Technical Constraints & Assets

* **Repo:** New monorepo (`/apps/web`, `/apps/api`, `/packages/shared`).
* **Design:** ShadCN + Ravn Design System. Clean, information-dense, fast — reference Linear or Notion for UX patterns.
* **Database:** PostgreSQL. Core entities: estimates, features, adjustments, projects, calibration data.
* **Auth:** WorkOS AuthKit. All users are Ravn employees.
* **Document Parsing:** `pdf-parse` or Anthropic native PDF support for PDFs, `mammoth` for DOCX, native Markdown parsing.
* **AI:** Claude API — Sonnet for speed, Opus for complexity. PRD parsing, estimation, risk identification, questions.
* **Vector Search:** pgvector for comparable project retrieval. Embed project descriptions, feature lists, lessons learned.
* **PDF Generation:** `@react-pdf/renderer` for estimate exports.
* **Hosting:** Vercel + Railway/Render + Neon/Supabase.

---

## Definition of Done (Demo Day Criteria)

*To receive the "Green Light," the demo must run on a real PRD — ideally a past Ravn project where we know the actual outcome.*

1. **Ingestion:** Partner uploads a real PRD. System parses and extracts project overview, 8+ features, technical constraints, and ambiguities. User confirms the extracted structure.
2. **AI Estimation:** AI generates a complete first-pass estimate in under 60 seconds — feature breakdown with complexity/hours/confidence, project summary, team recommendation, 5+ risks, comparable past projects, and clarification questions.
3. **Human Review:** Senior engineer reviews and adjusts 3+ features with written reasoning. Adds a risk the AI missed. Adjusts team composition. Sets confidence level.
4. **Output:** System generates both internal and client-ready estimate documents. Estimate exports as PDF.
5. **Calibration:** For a completed past project, user enters actual hours. System calculates accuracy and shows where the estimate was over/under.
6. **Dashboard:** Calibration view shows AI accuracy trend, common adjustment patterns, and improvement over time.
7. **The Proof:** Show the same PRD estimated by AI alone vs. with human review. Highlight what the human caught — risks, context, experience — that the AI missed.

---

## Non-Goals

* **Not a project manager.** We estimate scope; we don't track tasks, sprints, or execution.
* **Not a time tracker.** Actuals are entered manually post-project, not captured in real-time.
* **Not a resource scheduler.** We recommend team composition; we don't assign people or manage calendars.
* **Not a contract generator.** We produce estimates, not SOWs or legal documents.
* **Not a model trainer.** We collect the feedback data that enables fine-tuning, but model training is out of scope.

---

## Strategic Insight

The future of AI in professional services isn't "AI replaces engineers." It's "AI makes judgment work faster and better." Estimation is pure judgment — reading requirements, breaking down complexity, pattern-matching past experience, calibrating risk. AI handles the mechanical parts in minutes: parse the PRD, generate hour ranges, spot obvious risks. But AI lacks Ravn context, client knowledge, and the gut-feel risk detection that experience builds.

The Estimator embodies a thesis: **AI proposes, human disposes, system learns.** AI does the first 80% in minutes. The human applies the crucial 20% — judgment, context, accountability. Together, faster and better than either alone. Over time, institutional knowledge stays in the system instead of walking out the door when people leave.

If this works for estimation, it scales to every judgment-heavy process at Ravn: architecture decisions, code review, hiring, client communication. The Estimator is the first. It won't be the last.

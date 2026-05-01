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

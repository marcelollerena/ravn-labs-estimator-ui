# AI-Driven First-Pass Estimation Specification

## Overview
This section generates a complete AI-driven first-pass estimate from a confirmed EstimationRequest in under 60 seconds. The user watches step-by-step progress during generation, then reviews a dense estimation workbench with per-feature breakdowns, project summary, team recommendation, risks, comparable projects, and clarification questions before proceeding to Human Review & Adjustment.

## User Flows
- User lands here from PRD Ingestion with a confirmed EstimationRequest and starts (or resumes) first-pass estimation.
- User watches a step-by-step progress view while the AI generates the estimate (feature analysis, complexity scoring, hour estimation, risk identification, comparable retrieval, team recommendation).
- User reviews the finished estimate on a workbench layout: total hours (low/likely/high), estimated duration, overall complexity, overall confidence, and estimate status displayed prominently.
- User drills into the per-feature breakdown table showing feature name, description, complexity, hour range, confidence, assumptions, and dependencies for each EstimateFeature.
- User inspects the project-level summary panel with overall rationale and key assumptions.
- User reviews the team recommendation panel with suggested roles, headcount, seniority mix, and reasoning.
- User reviews the risks panel showing each EstimateRisk with category, likelihood, impact, and mitigation.
- User reviews the comparable projects panel showing 3-5 similar historical Projects with metadata and why they are comparable.
- User reviews the clarification questions panel listing unresolved EstimateQuestions that materially affect the estimate.
- User regenerates the estimate if unsatisfied, or continues to Human Review & Adjustment.

## UI Requirements
- Dense internal-tool layout optimized for scanning and comparison — estimation workbench, not a marketing dashboard.
- Generation progress view with labeled steps, current step highlight, elapsed time, and a subtle animation.
- Summary header bar showing total hours (low/likely/high), estimated duration, overall complexity, overall confidence, and estimate status.
- Per-feature breakdown as a compact table with sortable columns and expandable rows for assumptions and dependencies.
- Project summary, team recommendation, risks, comparable projects, and clarification questions as structured card panels.
- Risks displayed in a table or compact card grid with color-coded likelihood/impact indicators.
- Comparable projects as compact cards with key metrics (hours, team size, duration) and a similarity rationale.
- Clarification questions as a checklist-style list with question text and affected scope.
- AI-inferred content visually distinct (e.g., subtle background tint or icon badge) but not noisy.
- Two primary actions: "Regenerate Estimate" (secondary) and "Continue to Human Review" (primary).
- Mobile responsive using Tailwind responsive prefixes.
- Full dark mode support.
- No navigation chrome inside the section — the app shell handles that.

## Configuration
- shell: true

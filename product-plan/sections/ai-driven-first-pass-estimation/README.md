# AI-Driven First-Pass Estimation

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

## Design Decisions

- Dense internal-tool layout optimized for scanning and comparison
- Generation progress shows labeled steps with elapsed time per step
- Summary header displays key metrics (hours, duration, complexity, confidence) in a compact bar
- Feature breakdown is a sortable table with expandable rows for assumptions and dependencies
- Risks use color-coded likelihood/impact indicators with critical risks highlighted
- Comparable projects show key metrics with estimate vs. actual variance
- Clarification questions use a checklist pattern with impact badges

## Data Shapes

**Entities:** Estimate, EstimateFeature, EstimateRisk, TeamRecommendation, ComparableProject, EstimateQuestion, GenerationStep

## Visual Reference

See `screenshot.png` for the target UI design (if available).

## Components Provided

- `GenerationProgress` — Step-by-step progress view during AI estimation
- `EstimationWorkbenchView` — Main workbench layout composing all panels
- `SummaryHeader` — Compact metric bar showing hours, duration, complexity, confidence
- `FeatureBreakdown` — Sortable table with expandable feature rows
- `ProjectSummary` — Rationale and key assumptions panel
- `TeamRecommendation` — Role table with headcount, seniority, and reasoning
- `RisksPanel` — Risk cards with category, likelihood, impact, and mitigation
- `ComparableProjects` — Historical project comparison cards
- `ClarificationQuestions` — Checklist of unresolved questions with impact levels

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onGenerate` | Start AI estimation process |
| `onRegenerate` | Regenerate the estimate from scratch |
| `onContinueToReview` | Proceed to Human Review & Adjustment |
| `onExpandFeature` | Expand a feature row for details |
| `onCollapseFeature` | Collapse an expanded feature row |

# AI-Driven First-Pass Estimation

## Overview

Generates a complete AI-driven first-pass estimate from a confirmed PRD extraction in under 60 seconds. The user watches step-by-step progress during generation, then reviews a dense estimation workbench with per-feature breakdowns, project summary, team recommendation, risks, comparable projects, and clarification questions before proceeding to Human Review & Adjustment.

## User Flows

- User arrives from PRD Ingestion with a confirmed EstimationRequest and starts first-pass estimation
- User watches a step-by-step progress view (feature analysis, complexity scoring, hour estimation, risk identification, comparable retrieval, team recommendation)
- User reviews the finished estimate on a workbench layout with summary metrics
- User drills into per-feature breakdown with hours, complexity, confidence, assumptions, and dependencies
- User inspects project summary, team recommendation, risks, comparable projects, and clarification questions
- User regenerates the estimate if unsatisfied, or continues to Human Review

## Components Provided

- `GenerationProgress` — Step-by-step progress view during AI generation
- `EstimationWorkbenchView` — Main layout orchestrating all panels
- `SummaryHeader` — Key metrics bar (hours, duration, complexity, confidence, gen time)
- `FeatureBreakdown` — Sortable, expandable feature table
- `ProjectSummary` — AI rationale and key assumptions
- `TeamRecommendation` — Roles table with headcount, seniority, reasoning
- `RisksPanel` — Risk cards with category, likelihood, impact, mitigation
- `ComparableProjects` — Historical project cards with variance metrics
- `ClarificationQuestions` — Unresolved questions checklist

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onGenerate` | Start AI estimation process |
| `onRegenerate` | Regenerate estimate from scratch |
| `onContinueToReview` | Proceed to Human Review section |
| `onExpandFeature` | Expand a feature row |
| `onCollapseFeature` | Collapse a feature row |

## Data Shapes

**Entities:** Estimate, EstimateFeature, EstimateRisk, TeamRecommendation, ComparableProject, EstimateQuestion, GenerationStep

See `types.ts` for full interface definitions.

# Milestone 3: AI-Driven First-Pass Estimation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 2 (PRD Ingestion) complete

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Goal

Implement the AI-Driven First-Pass Estimation feature — generate a complete estimate from a confirmed PRD extraction with per-feature breakdown, project summary, team recommendation, risks, comparable projects, and clarification questions.

## Overview

The system generates a full estimate in under 60 seconds. Users watch step-by-step progress, then review a dense estimation workbench. They can regenerate if unsatisfied or proceed to human review.

**Key Functionality:**
- Step-by-step generation progress with elapsed time per step
- Summary header with total hours (low/likely/high), duration, complexity, confidence
- Sortable per-feature breakdown with expandable detail rows
- Project summary with AI rationale and key assumptions
- Team recommendation with roles, headcount, seniority, reasoning
- Risk assessment with category, likelihood, impact, mitigation
- Comparable projects with estimated vs actual hours and variance
- Clarification questions with impact level and resolution status

## Components Provided

Copy from `product-plan/sections/ai-driven-first-pass-estimation/components/`:

- `GenerationProgress` — Progress view during generation
- `EstimationWorkbenchView` — Main layout orchestrating all panels
- `SummaryHeader` — Key metrics bar
- `FeatureBreakdown` — Sortable, expandable feature table
- `ProjectSummary` — AI rationale and assumptions
- `TeamRecommendation` — Roles table
- `RisksPanel` — Risk cards
- `ComparableProjects` — Historical project cards
- `ClarificationQuestions` — Questions checklist

## Props Reference

See `types.ts` for full definitions. Key interfaces:

- `Estimate` — The complete estimate with all nested data
- `EstimateFeature` — Feature with complexity, hours (low/likely/high), confidence
- `EstimateRisk` — Risk with category, likelihood, impact, mitigation
- `TeamRecommendation` — Roles array with headcount and reasoning
- `GenerationStep` — Step with label, status, duration

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onRegenerate` | User clicks "Regenerate" |
| `onContinueToReview` | User clicks "Continue to Review" |
| `onExpandFeature` | User expands a feature row |
| `onCollapseFeature` | User collapses a feature row |

## Expected User Flows

### Flow 1: Generate Estimate
1. User arrives from PRD Ingestion with confirmed extraction
2. Generation starts automatically showing step progress
3. Steps complete with checkmarks and duration
4. **Outcome:** Estimation workbench renders with full data

### Flow 2: Review Estimate Details
1. User scans summary header (hours, duration, complexity, confidence)
2. User clicks a feature row to expand assumptions and dependencies
3. User reviews risks, team recommendation, comparable projects
4. **Outcome:** User has full understanding of the estimate

### Flow 3: Proceed to Review
1. User clicks "Continue to Review"
2. **Outcome:** Navigates to Human Review & Adjustment section

## Testing

See `product-plan/sections/ai-driven-first-pass-estimation/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/ai-driven-first-pass-estimation/README.md`
- `product-plan/sections/ai-driven-first-pass-estimation/tests.md`
- `product-plan/sections/ai-driven-first-pass-estimation/components/`
- `product-plan/sections/ai-driven-first-pass-estimation/types.ts`
- `product-plan/sections/ai-driven-first-pass-estimation/sample-data.json`

## Done When

- [ ] Generation progress shows steps with status indicators
- [ ] Summary header displays hours, duration, complexity, confidence
- [ ] Feature breakdown is sortable by all columns
- [ ] Feature rows expand to show assumptions and dependencies
- [ ] AI-generated content has visual distinction (blue tint/badge)
- [ ] Risks show color-coded likelihood and impact
- [ ] Comparable projects show variance metrics
- [ ] Clarification questions show resolution status
- [ ] "Regenerate" restarts the process
- [ ] "Continue to Review" navigates to human review
- [ ] Responsive on mobile

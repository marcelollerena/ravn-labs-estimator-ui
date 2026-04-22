# Milestone 3: AI-Driven First-Pass Estimation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) and Milestone 2 (PRD Ingestion) complete

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

Implement the AI-Driven First-Pass Estimation feature — generate a complete estimate from a confirmed PRD extraction in under 60 seconds, then display a dense estimation workbench for review.

## Overview

This section generates a complete AI-driven first-pass estimate from a confirmed EstimationRequest. The user watches step-by-step progress during generation, then reviews a dense workbench layout with per-feature breakdowns, project summary, team recommendation, risks, comparable projects, and clarification questions before proceeding to Human Review & Adjustment.

**Key Functionality:**
- Show step-by-step generation progress with elapsed time per step
- Display summary metrics: total hours (low/likely/high), duration, complexity, confidence
- Show sortable per-feature breakdown table with expandable detail rows
- Display project summary with rationale and key assumptions
- Show team recommendation with roles, headcount, seniority, and reasoning
- Display color-coded risks with category, likelihood, impact, and mitigation
- Show comparable historical projects with estimate vs. actual variance
- List clarification questions with impact levels and resolution status
- Allow regeneration or continuation to human review

## Components Provided

Copy the section components from `product-plan/sections/ai-driven-first-pass-estimation/components/`:

- `GenerationProgress` — Step-by-step progress view during AI estimation
- `EstimationWorkbenchView` — Main workbench layout composing all panels
- `SummaryHeader` — Compact metric bar (hours, duration, complexity, confidence, gen time)
- `FeatureBreakdown` — Sortable table with expandable feature rows
- `ProjectSummary` — Rationale and key assumptions panel
- `TeamRecommendation` — Role table with headcount, seniority, and reasoning
- `RisksPanel` — Risk display with category, likelihood, impact, and mitigation
- `ComparableProjects` — Historical project comparison cards
- `ClarificationQuestions` — Checklist of unresolved questions with impact levels

## Props Reference

The components expect these data shapes (see `types.ts` for full definitions):

**Data props:**

- `Estimate` — Complete estimate with hours, complexity, confidence, features, risks, team, comparables, questions
- `EstimateFeature` — Feature with complexity, hour range (low/likely/high), confidence, assumptions, dependencies
- `EstimateRisk` — Risk with category, likelihood, impact, and mitigation
- `TeamRecommendation` — Headcount, roles with seniority, and overall reasoning
- `ComparableProject` — Historical project with estimated vs. actual hours and similarity rationale
- `EstimateQuestion` — Question with affected scope, impact level, and resolution status
- `GenerationStep` — Step with label, status, and duration

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onGenerate` | User starts the estimation process |
| `onRegenerate` | User regenerates the estimate from scratch |
| `onContinueToReview` | User proceeds to Human Review & Adjustment |
| `onExpandFeature` | User expands a feature row to see details |
| `onCollapseFeature` | User collapses an expanded feature row |

## Expected User Flows

### Flow 1: Generate an Estimate

1. User arrives from PRD Ingestion with a confirmed extraction
2. User triggers estimation — generation progress view appears
3. Steps complete one by one with elapsed time displayed
4. Progress bar fills, step counter updates
5. **Outcome:** All steps complete, workbench view loads automatically

### Flow 2: Review the Estimate Workbench

1. User sees summary header with total hours, duration, complexity, confidence
2. User expands feature rows to inspect assumptions and dependencies
3. User sorts features by complexity or likely hours
4. User reviews team recommendation and risks
5. User checks comparable projects for validation
6. User reviews clarification questions
7. User clicks "Continue to Review"
8. **Outcome:** Navigates to Human Review & Adjustment section

### Flow 3: Regenerate Estimate

1. User is unsatisfied with the estimate
2. User clicks "Regenerate" in the page header
3. **Outcome:** Returns to generation progress, new estimate is generated

## Empty States

- **No estimate yet:** Generation can be triggered via `onGenerate`
- **No risks identified:** Risks panel shows "0" count, renders empty
- **No comparable projects:** Comparables panel shows "0" count, renders empty
- **All questions resolved:** Questions show "0 unresolved", all items have green checkmarks

## Testing

See `product-plan/sections/ai-driven-first-pass-estimation/tests.md` for UI behavior test specs covering:
- Generation progress and failure states
- Workbench review with all panels
- Feature sorting and expansion
- Color-coded severity indicators
- Empty state rendering

## Files to Reference

- `product-plan/sections/ai-driven-first-pass-estimation/README.md` — Feature overview and design intent
- `product-plan/sections/ai-driven-first-pass-estimation/tests.md` — UI behavior test specs
- `product-plan/sections/ai-driven-first-pass-estimation/components/` — React components
- `product-plan/sections/ai-driven-first-pass-estimation/types.ts` — TypeScript interfaces
- `product-plan/sections/ai-driven-first-pass-estimation/sample-data.json` — Test data

## Done When

- [ ] Generation progress view shows step-by-step progress with duration
- [ ] Workbench displays all panels: summary, features, project summary, team, risks, comparables, questions
- [ ] Feature table is sortable by name, complexity, likely hours, confidence
- [ ] Feature rows expand to show description, assumptions, and dependencies
- [ ] Risks are color-coded by severity (critical risks highlighted)
- [ ] Comparable projects show estimate vs. actual variance
- [ ] Questions show resolved/unresolved status with impact badges
- [ ] "Regenerate" and "Continue to Review" actions work
- [ ] Empty states render correctly
- [ ] Responsive on mobile
- [ ] Dark mode works correctly

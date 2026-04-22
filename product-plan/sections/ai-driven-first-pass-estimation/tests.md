# Test Specs: AI-Driven First-Pass Estimation

These test specs are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

This section generates a complete AI-driven estimate from a confirmed PRD extraction. Users watch step-by-step generation progress, then review a dense workbench with feature breakdowns, project summary, team recommendation, risks, comparable projects, and clarification questions.

---

## User Flow Tests

### Flow 1: Watch Estimate Generation

**Scenario:** User triggers estimation and watches progress

#### Success Path

**Setup:**
- Generation steps array with statuses progressing from pending to completed
- Project name: "HealthBridge Patient Portal"

**Steps:**
1. User sees the generation progress view with "Generating" badge
2. Progress bar fills as steps complete
3. Step labels show: "Analyzing features", "Scoring complexity", "Estimating hours", etc.
4. Completed steps show green checkmarks with duration (e.g., "4.2s")
5. Active step shows spinning blue loader
6. Step counter shows "3/6 steps"
7. All steps complete — view transitions to workbench

**Expected Results:**
- [ ] Progress bar width matches completed/total step ratio
- [ ] Each step shows the correct status icon (check, spinner, circle)
- [ ] Completed steps display duration in seconds
- [ ] "Cancel" button is visible and calls `onCancel`

#### Failure Path: Generation Fails

**Setup:**
- One step has status "failed"

**Expected Results:**
- [ ] Failed step shows red icon
- [ ] Badge changes to "Failed" with red styling
- [ ] Progress bar turns red
- [ ] Status text shows "Generation failed"

---

### Flow 2: Review Estimation Workbench

**Scenario:** User reviews the completed estimate

#### Success Path

**Setup:**
- Completed estimate with all panels populated

**Steps:**
1. User sees PageHeader with project name and "Completed" badge
2. Summary header shows: total hours (620 / 840 / 1,120), 14 weeks, High complexity, 72% confidence
3. User scrolls to feature breakdown table
4. User clicks a feature row to expand assumptions and dependencies
5. User clicks again to collapse
6. User sorts features by "Likely" hours (descending)
7. User scrolls to project summary panel
8. User reviews team recommendation table
9. User reviews risks panel with color-coded severity
10. User reviews comparable projects cards
11. User reviews clarification questions checklist
12. User clicks "Continue to Review"

**Expected Results:**
- [ ] Summary header displays formatted hour ranges with "low / likely / high" labels
- [ ] Feature breakdown shows 8 features with complexity badges and hour ranges
- [ ] Expanded feature shows description, assumptions (with AI badge), and dependency tags
- [ ] Sorting toggles ascending/descending with active column highlighted
- [ ] Project summary shows rationale text and key assumptions in a blue-tinted box
- [ ] Team recommendation shows 5 roles with count, seniority badge, and reasoning
- [ ] Risks panel shows 5 risks with category tags and L:/I: severity badges
- [ ] Critical risks (high likelihood + high impact) have a red left border
- [ ] Comparable projects show 4 cards with estimate vs. actual variance percentage
- [ ] Questions show resolved (green checkmark, strikethrough) and unresolved (empty circle)
- [ ] "Continue to Review" button calls `onContinueToReview`
- [ ] "Regenerate" button calls `onRegenerate`

---

### Flow 3: Regenerate Estimate

**Scenario:** User is unsatisfied with the estimate and regenerates

**Steps:**
1. User clicks "Regenerate" button in the page header
2. View transitions back to generation progress

**Expected Results:**
- [ ] `onRegenerate` callback is called
- [ ] Generation progress view is shown again

---

## Empty State Tests

### No Estimate Yet

**Scenario:** User arrives before estimation has started

**Setup:**
- `estimate` is null, `isGenerating` is false

**Expected Results:**
- [ ] Generation can be triggered via `onGenerate`

### Estimate With No Risks

**Setup:**
- Estimate with empty `risks` array

**Expected Results:**
- [ ] Risks panel shows "0" in the count badge
- [ ] Panel renders without errors

### Estimate With No Comparable Projects

**Setup:**
- Estimate with empty `comparableProjects` array

**Expected Results:**
- [ ] Comparable projects panel shows "0" in the count badge
- [ ] Panel renders empty grid without errors

### All Questions Resolved

**Setup:**
- All questions have `resolved: true`

**Expected Results:**
- [ ] All questions show green checkmarks
- [ ] "0 unresolved" is displayed in the header
- [ ] Resolved answers are shown in green text

---

## Component Interaction Tests

### SummaryHeader

**Renders correctly:**
- [ ] Displays total hours as "620 **840** 1,120 h" with low/likely/high labels
- [ ] Shows duration as "14 weeks"
- [ ] Shows complexity badge with correct color (High = orange)
- [ ] Shows confidence as "72%" with amber color (60-80% range)
- [ ] Shows generation time as "32.0s"

### FeatureBreakdown

**Renders correctly:**
- [ ] Column headers: Feature, Complexity, Low, Likely, High, Conf
- [ ] Low and High columns are hidden on mobile (sm: prefix)
- [ ] Total likely hours shown in section header
- [ ] Feature count shown in section header

**User interactions:**
- [ ] Clicking column headers triggers sorting
- [ ] Active sort column shows blue arrow icon
- [ ] Clicking same column toggles asc/desc direction
- [ ] Clicking feature row toggles expand/collapse
- [ ] Expanded row shows blue left border with description, assumptions, dependencies

### RisksPanel

**Renders correctly:**
- [ ] Each risk shows category tag, title, and L:/I: badges
- [ ] Category badges: Scope, Technical, Dependency, Team, Timeline
- [ ] Severity badges use color: low=emerald, medium=amber, high=red
- [ ] Critical risks (high/high) have red left border accent
- [ ] Mitigation text shown below each risk

### ComparableProjects

**Renders correctly:**
- [ ] Cards show project name and industry badge
- [ ] Metrics row: estimated hours, actual hours, variance %, duration, team size
- [ ] Positive variance (over estimate) shows red text with + prefix
- [ ] Negative variance (under estimate) shows green text
- [ ] Tech stack shown as small tags
- [ ] Similarity rationale text shown at bottom of each card

### ClarificationQuestions

**Renders correctly:**
- [ ] Unresolved questions show empty circle icon with normal text
- [ ] Resolved questions show green checkmark with strikethrough text
- [ ] Impact badges: low=zinc, medium=amber, high=red
- [ ] "Affects:" scope text shown below each question
- [ ] Resolved answers shown in green below the question
- [ ] Unresolved count shown in section header

---

## Edge Cases

- [ ] Handles estimates with 1 feature and 50+ features
- [ ] Very long feature names truncate properly in the table
- [ ] Very long assumption text wraps correctly in expanded rows
- [ ] Confidence of exactly 0.80 renders as emerald (≥0.8 threshold)
- [ ] Confidence of exactly 0.60 renders as amber (≥0.6 threshold)
- [ ] Zero-hour features render without errors
- [ ] Generation time of exactly 0ms renders as "0.0s"
- [ ] Comparable project with 0% variance renders as "0%" in neutral color

---

## Accessibility Checks

- [ ] Feature breakdown rows are keyboard-expandable
- [ ] Sort buttons in column headers are keyboard accessible
- [ ] Severity badges include readable text (not just color-coding)
- [ ] Expand/collapse state is communicated to screen readers
- [ ] Focus is managed appropriately after expanding a feature row

---

## Sample Test Data

```typescript
import type { Estimate, GenerationStep } from './types'

// Generation in progress
const mockSteps: GenerationStep[] = [
  { id: "step-1", label: "Analyzing features", status: "completed", durationMs: 4200 },
  { id: "step-2", label: "Scoring complexity", status: "completed", durationMs: 3800 },
  { id: "step-3", label: "Estimating hours", status: "in_progress", durationMs: 0 },
  { id: "step-4", label: "Identifying risks", status: "pending", durationMs: 0 },
  { id: "step-5", label: "Retrieving comparable projects", status: "pending", durationMs: 0 },
  { id: "step-6", label: "Recommending team composition", status: "pending", durationMs: 0 },
];

// Completed estimate (abbreviated)
const mockEstimate: Estimate = {
  id: "est-001",
  requestId: "req-042",
  projectName: "HealthBridge Patient Portal",
  status: "completed",
  totalHours: { low: 620, likely: 840, high: 1120 },
  estimatedDurationWeeks: 14,
  overallComplexity: "high",
  overallConfidence: 0.72,
  createdAt: "2026-04-16T09:32:00Z",
  generationDurationMs: 32000,
  summary: {
    rationale: "This is a mid-to-large healthcare portal with HIPAA compliance requirements...",
    keyAssumptions: [
      "Client will provide EHR sandbox credentials within the first two weeks.",
      "HIPAA compliance review is handled by a third-party auditor."
    ]
  },
  features: [
    {
      id: "feat-001",
      name: "Patient Dashboard",
      description: "Personalized landing page...",
      complexity: "medium",
      hours: { low: 60, likely: 80, high: 110 },
      confidence: 0.82,
      assumptions: ["Dashboard widgets are pre-defined, not user-configurable."],
      dependencies: ["EHR integration", "Authentication & RBAC"]
    }
  ],
  risks: [
    {
      id: "risk-001",
      category: "technical",
      title: "EHR API instability and rate limits",
      likelihood: "high",
      impact: "high",
      mitigation: "Build a caching layer and circuit breaker pattern for EHR calls."
    }
  ],
  teamRecommendation: {
    totalHeadcount: 6,
    roles: [
      { role: "Tech Lead", count: 1, seniority: "senior", reasoning: "Owns architecture and EHR integration strategy." }
    ],
    reasoning: "A 6-person team balances velocity with coordination overhead."
  },
  comparableProjects: [
    {
      id: "proj-012",
      name: "MedConnect Clinic Portal",
      industry: "Healthcare",
      techStack: ["React", "Node.js", "PostgreSQL", "Twilio"],
      teamSize: 5,
      estimatedHours: 780,
      actualHours: 920,
      durationWeeks: 16,
      similarityRationale: "Nearly identical scope — patient portal with EHR integration."
    }
  ],
  questions: [
    {
      id: "q-001",
      question: "Which EHR system(s) does the client use?",
      affectedScope: "EHR integration, Lab Results, Appointments, Prescriptions",
      impactLevel: "high",
      resolved: false,
      answer: null
    },
    {
      id: "q-003",
      question: "Does the client have an existing patient identity verification process?",
      affectedScope: "Authentication & RBAC, Onboarding flow",
      impactLevel: "medium",
      resolved: true,
      answer: "Client confirmed they use LexisNexis for identity proofing."
    }
  ]
};
```

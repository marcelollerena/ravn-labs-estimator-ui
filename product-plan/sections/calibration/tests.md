# Test Specs: Calibration

These test specs are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

The Calibration section lets PMs record post-project actuals and qualitative feedback. Key functionality: entering actual hours/duration/team size, calibrating features with actual hours and feedback, documenting team dynamics, and recording effort distribution per technology.

---

## User Flow Tests

### Flow 1: Enter Project Actuals

**Scenario:** PM records the actual hours, duration, and team size for a completed project.

#### Success Path

**Setup:**
- Calibration loaded with `status: "draft"` and `summary.actualTotalHours: null`

**Steps:**
1. PM sees the CalibrationSummaryHeader with empty input fields
2. PM enters `920` in the "Actual Hours" input
3. PM enters `16` in the Duration weeks input
4. PM enters `7` in the Team Size input
5. PM selects "High" from the Complexity dropdown

**Expected Results:**
- [ ] Actual Hours shows `920` with delta indicator `+80h (+10%)` in amber
- [ ] Duration shows `16` with reference `Est: 14wk`
- [ ] Team Size shows `7` with reference `Est: 6`
- [ ] Complexity dropdown shows "High" badge in orange
- [ ] "Mark as Complete" button becomes enabled

#### Clearing a Value

**Steps:**
1. PM clears the "Actual Hours" input (backspace to empty)

**Expected Results:**
- [ ] Input shows placeholder "—"
- [ ] Delta indicator disappears
- [ ] "Mark as Complete" button becomes disabled
- [ ] Warning bar appears: "Enter actual total hours in the summary header..."

---

### Flow 2: Calibrate a Feature

**Scenario:** PM enters actual hours and feedback for a specific feature.

#### Success Path

**Setup:**
- Feature "Patient Dashboard" with `status: "pending"` and `actualHours: null`

**Steps:**
1. PM sees the feature row with "Pending" badge in zinc
2. PM enters `125` in the inline actual hours input
3. PM clicks the feature row to expand it
4. PM types feedback: "EHR API had rate limiting issues..."
5. PM selects "High" from the Actual Complexity dropdown

**Expected Results:**
- [ ] Feature status changes from "Pending" to "Calibrated" (emerald badge)
- [ ] Left border changes from zinc to emerald
- [ ] Delta column shows `+15` in amber (125 - 110)
- [ ] Feedback textarea contains the entered text
- [ ] Complexity badge shows "High"
- [ ] Calibrated count in header updates (e.g., "6/8 calibrated")

#### Feature with No Individual Hours

**Steps:**
1. PM leaves the actual hours input empty for "Medical Records Access"

**Expected Results:**
- [ ] Feature remains in "Pending" status
- [ ] Delta column shows "—"
- [ ] Feature can still have feedback and complexity changes

---

### Flow 3: Record Team Feedback

**Scenario:** PM documents team dynamics and contributions.

#### Success Path

**Steps:**
1. PM sees the Team Feedback panel with empty textarea
2. PM types: "The team performed well overall despite scope expansion..."
3. PM clicks "Original Team Recommendation" to expand the reference

**Expected Results:**
- [ ] Textarea contains the entered feedback
- [ ] Original team roles table is visible with Role, #, Level, Reasoning columns
- [ ] Total headcount shown next to section header

---

### Flow 4: Document Effort Distribution

**Scenario:** PM enters actual effort percentages per technology.

#### Success Path

**Setup:**
- Tech stack: React, Node.js, PostgreSQL, AWS, Twilio

**Steps:**
1. PM sees 5 technology rows with percentage inputs and horizontal bars
2. PM enters: React 30%, Node.js 35%, PostgreSQL 15%, AWS 10%, Twilio 10%
3. PM types reasoning explaining the distribution

**Expected Results:**
- [ ] Total indicator shows "100%" in emerald
- [ ] Bars scale proportionally (Node.js bar is widest at 35%)
- [ ] Reasoning textarea contains the entered text

#### Invalid Total

**Steps:**
1. PM changes React to 40% (total becomes 110%)

**Expected Results:**
- [ ] Total indicator shows "110%" in amber
- [ ] Warning message appears: "Total is 110% — should sum to 100%."

---

## Empty State Tests

### Draft Calibration (No Actuals Entered)

**Setup:**
- Calibration with `status: "draft"`, all summary fields `null`, all features `status: "pending"`

**Expected Results:**
- [ ] Status badge shows "Draft" in blue
- [ ] All summary inputs show placeholder "—"
- [ ] "Mark as Complete" button is disabled
- [ ] Warning bar visible: "Enter actual total hours..."
- [ ] All feature rows show "Pending" badge
- [ ] Header shows "0/8 calibrated"

---

## Component Interaction Tests

### CalibrationSummaryHeader

**Renders correctly:**
- [ ] Shows "Actual Hours" label with number input
- [ ] Shows "Duration" label with weeks input and Calendar icon
- [ ] Shows "Team Size" label with people input and Users icon
- [ ] Shows "Complexity" with dropdown and Gauge icon
- [ ] Shows "Est. Confidence" as read-only with Target icon
- [ ] Estimate references shown below each editable field

**User interactions:**
- [ ] Entering actual hours triggers `onUpdateSummary` with `{ actualTotalHours: number }`
- [ ] Clearing hours triggers `onUpdateSummary` with `{ actualTotalHours: null }`
- [ ] Changing complexity triggers `onUpdateSummary` with `{ actualComplexity: value }`

### FeatureCalibrationTable

**Renders correctly:**
- [ ] Shows column headers: Feature, Complexity, Est., Actual, Delta, Status
- [ ] Features display with correct estimated hours and complexity badges
- [ ] Calibrated features have emerald left border, pending have zinc

**Sorting:**
- [ ] Clicking "Feature" header sorts alphabetically
- [ ] Clicking "Est." header sorts by estimated hours
- [ ] Clicking "Delta" header sorts by variance
- [ ] Clicking "Status" header groups pending vs calibrated
- [ ] Active sort column header is highlighted with blue icon

**User interactions:**
- [ ] Entering actual hours in inline input triggers `onUpdateFeatureActuals`
- [ ] Clicking a row expands/collapses the detail panel
- [ ] Expanded panel shows description, complexity selector, feedback textarea, and original estimate reference

### EffortBreakdownPanel

**Renders correctly:**
- [ ] Shows technology names with percentage inputs and colored bars
- [ ] Total percentage in header (emerald if 100%, amber otherwise)
- [ ] Bars have distinct colors per technology

**User interactions:**
- [ ] Changing a percentage triggers `onUpdateTechEffort`
- [ ] Input clamps values between 0 and 100
- [ ] Bars animate width transitions

---

## Edge Cases

- [ ] Very large actual hours (e.g., 10000) display correctly without overflow
- [ ] Feature names truncate properly with ellipsis on narrow screens
- [ ] All 8 features calibrated — header shows "8/8 calibrated"
- [ ] Complexity changed from estimated shows both badges (strikethrough + new)
- [ ] Delta of exactly 0 shows "0" in zinc (neutral) color
- [ ] Negative delta (under estimate) shows in emerald
- [ ] Effort breakdown with 0% shows empty bar
- [ ] All effort percentages set to 0 — total shows "0%" in amber

---

## Accessibility Checks

- [ ] All number inputs are keyboard accessible (tab navigation)
- [ ] Complexity and feature dropdowns work with keyboard
- [ ] Collapsible feature rows respond to Enter/Space
- [ ] Textarea labels are descriptive for screen readers
- [ ] Color indicators are supplemented by text (status labels, delta numbers)
- [ ] Focus states visible on all interactive elements (blue border)

---

## Sample Test Data

```typescript
import type { Calibration } from './types'

const mockCalibration: Calibration = {
  id: "cal-test",
  estimateId: "est-001",
  projectName: "Test Project",
  calibratorName: "Test User",
  status: "draft",
  createdAt: "2026-08-20T10:00:00Z",
  completedAt: null,
  summary: {
    actualTotalHours: null,
    actualDurationWeeks: null,
    actualTeamSize: null,
    actualComplexity: "high",
    estimatedTotalHours: { low: 620, likely: 840, high: 1120 },
    estimatedDurationWeeks: 14,
    estimatedComplexity: "high",
    estimatedConfidence: 0.72,
    estimatedHeadcount: 6,
  },
  features: [
    {
      featureId: "feat-001",
      featureName: "Feature A",
      description: "Test feature",
      estimatedComplexity: "high",
      estimatedHours: { low: 80, likely: 110, high: 150 },
      estimatedConfidence: 0.75,
      actualHours: null,
      actualComplexity: "high",
      feedback: "",
      status: "pending",
      assumptions: [],
      dependencies: [],
    },
  ],
  teamFeedback: "",
  originalTeamRoles: [
    { role: "Backend Engineer", count: 2, seniority: "senior", reasoning: "Core API development" },
  ],
  techEffortBreakdown: [
    { id: "tech-001", technology: "React", percentage: 30 },
    { id: "tech-002", technology: "Node.js", percentage: 35 },
  ],
  effortBreakdownReasoning: "",
}

// Populated state
const mockCalibratedFeature = {
  ...mockCalibration.features[0],
  actualHours: 125,
  status: "calibrated" as const,
  feedback: "Took longer due to API rate limiting.",
}
```

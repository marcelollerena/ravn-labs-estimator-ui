# Test Specs: AI-Driven First-Pass Estimation

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview

Generates a complete AI estimate with per-feature breakdown, risks, team recommendation, comparable projects, and clarification questions.

---

## User Flow Tests

### Flow 1: Generation Progress

**Setup:** Estimation in progress with generation steps

**Steps:**
1. User sees "Generating estimate" with step count
2. Steps complete one by one with checkmarks and duration
3. Progress bar fills proportionally

**Expected Results:**
- [ ] Completed steps show green checkmark and duration in seconds
- [ ] Active step shows spinning loader
- [ ] Progress bar width matches completed/total ratio
- [ ] "Cancel" button is visible during generation

### Flow 2: Review Estimate

**Setup:** Completed estimate with all data populated

**Steps:**
1. User sees summary header with hours, duration, complexity, confidence
2. User clicks a feature row to expand it
3. User reviews assumptions and dependencies in expanded view
4. User clicks "Continue to Review"

**Expected Results:**
- [ ] Total hours show low/likely/high format
- [ ] Confidence percentage is color-coded (green ≥80%, amber ≥60%, red <60%)
- [ ] Complexity badge is color-coded
- [ ] Feature rows are sortable by name, complexity, hours, confidence
- [ ] Expanded feature shows description, assumptions with AI badge, dependencies as tags

---

## Component Tests

### SummaryHeader
- [ ] Hours display: low (small) / likely (large, bold) / high (small)
- [ ] Generation time shows in seconds (e.g., "32.0s")

### FeatureBreakdown
- [ ] Default sort is by likely hours, descending
- [ ] Clicking column header toggles sort direction
- [ ] Total hours shown in header bar

### RisksPanel
- [ ] Critical risks (high likelihood + high impact) have red left border
- [ ] Likelihood and impact badges are color-coded

### ComparableProjects
- [ ] Variance shows as percentage (red for overruns, green for underruns)
- [ ] Tech stack shown as badge chips

---

## Edge Cases

- [ ] Generation failure shows error state with "Failed" badge
- [ ] Zero comparable projects renders section with count "0"
- [ ] All questions resolved shows "0 unresolved" in header

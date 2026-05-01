# Test Specs: Human Review & Adjustment

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview

Senior engineers review AI estimates, accept or adjust features with mandatory reasoning, modify risks and team composition, and set overall confidence.

---

## User Flow Tests

### Flow 1: Accept a Feature

**Setup:** ReviewEstimate with features in "pending" status

**Steps:**
1. User sees feature row with "Pending" status badge and gray left border
2. User clicks the checkmark (accept) button
3. Feature status changes to "Accepted"

**Expected Results:**
- [ ] Status badge changes from "Pending" to "Accepted" (green)
- [ ] Left border changes from gray to green
- [ ] Accept/adjust action buttons disappear
- [ ] Impact summary progress counter updates (e.g., "7/8 reviewed")

### Flow 2: Adjust a Feature

**Setup:** ReviewEstimate with pending features

**Steps:**
1. User clicks the pencil (adjust) button on a feature
2. User modifies hours, complexity, or confidence
3. User enters mandatory reasoning
4. User saves the adjustment

**Expected Results:**
- [ ] Status changes to "Adjusted" with amber badge and amber left border
- [ ] AI original value shown struck-through next to adjusted value
- [ ] Reasoning displayed in amber panel below the feature
- [ ] Impact bar updates with new hours delta, confidence shift
- [ ] Delta column shows +/- hours change

### Flow 3: Approve and Export

**Setup:** All features and risks reviewed

**Steps:**
1. All features show "Accepted" or "Adjusted" status
2. All risks show "Accepted" or "Adjusted" status
3. User clicks "Approve & Export"

**Expected Results:**
- [ ] "Approve & Export" button is enabled (blue)
- [ ] Button is disabled when any items are still "Pending"
- [ ] Warning banner disappears when all items reviewed

---

## Component Tests

### ReviewImpactBar
- [ ] Hours delta shows as "+30h (+3.6%)" format
- [ ] Confidence delta shows as "+6pp from AI"
- [ ] Progress shows "6/8 reviewed"
- [ ] Positive hours delta is amber, negative is green

### FeatureReviewTable
- [ ] Three status colors: gray (pending), green (accepted), amber (adjusted)
- [ ] Complexity change shows old struck-through + new badge
- [ ] AI column shows original likely hours
- [ ] Adj column shows adjusted likely hours

### RiskReviewPanel
- [ ] New risks show "New" badge in blue
- [ ] Existing AI risks show "AI" badge
- [ ] Likelihood/impact changes show old→new transition
- [ ] "Add Risk" button in panel header

### TeamReviewPanel
- [ ] New roles have blue left border and "NEW" tag
- [ ] Seniority upgrades show old→new transition
- [ ] Headcount delta shown in header (e.g., "+1")

### OverallConfidencePanel
- [ ] Large percentage display with color coding
- [ ] Progress bar width matches confidence percentage
- [ ] Delta from AI shown (e.g., "+6pp from AI")

---

## Edge Cases

- [ ] All features accepted shows 0 adjustments in impact bar
- [ ] Review with 0 risks pending shows risks as fully reviewed
- [ ] Pending items warning banner shows correct counts

# Human Review & Adjustment Specification

## Overview
This section enables a senior engineer to review and adjust the AI-generated first-pass estimate before it moves to export. Every AI-generated value — feature hours, complexity, confidence, risks, team composition, assumptions — can be accepted as-is or adjusted with mandatory reasoning. The interface makes it instantly clear what came from the AI and what was changed by a human, creating a living audit trail that feeds Ravn's institutional learning.

## User Flows
- User arrives from the AI-Driven First-Pass Estimation section with a completed estimate ready for human review.
- User sees a review console with the AI estimate summary at the top, including total hours, duration, complexity, and confidence — with real-time deltas as adjustments are made.
- User reviews each feature in a feature-by-feature table. Each row shows AI-original values alongside editable adjusted values for hours (low/likely/high), complexity, and confidence.
- User accepts a feature as-is (one-click) or adjusts it. Any material adjustment (hours change > 10%, complexity change, confidence change) requires a mandatory reasoning field before saving.
- User reviews and edits the assumptions list — can accept, modify, or remove AI assumptions and add new ones.
- User reviews and edits the dependencies list per feature.
- User reviews risks in an editable panel — can accept, modify severity/likelihood/impact, update mitigation, remove risks, or add new ones. Each change requires reasoning.
- User reviews and adjusts the team recommendation — can change headcount, roles, seniority, and reasoning for each role.
- User sets an overall confidence level for the reviewed estimate.
- User sees a real-time impact summary comparing AI-original totals vs. adjusted totals: hours delta, duration impact, team size change, confidence shift.
- User sees clear visual status indicators per item: accepted (unchanged), adjusted (with reasoning), pending review (not yet touched).
- User approves the estimate and proceeds to the Export step.

## UI Requirements
- Dense review console layout — every row is scannable and actionable without modals or page changes.
- AI-original values displayed as read-only reference alongside editable adjusted values.
- Visual distinction between AI-generated content (subtle blue tint/badge) and human-adjusted content (amber/orange indicator).
- Three-state indicators per item: pending (gray), accepted (green), adjusted (amber).
- Inline editing for hour ranges, complexity dropdowns, confidence sliders.
- Mandatory reasoning textarea that appears when a material adjustment is made — cannot save without filling it.
- Impact summary bar at the top that updates in real-time as adjustments accumulate: total hours delta, duration change, confidence shift, number of adjustments made.
- Feature review table with expandable rows showing assumptions, dependencies, and adjustment history.
- Risks panel with inline edit capability and add-new-risk action.
- Team recommendation panel with editable roles table.
- Overall confidence selector (0-100%) with reasoning field.
- Progress tracker showing how many items have been reviewed out of total.
- Two primary actions: "Save Draft" (secondary) and "Approve & Continue to Export" (primary, only enabled when all items reviewed).
- Mobile responsive using Tailwind responsive prefixes.
- Full dark mode support.
- No navigation chrome inside the section — the app shell handles that.

## Configuration
- shell: true

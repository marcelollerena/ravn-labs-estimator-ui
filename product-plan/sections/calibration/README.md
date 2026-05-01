# Calibration

## Overview

The Calibration section captures post-project actuals and qualitative learning once a project is complete. PMs record real hours, duration, team size, and per-feature feedback explaining why the estimate was accurate, optimistic, or pessimistic. This data closes the estimation feedback loop.

## User Flows

1. **Enter Project Actuals** — PM enters actual total hours, duration (weeks), team size, and selects actual complexity. Original estimate values shown as reference with delta indicators.
2. **Calibrate Features** — PM enters actual hours per feature (optional), expands rows to provide qualitative feedback explaining why the feature took more/less/same time. Status updates from "pending" to "calibrated".
3. **Record Team Feedback** — PM writes a general summary of team dynamics, surprises, and contributions. Can expand a collapsed reference of the original team recommendation.
4. **Document Effort Distribution** — PM enters percentage breakdown per technology from the project's tech stack. Horizontal bars update dynamically. Total indicator validates 100%.
5. **Save / Complete** — Save as draft anytime. Mark as complete when actual total hours are filled.

## Design Decisions

- Evolved from the AI Estimation workbench — same card shells, typography scale, monospace numbers, and color coding
- Summary header uses editable inputs replacing the read-only estimation values
- Feature table supports inline number inputs for actual hours directly in the row
- Complexity can be changed per feature via dropdown, showing original vs actual when different
- Delta indicators use emerald (under estimate) and amber (over estimate)
- Effort breakdown bars are relative to the largest percentage for better visual scaling
- Team feedback is a general textarea (not structured rows) with collapsible original team reference

## Data Shapes

- `Calibration` — Top-level calibration record with summary, features, team feedback, and effort breakdown
- `CalibrationSummary` — Actual vs estimated hours, duration, team size, complexity, confidence
- `FeatureCalibration` — Per-feature actuals with hours, complexity, feedback, and status
- `TechEffortEntry` — Technology name + percentage of total effort
- `OriginalTeamRole` — Read-only reference role from the original AI team recommendation

See `types.ts` for full interface definitions.

## Components Provided

- `CalibrationWorkbenchView` — Main layout composing all panels with PageHeader, status badge, and Save Draft / Mark as Complete actions
- `CalibrationSummaryHeader` — Editable actuals header (hours, duration, team size, complexity, confidence reference)
- `FeatureCalibrationTable` — Sortable, collapsible feature table with inline actual hours input, complexity dropdown, delta indicators, feedback textarea
- `TeamFeedbackPanel` — General team feedback textarea with collapsible original team recommendation reference
- `EffortBreakdownPanel` — Dynamic tech stack effort percentages with horizontal bar chart and reasoning textarea

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onUpdateSummary` | PM changes actual hours, duration, team size, or complexity |
| `onUpdateFeatureActuals` | PM enters/clears actual hours for a feature |
| `onUpdateFeatureComplexity` | PM changes actual complexity for a feature |
| `onUpdateFeatureFeedback` | PM types feedback for a feature |
| `onUpdateTeamFeedback` | PM types team feedback |
| `onUpdateTechEffort` | PM changes a technology effort percentage |
| `onUpdateEffortReasoning` | PM types effort breakdown reasoning |
| `onSaveDraft` | PM clicks "Save Draft" |
| `onMarkComplete` | PM clicks "Mark as Complete" |
| `onExpandFeature` | PM expands a feature row |
| `onCollapseFeature` | PM collapses a feature row |

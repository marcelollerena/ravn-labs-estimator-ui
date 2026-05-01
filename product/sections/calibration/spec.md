# Calibration

## Overview

The Calibration section captures post-project actuals and qualitative learning once a project is complete. PMs record real hours, duration, team size, and per-feature feedback explaining why the estimate was accurate, optimistic, or pessimistic. This data closes the estimation feedback loop and feeds future AI accuracy improvements.

## Shell

`shell: true` — rendered inside the application shell with sidebar navigation.

## User Flows

### 1. Enter Project Actuals (Summary Header)

1. PM opens a completed project's calibration view
2. Enters actual total hours, actual duration (weeks), and actual team size
3. Selects actual complexity from dropdown
4. Original estimate values shown as reference with delta indicators
5. Changes auto-save to draft state

### 2. Calibrate Features

1. PM scans feature list showing estimated vs actual columns
2. Enters actual hours per feature (optional — some features may not have individual tracking)
3. Expands a feature row to provide qualitative feedback
4. Writes reasoning explaining why the feature took more/less/same time as estimated
5. Feature status updates from "pending" to "calibrated" when actual hours are entered
6. Sorts by delta to quickly find the biggest misses

### 3. Record Team Feedback

1. PM writes a general summary of team dynamics, surprises, and contributions
2. Can expand a collapsed reference showing the original team recommendation for context

### 4. Document Effort Distribution

1. PM enters percentage breakdown per technology (from the project's tech stack)
2. Horizontal bars update dynamically as percentages change
3. Total indicator shows whether percentages sum to 100%
4. PM writes reasoning explaining the effort distribution

### 5. Save / Complete

1. PM can save as draft at any time
2. PM marks calibration as complete when satisfied
3. Completion requires at minimum the actual total hours to be filled

## UI Requirements

- Reuses the dense internal-tool aesthetic from the estimation workbench
- Same card shells, typography scale (JetBrains Mono for numbers), and color vocabulary
- Summary header with editable inputs replacing the read-only estimation values
- Feature table with sortable columns, collapsible rows, inline number inputs
- Complexity badges with consistent color coding (emerald/amber/orange/red)
- Delta indicators: emerald for under-estimate, amber for over-estimate
- Status badges: pending (zinc), calibrated (emerald)
- Responsive: two-column grid on desktop, single column on mobile
- Full dark mode support

## Sections Removed (vs Estimation Workbench)

- Risk Review — not applicable for post-project calibration
- Comparable Projects — not applicable
- Clarification Questions — not applicable
- Generation Time — not applicable

## Configuration

- `shell: true`
- No additional configuration required

# Human Review & Adjustment

## Overview

Enables a senior engineer to review and adjust the AI-generated first-pass estimate before it moves to export. Every AI-generated value can be accepted as-is or adjusted with mandatory reasoning. The interface makes it instantly clear what came from the AI and what was changed by a human, creating a living audit trail that feeds Ravn's institutional learning.

## User Flows

- User arrives from AI-Driven First-Pass Estimation with a completed estimate
- User sees a review console with impact summary bar showing real-time deltas
- User reviews each feature: accept (one-click) or adjust with mandatory reasoning
- User reviews and adjusts risks — can modify severity, update mitigation, add new risks
- User reviews and adjusts team recommendation — headcount, roles, seniority
- User sets overall confidence with reasoning
- User sees clear three-state indicators: pending (gray), accepted (green), adjusted (amber)
- User approves and proceeds to Export

## Design Decisions

- Three-state review model (pending/accepted/adjusted) with color-coded left borders for instant scanning
- AI-original values shown as struck-through references next to adjusted values
- Amber panels display mandatory reasoning inline
- Blue AI badges mark unmodified AI content
- Real-time impact bar updates as adjustments accumulate

## Components Provided

- `ReviewConsoleView` — Main layout with PageHeader, impact bar, and all panels
- `ReviewImpactBar` — Real-time impact summary (hours delta, duration, team, confidence, progress)
- `FeatureReviewTable` — Sortable feature table with AI vs adjusted values, status indicators, inline actions
- `RiskReviewPanel` — Risk review with severity change visualization, add risk action
- `TeamReviewPanel` — Team comparison with original vs adjusted roles
- `OverallConfidencePanel` — Confidence display with bar, delta, and reasoning

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onAcceptFeature` | User accepts a feature as-is |
| `onAdjustFeature` | User adjusts a feature with new values |
| `onAcceptRisk` | User accepts a risk as-is |
| `onAdjustRisk` | User adjusts a risk |
| `onAddRisk` | User adds a new risk |
| `onAdjustTeam` | User modifies team recommendation |
| `onSetOverallConfidence` | User sets overall confidence |
| `onSaveDraft` | User saves review draft |
| `onApproveAndExport` | User approves and proceeds to export |

## Data Shapes

**Entities:** ReviewEstimate, ReviewFeature, FeatureAdjustment, ReviewRisk, RiskAdjustment, TeamAdjustment, ImpactSummary

See `types.ts` for full interface definitions.

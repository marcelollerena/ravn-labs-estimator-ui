# Milestone 4: Human Review & Adjustment

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 3 (AI-Driven First-Pass Estimation) complete

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

Implement the Human Review & Adjustment feature — senior engineers review the AI estimate, accept or adjust features with mandatory reasoning, modify risks and team composition, and set overall confidence before proceeding to export.

## Overview

Every AI-generated value can be accepted as-is or adjusted. Adjustments require mandatory reasoning, creating an audit trail for institutional learning. The interface shows real-time impact of changes and tracks review progress.

**Key Functionality:**
- Impact summary bar with real-time deltas (hours, duration, team, confidence)
- Feature-by-feature review with accept/adjust actions
- Three-state indicators: pending (gray), accepted (green), adjusted (amber)
- AI-original vs adjusted values shown side-by-side
- Mandatory reasoning for material adjustments
- Risk review with accept/adjust/add capabilities
- Team recommendation editing
- Overall confidence setting with reasoning
- Progress tracking (X of Y reviewed)
- Approve gate — all items must be reviewed before export

## Components Provided

Copy from `product-plan/sections/human-review-and-adjustment/components/`:

- `ReviewConsoleView` — Main layout with header, impact bar, and all panels
- `ReviewImpactBar` — Real-time impact summary
- `FeatureReviewTable` — Sortable feature table with accept/adjust
- `RiskReviewPanel` — Risk review with severity changes
- `TeamReviewPanel` — Team comparison (original vs adjusted)
- `OverallConfidencePanel` — Confidence display with bar and reasoning

## Props Reference

See `types.ts` for full definitions. Key interfaces:

- `ReviewEstimate` — The review session with all features, risks, team, impact
- `ReviewFeature` — Feature with AI-original + adjusted values
- `FeatureAdjustment` — Adjustment record with before/after and reasoning
- `ReviewRisk` — Risk with original/adjusted severity
- `TeamAdjustment` — Original vs adjusted team composition
- `ImpactSummary` — Cumulative impact metrics

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onAcceptFeature` | Accept a feature as-is |
| `onAdjustFeature` | Adjust a feature (triggers reasoning requirement) |
| `onAcceptRisk` | Accept a risk as-is |
| `onAdjustRisk` | Adjust a risk |
| `onAddRisk` | Add a new risk |
| `onAdjustTeam` | Modify team recommendation |
| `onSetOverallConfidence` | Set confidence with reasoning |
| `onSaveDraft` | Save review without approving |
| `onApproveAndExport` | Approve and proceed to export |

## Expected User Flows

### Flow 1: Accept Features
1. User scans impact bar showing AI-original totals
2. User clicks checkmark on a feature to accept it
3. Feature shows green "Accepted" badge
4. Impact bar progress updates
5. **Outcome:** Feature is confirmed without changes

### Flow 2: Adjust a Feature
1. User clicks pencil icon on a feature
2. User modifies hours, complexity, or confidence
3. System requires mandatory reasoning text
4. User enters reasoning and saves
5. **Outcome:** Feature shows amber "Adjusted" badge with reasoning, impact bar updates

### Flow 3: Approve and Export
1. User reviews all features, risks, team
2. All items show "Accepted" or "Adjusted" (none "Pending")
3. User clicks "Approve & Export"
4. **Outcome:** Review is approved, navigates to Export section

## Testing

See `product-plan/sections/human-review-and-adjustment/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/human-review-and-adjustment/README.md`
- `product-plan/sections/human-review-and-adjustment/tests.md`
- `product-plan/sections/human-review-and-adjustment/components/`
- `product-plan/sections/human-review-and-adjustment/types.ts`
- `product-plan/sections/human-review-and-adjustment/sample-data.json`

## Done When

- [ ] Impact bar shows real-time deltas as adjustments are made
- [ ] Features can be accepted (one-click) or adjusted (with reasoning)
- [ ] Three-state indicators work: pending/accepted/adjusted
- [ ] AI-original values displayed alongside adjusted values
- [ ] Mandatory reasoning required for material adjustments
- [ ] Risks can be accepted, adjusted, or added
- [ ] Team recommendation is editable
- [ ] Overall confidence settable with reasoning
- [ ] "Approve & Export" only enabled when all items reviewed
- [ ] Warning shown when items are still pending
- [ ] Responsive on mobile

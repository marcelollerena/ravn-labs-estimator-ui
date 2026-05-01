import { Save, ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import { PageHeader } from '@/shell/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { ReviewImpactBar } from './ReviewImpactBar'
import { FeatureReviewTable } from './FeatureReviewTable'
import { RiskReviewPanel } from './RiskReviewPanel'
import { TeamReviewPanel } from './TeamReviewPanel'
import { OverallConfidencePanel } from './OverallConfidencePanel'
import type { ReviewEstimate } from '@/../product/sections/human-review-and-adjustment/types'

interface ReviewConsoleViewProps {
  review: ReviewEstimate
  expandedFeatureIds: Set<string>
  onExpandFeature?: (featureId: string) => void
  onCollapseFeature?: (featureId: string) => void
  onAcceptFeature?: (featureId: string) => void
  onAdjustFeature?: (featureId: string) => void
  onAcceptRisk?: (riskId: string) => void
  onAdjustRisk?: (riskId: string) => void
  onAddRisk?: () => void
  onAdjustTeam?: () => void
  onSaveDraft?: () => void
  onApproveAndExport?: () => void
}

export function ReviewConsoleView({
  review,
  expandedFeatureIds,
  onExpandFeature,
  onCollapseFeature,
  onAcceptFeature,
  onAdjustFeature,
  onAcceptRisk,
  onAdjustRisk,
  onAddRisk,
  onAdjustTeam,
  onSaveDraft,
  onApproveAndExport,
}: ReviewConsoleViewProps) {
  const allFeaturesReviewed = review.features.every(f => f.adjustment.status !== 'pending')
  const allRisksReviewed = review.risks.every(r => r.adjustment.status !== 'pending')
  const canApprove = allFeaturesReviewed && allRisksReviewed

  return (
    <div className="flex flex-col">
      <PageHeader
        title={review.projectName}
        description={`Human Review — ${review.reviewerName}`}
        status={
          review.reviewStatus === 'approved' ? (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-[11px] font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
            >
              <CheckCircle2 size={11} className="mr-1" />
              Approved
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-blue-200 bg-blue-50 text-[11px] font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
            >
              <Clock size={11} className="mr-1" />
              In Review
            </Badge>
          )
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={onSaveDraft}
              className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <Save size={13} />
              Save Draft
            </button>
            <button
              onClick={onApproveAndExport}
              disabled={!canApprove}
              className="flex items-center gap-1.5 rounded-md bg-blue-500 px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Approve & Export
              <ArrowRight size={14} />
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1080px] space-y-5 p-6">
          {/* Impact summary bar */}
          <ReviewImpactBar impact={review.impactSummary} />

          {/* Feature review table */}
          <FeatureReviewTable
            features={review.features}
            expandedFeatureIds={expandedFeatureIds}
            onExpandFeature={onExpandFeature}
            onCollapseFeature={onCollapseFeature}
            onAcceptFeature={onAcceptFeature}
            onAdjustFeature={onAdjustFeature}
          />

          {/* Risk + Team side by side on large screens */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <RiskReviewPanel
              risks={review.risks}
              onAcceptRisk={onAcceptRisk}
              onAdjustRisk={onAdjustRisk}
              onAddRisk={onAddRisk}
            />
            <TeamReviewPanel
              teamAdjustment={review.teamAdjustment}
              onAdjustTeam={onAdjustTeam}
            />
          </div>

          {/* Overall confidence */}
          <OverallConfidencePanel
            confidence={review.overallConfidence}
            reasoning={review.overallConfidenceReasoning}
            originalConfidence={review.impactSummary.originalConfidence}
          />

          {/* Bottom action bar (mobile-friendly) */}
          {!canApprove && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-950/20">
              <p className="text-[12px] text-amber-800 dark:text-amber-300">
                <span className="font-medium">
                  {review.impactSummary.totalFeatures - review.impactSummary.featuresReviewed} feature{review.impactSummary.totalFeatures - review.impactSummary.featuresReviewed !== 1 ? 's' : ''} and{' '}
                  {review.risks.filter(r => r.adjustment.status === 'pending').length} risk{review.risks.filter(r => r.adjustment.status === 'pending').length !== 1 ? 's' : ''} still pending review.
                </span>{' '}
                All items must be reviewed before approval.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '../../shell/components/PageHeader'
import { SummaryHeader } from './SummaryHeader'
import { FeatureBreakdown } from './FeatureBreakdown'
import { ProjectSummary } from './ProjectSummary'
import { TeamRecommendation } from './TeamRecommendation'
import { RisksPanel } from './RisksPanel'
import { ComparableProjects } from './ComparableProjects'
import { ClarificationQuestions } from './ClarificationQuestions'
import type { Estimate } from '../types'

function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className || ''}`}>{children}</span>
}

interface EstimationWorkbenchViewProps {
  estimate: Estimate
  expandedFeatureIds: Set<string>
  onRegenerate?: () => void
  onContinueToReview?: () => void
  onExpandFeature?: (featureId: string) => void
  onCollapseFeature?: (featureId: string) => void
}

export function EstimationWorkbenchView({
  estimate,
  expandedFeatureIds,
  onRegenerate,
  onContinueToReview,
  onExpandFeature,
  onCollapseFeature,
}: EstimationWorkbenchViewProps) {
  return (
    <div className="flex flex-col">
      <PageHeader
        title={estimate.projectName}
        description="AI First-Pass Estimate"
        status={
          <Badge
            variant="outline"
            className="border-emerald-200 bg-emerald-50 text-[11px] font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
          >
            <CheckCircle2 size={11} className="mr-1" />
            Completed
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <RotateCcw size={13} />
              Regenerate
            </button>
            <button
              onClick={onContinueToReview}
              className="flex items-center gap-1.5 rounded-md bg-blue-500 px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Continue to Review
              <ArrowRight size={14} />
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1080px] space-y-5 p-6">
          <SummaryHeader
            totalHours={estimate.totalHours}
            estimatedDurationWeeks={estimate.estimatedDurationWeeks}
            overallComplexity={estimate.overallComplexity}
            overallConfidence={estimate.overallConfidence}
            status={estimate.status}
            generationDurationMs={estimate.generationDurationMs}
          />

          <FeatureBreakdown
            features={estimate.features}
            expandedFeatureIds={expandedFeatureIds}
            onExpandFeature={onExpandFeature}
            onCollapseFeature={onCollapseFeature}
          />

          <ProjectSummary summary={estimate.summary} />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <TeamRecommendation teamRecommendation={estimate.teamRecommendation} />
            <RisksPanel risks={estimate.risks} />
          </div>

          <ComparableProjects comparableProjects={estimate.comparableProjects} />

          <ClarificationQuestions questions={estimate.questions} />
        </div>
      </div>
    </div>
  )
}

import { Save, CheckCircle2, Clock, ClipboardCheck } from 'lucide-react'
import { PageHeader } from '@/shell/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { CalibrationSummaryHeader } from './CalibrationSummaryHeader'
import { FeatureCalibrationTable } from './FeatureCalibrationTable'
import { TeamFeedbackPanel } from './TeamFeedbackPanel'
import { EffortBreakdownPanel } from './EffortBreakdownPanel'
import type {
  Calibration,
  CalibrationSummary,
  Complexity,
} from '@/../product/sections/calibration/types'

interface CalibrationWorkbenchViewProps {
  calibration: Calibration
  expandedFeatureIds: Set<string>
  onUpdateSummary?: (updates: Partial<CalibrationSummary>) => void
  onUpdateFeatureActuals?: (featureId: string, actualHours: number | null) => void
  onUpdateFeatureComplexity?: (featureId: string, complexity: Complexity) => void
  onUpdateFeatureFeedback?: (featureId: string, feedback: string) => void
  onUpdateTeamFeedback?: (feedback: string) => void
  onUpdateTechEffort?: (id: string, percentage: number) => void
  onUpdateEffortReasoning?: (reasoning: string) => void
  onSaveDraft?: () => void
  onMarkComplete?: () => void
  onExpandFeature?: (featureId: string) => void
  onCollapseFeature?: (featureId: string) => void
}

export function CalibrationWorkbenchView({
  calibration,
  expandedFeatureIds,
  onUpdateSummary,
  onUpdateFeatureActuals,
  onUpdateFeatureComplexity,
  onUpdateFeatureFeedback,
  onUpdateTeamFeedback,
  onUpdateTechEffort,
  onUpdateEffortReasoning,
  onSaveDraft,
  onMarkComplete,
  onExpandFeature,
  onCollapseFeature,
}: CalibrationWorkbenchViewProps) {
  const canComplete = calibration.summary.actualTotalHours !== null

  return (
    <div className="flex flex-col">
      <PageHeader
        title={calibration.projectName}
        description={`Post-Project Calibration — ${calibration.calibratorName}`}
        status={
          calibration.status === 'completed' ? (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-[11px] font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
            >
              <CheckCircle2 size={11} className="mr-1" />
              Completed
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-blue-200 bg-blue-50 text-[11px] font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
            >
              <Clock size={11} className="mr-1" />
              Draft
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
              onClick={onMarkComplete}
              disabled={!canComplete}
              className="flex items-center gap-1.5 rounded-md bg-blue-500 px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <ClipboardCheck size={14} />
              Mark as Complete
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1080px] space-y-5 p-6">
          <CalibrationSummaryHeader
            summary={calibration.summary}
            onUpdateSummary={onUpdateSummary}
          />

          <FeatureCalibrationTable
            features={calibration.features}
            expandedFeatureIds={expandedFeatureIds}
            onExpandFeature={onExpandFeature}
            onCollapseFeature={onCollapseFeature}
            onUpdateFeatureActuals={onUpdateFeatureActuals}
            onUpdateFeatureComplexity={onUpdateFeatureComplexity}
            onUpdateFeatureFeedback={onUpdateFeatureFeedback}
          />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <TeamFeedbackPanel
              teamFeedback={calibration.teamFeedback}
              originalTeamRoles={calibration.originalTeamRoles}
              onUpdateTeamFeedback={onUpdateTeamFeedback}
            />
            <EffortBreakdownPanel
              techEffortBreakdown={calibration.techEffortBreakdown}
              effortBreakdownReasoning={calibration.effortBreakdownReasoning}
              onUpdateTechEffort={onUpdateTechEffort}
              onUpdateEffortReasoning={onUpdateEffortReasoning}
            />
          </div>

          {/* Completion guidance */}
          {!canComplete && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-950/20">
              <p className="text-[12px] text-amber-800 dark:text-amber-300">
                <span className="font-medium">Enter actual total hours</span> in the summary header to enable marking this calibration as complete.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

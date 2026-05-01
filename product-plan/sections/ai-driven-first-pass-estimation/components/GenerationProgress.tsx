import { Check, Loader2, Circle, Zap, ArrowLeft } from 'lucide-react'
import { PageHeader } from '../../../shell/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import type { GenerationStep, GenerationStepStatus } from '../types'

interface GenerationProgressProps {
  steps: GenerationStep[]
  projectName: string
  onCancel?: () => void
}

function StepIcon({ status }: { status: GenerationStepStatus }) {
  if (status === 'completed')
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
        <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
      </div>
    )
  if (status === 'in_progress')
    return <Loader2 size={18} className="animate-spin text-blue-500" />
  if (status === 'failed')
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
        <Circle size={8} className="fill-red-500 text-red-500" />
      </div>
    )
  return <Circle size={18} className="text-zinc-200 dark:text-zinc-700" />
}

function formatDuration(ms: number): string {
  return (ms / 1000).toFixed(1) + 's'
}

export function GenerationProgress({ steps, projectName, onCancel }: GenerationProgressProps) {
  const completedSteps = steps.filter((s) => s.status === 'completed').length
  const hasFailed = steps.some((s) => s.status === 'failed')
  const isActive = steps.some((s) => s.status === 'in_progress')
  const totalElapsed = steps
    .filter((s) => s.status === 'completed')
    .reduce((sum, s) => sum + s.durationMs, 0)

  return (
    <div>
      <PageHeader
        title="First-Pass Estimation"
        description={projectName}
        status={
          <Badge
            variant="outline"
            className={`text-[11px] font-medium ${
              hasFailed
                ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400'
                : 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400'
            }`}
          >
            {hasFailed ? 'Failed' : 'Generating'}
          </Badge>
        }
      />

      <div className="mx-auto max-w-[520px] px-6 py-16">
        {/* Icon */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
            <Zap size={20} className="text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
              Generating estimate
            </p>
            <p className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-400 dark:text-zinc-500">
              {isActive
                ? `${completedSteps}/${steps.length} steps`
                : hasFailed
                  ? 'Generation failed'
                  : `Done in ${formatDuration(totalElapsed)}`}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                hasFailed ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${(completedSteps / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-1">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                step.status === 'in_progress'
                  ? 'bg-blue-50/50 dark:bg-blue-950/20'
                  : step.status === 'failed'
                    ? 'bg-red-50/50 dark:bg-red-950/20'
                    : ''
              }`}
            >
              <div className="shrink-0">
                <StepIcon status={step.status} />
              </div>
              <p
                className={`flex-1 text-[13px] font-medium ${
                  step.status === 'completed'
                    ? 'text-zinc-500 dark:text-zinc-400'
                    : step.status === 'in_progress'
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : step.status === 'failed'
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-zinc-300 dark:text-zinc-600'
                }`}
              >
                {step.label}
              </p>
              {step.status === 'completed' && (
                <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
                  {formatDuration(step.durationMs)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Cancel action */}
        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-4 py-2 text-[13px] font-medium text-zinc-500 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={14} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

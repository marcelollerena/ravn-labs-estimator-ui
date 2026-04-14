import { FileText, Check, Loader2, Circle, XCircle, RotateCcw, ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/shell/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import type { SourceFormat } from '@/../product/sections/prd-ingestion/types'

type StepStatus = 'pending' | 'active' | 'complete' | 'error'

interface ParsingStep {
  label: string
  description: string
  status: StepStatus
}

interface ParsingViewProps {
  fileName?: string
  sourceFormat?: SourceFormat
  steps: ParsingStep[]
  error?: string
  onCancel?: () => void
  onRetry?: () => void
}

const FORMAT_LABELS: Record<SourceFormat, string> = {
  pdf: 'PDF',
  docx: 'DOCX',
  markdown: 'Markdown',
  text: 'Text',
  form: 'Form',
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === 'complete')
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
        <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
      </div>
    )
  if (status === 'active')
    return <Loader2 size={18} className="animate-spin text-blue-500" />
  if (status === 'error')
    return <XCircle size={18} className="text-red-500 dark:text-red-400" />
  return <Circle size={18} className="text-zinc-200 dark:text-zinc-700" />
}

export function ParsingView({
  fileName,
  sourceFormat,
  steps,
  error,
  onCancel,
  onRetry,
}: ParsingViewProps) {
  const completedSteps = steps.filter((s) => s.status === 'complete').length
  const hasError = steps.some((s) => s.status === 'error') || !!error

  return (
    <div>
      <PageHeader
        title="PRD Ingestion"
        description={fileName || 'Processing document...'}
        status={
          <Badge
            variant="outline"
            className={`text-[11px] font-medium ${
              hasError
                ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400'
                : 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400'
            }`}
          >
            {hasError ? 'Error' : 'Parsing'}
          </Badge>
        }
      />

      <div className="mx-auto max-w-[520px] px-6 py-16">
        {/* Source indicator */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <FileText size={20} className="text-zinc-400 dark:text-zinc-500" />
          </div>
          <div>
            {fileName && (
              <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                {fileName}
              </p>
            )}
            {sourceFormat && (
              <p className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-400 dark:text-zinc-500">
                {FORMAT_LABELS[sourceFormat]}
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                hasError ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${(completedSteps / steps.length) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-center font-['JetBrains_Mono',monospace] text-[11px] text-zinc-400 dark:text-zinc-500">
            {completedSteps}/{steps.length} steps
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-1">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-lg px-4 py-3 ${
                step.status === 'active'
                  ? 'bg-blue-50/50 dark:bg-blue-950/20'
                  : step.status === 'error'
                    ? 'bg-red-50/50 dark:bg-red-950/20'
                    : ''
              }`}
            >
              <div className="mt-0.5 shrink-0">
                <StepIcon status={step.status} />
              </div>
              <div>
                <p
                  className={`text-[13px] font-medium ${
                    step.status === 'complete'
                      ? 'text-zinc-500 dark:text-zinc-400'
                      : step.status === 'active'
                        ? 'text-zinc-900 dark:text-zinc-100'
                        : step.status === 'error'
                          ? 'text-red-700 dark:text-red-300'
                          : 'text-zinc-300 dark:text-zinc-600'
                  }`}
                >
                  {step.label}
                </p>
                <p
                  className={`text-[12px] ${
                    step.status === 'active'
                      ? 'text-zinc-500 dark:text-zinc-400'
                      : step.status === 'error'
                        ? 'text-red-500 dark:text-red-400'
                        : 'text-zinc-300 dark:text-zinc-600'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-950/30">
            <p className="text-[13px] text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-3">
          {hasError ? (
            <>
              <button
                onClick={onCancel}
                className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-4 py-2 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 rounded-md bg-blue-500 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <RotateCcw size={14} />
                Retry
              </button>
            </>
          ) : (
            <button
              onClick={onCancel}
              className="rounded-md border border-zinc-200 px-4 py-2 text-[13px] font-medium text-zinc-500 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

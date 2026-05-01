import { Target } from 'lucide-react'

interface OverallConfidencePanelProps {
  confidence: number
  reasoning: string
  originalConfidence: number
  onSetConfidence?: (confidence: number, reasoning: string) => void
}

function confidenceColor(c: number): string {
  if (c >= 0.8) return 'text-emerald-600 dark:text-emerald-400'
  if (c >= 0.6) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function confidenceBg(c: number): string {
  if (c >= 0.8) return 'bg-emerald-500'
  if (c >= 0.6) return 'bg-amber-500'
  return 'bg-red-500'
}

export function OverallConfidencePanel({ confidence, reasoning, originalConfidence }: OverallConfidencePanelProps) {
  const delta = Math.round((confidence - originalConfidence) * 100)

  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <Target size={13} className="text-zinc-400 dark:text-zinc-500" />
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Overall Confidence
        </h2>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-baseline gap-2">
            <span className={`font-['JetBrains_Mono',monospace] text-[28px] font-semibold ${confidenceColor(confidence)}`}>
              {Math.round(confidence * 100)}%
            </span>
            {delta !== 0 && (
              <span className={`font-['JetBrains_Mono',monospace] text-[13px] font-medium ${
                delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {delta > 0 ? '+' : ''}{delta}pp from AI
              </span>
            )}
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mb-4 h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className={`h-2 rounded-full transition-all ${confidenceBg(confidence)}`}
            style={{ width: `${Math.round(confidence * 100)}%` }}
          />
        </div>

        {/* Reasoning */}
        {reasoning && (
          <div className="rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-800/50">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Reviewer Reasoning
            </p>
            <p className="text-[12px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              {reasoning}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

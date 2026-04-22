import { Calendar, Timer, Gauge, Target } from 'lucide-react'
import type { HourRange, Complexity, EstimateStatus } from '../types'

interface SummaryHeaderProps {
  totalHours: HourRange
  estimatedDurationWeeks: number
  overallComplexity: Complexity
  overallConfidence: number
  status: EstimateStatus
  generationDurationMs: number
}

const COMPLEXITY_STYLES: Record<Complexity, string> = {
  low: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400',
  medium: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400',
  high: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400',
  very_high: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
}

const COMPLEXITY_LABELS: Record<Complexity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  very_high: 'Very High',
}

function confidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-emerald-600 dark:text-emerald-400'
  if (confidence >= 0.6) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function formatHours(n: number): string {
  return n.toLocaleString()
}

export function SummaryHeader({
  totalHours,
  estimatedDurationWeeks,
  overallComplexity,
  overallConfidence,
  generationDurationMs,
}: SummaryHeaderProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-stretch lg:divide-x lg:divide-zinc-100 lg:dark:divide-zinc-800">
        {/* Total Hours */}
        <div className="col-span-2 border-b border-zinc-100 px-5 py-4 sm:col-span-3 lg:flex-1 lg:border-b-0 dark:border-zinc-800">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Total Hours
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-['JetBrains_Mono',monospace] text-[12px] text-zinc-400 dark:text-zinc-500">
              {formatHours(totalHours.low)}
            </span>
            <span className="font-['JetBrains_Mono',monospace] text-[20px] font-semibold text-zinc-900 dark:text-zinc-100">
              {formatHours(totalHours.likely)}
            </span>
            <span className="font-['JetBrains_Mono',monospace] text-[12px] text-zinc-400 dark:text-zinc-500">
              {formatHours(totalHours.high)}
            </span>
            <span className="text-[11px] text-zinc-300 dark:text-zinc-600">h</span>
          </div>
          <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            low / likely / high
          </p>
        </div>

        {/* Duration */}
        <div className="border-b border-zinc-100 px-5 py-4 lg:border-b-0 dark:border-zinc-800">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Duration
          </p>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-zinc-400 dark:text-zinc-500" />
            <span className="font-['JetBrains_Mono',monospace] text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
              {estimatedDurationWeeks}
            </span>
            <span className="text-[12px] text-zinc-500 dark:text-zinc-400">weeks</span>
          </div>
        </div>

        {/* Complexity */}
        <div className="border-b border-zinc-100 px-5 py-4 lg:border-b-0 dark:border-zinc-800">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Complexity
          </p>
          <div className="flex items-center gap-1.5">
            <Gauge size={13} className="text-zinc-400 dark:text-zinc-500" />
            <span
              className={`rounded-md border px-2.5 py-0.5 text-[11px] font-medium ${COMPLEXITY_STYLES[overallComplexity]}`}
            >
              {COMPLEXITY_LABELS[overallComplexity]}
            </span>
          </div>
        </div>

        {/* Confidence */}
        <div className="px-5 py-4">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Confidence
          </p>
          <div className="flex items-center gap-1.5">
            <Target size={13} className="text-zinc-400 dark:text-zinc-500" />
            <span
              className={`font-['JetBrains_Mono',monospace] text-[15px] font-semibold ${confidenceColor(overallConfidence)}`}
            >
              {Math.round(overallConfidence * 100)}%
            </span>
          </div>
        </div>

        {/* Generation Time */}
        <div className="border-t border-zinc-100 px-5 py-4 sm:border-t-0 lg:border-t-0 dark:border-zinc-800">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Gen Time
          </p>
          <div className="flex items-center gap-1.5">
            <Timer size={13} className="text-zinc-400 dark:text-zinc-500" />
            <span className="font-['JetBrains_Mono',monospace] text-[13px] text-zinc-500 dark:text-zinc-400">
              {(generationDurationMs / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

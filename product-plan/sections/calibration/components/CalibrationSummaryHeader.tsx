import { Calendar, Gauge, Target, Users } from 'lucide-react'
import type { CalibrationSummary, Complexity } from '../types'

interface CalibrationSummaryHeaderProps {
  summary: CalibrationSummary
  onUpdateSummary?: (updates: Partial<CalibrationSummary>) => void
}

const COMPLEXITY_OPTIONS: { value: Complexity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'very_high', label: 'Very High' },
]

const COMPLEXITY_STYLES: Record<Complexity, string> = {
  low: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400',
  medium: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400',
  high: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400',
  very_high: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
}

function confidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-emerald-600 dark:text-emerald-400'
  if (confidence >= 0.6) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function formatDelta(actual: number | null, estimated: number): { text: string; color: string } | null {
  if (actual === null) return null
  const delta = actual - estimated
  const pct = Math.round((delta / estimated) * 100)
  if (delta === 0) return { text: '0h (0%)', color: 'text-zinc-400 dark:text-zinc-500' }
  const sign = delta > 0 ? '+' : ''
  const color = delta > 0
    ? 'text-amber-600 dark:text-amber-400'
    : 'text-emerald-600 dark:text-emerald-400'
  return { text: `${sign}${delta}h (${sign}${pct}%)`, color }
}

export function CalibrationSummaryHeader({ summary, onUpdateSummary }: CalibrationSummaryHeaderProps) {
  const hoursDelta = formatDelta(summary.actualTotalHours, summary.estimatedTotalHours.likely)

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-stretch lg:divide-x lg:divide-zinc-100 lg:dark:divide-zinc-800">
        {/* Actual Total Hours */}
        <div className="col-span-2 border-b border-zinc-100 px-5 py-4 sm:col-span-3 lg:flex-1 lg:border-b-0 dark:border-zinc-800">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Actual Hours
          </p>
          <div className="flex items-baseline gap-2">
            <input
              type="number"
              min={0}
              value={summary.actualTotalHours ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : Number(e.target.value)
                onUpdateSummary?.({ actualTotalHours: val })
              }}
              placeholder="—"
              className="w-24 border-b border-zinc-200 bg-transparent font-['JetBrains_Mono',monospace] text-[20px] font-semibold text-zinc-900 outline-none placeholder:text-zinc-300 focus:border-blue-400 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-blue-500"
            />
            <span className="text-[11px] text-zinc-300 dark:text-zinc-600">h</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-400 dark:text-zinc-500">
              Est: {summary.estimatedTotalHours.likely.toLocaleString()}h
            </span>
            {hoursDelta && (
              <span className={`font-['JetBrains_Mono',monospace] text-[11px] font-medium ${hoursDelta.color}`}>
                {hoursDelta.text}
              </span>
            )}
          </div>
        </div>

        {/* Actual Duration */}
        <div className="border-b border-zinc-100 px-5 py-4 lg:border-b-0 dark:border-zinc-800">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Duration
          </p>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="shrink-0 text-zinc-400 dark:text-zinc-500" />
            <input
              type="number"
              min={1}
              value={summary.actualDurationWeeks ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : Number(e.target.value)
                onUpdateSummary?.({ actualDurationWeeks: val })
              }}
              placeholder="—"
              className="w-10 border-b border-zinc-200 bg-transparent text-center font-['JetBrains_Mono',monospace] text-[15px] font-semibold text-zinc-900 outline-none placeholder:text-zinc-300 focus:border-blue-400 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-blue-500"
            />
            <span className="text-[12px] text-zinc-500 dark:text-zinc-400">wk</span>
          </div>
          <p className="mt-1 font-['JetBrains_Mono',monospace] text-[11px] text-zinc-400 dark:text-zinc-500">
            Est: {summary.estimatedDurationWeeks}wk
          </p>
        </div>

        {/* Actual Team Size */}
        <div className="border-b border-zinc-100 px-5 py-4 lg:border-b-0 dark:border-zinc-800">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Team Size
          </p>
          <div className="flex items-center gap-1.5">
            <Users size={13} className="shrink-0 text-zinc-400 dark:text-zinc-500" />
            <input
              type="number"
              min={1}
              value={summary.actualTeamSize ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : Number(e.target.value)
                onUpdateSummary?.({ actualTeamSize: val })
              }}
              placeholder="—"
              className="w-10 border-b border-zinc-200 bg-transparent text-center font-['JetBrains_Mono',monospace] text-[15px] font-semibold text-zinc-900 outline-none placeholder:text-zinc-300 focus:border-blue-400 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-blue-500"
            />
            <span className="text-[12px] text-zinc-500 dark:text-zinc-400">people</span>
          </div>
          <p className="mt-1 font-['JetBrains_Mono',monospace] text-[11px] text-zinc-400 dark:text-zinc-500">
            Est: {summary.estimatedHeadcount}
          </p>
        </div>

        {/* Actual Complexity */}
        <div className="border-b border-zinc-100 px-5 py-4 sm:border-b-0 lg:border-b-0 dark:border-zinc-800">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Complexity
          </p>
          <div className="flex items-center gap-1.5">
            <Gauge size={13} className="shrink-0 text-zinc-400 dark:text-zinc-500" />
            <select
              value={summary.actualComplexity}
              onChange={(e) => onUpdateSummary?.({ actualComplexity: e.target.value as Complexity })}
              className={`cursor-pointer rounded-md border px-2.5 py-0.5 text-[11px] font-medium outline-none ${COMPLEXITY_STYLES[summary.actualComplexity]}`}
            >
              {COMPLEXITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {summary.actualComplexity !== summary.estimatedComplexity && (
            <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
              Est: <span className="capitalize">{summary.estimatedComplexity.replace('_', ' ')}</span>
            </p>
          )}
        </div>

        {/* Original Confidence (read-only) */}
        <div className="px-5 py-4">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Est. Confidence
          </p>
          <div className="flex items-center gap-1.5">
            <Target size={13} className="text-zinc-400 dark:text-zinc-500" />
            <span
              className={`font-['JetBrains_Mono',monospace] text-[15px] font-semibold ${confidenceColor(summary.estimatedConfidence)}`}
            >
              {Math.round(summary.estimatedConfidence * 100)}%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">Original estimate</p>
        </div>
      </div>
    </div>
  )
}

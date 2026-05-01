import { TrendingUp, TrendingDown, Minus, Clock, Users, Target, GitCompare } from 'lucide-react'
import type { ImpactSummary } from '../types'

interface ReviewImpactBarProps {
  impact: ImpactSummary
}

function formatDelta(value: number, suffix = ''): string {
  if (value === 0) return `0${suffix}`
  const sign = value > 0 ? '+' : ''
  return `${sign}${value}${suffix}`
}

function deltaColor(value: number): string {
  if (value === 0) return 'text-zinc-500 dark:text-zinc-400'
  if (value > 0) return 'text-amber-600 dark:text-amber-400'
  return 'text-emerald-600 dark:text-emerald-400'
}

function DeltaIcon({ value }: { value: number }) {
  if (value > 0) return <TrendingUp size={12} />
  if (value < 0) return <TrendingDown size={12} />
  return <Minus size={12} />
}

export function ReviewImpactBar({ impact }: ReviewImpactBarProps) {
  const confidenceDelta = Math.round((impact.adjustedConfidence - impact.originalConfidence) * 100)
  const durationDelta = impact.adjustedDurationWeeks - impact.originalDurationWeeks
  const headcountDelta = impact.adjustedHeadcount - impact.originalHeadcount

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-stretch lg:divide-x lg:divide-zinc-100 lg:dark:divide-zinc-800">
        {/* Hours Delta */}
        <div className="col-span-2 border-b border-zinc-100 px-5 py-4 sm:col-span-3 lg:flex-1 lg:border-b-0 dark:border-zinc-800">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Hours Impact
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-['JetBrains_Mono',monospace] text-[12px] text-zinc-400 dark:text-zinc-500">
              {impact.originalTotalHours.likely.toLocaleString()}
            </span>
            <span className="text-zinc-300 dark:text-zinc-600">→</span>
            <span className="font-['JetBrains_Mono',monospace] text-[20px] font-semibold text-zinc-900 dark:text-zinc-100">
              {impact.adjustedTotalHours.likely.toLocaleString()}
            </span>
            <span className={`flex items-center gap-0.5 font-['JetBrains_Mono',monospace] text-[12px] font-medium ${deltaColor(impact.hoursDeltaLikely)}`}>
              <DeltaIcon value={impact.hoursDeltaLikely} />
              {formatDelta(impact.hoursDeltaLikely, 'h')}
              <span className="text-[10px] opacity-60">({formatDelta(impact.hoursDeltaPercent, '%')})</span>
            </span>
          </div>
        </div>

        {/* Duration */}
        <div className="border-b border-zinc-100 px-5 py-4 lg:border-b-0 dark:border-zinc-800">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Duration
          </p>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-zinc-400 dark:text-zinc-500" />
            <span className="font-['JetBrains_Mono',monospace] text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
              {impact.adjustedDurationWeeks}
            </span>
            <span className="text-[12px] text-zinc-500 dark:text-zinc-400">wk</span>
            {durationDelta !== 0 && (
              <span className={`font-['JetBrains_Mono',monospace] text-[11px] font-medium ${deltaColor(durationDelta)}`}>
                {formatDelta(durationDelta)}
              </span>
            )}
          </div>
        </div>

        {/* Team */}
        <div className="border-b border-zinc-100 px-5 py-4 lg:border-b-0 dark:border-zinc-800">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Team
          </p>
          <div className="flex items-center gap-1.5">
            <Users size={13} className="text-zinc-400 dark:text-zinc-500" />
            <span className="font-['JetBrains_Mono',monospace] text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
              {impact.adjustedHeadcount}
            </span>
            {headcountDelta !== 0 && (
              <span className={`font-['JetBrains_Mono',monospace] text-[11px] font-medium ${deltaColor(headcountDelta)}`}>
                {formatDelta(headcountDelta)}
              </span>
            )}
          </div>
        </div>

        {/* Confidence */}
        <div className="px-5 py-4">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Confidence
          </p>
          <div className="flex items-center gap-1.5">
            <Target size={13} className="text-zinc-400 dark:text-zinc-500" />
            <span className={`font-['JetBrains_Mono',monospace] text-[15px] font-semibold ${
              impact.adjustedConfidence >= 0.8 ? 'text-emerald-600 dark:text-emerald-400'
              : impact.adjustedConfidence >= 0.6 ? 'text-amber-600 dark:text-amber-400'
              : 'text-red-600 dark:text-red-400'
            }`}>
              {Math.round(impact.adjustedConfidence * 100)}%
            </span>
            {confidenceDelta !== 0 && (
              <span className={`font-['JetBrains_Mono',monospace] text-[11px] font-medium ${confidenceDelta > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatDelta(confidenceDelta, 'pp')}
              </span>
            )}
          </div>
        </div>

        {/* Review Progress */}
        <div className="border-t border-zinc-100 px-5 py-4 sm:border-t-0 lg:border-t-0 dark:border-zinc-800">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Progress
          </p>
          <div className="flex items-center gap-1.5">
            <GitCompare size={13} className="text-zinc-400 dark:text-zinc-500" />
            <span className="font-['JetBrains_Mono',monospace] text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
              {impact.featuresReviewed}/{impact.totalFeatures}
            </span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">reviewed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

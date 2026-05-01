import { BarChart3 } from 'lucide-react'
import type { TechEffortEntry } from '@/../product/sections/calibration/types'

interface EffortBreakdownPanelProps {
  techEffortBreakdown: TechEffortEntry[]
  effortBreakdownReasoning: string
  onUpdateTechEffort?: (id: string, percentage: number) => void
  onUpdateEffortReasoning?: (reasoning: string) => void
}

const BAR_COLORS = [
  'bg-blue-500 dark:bg-blue-400',
  'bg-violet-500 dark:bg-violet-400',
  'bg-amber-500 dark:bg-amber-400',
  'bg-emerald-500 dark:bg-emerald-400',
  'bg-rose-500 dark:bg-rose-400',
  'bg-cyan-500 dark:bg-cyan-400',
  'bg-orange-500 dark:bg-orange-400',
  'bg-teal-500 dark:bg-teal-400',
]

const BAR_BG_COLORS = [
  'bg-blue-100 dark:bg-blue-950',
  'bg-violet-100 dark:bg-violet-950',
  'bg-amber-100 dark:bg-amber-950',
  'bg-emerald-100 dark:bg-emerald-950',
  'bg-rose-100 dark:bg-rose-950',
  'bg-cyan-100 dark:bg-cyan-950',
  'bg-orange-100 dark:bg-orange-950',
  'bg-teal-100 dark:bg-teal-950',
]

export function EffortBreakdownPanel({
  techEffortBreakdown,
  effortBreakdownReasoning,
  onUpdateTechEffort,
  onUpdateEffortReasoning,
}: EffortBreakdownPanelProps) {
  const total = techEffortBreakdown.reduce((sum, t) => sum + t.percentage, 0)
  const isBalanced = total === 100
  const maxPct = Math.max(...techEffortBreakdown.map((t) => t.percentage), 1)

  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <BarChart3 size={13} className="text-zinc-400 dark:text-zinc-500" />
          <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Effort Breakdown
          </h2>
        </div>
        <span
          className={`font-['JetBrains_Mono',monospace] text-[11px] font-medium ${
            isBalanced
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}
        >
          {total}%
        </span>
      </div>

      {/* Tech categories */}
      <div className="space-y-3 px-4 py-3">
        {techEffortBreakdown.map((entry, i) => {
          const colorIndex = i % BAR_COLORS.length
          const barWidth = maxPct > 0 ? (entry.percentage / maxPct) * 100 : 0

          return (
            <div key={entry.id} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-[12px] font-medium text-zinc-700 dark:text-zinc-300">
                {entry.technology}
              </span>
              <div className="flex items-center gap-2 flex-1">
                <div className={`h-2.5 flex-1 overflow-hidden rounded-full ${BAR_BG_COLORS[colorIndex]}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${BAR_COLORS[colorIndex]}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <div className="flex w-16 shrink-0 items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={entry.percentage}
                    onChange={(e) => {
                      const val = Math.max(0, Math.min(100, Number(e.target.value) || 0))
                      onUpdateTechEffort?.(entry.id, val)
                    }}
                    className="w-10 border-b border-zinc-200 bg-transparent text-right font-['JetBrains_Mono',monospace] text-[12px] font-medium text-zinc-900 outline-none focus:border-blue-400 dark:border-zinc-700 dark:text-zinc-100 dark:focus:border-blue-500"
                  />
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total validation */}
      {!isBalanced && (
        <div className="mx-4 mb-3 rounded-md border border-amber-200 bg-amber-50/50 px-3 py-2 dark:border-amber-800/50 dark:bg-amber-950/30">
          <p className="text-[11px] text-amber-700 dark:text-amber-400">
            Total is <span className="font-['JetBrains_Mono',monospace] font-medium">{total}%</span> — should sum to 100%.
          </p>
        </div>
      )}

      {/* Reasoning */}
      <div className="border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <label className="mb-1.5 block text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          Explain the effort distribution across technologies
        </label>
        <textarea
          value={effortBreakdownReasoning}
          onChange={(e) => onUpdateEffortReasoning?.(e.target.value)}
          rows={3}
          placeholder="Why did effort distribute this way? Were there surprises in which technologies consumed more time?"
          className="w-full resize-y rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-[12px] leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-600 dark:focus:ring-blue-600"
        />
      </div>
    </section>
  )
}

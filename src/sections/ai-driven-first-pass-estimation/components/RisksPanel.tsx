import { ShieldAlert } from 'lucide-react'
import type { EstimateRisk, Likelihood, Impact, RiskCategory } from '@/../product/sections/ai-driven-first-pass-estimation/types'

interface RisksPanelProps {
  risks: EstimateRisk[]
}

const SEVERITY_STYLES: Record<Likelihood | Impact, string> = {
  low: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400',
  medium: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400',
  high: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
}

const CATEGORY_LABELS: Record<RiskCategory, string> = {
  scope: 'Scope',
  technical: 'Technical',
  dependency: 'Dependency',
  team: 'Team',
  timeline: 'Timeline',
}

export function RisksPanel({ risks }: RisksPanelProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <ShieldAlert size={13} className="text-zinc-400 dark:text-zinc-500" />
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Risks
        </h2>
        <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
          {risks.length}
        </span>
      </div>

      <div>
        {risks.map((risk) => {
          const isCritical = risk.likelihood === 'high' && risk.impact === 'high'
          return (
            <div
              key={risk.id}
              className={`border-b border-zinc-50 px-4 py-3 last:border-b-0 dark:border-zinc-800/50 ${
                isCritical ? 'border-l-2 border-l-red-400 dark:border-l-red-600' : ''
              }`}
            >
              {/* Top row: category + title + badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {CATEGORY_LABELS[risk.category]}
                </span>
                <span className="flex-1 text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                  {risk.title}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-md border px-2.5 py-0.5 text-[10px] font-medium ${SEVERITY_STYLES[risk.likelihood]}`}
                  >
                    L: {risk.likelihood}
                  </span>
                  <span
                    className={`rounded-md border px-2.5 py-0.5 text-[10px] font-medium ${SEVERITY_STYLES[risk.impact]}`}
                  >
                    I: {risk.impact}
                  </span>
                </div>
              </div>
              {/* Mitigation */}
              <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {risk.mitigation}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

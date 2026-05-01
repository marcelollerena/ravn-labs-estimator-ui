import { ShieldAlert, Check, Pencil, Plus, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ReviewRisk, Likelihood, Impact, RiskCategory, ReviewItemStatus } from '../types'

interface RiskReviewPanelProps {
  risks: ReviewRisk[]
  onAcceptRisk?: (riskId: string) => void
  onAdjustRisk?: (riskId: string) => void
  onAddRisk?: () => void
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

const STATUS_INDICATOR: Record<ReviewItemStatus, { color: string; label: string }> = {
  pending: { color: 'bg-zinc-300 dark:bg-zinc-600', label: 'Pending' },
  accepted: { color: 'bg-emerald-400 dark:bg-emerald-500', label: 'Accepted' },
  adjusted: { color: 'bg-amber-400 dark:bg-amber-500', label: 'Adjusted' },
}

export function RiskReviewPanel({ risks, onAcceptRisk, onAdjustRisk, onAddRisk }: RiskReviewPanelProps) {
  const reviewedCount = risks.filter(r => r.adjustment.status !== 'pending').length

  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <ShieldAlert size={13} className="text-zinc-400 dark:text-zinc-500" />
          <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Risk Review
          </h2>
          <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
            {reviewedCount}/{risks.length}
          </span>
        </div>
        <button
          onClick={onAddRisk}
          className="flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Plus size={12} />
          Add Risk
        </button>
      </div>

      <div>
        {risks.map((risk) => {
          const isCritical = risk.likelihood === 'high' && risk.impact === 'high'
          const statusInfo = STATUS_INDICATOR[risk.adjustment.status]
          const likelihoodChanged = risk.likelihood !== risk.originalLikelihood
          const impactChanged = risk.impact !== risk.originalImpact

          return (
            <div
              key={risk.id}
              className={`border-b border-zinc-50 px-4 py-3 last:border-b-0 dark:border-zinc-800/50 ${
                isCritical ? 'border-l-2 border-l-red-400 dark:border-l-red-600' : ''
              }`}
            >
              {/* Top row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${statusInfo.color}`} title={statusInfo.label} />
                <span className="rounded bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {CATEGORY_LABELS[risk.category]}
                </span>
                {risk.isNew && (
                  <Badge variant="outline" className="border-blue-200 bg-blue-50/50 text-[10px] text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    <Plus size={9} className="mr-0.5" />New
                  </Badge>
                )}
                {!risk.isNew && risk.adjustment.status !== 'adjusted' && (
                  <Badge variant="outline" className="border-blue-200 bg-blue-50/50 font-['JetBrains_Mono',monospace] text-[10px] text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    <Sparkles size={9} className="mr-0.5" />AI
                  </Badge>
                )}
                <span className="flex-1 text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                  {risk.title}
                </span>
                <div className="flex items-center gap-1.5">
                  {likelihoodChanged ? (
                    <span className="flex items-center gap-0.5">
                      <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-medium line-through opacity-50 ${SEVERITY_STYLES[risk.originalLikelihood]}`}>L:{risk.originalLikelihood}</span>
                      <span className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${SEVERITY_STYLES[risk.likelihood]}`}>L:{risk.likelihood}</span>
                    </span>
                  ) : (
                    <span className={`rounded-md border px-2.5 py-0.5 text-[10px] font-medium ${SEVERITY_STYLES[risk.likelihood]}`}>L: {risk.likelihood}</span>
                  )}
                  {impactChanged ? (
                    <span className="flex items-center gap-0.5">
                      <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-medium line-through opacity-50 ${SEVERITY_STYLES[risk.originalImpact]}`}>I:{risk.originalImpact}</span>
                      <span className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${SEVERITY_STYLES[risk.impact]}`}>I:{risk.impact}</span>
                    </span>
                  ) : (
                    <span className={`rounded-md border px-2.5 py-0.5 text-[10px] font-medium ${SEVERITY_STYLES[risk.impact]}`}>I: {risk.impact}</span>
                  )}
                </div>
                {risk.adjustment.status === 'pending' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onAcceptRisk?.(risk.id)}
                      className="rounded p-1 text-zinc-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950 dark:hover:text-emerald-400"
                      title="Accept"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      onClick={() => onAdjustRisk?.(risk.id)}
                      className="rounded p-1 text-zinc-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950 dark:hover:text-amber-400"
                      title="Adjust"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Mitigation */}
              <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {risk.mitigation}
              </p>

              {/* Adjustment reasoning */}
              {risk.adjustment.status === 'adjusted' && risk.adjustment.reasoning && (
                <div className="mt-2 rounded border border-amber-200/50 bg-amber-50/30 px-2.5 py-2 dark:border-amber-800/30 dark:bg-amber-950/20">
                  <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                    <span className="font-medium">Reasoning: </span>{risk.adjustment.reasoning}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

import { useState } from 'react'
import { ChevronRight, ChevronDown, Check, Pencil, Sparkles, ArrowUpDown } from 'lucide-react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import type { ReviewFeature, Complexity, ReviewItemStatus } from '@/../product/sections/human-review-and-adjustment/types'

interface FeatureReviewTableProps {
  features: ReviewFeature[]
  expandedFeatureIds: Set<string>
  onExpandFeature?: (featureId: string) => void
  onCollapseFeature?: (featureId: string) => void
  onAcceptFeature?: (featureId: string) => void
  onAdjustFeature?: (featureId: string) => void
}

type SortKey = 'name' | 'status' | 'likely' | 'delta'
type SortDirection = 'asc' | 'desc'

const STATUS_STYLES: Record<ReviewItemStatus, { bg: string; text: string; label: string }> = {
  pending: {
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-500 dark:text-zinc-400',
    label: 'Pending',
  },
  accepted: {
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'Accepted',
  },
  adjusted: {
    bg: 'bg-amber-50 dark:bg-amber-950',
    text: 'text-amber-700 dark:text-amber-400',
    label: 'Adjusted',
  },
}

const COMPLEXITY_STYLES: Record<Complexity, string> = {
  low: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400',
  medium: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400',
  high: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400',
  very_high: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
}

const COMPLEXITY_LABELS: Record<Complexity, string> = {
  low: 'Low',
  medium: 'Med',
  high: 'High',
  very_high: 'V.High',
}

function confidenceColor(c: number): string {
  if (c >= 0.8) return 'text-emerald-600 dark:text-emerald-400'
  if (c >= 0.6) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

const STATUS_ORDER: Record<ReviewItemStatus, number> = { pending: 0, accepted: 1, adjusted: 2 }

function sortFeatures(features: ReviewFeature[], key: SortKey, dir: SortDirection): ReviewFeature[] {
  return [...features].sort((a, b) => {
    let cmp = 0
    switch (key) {
      case 'name':
        cmp = a.name.localeCompare(b.name)
        break
      case 'status':
        cmp = STATUS_ORDER[a.adjustment.status] - STATUS_ORDER[b.adjustment.status]
        break
      case 'likely':
        cmp = a.adjustment.adjustedHours.likely - b.adjustment.adjustedHours.likely
        break
      case 'delta':
        cmp = (a.adjustment.adjustedHours.likely - a.adjustment.originalHours.likely) -
              (b.adjustment.adjustedHours.likely - b.adjustment.originalHours.likely)
        break
    }
    return dir === 'asc' ? cmp : -cmp
  })
}

export function FeatureReviewTable({
  features,
  expandedFeatureIds,
  onExpandFeature,
  onCollapseFeature,
  onAcceptFeature,
  onAdjustFeature,
}: FeatureReviewTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('status')
  const [sortDir, setSortDir] = useState<SortDirection>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = sortFeatures(features, sortKey, sortDir)

  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Feature Review
          </h2>
          <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
            {features.filter(f => f.adjustment.status !== 'pending').length}/{features.length} reviewed
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
        <div className="w-5 shrink-0" />
        <SortHeader label="Feature" sortKey="name" active={sortKey === 'name'} onSort={handleSort} className="flex-1" />
        <SortHeader label="Status" sortKey="status" active={sortKey === 'status'} onSort={handleSort} className="w-20 text-center" />
        <span className="hidden w-20 text-center text-[11px] font-medium uppercase tracking-wider text-zinc-400 sm:block dark:text-zinc-500">Complexity</span>
        <span className="hidden w-14 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400 sm:block dark:text-zinc-500">AI</span>
        <SortHeader label="Adj." sortKey="likely" active={sortKey === 'likely'} onSort={handleSort} className="w-14 text-right" />
        <SortHeader label="Δ" sortKey="delta" active={sortKey === 'delta'} onSort={handleSort} className="w-12 text-right" />
        <span className="w-14 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Conf</span>
        <div className="w-16 shrink-0" />
      </div>

      {/* Rows */}
      <div>
        {sorted.map((feature) => {
          const adj = feature.adjustment
          const isExpanded = expandedFeatureIds.has(feature.id)
          const hoursDelta = adj.adjustedHours.likely - adj.originalHours.likely
          const status = STATUS_STYLES[adj.status]
          const complexityChanged = adj.adjustedComplexity !== adj.originalComplexity

          return (
            <Collapsible
              key={feature.id}
              open={isExpanded}
              onOpenChange={(open) => {
                if (open) onExpandFeature?.(feature.id)
                else onCollapseFeature?.(feature.id)
              }}
            >
              <CollapsibleTrigger asChild>
                <button className={`flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-800/20 ${
                  adj.status === 'pending' ? 'border-l-2 border-l-zinc-300 dark:border-l-zinc-600' :
                  adj.status === 'adjusted' ? 'border-l-2 border-l-amber-400 dark:border-l-amber-600' :
                  'border-l-2 border-l-emerald-400 dark:border-l-emerald-600'
                }`}>
                  <div className="w-5 shrink-0">
                    {isExpanded
                      ? <ChevronDown size={14} className="text-zinc-400 dark:text-zinc-500" />
                      : <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-600" />
                    }
                  </div>
                  <span className="flex-1 truncate text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                    {feature.name}
                  </span>
                  <span className={`w-20 text-center rounded px-2.5 py-0.5 text-[10px] font-medium ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                  <span className={`hidden w-20 text-center sm:block`}>
                    {complexityChanged ? (
                      <span className="flex items-center justify-center gap-1">
                        <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium line-through opacity-50 ${COMPLEXITY_STYLES[adj.originalComplexity]}`}>
                          {COMPLEXITY_LABELS[adj.originalComplexity]}
                        </span>
                        <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${COMPLEXITY_STYLES[adj.adjustedComplexity]}`}>
                          {COMPLEXITY_LABELS[adj.adjustedComplexity]}
                        </span>
                      </span>
                    ) : (
                      <span className={`rounded-md border px-2.5 py-0.5 text-[11px] font-medium ${COMPLEXITY_STYLES[adj.adjustedComplexity]}`}>
                        {COMPLEXITY_LABELS[adj.adjustedComplexity]}
                      </span>
                    )}
                  </span>
                  <span className="hidden w-14 text-right font-['JetBrains_Mono',monospace] text-[12px] text-zinc-400 sm:block dark:text-zinc-500">
                    {adj.originalHours.likely}
                  </span>
                  <span className="w-14 text-right font-['JetBrains_Mono',monospace] text-[12px] font-medium text-zinc-900 dark:text-zinc-100">
                    {adj.adjustedHours.likely}
                  </span>
                  <span className={`w-12 text-right font-['JetBrains_Mono',monospace] text-[11px] font-medium ${
                    hoursDelta > 0 ? 'text-amber-600 dark:text-amber-400'
                    : hoursDelta < 0 ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-zinc-400 dark:text-zinc-500'
                  }`}>
                    {hoursDelta === 0 ? '—' : (hoursDelta > 0 ? `+${hoursDelta}` : hoursDelta)}
                  </span>
                  <span className={`w-14 text-right font-['JetBrains_Mono',monospace] text-[12px] font-medium ${confidenceColor(adj.adjustedConfidence)}`}>
                    {Math.round(adj.adjustedConfidence * 100)}%
                  </span>
                  <div className="flex w-16 shrink-0 items-center justify-end gap-1">
                    {adj.status === 'pending' && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); onAcceptFeature?.(feature.id) }}
                          className="rounded p-1 text-zinc-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950 dark:hover:text-emerald-400"
                          title="Accept as-is"
                        >
                          <Check size={13} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onAdjustFeature?.(feature.id) }}
                          className="rounded p-1 text-zinc-400 transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950 dark:hover:text-amber-400"
                          title="Adjust"
                        >
                          <Pencil size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="ml-11 mr-6 mb-3 mt-1 border-l-2 border-zinc-200 py-3 pl-4 dark:border-zinc-700">
                  <p className="mb-3 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {feature.description}
                  </p>

                  {/* AI vs Adjusted comparison */}
                  {adj.status === 'adjusted' && (
                    <div className="mb-3 rounded-md border border-amber-200 bg-amber-50/50 px-3 py-2.5 dark:border-amber-800/50 dark:bg-amber-950/30">
                      <div className="mb-2 flex items-center gap-1.5">
                        <Pencil size={11} className="text-amber-600 dark:text-amber-400" />
                        <span className="text-[11px] font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          Adjustment
                        </span>
                      </div>
                      <div className="mb-2 grid grid-cols-3 gap-3 text-[11px]">
                        <div>
                          <span className="text-zinc-400 dark:text-zinc-500">Hours: </span>
                          <span className="font-['JetBrains_Mono',monospace] text-zinc-400 line-through dark:text-zinc-500">{adj.originalHours.likely}</span>
                          <span className="mx-1 text-zinc-300 dark:text-zinc-600">→</span>
                          <span className="font-['JetBrains_Mono',monospace] font-medium text-zinc-900 dark:text-zinc-100">{adj.adjustedHours.likely}</span>
                        </div>
                        {complexityChanged && (
                          <div>
                            <span className="text-zinc-400 dark:text-zinc-500">Complexity: </span>
                            <span className="text-zinc-400 line-through dark:text-zinc-500">{COMPLEXITY_LABELS[adj.originalComplexity]}</span>
                            <span className="mx-1 text-zinc-300 dark:text-zinc-600">→</span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">{COMPLEXITY_LABELS[adj.adjustedComplexity]}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-zinc-400 dark:text-zinc-500">Conf: </span>
                          <span className="font-['JetBrains_Mono',monospace] text-zinc-400 line-through dark:text-zinc-500">{Math.round(adj.originalConfidence * 100)}%</span>
                          <span className="mx-1 text-zinc-300 dark:text-zinc-600">→</span>
                          <span className={`font-['JetBrains_Mono',monospace] font-medium ${confidenceColor(adj.adjustedConfidence)}`}>{Math.round(adj.adjustedConfidence * 100)}%</span>
                        </div>
                      </div>
                      {adj.reasoning && (
                        <p className="text-[12px] leading-relaxed text-amber-800 dark:text-amber-300">
                          <span className="font-medium">Reasoning: </span>{adj.reasoning}
                        </p>
                      )}
                    </div>
                  )}

                  {adj.status === 'accepted' && (
                    <div className="mb-3 flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50/50 px-3 py-2 dark:border-emerald-800/50 dark:bg-emerald-950/30">
                      <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[12px] font-medium text-emerald-700 dark:text-emerald-400">Accepted as-is — AI estimate confirmed</span>
                    </div>
                  )}

                  {/* Assumptions */}
                  {feature.assumptions.length > 0 && (
                    <div className="mb-3">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Assumptions</span>
                        <Badge variant="outline" className="border-blue-200 bg-blue-50/50 font-['JetBrains_Mono',monospace] text-[10px] text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          <Sparkles size={9} className="mr-0.5" />AI
                        </Badge>
                      </div>
                      <ul className="space-y-1">
                        {feature.assumptions.map((a, i) => (
                          <li key={i} className="flex items-start gap-2 text-[12px] text-zinc-600 dark:text-zinc-400">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300 dark:bg-blue-700" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dependencies */}
                  {feature.dependencies.length > 0 && (
                    <div>
                      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Dependencies</span>
                      <div className="flex flex-wrap gap-1.5">
                        {feature.dependencies.map((dep, i) => (
                          <span key={i} className="rounded bg-zinc-100 px-2.5 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    </section>
  )
}

function SortHeader({ label, sortKey, active, onSort, className }: {
  label: string; sortKey: SortKey; active: boolean; onSort: (key: SortKey) => void; className?: string
}) {
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`flex items-center gap-0.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${
        active ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-400'
      } ${className || ''}`}
    >
      {label}
      <ArrowUpDown size={10} className={active ? 'text-blue-500' : 'text-zinc-300 dark:text-zinc-600'} />
    </button>
  )
}

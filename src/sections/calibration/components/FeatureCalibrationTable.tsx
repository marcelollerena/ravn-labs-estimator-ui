import { useState } from 'react'
import { ChevronRight, ChevronDown, ArrowUpDown, Sparkles } from 'lucide-react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import type {
  FeatureCalibration,
  Complexity,
  FeatureCalibrationStatus,
} from '@/../product/sections/calibration/types'

interface FeatureCalibrationTableProps {
  features: FeatureCalibration[]
  expandedFeatureIds: Set<string>
  onExpandFeature?: (featureId: string) => void
  onCollapseFeature?: (featureId: string) => void
  onUpdateFeatureActuals?: (featureId: string, actualHours: number | null) => void
  onUpdateFeatureComplexity?: (featureId: string, complexity: Complexity) => void
  onUpdateFeatureFeedback?: (featureId: string, feedback: string) => void
}

type SortKey = 'name' | 'complexity' | 'estimated' | 'delta' | 'status'
type SortDirection = 'asc' | 'desc'

const COMPLEXITY_ORDER: Record<Complexity, number> = { low: 0, medium: 1, high: 2, very_high: 3 }

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

const COMPLEXITY_OPTIONS: { value: Complexity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Med' },
  { value: 'high', label: 'High' },
  { value: 'very_high', label: 'V.High' },
]

const STATUS_STYLES: Record<FeatureCalibrationStatus, { bg: string; text: string; label: string }> = {
  pending: {
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-500 dark:text-zinc-400',
    label: 'Pending',
  },
  calibrated: {
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'Calibrated',
  },
}

const STATUS_ORDER: Record<FeatureCalibrationStatus, number> = { pending: 0, calibrated: 1 }

function getDelta(feature: FeatureCalibration): number | null {
  if (feature.actualHours === null) return null
  return feature.actualHours - feature.estimatedHours.likely
}

function deltaColor(delta: number | null, estimated: number): string {
  if (delta === null) return 'text-zinc-300 dark:text-zinc-600'
  const pct = Math.abs(delta / estimated) * 100
  if (pct <= 5) return 'text-zinc-400 dark:text-zinc-500'
  if (delta > 0) return 'text-amber-600 dark:text-amber-400'
  return 'text-emerald-600 dark:text-emerald-400'
}

function formatDelta(delta: number | null): string {
  if (delta === null) return '—'
  if (delta === 0) return '0'
  return delta > 0 ? `+${delta}` : `${delta}`
}

function sortFeatures(
  features: FeatureCalibration[],
  key: SortKey,
  dir: SortDirection,
): FeatureCalibration[] {
  return [...features].sort((a, b) => {
    let cmp = 0
    switch (key) {
      case 'name':
        cmp = a.featureName.localeCompare(b.featureName)
        break
      case 'complexity':
        cmp = COMPLEXITY_ORDER[a.actualComplexity] - COMPLEXITY_ORDER[b.actualComplexity]
        break
      case 'estimated':
        cmp = a.estimatedHours.likely - b.estimatedHours.likely
        break
      case 'delta': {
        const da = getDelta(a) ?? Infinity
        const db = getDelta(b) ?? Infinity
        cmp = da - db
        break
      }
      case 'status':
        cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
        break
    }
    return dir === 'asc' ? cmp : -cmp
  })
}

export function FeatureCalibrationTable({
  features,
  expandedFeatureIds,
  onExpandFeature,
  onCollapseFeature,
  onUpdateFeatureActuals,
  onUpdateFeatureComplexity,
  onUpdateFeatureFeedback,
}: FeatureCalibrationTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('status')
  const [sortDir, setSortDir] = useState<SortDirection>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = sortFeatures(features, sortKey, sortDir)
  const calibratedCount = features.filter((f) => f.status === 'calibrated').length

  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Feature Calibration
          </h2>
          <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
            {features.length}
          </span>
        </div>
        <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-400 dark:text-zinc-500">
          {calibratedCount}/{features.length} calibrated
        </span>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-4 border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
        <div className="w-5 shrink-0" />
        <ColumnHeader
          label="Feature"
          sortKey="name"
          active={sortKey === 'name'}
          onSort={handleSort}
          className="flex-1"
        />
        <span className="hidden w-24 text-center text-[11px] font-medium uppercase tracking-wider text-zinc-400 sm:block dark:text-zinc-500">
          Complexity
        </span>
        <ColumnHeader
          label="Est."
          sortKey="estimated"
          active={sortKey === 'estimated'}
          onSort={handleSort}
          className="w-16 text-right"
        />
        <span className="w-18 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Actual
        </span>
        <ColumnHeader
          label="Δ"
          sortKey="delta"
          active={sortKey === 'delta'}
          onSort={handleSort}
          className="w-14 text-right"
        />
        <ColumnHeader
          label="Status"
          sortKey="status"
          active={sortKey === 'status'}
          onSort={handleSort}
          className="hidden w-24 text-center sm:flex sm:justify-center"
        />
      </div>

      {/* Rows */}
      <div>
        {sorted.map((feature) => {
          const isExpanded = expandedFeatureIds.has(feature.featureId)
          const delta = getDelta(feature)
          const status = STATUS_STYLES[feature.status]
          const complexityChanged = feature.actualComplexity !== feature.estimatedComplexity

          return (
            <Collapsible
              key={feature.featureId}
              open={isExpanded}
              onOpenChange={(open) => {
                if (open) onExpandFeature?.(feature.featureId)
                else onCollapseFeature?.(feature.featureId)
              }}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={`flex w-full items-center gap-4 px-4 py-2.5 text-left transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-800/20 ${
                    feature.status === 'calibrated'
                      ? 'border-l-2 border-l-emerald-400 dark:border-l-emerald-600'
                      : 'border-l-2 border-l-zinc-300 dark:border-l-zinc-600'
                  }`}
                >
                  <div className="w-5 shrink-0">
                    {isExpanded ? (
                      <ChevronDown size={14} className="text-zinc-400 dark:text-zinc-500" />
                    ) : (
                      <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-600" />
                    )}
                  </div>
                  <span className="flex-1 truncate text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                    {feature.featureName}
                  </span>
                  <span className="hidden w-24 text-center sm:block">
                    {complexityChanged ? (
                      <span className="flex items-center justify-center gap-1">
                        <span
                          className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium line-through opacity-50 ${COMPLEXITY_STYLES[feature.estimatedComplexity]}`}
                        >
                          {COMPLEXITY_LABELS[feature.estimatedComplexity]}
                        </span>
                        <span
                          className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${COMPLEXITY_STYLES[feature.actualComplexity]}`}
                        >
                          {COMPLEXITY_LABELS[feature.actualComplexity]}
                        </span>
                      </span>
                    ) : (
                      <span
                        className={`rounded-md border px-2.5 py-0.5 text-[11px] font-medium ${COMPLEXITY_STYLES[feature.actualComplexity]}`}
                      >
                        {COMPLEXITY_LABELS[feature.actualComplexity]}
                      </span>
                    )}
                  </span>
                  <span className="w-16 text-right font-['JetBrains_Mono',monospace] text-[12px] text-zinc-400 dark:text-zinc-500">
                    {feature.estimatedHours.likely}
                  </span>
                  {/* Actual hours — inline input */}
                  <span className="w-18 text-right" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="number"
                      min={0}
                      value={feature.actualHours ?? ''}
                      onChange={(e) => {
                        e.stopPropagation()
                        const val = e.target.value === '' ? null : Number(e.target.value)
                        onUpdateFeatureActuals?.(feature.featureId, val)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="—"
                      className="w-16 border-b border-zinc-200 bg-transparent text-right font-['JetBrains_Mono',monospace] text-[12px] font-medium text-zinc-900 outline-none placeholder:text-zinc-300 focus:border-blue-400 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-blue-500"
                    />
                  </span>
                  <span
                    className={`w-14 text-right font-['JetBrains_Mono',monospace] text-[11px] font-medium ${deltaColor(delta, feature.estimatedHours.likely)}`}
                  >
                    {formatDelta(delta)}
                  </span>
                  <span
                    className={`hidden w-24 text-center sm:block rounded px-2.5 py-0.5 text-[10px] font-medium ${status.bg} ${status.text}`}
                  >
                    {status.label}
                  </span>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="ml-11 mr-6 mb-3 mt-1 border-l-2 border-zinc-200 py-3 pl-4 dark:border-zinc-700">
                  {/* Description */}
                  <p className="mb-3 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {feature.description}
                  </p>

                  {/* Complexity selector */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Actual Complexity
                    </span>
                    <select
                      value={feature.actualComplexity}
                      onChange={(e) =>
                        onUpdateFeatureComplexity?.(feature.featureId, e.target.value as Complexity)
                      }
                      className={`cursor-pointer rounded-md border px-2 py-0.5 text-[11px] font-medium outline-none ${COMPLEXITY_STYLES[feature.actualComplexity]}`}
                    >
                      {COMPLEXITY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {complexityChanged && (
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        was{' '}
                        <span className="capitalize">
                          {feature.estimatedComplexity.replace('_', ' ')}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Feedback textarea */}
                  <div className="mb-3">
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      What happened with this feature?
                    </label>
                    <textarea
                      value={feature.feedback}
                      onChange={(e) =>
                        onUpdateFeatureFeedback?.(feature.featureId, e.target.value)
                      }
                      rows={3}
                      placeholder="Why did this feature take more/less/same time as estimated? What difficulties appeared? What went better than expected?"
                      className="w-full resize-y rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-[12px] leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-600 dark:focus:ring-blue-600"
                    />
                  </div>

                  {/* Original estimate reference */}
                  <div className="rounded-md border border-zinc-100 bg-zinc-50/50 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-800/30">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <Sparkles size={10} className="text-blue-500 dark:text-blue-400" />
                      <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        Original Estimate
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="text-zinc-400 dark:text-zinc-500">
                        Hours:{' '}
                        <span className="font-['JetBrains_Mono',monospace] text-zinc-600 dark:text-zinc-400">
                          {feature.estimatedHours.low}
                        </span>
                        <span className="mx-0.5 text-zinc-300 dark:text-zinc-600">/</span>
                        <span className="font-['JetBrains_Mono',monospace] font-medium text-zinc-900 dark:text-zinc-100">
                          {feature.estimatedHours.likely}
                        </span>
                        <span className="mx-0.5 text-zinc-300 dark:text-zinc-600">/</span>
                        <span className="font-['JetBrains_Mono',monospace] text-zinc-600 dark:text-zinc-400">
                          {feature.estimatedHours.high}
                        </span>
                      </span>
                      <span className="text-zinc-400 dark:text-zinc-500">
                        Conf:{' '}
                        <span className="font-['JetBrains_Mono',monospace] font-medium">
                          {Math.round(feature.estimatedConfidence * 100)}%
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    </section>
  )
}

function ColumnHeader({
  label,
  sortKey,
  active,
  onSort,
  className,
}: {
  label: string
  sortKey: SortKey
  active: boolean
  onSort: (key: SortKey) => void
  className?: string
}) {
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`flex items-center gap-0.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${
        active
          ? 'text-zinc-600 dark:text-zinc-300'
          : 'text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-400'
      } ${className || ''}`}
    >
      {label}
      <ArrowUpDown
        size={10}
        className={active ? 'text-blue-500' : 'text-zinc-300 dark:text-zinc-600'}
      />
    </button>
  )
}

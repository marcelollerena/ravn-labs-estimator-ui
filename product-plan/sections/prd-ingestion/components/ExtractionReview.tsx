import { useState } from 'react'
import { RotateCcw, CheckCircle2, Sparkles, AlertTriangle, Lightbulb, Wrench, Check } from 'lucide-react'
import { PageHeader } from '../../../shell/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { FeatureList } from './FeatureList'
import { EditableStringList } from './EditableStringList'
import type {
  EstimationRequest,
  RequestFeature,
  SourceFormat,
} from '../types'

interface ExtractionReviewProps {
  request: EstimationRequest
  onUpdateTitle?: (requestId: string, title: string) => void
  onUpdateOverview?: (requestId: string, overview: string) => void
  onAddFeature?: (requestId: string, feature: { name: string; description: string }) => void
  onUpdateFeature?: (requestId: string, featureId: string, updates: Partial<RequestFeature>) => void
  onRemoveFeature?: (requestId: string, featureId: string) => void
  onUpdateConstraints?: (requestId: string, constraints: string[]) => void
  onUpdateAmbiguities?: (requestId: string, ambiguities: string[]) => void
  onUpdateImplicitRequirements?: (requestId: string, implicitRequirements: string[]) => void
  onRetryParse?: (requestId: string) => void
  onConfirm?: (requestId: string) => void
}

const FORMAT_LABELS: Record<SourceFormat, string> = {
  pdf: 'PDF',
  docx: 'DOCX',
  markdown: 'MD',
  text: 'TXT',
  form: 'Form',
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
  confirmed: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400',
  parsing: 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400',
}

export function ExtractionReview({
  request,
  onUpdateTitle,
  onUpdateOverview,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
  onUpdateConstraints,
  onUpdateAmbiguities,
  onUpdateImplicitRequirements,
  onRetryParse,
  onConfirm,
}: ExtractionReviewProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(request.title)
  const [isEditingOverview, setIsEditingOverview] = useState(false)
  const [overviewValue, setOverviewValue] = useState(request.projectOverview)

  const canConfirm = request.title.trim().length > 0 && request.features.length > 0

  return (
    <div className="flex flex-col">
      {/* Page header */}
      <PageHeader
        title={request.title || 'Untitled Request'}
        description={`Extracted from ${FORMAT_LABELS[request.sourceFormat]} source`}
        status={
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-[11px] font-medium ${STATUS_STYLES[request.status] || STATUS_STYLES.draft}`}
            >
              {request.status === 'confirmed' ? 'Confirmed' : 'Draft'}
            </Badge>
            <Badge
              variant="outline"
              className="border-zinc-200 text-[11px] font-medium text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
            >
              {FORMAT_LABELS[request.sourceFormat]}
            </Badge>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRetryParse?.(request.id)}
              className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <RotateCcw size={13} />
              Re-parse
            </button>
            <button
              onClick={() => onConfirm?.(request.id)}
              disabled={!canConfirm}
              className="flex items-center gap-1.5 rounded-md bg-blue-500 px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <CheckCircle2 size={14} />
              Confirm Extraction
            </button>
          </div>
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[960px] space-y-5 p-6">
          {/* Title */}
          <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
              <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Project Title
              </h2>
            </div>
            <div className="px-4 py-3">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onUpdateTitle?.(request.id, titleValue)
                        setIsEditingTitle(false)
                      }
                      if (e.key === 'Escape') {
                        setTitleValue(request.title)
                        setIsEditingTitle(false)
                      }
                    }}
                    className="flex-1 rounded border border-blue-300 bg-white px-2.5 py-1.5 text-[15px] font-semibold text-zinc-900 outline-none focus:ring-1 focus:ring-blue-400 dark:border-blue-700 dark:bg-zinc-900 dark:text-zinc-100"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      onUpdateTitle?.(request.id, titleValue)
                      setIsEditingTitle(false)
                    }}
                    className="rounded p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <p
                  onClick={() => setIsEditingTitle(true)}
                  className="cursor-text rounded px-0.5 py-0.5 text-[15px] font-semibold text-zinc-900 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-800/40"
                >
                  {request.title || <span className="text-zinc-300 dark:text-zinc-600">Untitled</span>}
                </p>
              )}
            </div>
          </section>

          {/* Project Overview */}
          <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
              <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Project Overview
              </h2>
            </div>
            <div className="px-4 py-3">
              {isEditingOverview ? (
                <div className="space-y-2">
                  <textarea
                    value={overviewValue}
                    onChange={(e) => setOverviewValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setOverviewValue(request.projectOverview)
                        setIsEditingOverview(false)
                      }
                    }}
                    className="min-h-[100px] w-full resize-y rounded border border-blue-300 bg-white px-3 py-2 text-[13px] leading-relaxed text-zinc-700 outline-none focus:ring-1 focus:ring-blue-400 dark:border-blue-700 dark:bg-zinc-900 dark:text-zinc-300"
                    autoFocus
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setOverviewValue(request.projectOverview)
                        setIsEditingOverview(false)
                      }}
                      className="rounded px-2.5 py-1 text-[12px] text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onUpdateOverview?.(request.id, overviewValue)
                        setIsEditingOverview(false)
                      }}
                      className="rounded bg-blue-500 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  onClick={() => setIsEditingOverview(true)}
                  className="cursor-text rounded px-0.5 py-0.5 text-[13px] leading-relaxed text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/40"
                >
                  {request.projectOverview || (
                    <span className="text-zinc-300 dark:text-zinc-600">No overview extracted</span>
                  )}
                </p>
              )}
            </div>
          </section>

          {/* Features — the hero section */}
          <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Features
                </h2>
                <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
                  {request.features.length}
                </span>
              </div>
            </div>
            <FeatureList
              features={request.features}
              onAdd={(feat) => onAddFeature?.(request.id, feat)}
              onUpdate={(fid, updates) => onUpdateFeature?.(request.id, fid, updates)}
              onRemove={(fid) => onRemoveFeature?.(request.id, fid)}
            />
          </section>

          {/* Technical Constraints */}
          <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Wrench size={13} className="text-zinc-400 dark:text-zinc-500" />
                <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Technical Constraints
                </h2>
                <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
                  {request.technicalConstraints.length}
                </span>
              </div>
            </div>
            <div className="py-1.5">
              <EditableStringList
                items={request.technicalConstraints}
                onUpdate={(items) => onUpdateConstraints?.(request.id, items)}
                placeholder="Add technical constraint..."
                addLabel="Add constraint"
              />
            </div>
          </section>

          {/* AI Insights — two columns for ambiguities and implicit requirements */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Ambiguities */}
            <section className="rounded-lg border border-amber-200/60 bg-amber-50/30 dark:border-amber-800/30 dark:bg-amber-950/10">
              <div className="flex items-center gap-2 border-b border-amber-200/40 px-4 py-2.5 dark:border-amber-800/20">
                <AlertTriangle size={13} className="text-amber-500 dark:text-amber-400" />
                <h2 className="text-[12px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Ambiguities
                </h2>
                <Badge
                  variant="outline"
                  className="ml-1 border-amber-200 bg-amber-100/50 font-['JetBrains_Mono',monospace] text-[10px] text-amber-600 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                >
                  <Sparkles size={10} className="mr-1" />
                  AI-inferred
                </Badge>
                <span className="font-['JetBrains_Mono',monospace] text-[11px] text-amber-400 dark:text-amber-600">
                  {request.ambiguities.length}
                </span>
              </div>
              <div className="py-1.5">
                <EditableStringList
                  items={request.ambiguities}
                  onUpdate={(items) => onUpdateAmbiguities?.(request.id, items)}
                  placeholder="Add ambiguity..."
                  addLabel="Add ambiguity"
                />
              </div>
            </section>

            {/* Implicit Requirements */}
            <section className="rounded-lg border border-violet-200/60 bg-violet-50/30 dark:border-violet-800/30 dark:bg-violet-950/10">
              <div className="flex items-center gap-2 border-b border-violet-200/40 px-4 py-2.5 dark:border-violet-800/20">
                <Lightbulb size={13} className="text-violet-500 dark:text-violet-400" />
                <h2 className="text-[12px] font-medium uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  Implicit Requirements
                </h2>
                <Badge
                  variant="outline"
                  className="ml-1 border-violet-200 bg-violet-100/50 font-['JetBrains_Mono',monospace] text-[10px] text-violet-600 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-400"
                >
                  <Sparkles size={10} className="mr-1" />
                  AI-inferred
                </Badge>
                <span className="font-['JetBrains_Mono',monospace] text-[11px] text-violet-400 dark:text-violet-600">
                  {request.implicitRequirements.length}
                </span>
              </div>
              <div className="py-1.5">
                <EditableStringList
                  items={request.implicitRequirements}
                  onUpdate={(items) => onUpdateImplicitRequirements?.(request.id, items)}
                  placeholder="Add implicit requirement..."
                  addLabel="Add requirement"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

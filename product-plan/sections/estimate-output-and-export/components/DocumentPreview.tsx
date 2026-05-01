import { Building2, Pencil } from 'lucide-react'
import type { PreviewData, ExportProfile } from '../types'

interface DocumentPreviewProps {
  preview: PreviewData
  profile: ExportProfile
}

function confidenceColor(c: number): string {
  if (c >= 0.8) return 'text-emerald-600 dark:text-emerald-400'
  if (c >= 0.6) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

export function DocumentPreview({ preview, profile }: DocumentPreviewProps) {
  const isInternal = profile === 'internal'

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Profile indicator */}
      <div className={`flex items-center gap-2 border-b px-4 py-2.5 ${
        isInternal
          ? 'border-violet-200 bg-violet-50/50 dark:border-violet-800/50 dark:bg-violet-950/20'
          : 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-950/20'
      }`}>
        <Building2 size={13} className={isInternal ? 'text-violet-500' : 'text-emerald-500'} />
        <span className={`text-[11px] font-medium uppercase tracking-wider ${
          isInternal ? 'text-violet-700 dark:text-violet-400' : 'text-emerald-700 dark:text-emerald-400'
        }`}>
          {isInternal ? 'Internal Document' : 'Client-Ready Document'}
        </span>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        <div className="px-6 py-5 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-[18px] font-semibold text-zinc-900 dark:text-zinc-100">{preview.projectName}</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">{preview.projectSummary}</p>
          </div>

          {/* Summary metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/50">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Hours</p>
              <p className="font-['JetBrains_Mono',monospace] text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
                {preview.totalHours.likely.toLocaleString()}
                {isInternal && (
                  <span className="ml-1 text-[11px] font-normal text-zinc-400 dark:text-zinc-500">
                    ({preview.totalHours.low}–{preview.totalHours.high})
                  </span>
                )}
              </p>
            </div>
            <div className="rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/50">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Duration</p>
              <p className="font-['JetBrains_Mono',monospace] text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
                {preview.durationWeeks} <span className="text-[11px] font-normal text-zinc-400">wk</span>
              </p>
            </div>
            <div className="rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/50">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Team</p>
              <p className="font-['JetBrains_Mono',monospace] text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
                {preview.teamHeadcount} <span className="text-[11px] font-normal text-zinc-400">people</span>
              </p>
            </div>
            {isInternal && (
              <div className="rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/50">
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Confidence</p>
                <p className={`font-['JetBrains_Mono',monospace] text-[15px] font-semibold ${confidenceColor(preview.confidence)}`}>
                  {Math.round(preview.confidence * 100)}%
                </p>
              </div>
            )}
          </div>

          {/* Features table */}
          <div>
            <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Feature Breakdown
            </h3>
            <div className="rounded-md border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-2 border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
                <span className="flex-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Feature</span>
                <span className="w-16 text-center text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Cmplx</span>
                <span className="w-14 text-right text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Hours</span>
                {isInternal && (
                  <span className="w-12 text-right text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Conf</span>
                )}
              </div>
              {preview.features.map((feat) => (
                <div key={feat.id} className="flex items-start gap-2 border-b border-zinc-50 px-3 py-2 last:border-b-0 dark:border-zinc-800/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100">{feat.name}</span>
                      {isInternal && feat.wasAdjusted && (
                        <Pencil size={9} className="text-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{feat.description}</p>
                  </div>
                  <span className="w-16 shrink-0 text-center text-[11px] text-zinc-600 dark:text-zinc-400">{feat.complexity}</span>
                  <span className="w-14 shrink-0 text-right font-['JetBrains_Mono',monospace] text-[12px] font-medium text-zinc-900 dark:text-zinc-100">
                    {feat.hoursLikely}
                    {isInternal && feat.hoursLow != null && (
                      <span className="block text-[10px] font-normal text-zinc-400 dark:text-zinc-500">
                        {feat.hoursLow}–{feat.hoursHigh}
                      </span>
                    )}
                  </span>
                  {isInternal && (
                    <span className={`w-12 shrink-0 text-right font-['JetBrains_Mono',monospace] text-[11px] font-medium ${
                      feat.confidence != null ? confidenceColor(feat.confidence) : 'text-zinc-400'
                    }`}>
                      {feat.confidence != null ? `${Math.round(feat.confidence * 100)}%` : '—'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div>
            <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Risk Assessment
            </h3>
            <div className="space-y-2">
              {preview.risks.map((risk) => (
                <div key={risk.id} className="rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {risk.category}
                    </span>
                    <span className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100">{risk.title}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">{risk.mitigation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Team Composition
            </h3>
            <div className="flex flex-wrap gap-2">
              {preview.teamRoles.map((role, i) => (
                <div key={i} className="rounded-md border border-zinc-200 px-3 py-1.5 dark:border-zinc-700">
                  <span className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100">{role.count}× {role.role}</span>
                  <span className="ml-1.5 text-[10px] text-zinc-500 dark:text-zinc-400">({role.seniority})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assumptions */}
          <div>
            <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Key Assumptions
            </h3>
            <ul className="space-y-1">
              {preview.assumptions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-zinc-600 dark:text-zinc-400">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimers (client only) */}
          {!isInternal && preview.disclaimers.length > 0 && (
            <div className="rounded-md border border-zinc-200 bg-zinc-50/50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/30">
              <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Disclaimers
              </h3>
              <ul className="space-y-1.5">
                {preview.disclaimers.map((d, i) => (
                  <li key={i} className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

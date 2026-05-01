import { Users, Pencil, ArrowRight } from 'lucide-react'
import type { TeamAdjustment, Seniority } from '../types'

interface TeamReviewPanelProps {
  teamAdjustment: TeamAdjustment
  onAdjustTeam?: () => void
}

const SENIORITY_STYLES: Record<Seniority, string> = {
  junior: 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
  mid: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400',
  senior: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-400',
}

export function TeamReviewPanel({ teamAdjustment, onAdjustTeam }: TeamReviewPanelProps) {
  const isAdjusted = teamAdjustment.status === 'adjusted'
  const headcountDelta = teamAdjustment.adjustedHeadcount - teamAdjustment.originalHeadcount

  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Users size={13} className="text-zinc-400 dark:text-zinc-500" />
          <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Team Recommendation
          </h2>
          <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
            {teamAdjustment.adjustedHeadcount}
            {headcountDelta !== 0 && (
              <span className={headcountDelta > 0 ? 'text-amber-500' : 'text-emerald-500'}>
                {' '}({headcountDelta > 0 ? '+' : ''}{headcountDelta})
              </span>
            )}
          </span>
          {isAdjusted && (
            <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              Adjusted
            </span>
          )}
        </div>
        <button
          onClick={onAdjustTeam}
          className="flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Pencil size={11} />
          Edit
        </button>
      </div>

      {/* Adjusted roles table */}
      <div>
        <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
          <span className="w-36 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Role</span>
          <span className="w-10 text-center text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">#</span>
          <span className="w-16 text-center text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Level</span>
          <span className="flex-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Reasoning</span>
        </div>

        {teamAdjustment.adjustedRoles.map((role, i) => {
          const original = teamAdjustment.originalRoles.find(r => r.role === role.role)
          const isNewRole = !original
          const seniorityChanged = original && original.seniority !== role.seniority
          const countChanged = original && original.count !== role.count

          return (
            <div
              key={i}
              className={`flex items-start gap-2 border-b border-zinc-50 px-4 py-2.5 last:border-b-0 dark:border-zinc-800/50 ${
                isNewRole ? 'border-l-2 border-l-blue-400 dark:border-l-blue-600' : ''
              }`}
            >
              <span className="w-36 shrink-0 text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                {role.role}
                {isNewRole && (
                  <span className="ml-1.5 rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-400">NEW</span>
                )}
              </span>
              <span className="w-10 shrink-0 text-center font-['JetBrains_Mono',monospace] text-[12px] text-zinc-900 dark:text-zinc-100">
                {countChanged ? (
                  <span className="flex items-center justify-center gap-0.5">
                    <span className="text-zinc-400 line-through dark:text-zinc-500">{original.count}</span>
                    <ArrowRight size={9} className="text-zinc-300 dark:text-zinc-600" />
                    <span>{role.count}</span>
                  </span>
                ) : (
                  role.count
                )}
              </span>
              <span className="w-16 shrink-0 text-center">
                {seniorityChanged ? (
                  <span className="flex flex-col items-center gap-0.5">
                    <span className={`inline-block rounded-md border px-1.5 py-0.5 text-[9px] font-medium capitalize line-through opacity-50 ${SENIORITY_STYLES[original.seniority]}`}>
                      {original.seniority}
                    </span>
                    <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-medium capitalize ${SENIORITY_STYLES[role.seniority]}`}>
                      {role.seniority}
                    </span>
                  </span>
                ) : (
                  <span className={`inline-block rounded-md border px-2.5 py-0.5 text-[10px] font-medium capitalize ${SENIORITY_STYLES[role.seniority]}`}>
                    {role.seniority}
                  </span>
                )}
              </span>
              <span className="flex-1 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {role.reasoning}
              </span>
            </div>
          )
        })}
      </div>

      {/* Adjustment reasoning */}
      {isAdjusted && teamAdjustment.reasoning && (
        <div className="border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <div className="rounded border border-amber-200/50 bg-amber-50/30 px-3 py-2 dark:border-amber-800/30 dark:bg-amber-950/20">
            <p className="text-[12px] leading-relaxed text-amber-800 dark:text-amber-300">
              <span className="font-medium">Reasoning: </span>{teamAdjustment.reasoning}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

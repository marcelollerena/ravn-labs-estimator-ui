import { Users, ChevronRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import type { OriginalTeamRole, Seniority } from '@/../product/sections/calibration/types'

interface TeamFeedbackPanelProps {
  teamFeedback: string
  originalTeamRoles: OriginalTeamRole[]
  onUpdateTeamFeedback?: (feedback: string) => void
}

const SENIORITY_STYLES: Record<Seniority, string> = {
  junior: 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
  mid: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400',
  senior: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-400',
}

export function TeamFeedbackPanel({
  teamFeedback,
  originalTeamRoles,
  onUpdateTeamFeedback,
}: TeamFeedbackPanelProps) {
  const [showOriginal, setShowOriginal] = useState(false)
  const totalOriginalHeadcount = originalTeamRoles.reduce((sum, r) => sum + r.count, 0)

  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <Users size={13} className="text-zinc-400 dark:text-zinc-500" />
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Team Feedback
        </h2>
      </div>

      {/* Feedback textarea */}
      <div className="px-4 py-3">
        <label className="mb-1.5 block text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          Describe the real team dynamics, unexpected contributions, blockers, and any staffing surprises that affected the project outcome.
        </label>
        <textarea
          value={teamFeedback}
          onChange={(e) => onUpdateTeamFeedback?.(e.target.value)}
          rows={5}
          placeholder="What happened with the team? Who exceeded expectations? Were there unexpected contributors or missing skills? What would you change about the team composition next time?"
          className="w-full resize-y rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-[12px] leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-600 dark:focus:ring-blue-600"
        />
      </div>

      {/* Original team recommendation (collapsible reference) */}
      {originalTeamRoles.length > 0 && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <Collapsible open={showOriginal} onOpenChange={setShowOriginal}>
            <CollapsibleTrigger asChild>
              <button className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-800/20">
                {showOriginal ? (
                  <ChevronDown size={12} className="text-zinc-400 dark:text-zinc-500" />
                ) : (
                  <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-600" />
                )}
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Original Team Recommendation
                </span>
                <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
                  {totalOriginalHeadcount}
                </span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-3">
                {/* Column headers */}
                <div className="mb-1 flex items-center gap-2 py-1">
                  <span className="w-36 text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Role
                  </span>
                  <span className="w-10 text-center text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    #
                  </span>
                  <span className="w-16 text-center text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Level
                  </span>
                  <span className="flex-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Reasoning
                  </span>
                </div>
                {originalTeamRoles.map((role, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 border-t border-zinc-50 py-2 first:border-t-0 dark:border-zinc-800/50"
                  >
                    <span className="w-36 shrink-0 text-[12px] text-zinc-600 dark:text-zinc-400">
                      {role.role}
                    </span>
                    <span className="w-10 shrink-0 text-center font-['JetBrains_Mono',monospace] text-[11px] text-zinc-600 dark:text-zinc-400">
                      {role.count}
                    </span>
                    <span className="w-16 shrink-0 text-center">
                      <span
                        className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-medium capitalize ${SENIORITY_STYLES[role.seniority]}`}
                      >
                        {role.seniority}
                      </span>
                    </span>
                    <span className="flex-1 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-500">
                      {role.reasoning}
                    </span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </section>
  )
}

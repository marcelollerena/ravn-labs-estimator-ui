import { Users } from 'lucide-react'
import type { TeamRecommendation as TeamRecommendationType, Seniority } from '@/../product/sections/ai-driven-first-pass-estimation/types'

interface TeamRecommendationProps {
  teamRecommendation: TeamRecommendationType
}

const SENIORITY_STYLES: Record<Seniority, string> = {
  junior: 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
  mid: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400',
  senior: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-400',
}

export function TeamRecommendation({ teamRecommendation }: TeamRecommendationProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <Users size={13} className="text-zinc-400 dark:text-zinc-500" />
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Team Recommendation
        </h2>
        <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
          {teamRecommendation.totalHeadcount}
        </span>
      </div>

      {/* Roles table */}
      <div>
        {/* Column headers */}
        <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
          <span className="w-36 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Role
          </span>
          <span className="w-10 text-center text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            #
          </span>
          <span className="w-16 text-center text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Level
          </span>
          <span className="flex-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Reasoning
          </span>
        </div>

        {/* Rows */}
        {teamRecommendation.roles.map((role, i) => (
          <div
            key={i}
            className="flex items-start gap-2 border-b border-zinc-50 px-4 py-2.5 last:border-b-0 dark:border-zinc-800/50"
          >
            <span className="w-36 shrink-0 text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
              {role.role}
            </span>
            <span className="w-10 shrink-0 text-center font-['JetBrains_Mono',monospace] text-[12px] text-zinc-900 dark:text-zinc-100">
              {role.count}
            </span>
            <span className="w-16 shrink-0 text-center">
              <span
                className={`inline-block rounded-md border px-2.5 py-0.5 text-[10px] font-medium capitalize ${SENIORITY_STYLES[role.seniority]}`}
              >
                {role.seniority}
              </span>
            </span>
            <span className="flex-1 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              {role.reasoning}
            </span>
          </div>
        ))}
      </div>

      {/* Overall reasoning */}
      <div className="border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <p className="text-[12px] italic leading-relaxed text-zinc-500 dark:text-zinc-400">
          {teamRecommendation.reasoning}
        </p>
      </div>
    </section>
  )
}

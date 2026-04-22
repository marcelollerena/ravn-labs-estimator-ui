import { Circle, CheckCircle2, HelpCircle } from 'lucide-react'
import type { EstimateQuestion, ImpactLevel } from '../types'

interface ClarificationQuestionsProps {
  questions: EstimateQuestion[]
}

const IMPACT_STYLES: Record<ImpactLevel, string> = {
  low: 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
  medium: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400',
  high: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
}

export function ClarificationQuestions({ questions }: ClarificationQuestionsProps) {
  const unresolvedCount = questions.filter((q) => !q.resolved).length

  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <HelpCircle size={13} className="text-zinc-400 dark:text-zinc-500" />
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Clarification Questions
        </h2>
        <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
          {unresolvedCount} unresolved
        </span>
      </div>

      <div>
        {questions.map((q) => (
          <div
            key={q.id}
            className="flex items-start gap-3 border-b border-zinc-50 px-4 py-3 last:border-b-0 dark:border-zinc-800/50"
          >
            {/* Status icon */}
            <div className="mt-0.5 shrink-0">
              {q.resolved ? (
                <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />
              ) : (
                <Circle size={16} className="text-zinc-300 dark:text-zinc-600" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-2">
                <p
                  className={`flex-1 text-[13px] ${
                    q.resolved
                      ? 'text-zinc-400 line-through dark:text-zinc-500'
                      : 'text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  {q.question}
                </p>
                <span
                  className={`shrink-0 rounded-md border px-2.5 py-0.5 text-[10px] font-medium ${IMPACT_STYLES[q.impactLevel]}`}
                >
                  {q.impactLevel}
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-zinc-400 dark:text-zinc-500">
                Affects: {q.affectedScope}
              </p>
              {q.resolved && q.answer && (
                <p className="mt-1.5 text-[12px] leading-relaxed text-emerald-600 dark:text-emerald-400">
                  {q.answer}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

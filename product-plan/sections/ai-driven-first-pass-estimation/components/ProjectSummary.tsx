import { Sparkles } from 'lucide-react'
import type { EstimateSummary } from '../types'

function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className || ''}`}>{children}</span>
}

interface ProjectSummaryProps {
  summary: EstimateSummary
}

export function ProjectSummary({ summary }: ProjectSummaryProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Project Summary
        </h2>
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50/50 font-['JetBrains_Mono',monospace] text-[10px] text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
        >
          <Sparkles size={10} className="mr-1" />
          AI-generated
        </Badge>
      </div>

      <div className="p-4">
        {/* Rationale */}
        <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
          {summary.rationale}
        </p>

        {/* Key Assumptions */}
        {summary.keyAssumptions.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Key Assumptions
            </h3>
            <div className="rounded-lg border border-blue-200/40 bg-blue-50/20 p-3 dark:border-blue-800/30 dark:bg-blue-950/10">
              <ul className="space-y-1.5">
                {summary.keyAssumptions.map((assumption, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[12px] leading-relaxed text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300 dark:bg-blue-700" />
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

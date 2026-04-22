import { GitCompare } from 'lucide-react'
import type { ComparableProject } from '@/../product/sections/ai-driven-first-pass-estimation/types'

interface ComparableProjectsProps {
  comparableProjects: ComparableProject[]
}

function varianceDelta(estimated: number, actual: number): { label: string; className: string } {
  const pct = Math.round(((actual - estimated) / estimated) * 100)
  if (pct > 0) return { label: `+${pct}%`, className: 'text-red-600 dark:text-red-400' }
  if (pct < 0) return { label: `${pct}%`, className: 'text-emerald-600 dark:text-emerald-400' }
  return { label: '0%', className: 'text-zinc-500 dark:text-zinc-400' }
}

export function ComparableProjects({ comparableProjects }: ComparableProjectsProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <GitCompare size={13} className="text-zinc-400 dark:text-zinc-500" />
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Comparable Projects
        </h2>
        <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
          {comparableProjects.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        {comparableProjects.map((project) => {
          const delta = varianceDelta(project.estimatedHours, project.actualHours)
          return (
            <div
              key={project.id}
              className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/30"
            >
              {/* Header */}
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
                  {project.name}
                </h3>
                <span className="shrink-0 rounded border border-slate-200 bg-slate-200/60 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-400">
                  {project.industry}
                </span>
              </div>

              {/* Metrics */}
              <div className="mb-2 flex items-center gap-3 font-['JetBrains_Mono',monospace] text-[11px]">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Est: {project.estimatedHours.toLocaleString()}h
                </span>
                <span className="text-zinc-300 dark:text-zinc-600">|</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  Act: {project.actualHours.toLocaleString()}h
                </span>
                <span className={`font-medium ${delta.className}`}>{delta.label}</span>
                <span className="text-zinc-300 dark:text-zinc-600">|</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {project.durationWeeks}w
                </span>
                <span className="text-zinc-300 dark:text-zinc-600">|</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {project.teamSize}p
                </span>
              </div>

              {/* Tech stack */}
              <div className="mb-2 flex flex-wrap gap-1">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="rounded border border-zinc-200 bg-zinc-200/60 px-2.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:border-zinc-600 dark:bg-zinc-600/40 dark:text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Rationale */}
              <p className="text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {project.similarityRationale}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

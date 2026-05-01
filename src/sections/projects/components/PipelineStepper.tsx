import type { PipelineProgress, PipelinePhase } from '@/../product/sections/projects/types'

const phases: { key: PipelinePhase; label: string }[] = [
  { key: 'ingestion', label: 'Ingestion' },
  { key: 'estimation', label: 'Estimation' },
  { key: 'review', label: 'Review' },
  { key: 'export', label: 'Export' },
]

interface PipelineStepperProps {
  progress: PipelineProgress
}

export function PipelineStepper({ progress }: PipelineStepperProps) {
  return (
    <div className="flex items-center gap-1.5">
      {phases.map((phase) => {
        const state = progress[phase.key]
        return (
          <div key={phase.key} className="group relative">
            <div
              className={`size-[7px] rounded-full ${
                state === 'completed'
                  ? 'bg-blue-500 dark:bg-blue-400'
                  : state === 'current'
                    ? 'bg-blue-500 dark:bg-blue-400 animate-pulse'
                    : 'bg-zinc-300 dark:bg-zinc-600'
              }`}
            />
            <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap dark:bg-zinc-700">
              {phase.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}

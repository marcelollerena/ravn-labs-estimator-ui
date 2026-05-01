import type { EstimationProject } from '@/../product/sections/projects/types'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { PipelineStepper } from './PipelineStepper'
import { ProjectQuickActions } from './ProjectQuickActions'

function formatHours(project: EstimationProject): string {
  if (!project.totalHours) return '—'
  return `${project.totalHours.low.toLocaleString()}–${project.totalHours.high.toLocaleString()}h`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface ProjectCardProps {
  project: EstimationProject
  onProjectClick?: (projectId: string) => void
  onResume?: (projectId: string) => void
  onView?: (projectId: string) => void
  onDuplicate?: (projectId: string) => void
  onArchive?: (projectId: string) => void
  onUnarchive?: (projectId: string) => void
  onDelete?: (projectId: string) => void
}

export function ProjectCard({
  project,
  onProjectClick,
  onResume,
  onView,
  onDuplicate,
  onArchive,
  onUnarchive,
  onDelete,
}: ProjectCardProps) {
  return (
    <div
      className="cursor-pointer rounded-lg border border-zinc-200 p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/30"
      onClick={() => onProjectClick?.(project.id)}
    >
      {/* Top: name + status */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
            {project.name}
          </div>
          <div className="mt-0.5 truncate text-[11px] text-zinc-400 dark:text-zinc-500">
            {project.description}
          </div>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      {/* Middle: pipeline stepper */}
      <div className="mt-3">
        <PipelineStepper progress={project.pipelineProgress} />
      </div>

      {/* Bottom: hours + date + actions */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-['JetBrains_Mono',monospace] text-[12px] text-zinc-600 dark:text-zinc-400">
            {formatHours(project)}
          </span>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {formatDate(project.updatedAt)}
          </span>
        </div>
        <ProjectQuickActions
          status={project.status}
          projectName={project.name}
          onResume={() => onResume?.(project.id)}
          onView={() => onView?.(project.id)}
          onDuplicate={() => onDuplicate?.(project.id)}
          onArchive={() => onArchive?.(project.id)}
          onUnarchive={() => onUnarchive?.(project.id)}
          onDelete={() => onDelete?.(project.id)}
        />
      </div>
    </div>
  )
}

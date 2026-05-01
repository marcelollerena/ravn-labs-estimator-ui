import { ArrowUpDown } from 'lucide-react'
import type { EstimationProject, SortConfig, SortField } from '@/../product/sections/projects/types'
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
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface ProjectsTableProps {
  projects: EstimationProject[]
  sortConfig: SortConfig
  onSort?: (field: SortField) => void
  onProjectClick?: (projectId: string) => void
  onResume?: (projectId: string) => void
  onView?: (projectId: string) => void
  onDuplicate?: (projectId: string) => void
  onArchive?: (projectId: string) => void
  onUnarchive?: (projectId: string) => void
  onDelete?: (projectId: string) => void
}

const sortableColumns: { field: SortField; label: string; className: string }[] = [
  { field: 'name', label: 'Project', className: 'w-[240px]' },
  { field: 'status', label: 'Status', className: 'w-[100px]' },
]

export function ProjectsTable({
  projects,
  sortConfig,
  onSort,
  onProjectClick,
  onResume,
  onView,
  onDuplicate,
  onArchive,
  onUnarchive,
  onDelete,
}: ProjectsTableProps) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
      {/* Header */}
      <div className="border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
        <div className="flex items-center gap-4 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
          {sortableColumns.map((col) => (
            <button
              key={col.field}
              className={`${col.className} flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300`}
              onClick={() => onSort?.(col.field)}
            >
              {col.label}
              <ArrowUpDown
                size={10}
                className={sortConfig.field === col.field ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-300 dark:text-zinc-600'}
              />
            </button>
          ))}
          <span className="hidden w-[140px] lg:block">Phase</span>
          <button
            className="hidden w-[120px] items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300 lg:flex"
            onClick={() => onSort?.('totalHoursLikely')}
          >
            Hours
            <ArrowUpDown
              size={10}
              className={sortConfig.field === 'totalHoursLikely' ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-300 dark:text-zinc-600'}
            />
          </button>
          <button
            className="flex flex-1 items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300"
            onClick={() => onSort?.('updatedAt')}
          >
            Updated
            <ArrowUpDown
              size={10}
              className={sortConfig.field === 'updatedAt' ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-300 dark:text-zinc-600'}
            />
          </button>
          <span className="w-[40px]" />
        </div>
      </div>

      {/* Rows */}
      {projects.map((project) => (
        <div
          key={project.id}
          className="flex items-center gap-4 border-b border-zinc-100 px-4 py-2.5 last:border-b-0 cursor-pointer hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30"
          onClick={() => onProjectClick?.(project.id)}
        >
          <div className="w-[240px] min-w-0">
            <div className="truncate text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
              {project.name}
            </div>
            <div className="truncate text-[11px] text-zinc-400 dark:text-zinc-500">
              {project.description}
            </div>
          </div>
          <div className="w-[100px]">
            <ProjectStatusBadge status={project.status} />
          </div>
          <div className="hidden w-[140px] lg:block">
            <PipelineStepper progress={project.pipelineProgress} />
          </div>
          <div className="hidden w-[120px] lg:block">
            <span className="font-['JetBrains_Mono',monospace] text-[12px] text-zinc-600 dark:text-zinc-400">
              {formatHours(project)}
            </span>
          </div>
          <div className="flex-1">
            <span className="text-[12px] text-zinc-400 dark:text-zinc-500">
              {formatDate(project.updatedAt)}
            </span>
          </div>
          <div className="w-[40px] flex justify-end">
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
      ))}
    </div>
  )
}

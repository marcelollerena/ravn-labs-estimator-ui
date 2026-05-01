import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/shell/components/PageHeader'
import type { ProjectsListViewProps } from '@/../product/sections/projects/types'
import { ProjectsToolbar } from './ProjectsToolbar'
import { ProjectsTable } from './ProjectsTable'
import { ProjectCard } from './ProjectCard'
import { ProjectsEmptyState } from './ProjectsEmptyState'

export function ProjectsListView({
  projects,
  activeCount,
  archivedCount,
  activeTab,
  searchQuery,
  statusFilter,
  sortConfig,
  onTabChange,
  onSearch,
  onFilterStatus,
  onSort,
  onProjectClick,
  onResume,
  onView,
  onDuplicate,
  onArchive,
  onUnarchive,
  onDelete,
  onNewEstimate,
}: ProjectsListViewProps) {
  const totalCount = activeCount + archivedCount
  const hasProjects = totalCount > 0
  const hasResults = projects.length > 0
  const isFiltered = searchQuery !== '' || statusFilter !== 'all'

  const emptyVariant = !hasProjects
    ? 'no-projects' as const
    : activeTab === 'archived'
      ? 'empty-archived' as const
      : 'no-results' as const

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Projects"
        description="All estimation projects across the pipeline"
        status={
          hasProjects ? (
            <Badge variant="secondary" className="text-[11px] font-medium">
              {totalCount} total
            </Badge>
          ) : undefined
        }
        actions={
          <Button
            size="sm"
            className="h-7 gap-1.5 text-[13px]"
            onClick={onNewEstimate}
          >
            <Plus size={14} />
            New Estimate
          </Button>
        }
      />

      <ProjectsToolbar
        activeTab={activeTab}
        activeCount={activeCount}
        archivedCount={archivedCount}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onTabChange={onTabChange}
        onSearch={onSearch}
        onFilterStatus={onFilterStatus}
      />

      <div className="p-6">
        {!hasResults ? (
          <ProjectsEmptyState
            variant={emptyVariant}
            onNewEstimate={onNewEstimate}
            onClearFilters={
              isFiltered
                ? () => {
                    onSearch?.('')
                    onFilterStatus?.('all')
                  }
                : undefined
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <ProjectsTable
                projects={projects}
                sortConfig={sortConfig}
                onSort={onSort}
                onProjectClick={onProjectClick}
                onResume={onResume}
                onView={onView}
                onDuplicate={onDuplicate}
                onArchive={onArchive}
                onUnarchive={onUnarchive}
                onDelete={onDelete}
              />
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onProjectClick={onProjectClick}
                  onResume={onResume}
                  onView={onView}
                  onDuplicate={onDuplicate}
                  onArchive={onArchive}
                  onUnarchive={onUnarchive}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

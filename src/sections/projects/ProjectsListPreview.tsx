import { useState, useMemo } from 'react'
import data from '@/../product/sections/projects/data.json'
import { ProjectsListView } from './components/ProjectsListView'
import type {
  EstimationProject,
  StatusFilter,
  SortConfig,
  SortField,
  PipelinePhase,
} from '@/../product/sections/projects/types'

const allProjects = data.projects as unknown as EstimationProject[]

const phaseRoutes: Record<PipelinePhase, string> = {
  ingestion: '/ingestion',
  estimation: '/estimates',
  review: '/reviews',
  export: '/export',
}

export default function ProjectsListPreview() {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'updatedAt',
    direction: 'desc',
  })

  const activeCount = allProjects.filter((p) => p.status !== 'archived').length
  const archivedCount = allProjects.filter((p) => p.status === 'archived').length

  const filteredProjects = useMemo(() => {
    let result = allProjects

    // Tab filter
    if (activeTab === 'archived') {
      result = result.filter((p) => p.status === 'archived')
    } else {
      result = result.filter((p) => p.status !== 'archived')
    }

    // Status filter (active tab only)
    if (activeTab === 'active' && statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter)
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(query))
    }

    // Sort
    result = [...result].sort((a, b) => {
      const dir = sortConfig.direction === 'asc' ? 1 : -1
      switch (sortConfig.field) {
        case 'name':
          return dir * a.name.localeCompare(b.name)
        case 'status':
          return dir * a.status.localeCompare(b.status)
        case 'totalHoursLikely': {
          const aHours = a.totalHours?.likely ?? 0
          const bHours = b.totalHours?.likely ?? 0
          return dir * (aHours - bHours)
        }
        case 'updatedAt':
          return dir * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
        default:
          return 0
      }
    })

    return result
  }, [activeTab, statusFilter, searchQuery, sortConfig])

  function handleSort(field: SortField) {
    setSortConfig((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'desc' }
    )
  }

  function handleProjectClick(projectId: string) {
    const project = allProjects.find((p) => p.id === projectId)
    if (project) {
      const route = phaseRoutes[project.currentPhase]
      console.log(`Navigate to ${route} (project: ${project.name}, phase: ${project.currentPhase})`)
    }
  }

  return (
    <ProjectsListView
      projects={filteredProjects}
      activeCount={activeCount}
      archivedCount={archivedCount}
      activeTab={activeTab}
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      sortConfig={sortConfig}
      onTabChange={setActiveTab}
      onSearch={setSearchQuery}
      onFilterStatus={setStatusFilter}
      onSort={handleSort}
      onProjectClick={handleProjectClick}
      onResume={(id) => handleProjectClick(id)}
      onView={(id) => {
        const project = allProjects.find((p) => p.id === id)
        console.log('View project:', project?.name)
      }}
      onDuplicate={(id) => {
        const project = allProjects.find((p) => p.id === id)
        console.log('Duplicate project:', project?.name)
      }}
      onArchive={(id) => {
        const project = allProjects.find((p) => p.id === id)
        console.log('Archive project:', project?.name)
      }}
      onUnarchive={(id) => {
        const project = allProjects.find((p) => p.id === id)
        console.log('Unarchive project:', project?.name)
      }}
      onDelete={(id) => {
        const project = allProjects.find((p) => p.id === id)
        console.log('Delete project:', project?.name)
      }}
      onNewEstimate={() => console.log('Navigate to /ingestion (new estimate)')}
    />
  )
}

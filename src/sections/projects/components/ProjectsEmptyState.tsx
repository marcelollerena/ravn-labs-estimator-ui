import { FolderOpen, SearchX, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'

type EmptyVariant = 'no-projects' | 'no-results' | 'empty-archived'

interface ProjectsEmptyStateProps {
  variant: EmptyVariant
  onNewEstimate?: () => void
  onClearFilters?: () => void
}

const config: Record<EmptyVariant, { icon: typeof FolderOpen; title: string; description: string }> = {
  'no-projects': {
    icon: FolderOpen,
    title: 'No estimation projects yet',
    description: 'Upload a PRD to start your first estimate.',
  },
  'no-results': {
    icon: SearchX,
    title: 'No projects match your filters',
    description: 'Try adjusting your search or filter criteria.',
  },
  'empty-archived': {
    icon: Archive,
    title: 'No archived projects',
    description: 'Completed projects you archive will appear here.',
  },
}

export function ProjectsEmptyState({ variant, onNewEstimate, onClearFilters }: ProjectsEmptyStateProps) {
  const { icon: Icon, title, description } = config[variant]

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <Icon size={20} className="text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="mt-3 text-[14px] font-medium text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
      {variant === 'no-projects' && onNewEstimate && (
        <Button size="sm" className="mt-4 h-8 gap-1.5 text-[13px]" onClick={onNewEstimate}>
          New Estimate
        </Button>
      )}
      {variant === 'no-results' && onClearFilters && (
        <button
          className="mt-3 text-[13px] text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

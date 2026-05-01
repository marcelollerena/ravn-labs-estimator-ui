import {
  Play,
  Eye,
  Copy,
  Archive,
  ArchiveRestore,
  Trash2,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ProjectStatus } from '@/../product/sections/projects/types'

interface ProjectQuickActionsProps {
  status: ProjectStatus
  projectName: string
  onResume?: () => void
  onView?: () => void
  onDuplicate?: () => void
  onArchive?: () => void
  onUnarchive?: () => void
  onDelete?: () => void
}

export function ProjectQuickActions({
  status,
  projectName,
  onResume,
  onView,
  onDuplicate,
  onArchive,
  onUnarchive,
  onDelete,
}: ProjectQuickActionsProps) {
  const canResume = status !== 'estimated' && status !== 'archived'
  const canArchive = status !== 'archived'
  const canDelete = status === 'draft' || status === 'extracting'
  const isArchived = status === 'archived'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="size-7 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {canResume && (
          <DropdownMenuItem onClick={onResume}>
            <Play size={14} />
            Resume
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onView}>
          <Eye size={14} />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy size={14} />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {canArchive && (
          <DropdownMenuItem onClick={() => {
            if (window.confirm(`Archive "${projectName}"? It will move to the Archived tab.`)) {
              onArchive?.()
            }
          }}>
            <Archive size={14} />
            Archive
          </DropdownMenuItem>
        )}
        {isArchived && (
          <DropdownMenuItem onClick={onUnarchive}>
            <ArchiveRestore size={14} />
            Unarchive
          </DropdownMenuItem>
        )}
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
              onClick={() => {
                if (window.confirm(`Permanently delete "${projectName}"? This cannot be undone.`)) {
                  onDelete?.()
                }
              }}
            >
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

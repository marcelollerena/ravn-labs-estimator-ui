import { Search, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { StatusFilter } from '@/../product/sections/projects/types'

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'extracting', label: 'Extracting' },
  { value: 'estimating', label: 'Estimating' },
  { value: 'in_review', label: 'In Review' },
  { value: 'estimated', label: 'Estimated' },
]

interface ProjectsToolbarProps {
  activeTab: 'active' | 'archived'
  activeCount: number
  archivedCount: number
  searchQuery: string
  statusFilter: StatusFilter
  onTabChange?: (tab: 'active' | 'archived') => void
  onSearch?: (query: string) => void
  onFilterStatus?: (status: StatusFilter) => void
}

export function ProjectsToolbar({
  activeTab,
  activeCount,
  archivedCount,
  searchQuery,
  statusFilter,
  onTabChange,
  onSearch,
  onFilterStatus,
}: ProjectsToolbarProps) {
  const activeLabel = statusOptions.find((o) => o.value === statusFilter)?.label ?? 'All statuses'

  return (
    <div className="flex flex-col gap-3 border-b border-zinc-200 px-6 py-3 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
      {/* Tabs */}
      <div className="flex items-center gap-1">
        <button
          className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === 'active'
              ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
          }`}
          onClick={() => onTabChange?.('active')}
        >
          Active
          <span className="ml-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            {activeCount}
          </span>
        </button>
        <button
          className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
            activeTab === 'archived'
              ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
          }`}
          onClick={() => onTabChange?.('archived')}
        >
          Archived
          <span className="ml-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            {archivedCount}
          </span>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            className="h-8 w-[200px] rounded-md border border-zinc-200 bg-transparent pl-8 pr-3 text-[13px] text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-200 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-700 dark:focus:ring-blue-800"
          />
        </div>

        {activeTab === 'active' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-[13px] font-normal"
              >
                {activeLabel}
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onFilterStatus?.(option.value)}
                  className={statusFilter === option.value ? 'font-medium' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

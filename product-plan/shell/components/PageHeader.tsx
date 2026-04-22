import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  status?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, description, status, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h1>
          {status}
        </div>
        {description && (
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="ml-4 flex shrink-0 items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}

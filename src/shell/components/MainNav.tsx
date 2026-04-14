import { type LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  isActive?: boolean
}

export interface NavGroup {
  label?: string
  items: NavItem[]
}

interface MainNavProps {
  groups: NavGroup[]
  collapsed?: boolean
  onNavigate?: (href: string) => void
}

export function MainNav({ groups, collapsed = false, onNavigate }: MainNavProps) {
  return (
    <nav className="flex flex-col gap-4 px-2">
      {groups.map((group, groupIdx) => (
        <div key={groupIdx} className="flex flex-col gap-0.5">
          {group.label && !collapsed && (
            <span className="mb-1 px-2.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              {group.label}
            </span>
          )}
          {collapsed && groupIdx > 0 && (
            <div className="mx-2 mb-1 border-t border-zinc-800/60" />
          )}
          {group.items.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.href}
                onClick={() => onNavigate?.(item.href)}
                className={`
                  group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors
                  ${item.isActive
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                  }
                  ${collapsed ? 'justify-center px-2' : ''}
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={16}
                  className={`shrink-0 ${item.isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}
                />
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

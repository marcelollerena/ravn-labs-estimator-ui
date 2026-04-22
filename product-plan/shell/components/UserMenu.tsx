import { useState, useRef, useEffect } from 'react'
import { LogOut, Settings } from 'lucide-react'

interface UserMenuProps {
  user: { name: string; avatarUrl?: string }
  collapsed?: boolean
  onLogout?: () => void
  onSettings?: () => void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UserMenu({ user, collapsed = false, onLogout, onSettings }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors
          hover:bg-zinc-800/50
          ${collapsed ? 'justify-center px-2' : ''}
        `}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-[11px] font-semibold text-zinc-200">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            getInitials(user.name)
          )}
        </div>
        {!collapsed && (
          <span className="truncate text-[13px] font-medium text-zinc-300">
            {user.name}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-1 w-48 rounded-md border border-zinc-700 bg-zinc-800 py-1 shadow-lg">
          <button
            onClick={() => { onSettings?.(); setOpen(false) }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-[13px] text-zinc-300 hover:bg-zinc-700"
          >
            <Settings size={14} />
            Settings
          </button>
          <div className="my-1 border-t border-zinc-700" />
          <button
            onClick={() => { onLogout?.(); setOpen(false) }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-[13px] text-zinc-300 hover:bg-zinc-700"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

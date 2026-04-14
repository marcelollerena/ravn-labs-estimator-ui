import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { MainNav, type NavGroup } from './MainNav'
import { UserMenu } from './UserMenu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface AppShellProps {
  children: React.ReactNode
  navigationGroups: NavGroup[]
  user?: { name: string; avatarUrl?: string }
  onNavigate?: (href: string) => void
  onLogout?: () => void
  onSettings?: () => void
}

function SidebarContent({
  navigationGroups,
  user,
  collapsed = false,
  onNavigate,
  onLogout,
  onSettings,
}: Omit<AppShellProps, 'children'> & { collapsed?: boolean }) {
  return (
    <div className="flex h-full flex-col bg-zinc-950">
      {/* Logo */}
      <div className={`flex h-12 shrink-0 items-center border-b border-zinc-800/50 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
        {collapsed ? (
          <span className="text-[13px] font-bold text-zinc-100">E</span>
        ) : (
          <span className="text-[13px] font-semibold tracking-tight text-zinc-100">
            Estimator
          </span>
        )}
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto py-3">
        <MainNav groups={navigationGroups} collapsed={collapsed} onNavigate={onNavigate} />
      </div>

      {/* User menu */}
      {user && (
        <div className="shrink-0 border-t border-zinc-800/50 px-2 py-2">
          <UserMenu user={user} collapsed={collapsed} onLogout={onLogout} onSettings={onSettings} />
        </div>
      )}
    </div>
  )
}

export function AppShell({
  children,
  navigationGroups,
  user,
  onNavigate,
  onLogout,
  onSettings,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden font-['Inter',system-ui,sans-serif]">
      {/* Desktop sidebar */}
      <aside className="hidden w-[232px] shrink-0 lg:block">
        <SidebarContent
          navigationGroups={navigationGroups}
          user={user}
          onNavigate={onNavigate}
          onLogout={onLogout}
          onSettings={onSettings}
        />
      </aside>

      {/* Tablet sidebar (collapsed) */}
      <aside className="hidden w-14 shrink-0 md:block lg:hidden">
        <SidebarContent
          navigationGroups={navigationGroups}
          user={user}
          collapsed
          onNavigate={onNavigate}
          onLogout={onLogout}
          onSettings={onSettings}
        />
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex h-12 shrink-0 items-center border-b border-zinc-200 px-4 dark:border-zinc-800 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="text-zinc-600 dark:text-zinc-400">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[232px] p-0">
              <SidebarContent
                navigationGroups={navigationGroups}
                user={user}
                onNavigate={(href) => {
                  setMobileOpen(false)
                  onNavigate?.(href)
                }}
                onLogout={onLogout}
                onSettings={onSettings}
              />
            </SheetContent>
          </Sheet>
          <span className="ml-3 text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
            Estimator
          </span>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-zinc-900">
          {children}
        </main>
      </div>
    </div>
  )
}

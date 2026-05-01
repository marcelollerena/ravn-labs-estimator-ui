import {
  LayoutDashboard,
  FileUp,
  FileText,
  ClipboardCheck,
  FolderOpen,
  BarChart3,
  Plus,
} from 'lucide-react'
import { AppShell } from './components/AppShell'
import { PageHeader } from './components/PageHeader'
import type { NavGroup } from './components/MainNav'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const navigationGroups: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'PRD Ingestion', href: '/ingestion', icon: FileUp },
    ],
  },
  {
    label: 'Estimation',
    items: [
      { label: 'Estimates', href: '/estimates', icon: FileText },
      { label: 'Reviews', href: '/reviews', icon: ClipboardCheck },
    ],
  },
  {
    label: 'Data',
    items: [
      { label: 'Projects', href: '/projects', icon: FolderOpen, isActive: true },
      { label: 'Calibration', href: '/calibration', icon: BarChart3 },
    ],
  },
]

const user = {
  name: 'Alex Morgan',
}

export default function ShellPreview() {
  return (
    <AppShell
      navigationGroups={navigationGroups}
      user={user}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
      onSettings={() => console.log('Settings')}
    >
      <PageHeader
        title="Estimates"
        description="AI-generated project estimates from parsed PRDs"
        status={
          <Badge variant="secondary" className="text-[11px] font-medium">
            12 total
          </Badge>
        }
        actions={
          <Button size="sm" className="h-7 gap-1.5 text-[13px]">
            <Plus size={14} />
            New Estimate
          </Button>
        }
      />
      <div className="p-6">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
            <div className="flex items-center gap-4 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
              <span className="w-[240px]">Project</span>
              <span className="w-[100px]">Status</span>
              <span className="w-[100px]">Complexity</span>
              <span className="w-[120px]">Hours (range)</span>
              <span className="flex-1">Last updated</span>
            </div>
          </div>
          {[
            { name: 'Mobile Banking App', status: 'Confirmed', complexity: 'Complex', hours: '640–920h', date: 'Apr 12, 2026' },
            { name: 'Analytics Dashboard', status: 'In Review', complexity: 'Moderate', hours: '280–400h', date: 'Apr 11, 2026' },
            { name: 'E-commerce Platform', status: 'Draft', complexity: 'Very Complex', hours: '1,200–1,800h', date: 'Apr 10, 2026' },
            { name: 'Internal CRM Tool', status: 'Approved', complexity: 'Moderate', hours: '320–480h', date: 'Apr 9, 2026' },
            { name: 'API Gateway Service', status: 'Draft', complexity: 'Simple', hours: '80–120h', date: 'Apr 8, 2026' },
          ].map((row) => (
            <div
              key={row.name}
              className="flex items-center gap-4 border-b border-zinc-100 px-4 py-2.5 last:border-b-0 hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/30"
            >
              <span className="w-[240px] truncate text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                {row.name}
              </span>
              <span className="w-[100px]">
                <Badge
                  variant="outline"
                  className={`text-[11px] font-medium ${
                    row.status === 'Approved'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                      : row.status === 'In Review'
                        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400'
                        : row.status === 'Confirmed'
                          ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {row.status}
                </Badge>
              </span>
              <span className="w-[100px] text-[13px] text-zinc-600 dark:text-zinc-400">
                {row.complexity}
              </span>
              <span className="w-[120px] font-['JetBrains_Mono',monospace] text-[12px] text-zinc-600 dark:text-zinc-400">
                {row.hours}
              </span>
              <span className="flex-1 text-[12px] text-zinc-400 dark:text-zinc-500">
                {row.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

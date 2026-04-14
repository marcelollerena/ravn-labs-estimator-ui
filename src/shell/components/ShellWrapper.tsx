import {
  LayoutDashboard,
  FileUp,
  FileText,
  ClipboardCheck,
  FolderOpen,
  BarChart3,
} from 'lucide-react'
import { AppShell } from './AppShell'
import type { NavGroup } from './MainNav'

const navigationGroups: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'PRD Ingestion', href: '/ingestion', icon: FileUp, isActive: true },
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
      { label: 'Projects', href: '/projects', icon: FolderOpen },
      { label: 'Calibration', href: '/calibration', icon: BarChart3 },
    ],
  },
]

const user = { name: 'Alex Morgan' }

export default function ShellWrapper({ children }: { children?: React.ReactNode }) {
  return (
    <AppShell
      navigationGroups={navigationGroups}
      user={user}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
      onSettings={() => console.log('Settings')}
    >
      {children}
    </AppShell>
  )
}

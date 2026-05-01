import { useState } from 'react'
import data from '@/../product/sections/estimate-output-and-export/data.json'
import { ExportDashboardView } from './components/ExportDashboardView'
import type { ExportDashboard, ExportProfile } from '@/../product/sections/estimate-output-and-export/types'

export default function ExportDashboardPreview() {
  const dashboard = data.dashboard as unknown as ExportDashboard
  const [activeProfile, setActiveProfile] = useState<ExportProfile>(dashboard.activeProfile)

  const currentDashboard = { ...dashboard, activeProfile }

  return (
    <ExportDashboardView
      dashboard={currentDashboard}
      onSwitchProfile={(profile) => {
        setActiveProfile(profile)
        console.log('Switch profile:', profile)
      }}
      onToggleSection={(sectionId, profile, included) => console.log('Toggle section:', sectionId, profile, included)}
      onUpdateNotes={(profile, notes) => console.log('Update notes:', profile, notes)}
      onExport={(format, profile) => console.log('Export:', format, profile)}
      onCopyLink={(url) => {
        navigator.clipboard?.writeText(url)
        console.log('Copy link:', url)
      }}
      onDownload={(id) => console.log('Download:', id)}
    />
  )
}

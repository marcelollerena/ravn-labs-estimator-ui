import { FileOutput, Building2, Users } from 'lucide-react'
import { PageHeader } from '@/shell/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { ExportMetadataBar } from './ExportMetadataBar'
import { SectionToggles } from './SectionToggles'
import { ExportActions } from './ExportActions'
import { DocumentPreview } from './DocumentPreview'
import { ExportHistory } from './ExportHistory'
import { CoverNotes } from './CoverNotes'
import type { ExportDashboard, ExportProfile, ExportFormat } from '@/../product/sections/estimate-output-and-export/types'

interface ExportDashboardViewProps {
  dashboard: ExportDashboard
  onSwitchProfile?: (profile: ExportProfile) => void
  onToggleSection?: (sectionId: string, profile: ExportProfile, included: boolean) => void
  onUpdateNotes?: (profile: ExportProfile, notes: string) => void
  onExport?: (format: ExportFormat, profile: ExportProfile) => void
  onCopyLink?: (url: string) => void
  onDownload?: (historyEntryId: string) => void
}

export function ExportDashboardView({
  dashboard,
  onSwitchProfile,
  onToggleSection,
  onUpdateNotes,
  onExport,
  onCopyLink,
  onDownload,
}: ExportDashboardViewProps) {
  const { activeProfile } = dashboard
  const preview = activeProfile === 'internal' ? dashboard.internalPreview : dashboard.clientPreview
  const notes = activeProfile === 'internal' ? dashboard.notes.internal : dashboard.notes.client

  return (
    <div className="flex flex-col">
      <PageHeader
        title={dashboard.metadata.projectName}
        description="Export & Handoff"
        status={
          <Badge
            variant="outline"
            className="border-emerald-200 bg-emerald-50 text-[11px] font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
          >
            <FileOutput size={11} className="mr-1" />
            Ready to Export
          </Badge>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] space-y-5 p-6">
          {/* Metadata bar */}
          <ExportMetadataBar metadata={dashboard.metadata} />

          {/* Profile selector */}
          <div className="flex items-stretch gap-3">
            <button
              onClick={() => onSwitchProfile?.('internal')}
              className={`flex flex-1 items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                activeProfile === 'internal'
                  ? 'border-violet-300 bg-violet-50/50 ring-1 ring-violet-200 dark:border-violet-700 dark:bg-violet-950/30 dark:ring-violet-800'
                  : 'border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800'
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                activeProfile === 'internal'
                  ? 'bg-violet-100 dark:bg-violet-900/50'
                  : 'bg-zinc-100 dark:bg-zinc-800'
              }`}>
                <Building2 size={14} className={activeProfile === 'internal' ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-500'} />
              </div>
              <div>
                <p className={`text-[13px] font-medium ${
                  activeProfile === 'internal' ? 'text-violet-900 dark:text-violet-200' : 'text-zinc-700 dark:text-zinc-300'
                }`}>Internal</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Full detail, all sections</p>
              </div>
            </button>
            <button
              onClick={() => onSwitchProfile?.('client')}
              className={`flex flex-1 items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                activeProfile === 'client'
                  ? 'border-emerald-300 bg-emerald-50/50 ring-1 ring-emerald-200 dark:border-emerald-700 dark:bg-emerald-950/30 dark:ring-emerald-800'
                  : 'border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800'
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                activeProfile === 'client'
                  ? 'bg-emerald-100 dark:bg-emerald-900/50'
                  : 'bg-zinc-100 dark:bg-zinc-800'
              }`}>
                <Users size={14} className={activeProfile === 'client' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'} />
              </div>
              <div>
                <p className={`text-[13px] font-medium ${
                  activeProfile === 'client' ? 'text-emerald-900 dark:text-emerald-200' : 'text-zinc-700 dark:text-zinc-300'
                }`}>Client-Ready</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Clean, no internal data</p>
              </div>
            </button>
          </div>

          {/* Main content: sidebar + preview */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
            {/* Left sidebar: toggles + actions + notes */}
            <div className="space-y-5">
              <SectionToggles
                sections={dashboard.sections}
                activeProfile={activeProfile}
                onToggleSection={onToggleSection}
              />
              <ExportActions
                actions={dashboard.actions}
                activeProfile={activeProfile}
                onExport={onExport}
                onCopyLink={onCopyLink}
              />
              <CoverNotes
                notes={notes}
                profile={activeProfile}
                onUpdateNotes={onUpdateNotes}
              />
            </div>

            {/* Right: document preview */}
            <DocumentPreview preview={preview} profile={activeProfile} />
          </div>

          {/* Export history */}
          <ExportHistory history={dashboard.history} onDownload={onDownload} />
        </div>
      </div>
    </div>
  )
}

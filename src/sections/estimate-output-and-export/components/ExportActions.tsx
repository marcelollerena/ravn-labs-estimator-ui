import { FileText, FileCode, Link2, Check, Loader2, Download, Copy } from 'lucide-react'
import type { ExportAction, ExportFormat, ExportProfile } from '@/../product/sections/estimate-output-and-export/types'

interface ExportActionsProps {
  actions: ExportAction[]
  activeProfile: ExportProfile
  onExport?: (format: ExportFormat, profile: ExportProfile) => void
  onCopyLink?: (url: string) => void
}

const FORMAT_CONFIG: Record<ExportFormat, { icon: typeof FileText; label: string; description: string }> = {
  pdf: { icon: FileText, label: 'PDF', description: 'Formatted document' },
  markdown: { icon: FileCode, label: 'Markdown', description: 'Raw text format' },
  web_link: { icon: Link2, label: 'Web Link', description: 'Shareable URL' },
}

export function ExportActions({ actions, activeProfile, onExport, onCopyLink }: ExportActionsProps) {
  const profileActions = actions.filter(a => a.profile === activeProfile)

  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Export Actions
        </h2>
      </div>

      <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
        {profileActions.map((action) => {
          const config = FORMAT_CONFIG[action.format]
          const Icon = config.icon

          return (
            <div key={action.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                  <Icon size={14} className="text-zinc-600 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">{config.label}</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{config.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {action.status === 'completed' && (
                  <>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                      <Check size={11} />
                      Generated
                    </span>
                    {action.format === 'web_link' && action.fileUrl ? (
                      <button
                        onClick={() => onCopyLink?.(action.fileUrl!)}
                        className="flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      >
                        <Copy size={11} />
                        Copy Link
                      </button>
                    ) : action.fileUrl ? (
                      <a
                        href={action.fileUrl}
                        download={action.fileName || undefined}
                        className="flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      >
                        <Download size={11} />
                        Download
                      </a>
                    ) : null}
                  </>
                )}
                {action.status === 'generating' && (
                  <span className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400">
                    <Loader2 size={11} className="animate-spin" />
                    Generating...
                  </span>
                )}
                {action.status === 'idle' && (
                  <button
                    onClick={() => onExport?.(action.format, activeProfile)}
                    className="flex items-center gap-1 rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Generate
                  </button>
                )}
                {action.status === 'failed' && (
                  <button
                    onClick={() => onExport?.(action.format, activeProfile)}
                    className="flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1 text-[11px] font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

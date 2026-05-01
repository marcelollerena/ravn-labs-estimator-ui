import { Clock, FileText, FileCode, Link2, Download } from 'lucide-react'
import type { ExportHistoryEntry, ExportFormat } from '../types'

interface ExportHistoryProps {
  history: ExportHistoryEntry[]
  onDownload?: (historyEntryId: string) => void
}

const FORMAT_ICONS: Record<ExportFormat, typeof FileText> = {
  pdf: FileText,
  markdown: FileCode,
  web_link: Link2,
}

const FORMAT_LABELS: Record<ExportFormat, string> = {
  pdf: 'PDF',
  markdown: 'Markdown',
  web_link: 'Web Link',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ExportHistory({ history, onDownload }: ExportHistoryProps) {
  if (history.length === 0) return null

  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <Clock size={13} className="text-zinc-400 dark:text-zinc-500" />
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Export History
        </h2>
        <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
          {history.length}
        </span>
      </div>

      <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
        {history.map((entry) => {
          const Icon = FORMAT_ICONS[entry.format]
          return (
            <div key={entry.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <div className="flex items-center gap-3">
                <Icon size={13} className="shrink-0 text-zinc-400 dark:text-zinc-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100">
                      {FORMAT_LABELS[entry.format]}
                    </span>
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium uppercase ${
                      entry.profile === 'internal'
                        ? 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400'
                        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                    }`}>
                      {entry.profile}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {formatDate(entry.exportedAt)} · {entry.exportedBy}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDownload?.(entry.id)}
                className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                title="Download"
              >
                <Download size={13} />
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

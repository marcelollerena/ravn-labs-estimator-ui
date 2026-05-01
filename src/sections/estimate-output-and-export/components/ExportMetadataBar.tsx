import { Hash, User, Calendar, Target, FileText } from 'lucide-react'
import type { ExportMetadata } from '@/../product/sections/estimate-output-and-export/types'

interface ExportMetadataBarProps {
  metadata: ExportMetadata
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function confidenceColor(c: number): string {
  if (c >= 0.8) return 'text-emerald-600 dark:text-emerald-400'
  if (c >= 0.6) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

export function ExportMetadataBar({ metadata }: ExportMetadataBarProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3">
        <div className="flex items-center gap-1.5">
          <Hash size={12} className="text-zinc-400 dark:text-zinc-500" />
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">ID</span>
          <span className="font-['JetBrains_Mono',monospace] text-[12px] font-medium text-zinc-700 dark:text-zinc-300">{metadata.estimateId}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">v</span>
          <span className="font-['JetBrains_Mono',monospace] text-[12px] font-medium text-zinc-700 dark:text-zinc-300">{metadata.version}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User size={12} className="text-zinc-400 dark:text-zinc-500" />
          <span className="text-[12px] text-zinc-700 dark:text-zinc-300">{metadata.reviewerName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-zinc-400 dark:text-zinc-500" />
          <span className="text-[12px] text-zinc-600 dark:text-zinc-400">{formatDate(metadata.approvedAt)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText size={12} className="text-zinc-400 dark:text-zinc-500" />
          <span className="font-['JetBrains_Mono',monospace] text-[12px] font-medium text-zinc-700 dark:text-zinc-300">{metadata.totalFeatures}</span>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">features</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-['JetBrains_Mono',monospace] text-[12px] font-medium text-zinc-700 dark:text-zinc-300">{metadata.totalHoursLikely.toLocaleString()}</span>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">hours</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Target size={12} className="text-zinc-400 dark:text-zinc-500" />
          <span className={`font-['JetBrains_Mono',monospace] text-[12px] font-medium ${confidenceColor(metadata.overallConfidence)}`}>
            {Math.round(metadata.overallConfidence * 100)}%
          </span>
        </div>
        <span className={`rounded px-2.5 py-0.5 text-[10px] font-medium uppercase ${
          metadata.status === 'exported'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
            : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
        }`}>
          {metadata.status}
        </span>
      </div>
    </div>
  )
}

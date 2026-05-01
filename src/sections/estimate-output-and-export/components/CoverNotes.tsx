import { MessageSquare } from 'lucide-react'
import type { ExportProfile } from '@/../product/sections/estimate-output-and-export/types'

interface CoverNotesProps {
  notes: string
  profile: ExportProfile
  onUpdateNotes?: (profile: ExportProfile, notes: string) => void
}

export function CoverNotes({ notes, profile, onUpdateNotes }: CoverNotesProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <MessageSquare size={13} className="text-zinc-400 dark:text-zinc-500" />
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {profile === 'internal' ? 'Internal Notes' : 'Client Cover Notes'}
        </h2>
      </div>

      <div className="p-4">
        <textarea
          value={notes}
          onChange={(e) => onUpdateNotes?.(profile, e.target.value)}
          rows={4}
          className="w-full resize-y rounded-md border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-[12px] leading-relaxed text-zinc-700 placeholder:text-zinc-400 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 dark:placeholder:text-zinc-500 dark:focus:border-blue-600 dark:focus:ring-blue-600"
          placeholder={profile === 'internal' ? 'Add internal review notes...' : 'Add cover notes for the client...'}
        />
        <p className="mt-1.5 text-[10px] text-zinc-400 dark:text-zinc-500">
          {profile === 'internal'
            ? 'These notes are included in the internal export only.'
            : 'These notes appear at the top of the client-ready document.'}
        </p>
      </div>
    </section>
  )
}

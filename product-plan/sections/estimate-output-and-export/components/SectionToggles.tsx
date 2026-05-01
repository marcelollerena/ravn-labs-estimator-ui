import { Check, Lock } from 'lucide-react'
import type { ExportSection, ExportProfile } from '../types'

interface SectionTogglesProps {
  sections: ExportSection[]
  activeProfile: ExportProfile
  onToggleSection?: (sectionId: string, profile: ExportProfile, included: boolean) => void
}

export function SectionToggles({ sections, activeProfile, onToggleSection }: SectionTogglesProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Included Sections
        </h2>
        <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
          {sections.filter(s => activeProfile === 'internal' ? s.includedInInternal : s.includedInClient).length}/{sections.length}
        </span>
      </div>

      <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
        {sections.map((section) => {
          const included = activeProfile === 'internal' ? section.includedInInternal : section.includedInClient
          const isClientUnsafe = activeProfile === 'client' && !section.clientSafe

          return (
            <button
              key={section.id}
              onClick={() => {
                if (!isClientUnsafe) {
                  onToggleSection?.(section.id, activeProfile, !included)
                }
              }}
              disabled={isClientUnsafe}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                isClientUnsafe
                  ? 'cursor-not-allowed opacity-40'
                  : 'hover:bg-zinc-50/70 dark:hover:bg-zinc-800/20'
              }`}
            >
              {/* Checkbox */}
              <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                included
                  ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-500'
                  : 'border-zinc-300 dark:border-zinc-600'
              }`}>
                {included && <Check size={10} className="text-white" strokeWidth={3} />}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                  {section.label}
                </span>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {section.description}
                </p>
              </div>

              {isClientUnsafe && (
                <Lock size={12} className="shrink-0 text-zinc-400 dark:text-zinc-500" />
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

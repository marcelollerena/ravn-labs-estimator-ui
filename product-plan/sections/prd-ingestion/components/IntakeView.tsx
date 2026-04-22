import { useState, useCallback } from 'react'
import { Upload, FileText, ClipboardPaste, FormInput, Plus, X } from 'lucide-react'
import { PageHeader } from '../../shell/components/PageHeader'
import type { StructuredFormInput } from '../types'

interface IntakeViewProps {
  onUploadFile?: (file: File) => void
  onPasteText?: (text: string) => void
  onSubmitForm?: (input: StructuredFormInput) => void
}

type InputMethod = 'upload' | 'paste' | 'form'

const ACCEPTED_FORMATS = [
  { ext: 'PDF', mime: '.pdf' },
  { ext: 'DOCX', mime: '.docx' },
  { ext: 'MD', mime: '.md' },
]

export function IntakeView({ onUploadFile, onPasteText, onSubmitForm }: IntakeViewProps) {
  const [method, setMethod] = useState<InputMethod>('upload')
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [pasteText, setPasteText] = useState('')
  const [formData, setFormData] = useState<StructuredFormInput>({
    title: '',
    description: '',
    features: [{ name: '', description: '' }],
    constraints: [''],
  })

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) setSelectedFile(file)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  function handleSubmit() {
    if (method === 'upload' && selectedFile) onUploadFile?.(selectedFile)
    else if (method === 'paste' && pasteText.trim()) onPasteText?.(pasteText.trim())
    else if (method === 'form') onSubmitForm?.(formData)
  }

  const canSubmit =
    (method === 'upload' && selectedFile !== null) ||
    (method === 'paste' && pasteText.trim().length > 0) ||
    (method === 'form' && formData.title.trim().length > 0)

  const methods: { id: InputMethod; label: string; icon: typeof Upload; desc: string }[] = [
    { id: 'upload', label: 'Upload File', icon: Upload, desc: 'PDF, DOCX, or Markdown' },
    { id: 'paste', label: 'Paste Text', icon: ClipboardPaste, desc: 'Raw PRD content' },
    { id: 'form', label: 'Structured Form', icon: FormInput, desc: 'Manual entry' },
  ]

  return (
    <div>
      <PageHeader
        title="PRD Ingestion"
        description="Provide a PRD document to extract structured project data for estimation"
      />

      <div className="mx-auto max-w-[720px] p-6">
        {/* Method selector */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {methods.map((m) => {
            const Icon = m.icon
            const isActive = method === m.id
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex flex-col items-start rounded-lg border px-4 py-3 text-left transition-all ${
                  isActive
                    ? 'border-blue-200 bg-blue-50/50 ring-1 ring-blue-200 dark:border-blue-800 dark:bg-blue-950/30 dark:ring-blue-800'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600'
                }`}
              >
                <Icon
                  size={16}
                  className={`mb-2 ${isActive ? 'text-blue-500' : 'text-zinc-400 dark:text-zinc-500'}`}
                />
                <span
                  className={`text-[13px] font-medium ${
                    isActive ? 'text-blue-700 dark:text-blue-300' : 'text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {m.label}
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{m.desc}</span>
              </button>
            )
          })}
        </div>

        {/* Input area */}
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          {method === 'upload' && (
            <div className="p-5">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50/50 dark:border-blue-600 dark:bg-blue-950/20'
                    : selectedFile
                      ? 'border-emerald-300 bg-emerald-50/30 dark:border-emerald-700 dark:bg-emerald-950/20'
                      : 'border-zinc-200 bg-zinc-50/50 dark:border-zinc-700 dark:bg-zinc-800/30'
                }`}
              >
                {selectedFile ? (
                  <>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                      <FileText size={18} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                      {selectedFile.name}
                    </p>
                    <p className="mt-0.5 font-['JetBrains_Mono',monospace] text-[11px] text-zinc-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="mt-3 text-[12px] text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <Upload
                      size={20}
                      className={`mb-3 ${dragActive ? 'text-blue-500' : 'text-zinc-300 dark:text-zinc-600'}`}
                    />
                    <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                      Drag and drop your PRD, or{' '}
                      <label className="cursor-pointer font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400">
                        browse
                        <input
                          type="file"
                          accept=".pdf,.docx,.md"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </p>
                    <div className="mt-3 flex gap-2">
                      {ACCEPTED_FORMATS.map((f) => (
                        <span
                          key={f.ext}
                          className="rounded border border-zinc-200 px-2 py-0.5 font-['JetBrains_Mono',monospace] text-[10px] font-medium text-zinc-400 dark:border-zinc-700 dark:text-zinc-500"
                        >
                          {f.ext}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {method === 'paste' && (
            <div className="p-5">
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste your PRD content here..."
                className="min-h-[280px] w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 font-['JetBrains_Mono',monospace] text-[12px] leading-relaxed text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 dark:border-zinc-700 dark:bg-zinc-800/30 dark:text-zinc-200 dark:placeholder:text-zinc-600 dark:focus:border-blue-700"
              />
              <div className="mt-2 text-right font-['JetBrains_Mono',monospace] text-[11px] text-zinc-400 dark:text-zinc-500">
                {pasteText.length.toLocaleString()} chars
              </div>
            </div>
          )}

          {method === 'form' && (
            <div className="space-y-5 p-5">
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
                  Project Title
                </label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Mobile Banking App"
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-700"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the project..."
                  className="min-h-[80px] w-full resize-y rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-700"
                  rows={3}
                />
              </div>

              {/* Features repeater */}
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
                  Features
                </label>
                <div className="space-y-2">
                  {formData.features.map((feat, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={feat.name}
                        onChange={(e) => {
                          const f = [...formData.features]
                          f[i] = { ...f[i], name: e.target.value }
                          setFormData({ ...formData, features: f })
                        }}
                        placeholder="Feature name"
                        className="w-[180px] shrink-0 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-700"
                      />
                      <input
                        value={feat.description}
                        onChange={(e) => {
                          const f = [...formData.features]
                          f[i] = { ...f[i], description: e.target.value }
                          setFormData({ ...formData, features: f })
                        }}
                        placeholder="Description"
                        className="flex-1 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-700"
                      />
                      {formData.features.length > 1 && (
                        <button
                          onClick={() =>
                            setFormData({
                              ...formData,
                              features: formData.features.filter((_, j) => j !== i),
                            })
                          }
                          className="rounded p-1.5 text-zinc-300 hover:bg-zinc-100 hover:text-zinc-500 dark:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        features: [...formData.features, { name: '', description: '' }],
                      })
                    }
                    className="flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    <Plus size={13} />
                    Add feature
                  </button>
                </div>
              </div>

              {/* Constraints repeater */}
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
                  Technical Constraints
                </label>
                <div className="space-y-2">
                  {formData.constraints.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={c}
                        onChange={(e) => {
                          const cs = [...formData.constraints]
                          cs[i] = e.target.value
                          setFormData({ ...formData, constraints: cs })
                        }}
                        placeholder="e.g. React Native, PostgreSQL required"
                        className="flex-1 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-300 focus:ring-1 focus:ring-blue-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-700"
                      />
                      {formData.constraints.length > 1 && (
                        <button
                          onClick={() =>
                            setFormData({
                              ...formData,
                              constraints: formData.constraints.filter((_, j) => j !== i),
                            })
                          }
                          className="rounded p-1.5 text-zinc-300 hover:bg-zinc-100 hover:text-zinc-500 dark:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setFormData({ ...formData, constraints: [...formData.constraints, ''] })
                    }
                    className="flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    <Plus size={13} />
                    Add constraint
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="mt-5 flex items-center justify-end">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-md bg-blue-500 px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Parse PRD
          </button>
        </div>
      </div>
    </div>
  )
}

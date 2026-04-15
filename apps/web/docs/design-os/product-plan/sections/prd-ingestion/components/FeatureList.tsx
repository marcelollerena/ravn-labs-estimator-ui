import { useState } from 'react';
import { Plus, X, GripVertical, Check, Pencil } from 'lucide-react';
import type { RequestFeature } from '../types';

interface FeatureListProps {
  features: RequestFeature[];
  onAdd?: (feature: { name: string; description: string }) => void;
  onUpdate?: (featureId: string, updates: Partial<RequestFeature>) => void;
  onRemove?: (featureId: string) => void;
}

export function FeatureList({ features, onAdd, onUpdate, onRemove }: FeatureListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  function startEdit(feature: RequestFeature) {
    setEditingId(feature.id);
    setEditName(feature.name);
    setEditDesc(feature.description);
  }

  function commitEdit() {
    if (!editingId || !editName.trim()) return;
    onUpdate?.(editingId, { name: editName.trim(), description: editDesc.trim() });
    setEditingId(null);
  }

  function commitAdd() {
    if (!newName.trim()) return;
    onAdd?.({ name: newName.trim(), description: newDesc.trim() });
    setNewName('');
    setNewDesc('');
    setIsAdding(false);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
        <span className="w-8 shrink-0" />
        <span className="w-[200px] shrink-0 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Feature
        </span>
        <span className="flex-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Description
        </span>
        <span className="w-16 shrink-0" />
      </div>

      {/* Feature rows */}
      {features.map((feature, index) => (
        <div
          key={feature.id}
          className="group flex items-start border-b border-zinc-100 px-3 py-2.5 last:border-b-0 hover:bg-zinc-50/70 dark:border-zinc-800/50 dark:hover:bg-zinc-800/20"
        >
          {editingId === feature.id ? (
            <>
              <span className="w-8 shrink-0 pt-1.5 text-center font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-1 gap-3">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-[192px] shrink-0 rounded border border-blue-300 bg-white px-2 py-1 text-[13px] font-medium text-zinc-900 outline-none focus:ring-1 focus:ring-blue-400 dark:border-blue-700 dark:bg-zinc-900 dark:text-zinc-100"
                  autoFocus
                />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commitEdit();
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="flex-1 resize-none rounded border border-blue-300 bg-white px-2 py-1 text-[13px] text-zinc-700 outline-none focus:ring-1 focus:ring-blue-400 dark:border-blue-700 dark:bg-zinc-900 dark:text-zinc-300"
                  rows={2}
                />
              </div>
              <div className="flex w-16 shrink-0 items-start justify-end gap-1 pt-1">
                <button
                  onClick={commitEdit}
                  className="rounded p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                >
                  <X size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="w-8 shrink-0 pt-0.5 text-center">
                <GripVertical
                  size={14}
                  className="mx-auto text-zinc-200 opacity-0 group-hover:opacity-100 dark:text-zinc-700"
                />
              </span>
              <span className="w-[200px] shrink-0 pr-3 text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                {feature.name}
              </span>
              <span className="flex-1 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {feature.description}
              </span>
              <div className="flex w-16 shrink-0 items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => startEdit(feature)}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => onRemove?.(feature.id)}
                  className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Add feature */}
      {isAdding ? (
        <div className="flex items-start border-t border-zinc-100 px-3 py-2.5 dark:border-zinc-800/50">
          <span className="w-8 shrink-0 pt-1.5 text-center font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
            {String(features.length + 1).padStart(2, '0')}
          </span>
          <div className="flex flex-1 gap-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Feature name"
              className="w-[192px] shrink-0 rounded border border-zinc-300 bg-white px-2 py-1 text-[13px] font-medium text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
              autoFocus
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commitAdd();
                if (e.key === 'Escape') {
                  setIsAdding(false);
                  setNewName('');
                  setNewDesc('');
                }
              }}
              placeholder="Description"
              className="flex-1 resize-none rounded border border-zinc-300 bg-white px-2 py-1 text-[13px] text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
              rows={2}
            />
          </div>
          <div className="flex w-16 shrink-0 items-start justify-end gap-1 pt-1">
            <button
              onClick={commitAdd}
              className="rounded p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewName('');
                setNewDesc('');
              }}
              className="rounded p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-2.5 text-[13px] text-zinc-400 transition-colors hover:text-blue-500 dark:text-zinc-500 dark:hover:text-blue-400"
        >
          <span className="w-8 shrink-0" />
          <Plus size={13} />
          Add feature
        </button>
      )}
    </div>
  );
}

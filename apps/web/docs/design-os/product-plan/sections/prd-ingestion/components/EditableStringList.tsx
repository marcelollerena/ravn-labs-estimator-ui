import { useState } from 'react';
import { Plus, X, Pencil, Check } from 'lucide-react';

interface EditableStringListProps {
  items: string[];
  onUpdate?: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

export function EditableStringList({
  items,
  onUpdate,
  placeholder = 'Add item...',
  addLabel = 'Add',
}: EditableStringListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [addValue, setAddValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  function startEdit(index: number) {
    setEditingIndex(index);
    setEditValue(items[index]);
  }

  function commitEdit() {
    if (editingIndex === null || !editValue.trim()) return;
    const updated = [...items];
    updated[editingIndex] = editValue.trim();
    onUpdate?.(updated);
    setEditingIndex(null);
    setEditValue('');
  }

  function removeItem(index: number) {
    onUpdate?.(items.filter((_, i) => i !== index));
  }

  function addItem() {
    if (!addValue.trim()) return;
    onUpdate?.([...items, addValue.trim()]);
    setAddValue('');
    setIsAdding(false);
  }

  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <div
          key={index}
          className="group flex items-start gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
        >
          {editingIndex === index ? (
            <div className="flex flex-1 items-start gap-1.5">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    commitEdit();
                  }
                  if (e.key === 'Escape') setEditingIndex(null);
                }}
                className="flex-1 resize-none rounded border border-blue-300 bg-white px-2 py-1 text-[13px] text-zinc-900 outline-none focus:ring-1 focus:ring-blue-400 dark:border-blue-700 dark:bg-zinc-900 dark:text-zinc-100"
                rows={2}
                autoFocus
              />
              <button
                onClick={commitEdit}
                className="mt-1 rounded p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                <Check size={14} />
              </button>
            </div>
          ) : (
            <>
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <span className="flex-1 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                {item}
              </span>
              <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => startEdit(index)}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {isAdding ? (
        <div className="flex items-start gap-1.5 px-2.5 py-1.5">
          <textarea
            value={addValue}
            onChange={(e) => setAddValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addItem();
              }
              if (e.key === 'Escape') {
                setIsAdding(false);
                setAddValue('');
              }
            }}
            placeholder={placeholder}
            className="flex-1 resize-none rounded border border-zinc-300 bg-white px-2 py-1 text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            rows={2}
            autoFocus
          />
          <button
            onClick={addItem}
            className="mt-1 rounded p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            <Check size={14} />
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setAddValue('');
            }}
            className="mt-1 rounded p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] text-zinc-400 transition-colors hover:text-blue-500 dark:text-zinc-500 dark:hover:text-blue-400"
        >
          <Plus size={13} />
          {addLabel}
        </button>
      )}
    </div>
  );
}

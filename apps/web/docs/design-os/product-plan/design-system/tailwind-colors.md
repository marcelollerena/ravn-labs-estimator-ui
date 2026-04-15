# Tailwind Color Configuration

## Color Choices

- **Primary:** `blue` — Used for buttons, links, active nav states, focus rings
- **Secondary:** `slate` — Used for tags, badges, secondary surfaces, muted elements
- **Neutral:** `zinc` — Used for backgrounds, text hierarchy, borders, sidebar

## Usage Examples

Primary button: `bg-blue-500 hover:bg-blue-600 text-white`
Active nav: `bg-blue-500/10 text-blue-400`
Secondary badge: `bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300`
Neutral text: `text-zinc-600 dark:text-zinc-400`
Neutral border: `border-zinc-200 dark:border-zinc-700`
Sidebar background: `bg-zinc-950` (always dark)
Content background: `bg-white dark:bg-zinc-900`

## Semantic Colors (status indicators)

- Draft: `border-zinc-200 bg-zinc-50 text-zinc-600`
- Parsing: `border-blue-200 bg-blue-50 text-blue-600`
- Confirmed: `border-emerald-200 bg-emerald-50 text-emerald-700`
- In Review: `border-amber-200 bg-amber-50 text-amber-700`
- Approved: `border-emerald-200 bg-emerald-50 text-emerald-700`
- Error: `border-red-200 bg-red-50 text-red-600`

## AI-Inferred Sections

- Ambiguities: amber tint — `border-amber-200/60 bg-amber-50/30`
- Implicit Requirements: violet tint — `border-violet-200/60 bg-violet-50/30`

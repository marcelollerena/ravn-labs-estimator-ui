# Tailwind Color Configuration

## Color Choices

- **Primary:** `blue` — Used for buttons, links, active states, key accents
- **Secondary:** `slate` — Used for tags, industry badges, secondary elements
- **Neutral:** `zinc` — Used for backgrounds, text, borders, cards

## Usage Examples

Primary button: `bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-500`
Secondary button: `border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800`
Active nav item: `bg-blue-500/10 text-blue-400`
Card: `rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900`
Badge (success): `border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400`
Badge (warning): `border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400`
Badge (danger): `border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400`

## Sidebar

The sidebar is always dark regardless of theme:
- Background: `bg-zinc-950`
- Text: `text-zinc-400` (default), `text-blue-400` (active)
- Hover: `hover:bg-zinc-800/50`
- Section labels: `text-zinc-500` at 11px uppercase

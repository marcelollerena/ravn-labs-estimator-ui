# Milestone 1: Shell

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Goal

Set up the design tokens and application shell — the persistent chrome that wraps all sections.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Colors:**
- Primary: `blue` — buttons, links, active nav items, key accents
- Secondary: `slate` — tags, badges, secondary elements
- Neutral: `zinc` — backgrounds, text, borders, sidebar

**Typography:**
- Heading & Body: Inter (400-700 weight)
- Code/Mono: JetBrains Mono (400-500 weight)

### 2. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with sidebar and content area
- `MainNav.tsx` — Navigation component with grouped items and active state
- `PageHeader.tsx` — Page header with title, description, status badge, and actions
- `UserMenu.tsx` — User menu with avatar initials and dropdown

**Wire Up Navigation:**

Connect navigation to your routing:

| Label | Route | Icon | Group |
|-------|-------|------|-------|
| Dashboard | `/` | LayoutDashboard | Main |
| PRD Ingestion | `/ingestion` | FileUp | Main |
| Estimates | `/estimates` | FileText | Estimation |
| Reviews | `/reviews` | ClipboardCheck | Estimation |
| Projects | `/projects` | FolderOpen | Data |
| Calibration | `/calibration` | BarChart3 | Data |

**User Menu:**

The user menu expects:
- User name (displayed as initials in avatar)
- Avatar URL (optional — falls back to initials)
- Logout callback
- Settings callback

All users are Ravn employees (WorkOS AuthKit).

## Layout Details

- Fixed sidebar (232px) on the left, scrollable content on the right
- Sidebar always dark (zinc-950), content area respects light/dark theme
- Tablet (768-1023px): Sidebar collapses to icon-only (56px)
- Mobile (<768px): Sidebar hidden, top bar with hamburger, overlay nav

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (Inter + JetBrains Mono fonts, blue/slate/zinc colors)
- [ ] Shell renders with sidebar navigation
- [ ] Navigation links to correct routes
- [ ] Active nav item is highlighted
- [ ] User menu shows user info with dropdown
- [ ] Responsive: tablet shows collapsed sidebar, mobile shows hamburger menu
- [ ] Dark mode works correctly

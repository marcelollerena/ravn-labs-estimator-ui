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

**Colors:** blue (primary), slate (secondary), zinc (neutral)
**Fonts:** Inter (headings + body), JetBrains Mono (code/numbers)

### 2. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with sidebar + content
- `MainNav.tsx` — Navigation with grouped items and icons
- `UserMenu.tsx` — User menu with avatar, settings, sign out
- `PageHeader.tsx` — Page header with title, description, status, actions

**Wire Up Navigation:**

- Dashboard → `/` — Overview metrics and recent activity
- PRD Ingestion → `/ingestion` — Upload, parse, and review PRDs
- Estimates → `/estimates` — AI-generated estimate list and detail
- Reviews → `/reviews` — Human review queue
- Projects → `/projects` — Historical project database
- Calibration → `/calibration` — Accuracy dashboard

**User Menu:**

The user menu expects:
- User name (string)
- Avatar URL (optional)
- Logout callback
- Settings callback

**Dependencies:** The shell uses `@/components/ui/sheet` and `@/components/ui/dropdown-menu` — install these from shadcn/ui or provide equivalent components.

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (colors, fonts)
- [ ] Shell renders with sidebar navigation
- [ ] Navigation links to correct routes
- [ ] User menu shows user info and dropdown
- [ ] Responsive: full sidebar on desktop, icon-only on tablet, hamburger on mobile
- [ ] Dark mode works correctly

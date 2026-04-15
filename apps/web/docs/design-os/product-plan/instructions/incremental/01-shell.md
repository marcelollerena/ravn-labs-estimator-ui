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
**Fonts:** Inter (heading + body), JetBrains Mono (mono)

### 2. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper (sidebar + content area)
- `MainNav.tsx` — Grouped sidebar navigation
- `UserMenu.tsx` — User menu with avatar and dropdown
- `PageHeader.tsx` — Page title, description, status, and action bar

**Wire Up Navigation:**

The shell uses grouped navigation with these items:

**Main:**
- Dashboard → `/`
- PRD Ingestion → `/ingestion`

**Estimation:**
- Estimates → `/estimates`
- Reviews → `/reviews`

**Data:**
- Projects → `/projects`
- Calibration → `/calibration`

Connect the `onNavigate` callback to your router.

**User Menu:**

The user menu expects:
- User name (string)
- Avatar URL (optional string)
- Logout callback
- Settings callback

**Layout:**
- 232px fixed sidebar (always dark, zinc-950)
- Content area fills remaining width (white / zinc-900)
- Tablet: sidebar collapses to 56px icon-only
- Mobile: sidebar hidden, hamburger menu with sheet overlay

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (Inter + JetBrains Mono loaded, blue/slate/zinc palette)
- [ ] Shell renders with grouped sidebar navigation (6 items in 3 groups)
- [ ] Navigation links to correct routes via `onNavigate`
- [ ] User menu shows user info with settings and logout
- [ ] PageHeader renders title, description, status badge, and action area
- [ ] Responsive: full sidebar → icon-only → hamburger sheet
- [ ] Light and dark mode supported

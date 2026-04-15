# Application Shell

## Overview

A compact sidebar-driven shell for the Estimator. Always-dark sidebar (zinc-950) with grouped navigation. Large content area with a structured PageHeader for title, status, and contextual actions. Designed for dense workflows: multi-step ingestion, structured review, tabular data.

## Navigation Structure

**Main:**
- Dashboard → Overview metrics and recent activity
- PRD Ingestion → Upload, parse, and review PRDs

**Estimation:**
- Estimates → AI-generated estimate list and detail
- Reviews → Human review queue and adjustment interface

**Data:**
- Projects → Historical project database
- Calibration → Accuracy dashboard and trends

## Layout

- Fixed sidebar (232px) on the left, scrollable content on the right
- Sidebar always dark (zinc-950), content area respects light/dark theme
- PageHeader is at top of content area with title, description, status badge, and action slot

## Responsive Behavior

- Desktop (≥1024px): Full sidebar always visible
- Tablet (768-1023px): Sidebar collapses to icon-only (56px), tooltip labels on hover
- Mobile (<768px): Sidebar hidden, top bar with hamburger, sheet overlay for nav

## Components

- `AppShell.tsx` — Main shell wrapper accepting `navigationGroups`, `user`, callbacks, and `children`
- `MainNav.tsx` — Grouped navigation with section labels and active state
- `UserMenu.tsx` — User avatar with dropdown (settings, logout)
- `PageHeader.tsx` — Page title, description, status badge, and action area
- `index.ts` — Barrel exports

## Design Notes

- Sidebar: zinc-950 bg, zinc-400 text, blue-500/10 bg + blue-400 text for active
- Nav groups: 11px uppercase zinc-500 labels
- Icons: lucide-react, 16px
- Logo: "Estimator" at 13px font-semibold
- User avatar: 28px with initials fallback

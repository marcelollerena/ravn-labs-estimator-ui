# Application Shell

## Overview

A compact sidebar-driven shell for the Estimator. Always-dark sidebar with grouped navigation. Large content area with a structured PageHeader for title, status, and contextual actions. Designed for dense workflows: multi-step ingestion, structured review, tabular data.

## Navigation Structure

**Main**
- Dashboard — Overview metrics and recent activity
- PRD Ingestion — Upload, parse, and review PRDs

**Estimation**
- Estimates — AI-generated estimate list and detail
- Reviews — Human review queue and adjustment interface

**Data**
- Projects — Historical project database
- Calibration — Accuracy dashboard and trends

## Components

- `AppShell.tsx` — Main layout wrapper with sidebar + content area
- `MainNav.tsx` — Navigation component with grouped items
- `UserMenu.tsx` — User menu with avatar, settings, and sign out
- `PageHeader.tsx` — Page header with title, description, status badge, and actions
- `index.ts` — Barrel exports

## Layout Pattern

- Fixed sidebar (232px) on the left, scrollable content on the right
- Sidebar always dark (zinc-950), content area respects light/dark theme
- Content area: white / zinc-900 background

## Responsive Behavior

- **Desktop (≥1024px):** Full sidebar always visible
- **Tablet (768-1023px):** Sidebar collapses to icon-only (56px), tooltip labels on hover
- **Mobile (<768px):** Sidebar hidden, top bar with hamburger, sheet overlay for nav

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onNavigate` | User clicks a navigation item |
| `onLogout` | User clicks "Sign out" |
| `onSettings` | User clicks "Settings" |

## User Menu

The user menu expects:
- `user.name` — Display name
- `user.avatarUrl` — Optional avatar image URL
- Falls back to initials when no avatar provided

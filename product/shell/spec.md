# Application Shell Specification

## Overview
A compact sidebar-driven shell for the Estimator, an internal Ravn estimation tool. Always-dark sidebar with grouped navigation. Large content area with a structured PageHeader for title, status, and contextual actions. Designed for dense workflows: multi-step ingestion, structured review, tabular data.

## Navigation Structure

**Main**
- Dashboard → Overview metrics and recent activity
- PRD Ingestion → Upload, parse, and review PRDs

**Estimation**
- Estimates → AI-generated estimate list and detail
- Reviews → Human review queue and adjustment interface

**Data**
- Projects → Historical project database
- Calibration → Accuracy dashboard and trends

## Page Header
Every content page includes a PageHeader component with:
- Page title (required)
- Description or breadcrumb-style context (optional)
- Status badge (optional — e.g., "Draft", "In Review", "Confirmed")
- Right-aligned action area for contextual buttons (optional)
- Bottom border separator from content

## User Menu
Bottom of sidebar. Avatar initials + user name. Dropdown with Settings and Sign Out. All users are Ravn employees (WorkOS AuthKit).

## Layout Pattern
- Fixed sidebar (232px) on the left, scrollable content on the right
- Sidebar always dark (zinc-950), content area respects light/dark theme
- Content area: white / zinc-900 background, no max-width constraint
- PageHeader is sticky at top of content scroll area

## Responsive Behavior
- **Desktop (≥1024px):** Full sidebar always visible
- **Tablet (768-1023px):** Sidebar collapses to icon-only (56px), tooltip labels on hover
- **Mobile (<768px):** Sidebar hidden, top bar with hamburger, sheet overlay for nav

## Design Notes
- Sidebar: zinc-950 bg, zinc-400 text, blue-500 for active item with blue-500/10 bg
- Nav groups: uppercase zinc-500 labels at 11px, separated by spacing
- Hover state: zinc-800/50 background
- Icons: lucide-react, 16px, zinc-500 default, blue-400 active
- Logo: "Estimator" wordmark at top, text-[13px] font-semibold, zinc-100
- PageHeader: 13px description text, 14px badge, right-aligned actions
- Divider between main nav and bottom user section
- No notification badges in MVP

# Estimate Output & Export

## Overview

Lets users generate, preview, and export estimate documents in two variants: a full-detail internal version (for Ravn team use) and a clean client-ready version (for client handoff). Users can toggle sections on/off, switch between audiences, preview the output, and export to PDF, Markdown, or a shareable web link.

## User Flows

- User arrives from Human Review & Adjustment with an approved estimate
- User sees an export dashboard with version metadata and export status
- User selects an export profile: Internal (full detail) or Client-Ready (sanitized)
- User previews the document — can switch between Internal and Client-Ready views
- User toggles individual sections on/off (client-unsafe sections are locked)
- User adds optional cover notes or disclaimers
- User exports to PDF, Markdown, or generates a shareable web link
- User sees export history with past exports

## Design Decisions

- Profile selector as prominent cards with distinct colors (violet for internal, emerald for client)
- Sidebar + preview grid layout for simultaneous toggle and preview
- Client-unsafe sections (comparable projects, adjustment history, AI attribution) locked with padlock icon
- Export actions show idle/generating/completed/failed states
- Document preview adapts content based on active profile

## Components Provided

- `ExportDashboardView` — Main layout with profile selector, sidebar + preview grid
- `ExportMetadataBar` — Version/status metadata bar
- `SectionToggles` — Section inclusion checklist with client-unsafe lock indicators
- `ExportActions` — PDF/Markdown/Web Link buttons with status states
- `DocumentPreview` — Rendered preview adapting to Internal vs Client profile
- `ExportHistory` — Past export log with download actions
- `CoverNotes` — Editable textarea for per-profile notes

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onSwitchProfile` | User switches between Internal and Client |
| `onToggleSection` | User toggles a section on/off |
| `onUpdateNotes` | User edits cover notes |
| `onExport` | User triggers export (PDF, Markdown, Web Link) |
| `onCopyLink` | User copies shareable link |
| `onDownload` | User downloads a previously exported file |

## Data Shapes

**Entities:** ExportDashboard, ExportSection, ExportMetadata, ExportAction, ExportHistoryEntry, PreviewData

See `types.ts` for full interface definitions.

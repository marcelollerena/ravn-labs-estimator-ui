# Estimate Output & Export Specification

## Overview
This section lets users generate, preview, and export estimate documents in two variants: a full-detail internal version (for Ravn team use) and a clean client-ready version (for client handoff). Users can toggle sections on/off, switch between audiences, preview the output side-by-side, and export to PDF, Markdown, or a shareable web link. The interface provides clear control over what each audience sees and maintains version metadata throughout.

## User Flows
- User arrives from Human Review & Adjustment with an approved estimate ready for export.
- User sees an export dashboard with the estimate summary, version metadata (estimate ID, project name, reviewer, approval date, version number), and export status.
- User selects an export profile: Internal (full detail) or Client-Ready (sanitized).
- User previews the document in a rendered panel — can switch between Internal and Client-Ready views side-by-side or in a tabbed layout.
- User toggles individual sections on/off for each export profile: project summary, feature breakdown, hour ranges, assumptions, risks, team recommendation, comparable projects, clarification questions, adjustment history.
- Client-Ready profile automatically hides: internal-only notes, comparable projects, adjustment reasoning, AI vs. human attribution, and detailed hour breakdowns (shows only likely hours).
- User adds optional cover notes, disclaimers, or assumptions that appear in the exported document.
- User exports to PDF, Markdown, or generates a shareable web link. Each action shows a progress state and confirmation.
- User can copy the shareable link or download the generated file.
- User sees a log of previous exports with timestamps, format, and recipient profile.

## UI Requirements
- Export dashboard layout with clear visual separation between profile selection, preview, and actions.
- Profile selector as prominent tabs or toggle: "Internal" and "Client-Ready" with distinct visual treatment.
- Side-by-side or panelized preview showing the rendered document with proper typography and formatting.
- Section toggles as a checklist sidebar or header strip — each toggle clearly labeled with what it controls.
- Internal profile: full detail with AI/human attribution badges, adjustment reasoning, comparable projects, all hour range variants.
- Client-Ready profile: clean presentation with only likely hours, no internal notes, professional framing, disclaimers section.
- Export actions as a button group: PDF, Markdown, Web Link — each with loading/success/error states.
- Version metadata bar showing estimate ID, version, reviewer name, approval date, and status.
- Export history table showing past exports with timestamp, format, profile, and re-download action.
- Cover notes/disclaimers as an editable textarea that persists per profile.
- Content summary showing total sections included, total features, total hours displayed, and a word/page count estimate.
- Clear audience labeling: "This version is for [Internal Team / Client]" with distinct color coding.
- Mobile responsive using Tailwind responsive prefixes.
- Full dark mode support.
- No navigation chrome inside the section — the app shell handles that.

## Configuration
- shell: true

# Projects & Pipeline Overview Specification

## Overview
The Projects page is the central hub for all estimation work. It displays every estimation project — drafts, in-progress estimates, completed work, and archived items — in a single, filterable list. Users can resume a draft at its exact pipeline phase, review a completed estimate, duplicate a project, or archive old work. This is the primary entry point and home screen for the Estimator.

## User Flows

### Browse Projects
- User lands on the Projects page and sees all active projects sorted by last updated (most recent first).
- Each project row shows the project name, status badge, a 4-dot pipeline stepper indicating phase progress, hour range (if available), and last updated timestamp.
- User can switch between Active and Archived tabs. Active shows all non-archived projects. Archived shows only archived projects.
- User can filter by status (Draft, Extracting, Estimating, In Review, Estimated) using a dropdown. The filter is only visible in the Active tab.
- User can search by project name using a text input with debounced filtering.
- User can sort by clicking column headers: name, status, hours, last updated.

### Resume a Draft
- User clicks a project row or selects "Resume" from the quick actions menu.
- The app navigates to the project's current pipeline phase with all prior state restored:
  - Draft → PRD Ingestion (IntakeView with partially-filled form or uploaded file)
  - Extracting → PRD Ingestion (ExtractionReview with parsed data, or ParsingView with error + retry if parsing failed)
  - Estimating → AI Estimation (GenerationProgress if running, EstimationWorkbench if complete, error + retry if failed)
  - In Review → Human Review (ReviewConsole with all pending/accepted/adjusted states preserved)
  - Estimated → Export (ExportDashboard for generating documents)

### View a Completed Estimate
- User clicks a project with "Estimated" status.
- The app opens the estimate in read-only mode at the Export phase.

### Quick Actions
- User opens the context menu (⋯ icon) on any project row.
- Available actions depend on project status:
  - Resume: shown when status is not "estimated" or "archived"
  - View: always shown
  - Duplicate: always shown — creates a new draft with the same PRD content
  - Archive: shown for non-archived projects — requires confirmation
  - Unarchive: shown for archived projects — no confirmation needed
  - Delete: shown only for "draft" or "extracting" status — requires confirmation, destructive action

### Start New Estimate
- User clicks the "New Estimate" button in the page header.
- The app navigates to PRD Ingestion with a blank form.

## UI Requirements
- Page header with title "Projects", description, project count badge, and "New Estimate" primary action button.
- Toolbar with Active/Archived tabs (with count badges), search input, and status filter dropdown.
- Desktop (lg+): table layout with sortable columns — Project (name + description), Status (badge), Phase (4-dot stepper), Hours (low-high range in monospace), Updated (relative date), Actions (⋯ menu).
- Tablet (md to lg): same table with Phase and Hours columns hidden.
- Mobile (below md): card list replacing the table. Each card shows name + status badge, pipeline stepper, hours + date + actions.
- Row hover state for clickable rows.
- Status badges with distinct colors: Draft (zinc/gray), Extracting (blue), Estimating (blue), In Review (amber), Estimated (emerald/green), Archived (stone).
- Pipeline stepper: 4 small circles — completed phases filled blue, current phase filled blue with pulse animation, upcoming phases gray. Tooltip shows phase name on hover.
- Three empty states: no projects at all (with CTA), no filter/search results (with clear action), empty archived tab.
- Loading state with skeleton rows (desktop) and skeleton cards (mobile).
- Full dark mode support using `dark:` variants.
- Mobile responsive using Tailwind responsive prefixes.
- No navigation chrome inside the section — the app shell handles that.

## Configuration
- shell: true

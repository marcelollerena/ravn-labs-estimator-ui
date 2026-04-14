# PRD Ingestion Specification

## Overview
The entry point into the estimation workflow. Users provide a PRD document via file upload (PDF, DOCX, Markdown), text paste, or a structured fallback form. The system parses the document and uses AI to extract a structured representation — title, project overview, feature list, technical constraints, ambiguities, and implicit requirements. The user reviews, edits, and confirms this extraction before it feeds into the estimation pipeline.

## User Flows

### Upload / Input Flow
- User lands on the ingestion page and sees three input methods: file upload, text paste, structured form
- File upload accepts PDF, DOCX, and Markdown via drag-and-drop or file picker
- Text paste provides a textarea for raw PRD content
- Structured form provides fields for title, description, feature list, and constraints as a fallback
- User selects one method and submits content for parsing

### Parsing / Extraction Flow
- System shows a parsing progress state while AI processes the document
- On success, transitions to the review screen with all extracted fields populated
- On failure, shows an error state with the option to retry or switch input method

### Review / Edit Flow
- User reviews the AI-extracted structure: title, project overview, features, technical constraints, ambiguities, implicit requirements
- All fields are editable inline
- Features are the primary editable area: user can add, remove, rename, and rewrite feature names and descriptions
- Technical constraints, ambiguities, and implicit requirements are editable string lists — user can add, remove, and edit items
- Ambiguities and implicit requirements are visually distinct from explicit features and constraints
- User can retry parsing if the extraction quality is poor (returns to parsing state)

### Confirmation Flow
- User confirms the reviewed extraction — status changes from "draft" to "confirmed"
- Confirmed extraction becomes the input for AI estimation
- Once confirmed, user is navigated to the estimation step

## UI Requirements
- Three input methods presented as clearly distinguishable options (tabs or cards) — not buried behind a dropdown
- File upload area with drag-and-drop zone, accepted format labels, and file size indication
- Text paste with a monospace textarea and character count
- Structured form with labeled fields for title, description, features (repeater), and constraints (repeater)
- Parsing state: progress indicator with a status message (not a blank spinner)
- Error state: clear error message, retry button, option to switch input method
- Review screen: structured card or panel layout — each extracted section (overview, features, constraints, ambiguities, implicit requirements) in its own visual region
- Feature list: table or stacked list with name and description columns, inline edit, add/remove controls
- Ambiguities and implicit requirements: visually tagged as AI-inferred (e.g., subtle background color or icon marker) to distinguish from explicit PRD content
- Confirm button is prominent and only enabled when the extraction has at least a title and one feature
- Status indicator showing current state: draft, parsing, confirmed
- Source format badge (PDF, DOCX, Markdown, Text, Form) visible during review

## Configuration
- shell: true

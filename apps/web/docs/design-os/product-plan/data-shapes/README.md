# UI Data Shapes

These types define the shape of data that the UI components expect to receive as props. They represent the **frontend contract** — what the components need to render correctly.

How you model, store, and fetch this data on the backend is an implementation decision. You may combine, split, or extend these types to fit your architecture.

## Entities

- **EstimationRequest** — A parsed PRD serving as input to the estimation pipeline (used in: prd-ingestion)
- **RequestFeature** — A discrete feature extracted from a PRD (used in: prd-ingestion)
- **SourceFormat** — Union type for PRD source formats: pdf, docx, markdown, text, form (used in: prd-ingestion)
- **EstimationRequestStatus** — Lifecycle status: draft, parsing, confirmed, estimating, complete (used in: prd-ingestion)
- **StructuredFormInput** — Structured fallback form data shape (used in: prd-ingestion)

## Per-Section Types

Each section includes its own `types.ts` with the full interface definitions:

- `sections/prd-ingestion/types.ts`

## Combined Reference

See `overview.ts` for all entity types aggregated in one file.

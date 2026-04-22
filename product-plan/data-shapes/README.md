# UI Data Shapes

These types define the shape of data that the UI components expect to receive as props. They represent the **frontend contract** — what the components need to render correctly.

How you model, store, and fetch this data on the backend is an implementation decision. You may combine, split, or extend these types to fit your architecture.

## Entities

- **EstimationRequest** — A parsed PRD serving as input to the estimation pipeline (used in: prd-ingestion)
- **RequestFeature** — A discrete feature extracted from a PRD (used in: prd-ingestion)
- **StructuredFormInput** — Structured form fallback input shape (used in: prd-ingestion)
- **Estimate** — The AI-generated first-pass estimate for a project (used in: ai-driven-first-pass-estimation)
- **EstimateFeature** — A single feature within the estimate with complexity, hours, confidence (used in: ai-driven-first-pass-estimation)
- **EstimateRisk** — A risk identified during estimation (used in: ai-driven-first-pass-estimation)
- **TeamRecommendation** — Suggested team composition with roles and reasoning (used in: ai-driven-first-pass-estimation)
- **ComparableProject** — A historical project surfaced as comparable (used in: ai-driven-first-pass-estimation)
- **EstimateQuestion** — An unresolved clarification question (used in: ai-driven-first-pass-estimation)
- **GenerationStep** — A labeled step in the AI generation pipeline (used in: ai-driven-first-pass-estimation)

## Per-Section Types

Each section includes its own `types.ts` with the full interface definitions:

- `sections/prd-ingestion/types.ts`
- `sections/ai-driven-first-pass-estimation/types.ts`

## Combined Reference

See `overview.ts` for all entity types aggregated in one file.

# Data Shape

## Entities

### EstimationProject
A top-level entity that unifies all pipeline phases into a single project record. Contains denormalized summary metadata (name, status, hours, confidence, feature count, pipeline progress) for list-view rendering, plus foreign keys to the phase-specific entities (EstimationRequest, Estimate, ReviewEstimate, ExportDashboard). The primary entity for the Projects list and all cross-phase navigation. Tracks project status through the pipeline: draft, extracting, estimating, in_review, estimated, archived.

### EstimationRequest
A parsed PRD that serves as the input to the estimation pipeline. Contains the raw document content, AI-extracted structure (overview, features, constraints, ambiguities, implicit requirements), and a status tracking its lifecycle from draft through confirmation to estimation.

### RequestFeature
A discrete feature extracted from a PRD during ingestion. Belongs to an EstimationRequest and carries a name and description that feed into the estimation step.

### Estimate
The AI-generated (and later human-reviewed) estimate for a project. Contains total hour ranges, overall complexity, timeline, effort breakdown, team recommendation, and review metadata.

### EstimateFeature
A single feature within an estimate, with complexity rating, hour range (low/likely/high), confidence level, assumptions, and dependencies. The primary unit of estimation.

### EstimateRisk
A risk identified for an estimate — categorized by type (scope, technical, dependency, team, timeline) with likelihood, impact, and mitigation. Can be AI-generated or human-added.

### EstimateQuestion
An ambiguity or clarification question surfaced during estimation that significantly affects the estimate. Can be resolved with an answer.

### Adjustment
A human modification to an AI estimate, recording the action taken (accept, adjust, split, merge, add, remove), mandatory reasoning, and the before/after values. This is the core training data.

### Project
A historical Ravn project used for comparable retrieval. Contains project metadata, tech stack, team size, estimated vs. actual hours, features, challenges, and lessons learned.

### CalibrationEntry
A post-project accuracy record comparing estimated hours to actual hours, with variance calculation and optional per-feature breakdown.

## Relationships

- EstimationProject has one EstimationRequest
- EstimationProject has one Estimate (nullable)
- EstimationProject has one ReviewEstimate (nullable)
- EstimationProject has one ExportDashboard (nullable)
- EstimationRequest has many RequestFeature
- EstimationRequest has one Estimate
- Estimate has many EstimateFeature
- Estimate has many EstimateRisk
- Estimate has many EstimateQuestion
- Estimate has many Adjustment
- Estimate has many comparable Project (via EstimateComparable)
- EstimateFeature has many Adjustment
- CalibrationEntry references one Estimate

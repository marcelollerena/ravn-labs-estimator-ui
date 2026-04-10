# Implement Feature / Fix

This command governs **every coding session** — new features, bug fixes, refactors, and
security patches. Follow every step in order. Do not skip or reorder.

---

## Step 0 — Confirm You Have a Plan

Before touching a single file, you must have a written implementation plan that the user
has already approved. This is non-negotiable.

If no approved plan exists:

1. Tell the user: "There is no approved plan for this work. Run `/shape-spec` first."
2. Stop.

If a plan exists, confirm its location (usually
`C:\Users\samue\.claude\plans\<slug>.md`) and read it fully before proceeding.

---

## Step 1 — Sync Remote Branches

Pull the latest state of both long-lived branches before creating any new branch.

```bash
git fetch origin
git checkout main        && git pull origin main
git checkout development && git pull origin development
```

If either pull produces merge conflicts, **stop and tell the user** before continuing.
Never resolve conflicts silently.

---

## Step 2 — Create the Working Branch

Branch off `development` (not `main`). Name the branch using the conventional prefix
that matches the work:


| Work type       | Prefix      | Example                           |
| --------------- | ----------- | --------------------------------- |
| New feature     | `feat/`     | `feat/agent-balance-table`        |
| Bug fix         | `fix/`      | `fix/rate-limit-toctou`           |
| Security patch  | `fix/`      | `fix/cors-wildcard-headers`       |
| Refactor        | `refactor/` | `refactor/lmsr-decimal-precision` |
| Tests           | `test/`     | `test/settlement-integration`     |
| Documentation   | `docs/`     | `docs/api-endpoints`              |
| Chore / tooling | `chore/`    | `chore/env-validation`            |

```bash
git checkout development
git checkout -b <prefix>/<short-slug>
```

Announce the branch name to the user before writing any code.

---

## Step 3 — Create the Spec Folder (new features only)

**Skip this step for fixes, refactors, and patches.**

For every new feature, create a spec folder under:

```
.claude/commands/agent-os/specs/<phase-slug>/
```

The folder must contain exactly four files, populated from the approved plan:

### `spec.md`

Full feature specification:

- Context (why this feature exists, which roadmap phase it belongs to)
- Task list (checkboxes — will be ticked as tickets complete)
- What will be built (entities, services, endpoints, UI components)
- Acceptance criteria

### `shape.md`

Lightweight architectural shape:

- Data model changes (new tables, columns, indexes)
- API surface (new or changed endpoints)
- Frontend changes (new pages, components, hooks)
- Dependencies on other phases or external services

### `references.md`

Pointers to related existing code:

- Files that will be modified
- Files that serve as patterns to follow
- Related specs from previous phases

### `standards.md`

Which standards docs apply to this feature, linked from
`.claude/commands/agent-os/standards/`.

### Roadmap Update (new features only)

After creating the four spec files, open the roadmap:

```
.claude/commands/agent-os/product/roadmap.md
```

Add the new feature as a **pending phase entry** at the correct position in the roadmap
(after the last completed phase, before any future phases). Use this format:

```markdown
## Phase <N><letter> — <Feature Name>
**Status:** Pending

### Tasks
- [ ] T-1: <ticket title>
- [ ] T-2: <ticket title>
- [ ] T-3: <ticket title>
...
```

Derive the task list from the approved plan. This registers the feature in the roadmap
**before any code is written** so the team can see what is planned and in what order.

> Step 6 will tick these checkboxes `[x]` once all tickets are complete.

---

## Step 4 — Decompose Into Tickets

Read the approved plan and break it into the smallest independently shippable units of
work. Each ticket must:

- Be completable in one focused coding session
- Leave the codebase in a compilable, runnable state when done
- Have a clear, one-sentence definition of done

Present the full ticket list to the user **before writing any code**. Example format:

```
Tickets for feat/agent-balance-table
─────────────────────────────────────
[T-1] Add `agent_balances` table migration + AgentBalance entity + repository
[T-2] Update SettlementService to upsert balance on each position settlement
[T-3] Add GET /api/v1/agents/:id/balance endpoint + DTO + controller
[T-4] Add balance field to AgentDetailPage frontend component
[T-5] Add integration test for full settle → balance flow

Starting with T-1. Commit each ticket manually to proceed to the next.
```

Wait for the user to confirm the ticket list before starting T-1.

---

## Step 5 — Implement Ticket by Ticket

For each ticket:

### 5a. Announce the ticket

State which ticket you are starting and what the definition of done is.

### 5b. Read before writing

Read every file you intend to modify. Never edit a file you have not read in this session.

### 5c. Implement the ticket

Write only the code required for this ticket. Do not:

- Pre-emptively implement the next ticket
- Add error handling, logging, or validation beyond what this ticket requires
- Refactor surrounding code that is not part of the ticket scope

### 5d. Update the spec `spec.md` task list

Tick the completed tasks in the spec's checkbox list.

### 5e. Stop and wait for a manual commit

When the ticket is complete, output exactly:

```
─────────────────────────────────────────────────────────
✓ Ticket T-N complete: <one-line summary of what was done>

Files changed:
  • path/to/file1.java
  • path/to/file2.ts

Please review, commit manually, then reply "next" to continue with T-(N+1).
─────────────────────────────────────────────────────────
```

Do **not** run `git add` or `git commit`. Do **not** proceed to the next ticket until the
user explicitly says to continue (e.g. "next", "continue", "done").

---

## Step 6 — After the Final Ticket

Once all tickets are complete:

1. Update `spec.md` to mark all tasks `[x]`.
2. Update the roadmap at `.claude/commands/agent-os/product/roadmap.md` to reflect the
   new phase or feature as complete.
3. Output a closing summary:

```
─────────────────────────────────────────────────────────
All tickets complete for <branch-name>.

Summary of changes:
  • <bullet per ticket>

Next steps:
  • Manual review and final commit on this branch
  • Open a PR from <branch-name> → development when ready
─────────────────────────────────────────────────────────
```

Do **not** push the branch or open a PR. The user does that manually.

---

## Rules That Apply at All Times

- **One ticket at a time.** Never implement T-2 while describing T-1.
- **No silent git operations.** Never run `git add`, `git commit`, `git push`, or
  `git merge` unless the user explicitly asks.
- **No force-push.** Ever.
- **Read before edit.** Always read a file with the Read tool before using the Edit tool.
- **Compilable at every stop.** Each ticket must leave the project in a state that
  compiles and starts without errors.
- **Respect existing conventions.** Match the code style, package structure, and naming
  conventions of the surrounding code. Do not introduce new patterns without flagging them.
- **Security findings first.** If implementing a feature that touches a file listed in
  `SECURITY-AUDIT.md`, note the relevant finding and apply the recommended fix as part
  of the ticket scope (do not defer it).

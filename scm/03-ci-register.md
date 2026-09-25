# Release 1 — Configuration Item (CI) Register

Verified against `git ls-files` on the actual `gradetrackerapp_vibe` repo
(8 commits, HEAD at `865e6bc`, branch `master`) — this is not a guess.

| CI ID | Name | Type | Version | Location |
|---|---|---|---|---|
| CI-01 | schema.prisma | Database schema | 1.0 | `prisma/schema.prisma` |
| CI-02 | Migration history (2 migrations) | Database schema | 1.0 | `prisma/migrations/` |
| CI-03 | Seed script | Source code | 1.0 | `prisma/seed.js` |
| CI-04 | Entities & Attributes doc | Design document | 1.0 | `scm/01-entities-attributes.md` |
| CI-05 | ERD (DBML source) | Design document | 1.0 | `scm/02-erd.dbml` |
| CI-06 | ERD (rendered diagram) | Design document | 1.0 | `scm/02-erd.png` |
| CI-07 | Route pages & server actions | Source code | 1.0 | `app/page.js`, `app/courses/page.js`, `app/courses/[courseId]/page.js`, `app/courses/[courseId]/actions.js`, `app/semesters/[semesterId]/page.js`, `app/layout.js` |
| CI-08 | UI components | Source code | 1.0 | `app/components/` (CourseSummaryCard, GpaCard, GpaTrendChart, SemesterCard, StaleDataBanner) |
| CI-09 | Business logic (grade/GPA calculations) | Source code | 1.0 | `lib/calculations.js`, `lib/dashboard.js`, `lib/gradeScale.js`, `lib/prisma.js` |
| CI-10 | Test suite | Test cases | 1.0 | `lib/calculations.test.js`, `lib/dashboard.test.js` |
| CI-11 | ARCHITECTURE.md | Design document | 1.0 | `ARCHITECTURE.md` |
| CI-12 | README.md | User documentation | 1.0 | `README.md` |
| CI-13 | SETUP.md | User documentation | 1.0 | `SETUP.md` |
| CI-14 | PROGRESS.md | Project documentation | 1.0 | `PROGRESS.md` |
| CI-15 | package.json / package-lock.json | Configuration file | 1.0 | `package.json`, `package-lock.json` |
| CI-16 | .env.example | Configuration file | 1.0 | `.env.example` (real `.env` is NOT a CI — holds secrets, git-ignored by design; confirmed in `.gitignore`) |
| CI-17 | Build/tooling config | Configuration file | 1.0 | `eslint.config.mjs`, `next.config.mjs`, `postcss.config.mjs`, `jsconfig.json`, `prisma.config.js` |

## Notes
- All versions start at **1.0** — this register documents the state *at* Baseline 1, before any change control exists.
- `node_modules/` and other `.gitignore`'d build artifacts are correctly excluded — they're generated from CI-15, not independently versioned.
- 17 rows is thorough but possibly more granular than your rubric wants. If your lecturer's template expects ~8–10 CIs, merge CI-07/08/09 into one "Application source code" row and CI-12/13/14 into one "Project documentation" row — the underlying facts don't change, just the grouping.
- Public static assets (`public/*.svg`, favicon) were left out as too trivial to be meaningful CIs — say so if your rubric wants everything listed regardless.

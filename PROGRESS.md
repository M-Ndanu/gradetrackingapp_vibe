# Grade Tracker Progress

## Phase 1: Project setup, Neon, Prisma schema, and seed

Status: Complete.

Completed:

- Scaffolded a Next.js App Router application with JavaScript, Tailwind CSS, ESLint, and npm.
- Added Prisma 7.10.0 and a Prisma config that uses `DIRECT_URL` for migrations.
- Added the Year -> Semester -> Course -> Category -> Score schema with cascade deletes.
- Added raw `createdAt` and `updatedAt` timestamps for future stale-data checks. No computed grades or GPA values are stored.
- Added a repeatable seed with two semesters and five courses.
- Added `.env.example` with separate pooled and direct Neon connection placeholders.

Next:

- Phase 2: Add pure calculation functions and the grade-scale lookup with unit tests.

Open decisions:

- The single-user display name and final visual direction can be chosen during the UI phases.
- Neon migration and seed commands require the real values already present in the local `.env` file.
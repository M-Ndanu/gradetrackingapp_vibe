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

## Phase 2: Calculation functions and grade scale

Status: Complete.

Completed:

- Added database-free pure functions in `lib/calculations.js` for category averages, weight validation, course grades, GPA, projections, and sample final grades.
- Centralized course percentage rounding in `roundCoursePercentage`.
- Added the exact grade scale in `lib/gradeScale.js`, including five color bands and the below-70 fail rule.
- Added unit tests using Node's built-in test runner.

Next:

- Phase 3: Build the course page with category and score CRUD.

Open decisions:

- The single-user display name and final visual direction can be chosen during the UI phases.
- Neon migration and seed are still pending because the database connection is failing. Do not run database-dependent commands until connectivity is restored.
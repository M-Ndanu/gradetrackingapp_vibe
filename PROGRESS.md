# Grade Tracker Progress

## Phase 1: Project setup, Neon, Prisma schema, and seed

Status: Complete.

Completed:

- Scaffolded a Next.js App Router application with JavaScript, Tailwind CSS, ESLint, and npm.
- Added Prisma 7.10.0 and a Prisma config that uses `DIRECT_URL` for migrations.
- Added the Year -> Semester -> Course -> Category -> Score schema with cascade deletes.
- Added raw `createdAt` and `updatedAt` timestamps for future stale-data checks. No computed grades or GPA values are stored.
- Added a repeatable seed with two semesters and five courses.
- Applied the initial migration to Neon after database connectivity was restored.
- Added `.env.example` with separate pooled and direct Neon connection placeholders.

## Phase 2: Calculation functions and grade scale

Status: Complete.

Completed:

- Added database-free pure functions in `lib/calculations.js` for category averages, weight validation, course grades, GPA, projections, and sample final grades.
- Centralized course percentage rounding in `roundCoursePercentage`.
- Added the exact grade scale in `lib/gradeScale.js`, including five color bands and the below-70 fail rule.
- Added unit tests using Node's built-in test runner.

Next:

## Phase 3: Course page CRUD

Status: Complete.

Completed:

- Added `/courses` as a simple course picker backed by Prisma.
- Added `/courses/[courseId]` as a Server Component that loads the course hierarchy from Neon.
- Added `CourseEditor` as a Client Component because category expansion, form result messages, and delete button interactions need browser state.
- Added server actions for creating, editing, and deleting categories and scores.
- Added server-side validation for required text, numeric marks, positive `outOf` values, mark limits, and category weights above 100%.
- Added a running category weight total with a balanced/adjust-needed status.
- Added friendly empty states and visible success/error feedback after mutations.
- Ran the Neon seed successfully after connectivity was restored.

Next:

## Phase 4: Target-grade projection

Status: Complete.

Completed:

- Added a live target percentage input to the course page.
- Connected the course editor to the pure `projectCourseGrade` calculation.
- Added the required remaining-work message, including secured and out-of-reach states.
- Added sample final grades for 50%, 75%, and 100% averages on remaining work.
- Kept projection values computed from current raw category and score data; nothing is stored.

Next:

## Phase 5: Semester page and dashboard

Status: Complete.

Completed:

- Replaced the starter root page with a personalized dashboard welcome.
- Added current and projected overall GPA cards using credit-hour-weighted calculations.
- Added a semester GPA trend line chart with an accessible SVG and an empty state.
- Added horizontally scrollable semester cards ordered newest to oldest and labeled by year.
- Added `/semesters/[semesterId]` with the same GPA and course-summary layout scoped to one semester.
- Added a page-load stale-data banner for courses with no categories, empty categories, or no updates for 14+ days.
- Added pure stale-data and dashboard summary helpers in `lib/dashboard.js` with unit tests.

Next:

- Phase 6: Visual polish, empty states, and toasts.

Open decisions:

- The single-user display name and final visual direction can be chosen during the UI phases.
- The Neon migration is applied. The seed should be run before testing the seeded course links if the database is empty.
- Phase 6 remains intentionally untouched.

## Phase 5 correction: saved-target projected GPA

Status: Complete.

- Added an optional persisted target percentage to each course.
- The course page now saves or clears its target instead of keeping it only in local browser state.
- Dashboard and semester projected GPA calculations use each in-progress course's saved target.
- In-progress courses without targets are excluded from projected GPA and named in a partial-data note.
- When no in-progress course has a target, the projected GPA card shows `Not enough data for a projection`.
- Added regression tests for targeted, partial, and no-target projections.

This is a correction to Phase 5 dashboard behavior, not a new phase. Phase 6 remains untouched.
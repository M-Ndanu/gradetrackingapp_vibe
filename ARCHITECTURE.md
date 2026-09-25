# Grade Tracker Architecture

## Folder map

- `app/page.js`: Server Component for the dashboard. Loads the full hierarchy, calculates overall GPA summaries, and renders the dashboard sections.
- `app/semesters/[semesterId]/page.js`: Server Component for one semester. Loads only that semester and renders its scoped GPA cards, trend, and course summaries.
- `app/courses/page.js`: Server Component course picker.
- `app/courses/[courseId]/page.js`: Server Component that loads one course hierarchy and passes it to the editor.
- `app/courses/[courseId]/CourseEditor.js`: Client Component. Owns category expansion, target input state, form result toasts, and browser interactions.
- `app/courses/[courseId]/actions.js`: Server Actions for category, score, and course-target mutations. Validates input, writes raw data with Prisma, and revalidates affected routes.
- `app/components/`: Small display components for GPA cards, course summaries, semester cards, the GPA trend chart, and the stale-data banner. These are Server Components because they render props and need no browser state.
- `lib/calculations.js`: Pure grade, GPA, and target-projection functions. It has no React or database dependencies.
- `lib/gradeScale.js`: The single grade-scale lookup and five color-band definitions.
- `lib/dashboard.js`: Pure dashboard summaries and stale-data checks.
- `lib/prisma.js`: Shared Prisma client using Neon's pooled `DATABASE_URL` at runtime.
- `prisma/schema.prisma`: Raw Year -> Semester -> Course -> Category -> Score data model.
- `prisma/seed.js`: Repeatable sample data for two semesters and five courses.
- `prisma/migrations/`: Database schema history, including the optional course target percentage.

## Data flow

1. A Server Component calls Prisma through `lib/prisma.js`.
2. Prisma reads raw Year, Semester, Course, Category, and Score records from Neon.
3. The Server Component passes raw records to pure functions in `lib/calculations.js` and `lib/dashboard.js`.
4. Those functions calculate category averages, course grades, GPA, projections, and stale-data reasons without storing results.
5. The page passes the resulting display data to small components in `app/components/` or to the course editor.
6. The browser renders the Server Component output. Only the course editor is a Client Component because it needs local UI state.

Computed values are never persisted. The only target-related stored value is the user's optional raw `Course.targetPercentage` input.

## Adding a score: file-by-file trace

1. The user opens `app/courses/[courseId]/page.js`. The Server Component loads the course, categories, and scores from Prisma.
2. The page passes the course and the `createScore` action into `app/courses/[courseId]/CourseEditor.js`.
3. The client editor renders the add-score form inside the relevant category section. The form collects the score name, mark, `outOf`, and category ID.
4. Submitting the form invokes `createScore` in `app/courses/[courseId]/actions.js` as a Server Action.
5. The action validates required text, non-negative marks, positive totals, and that the mark does not exceed `outOf`.
6. The action calls `prisma.score.create`, writing only the raw score values and timestamps to Neon.
7. The action calls `revalidatePath` for the course page. It returns a success or error object instead of redirecting.
8. `CourseEditor.js` receives that result and displays a visible dismissible toast. The refreshed Server Component data then includes the new score.
9. On the next render, `lib/calculations.js` recomputes the category average, course percentage, grade band, and any projection from the updated raw records.
10. Dashboard and semester pages recompute their summaries from the same raw data when those routes are rendered.

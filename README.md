# Grade Tracking App

A grade tracker for managing semesters, courses, weighted categories, assignment scores, and GPA. This app helps students keep a clear view of where they stand in each class and what they need to reach their target grade.

## What this app does

- Track semesters and courses across an academic year
- Add credit hours and target percentages for each course
- Manage categories such as homework, quizzes, projects, tests, and participation
- Record individual scores with a mark and total value
- Calculate weighted category averages and course percentages
- Display course grades and overall GPA using credit-hour weighting
- Estimate projected GPA from saved course targets
- Identify stale course data when scores or updates have not changed recently

## Core grading logic

The app calculates each course percentage by averaging the scored categories with their weights. Those weighted percentages are then converted into a grade and used to calculate GPA across credit-bearing courses.

## Tech stack

- Next.js
- React
- Prisma
- PostgreSQL
- Tailwind CSS

## Local development

1. Install dependencies:
   `ash
   npm install
   `
2. Copy the environment example and set your database connection values:
   `ash
   copy .env.example .env
   `
3. Generate the Prisma client and initialize the database:
   `ash
   npm run db:generate
   npm run db:migrate -- --name init
   npm run db:seed
   `
4. Start the app:
   `ash
   npm run dev
   `
5. Open http://localhost:3000 to view the app.

## Useful commands

`ash
npm run lint
npm test
`

## Project notes

This project is designed for student workflows where weighted categories, score entries, and GPA reporting matter more than raw gradebook exports. It keeps course records organized by semester and updates summary data as assignments and assessments change.

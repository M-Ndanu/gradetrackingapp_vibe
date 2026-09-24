require("dotenv/config");

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const seededCourses = [
  {
    name: "Data Structures",
    creditHours: 3,
    categories: [
      { name: "Assignments", weight: 30, scores: [{ name: "Linked Lists", mark: 88, outOf: 100 }] },
      { name: "Midterm", weight: 30, scores: [{ name: "Midterm Exam", mark: 82, outOf: 100 }] },
      { name: "Final Exam", weight: 40, scores: [] },
    ],
  },
  {
    name: "Web Engineering",
    creditHours: 3,
    categories: [
      { name: "Projects", weight: 50, scores: [{ name: "Portfolio App", mark: 94, outOf: 100 }] },
      { name: "Tests", weight: 50, scores: [{ name: "HTTP and APIs", mark: 86, outOf: 100 }] },
    ],
  },
  {
    name: "Software Requirements",
    creditHours: 3,
    categories: [
      { name: "Case Studies", weight: 40, scores: [{ name: "Stakeholder Map", mark: 91, outOf: 100 }] },
      { name: "Presentation", weight: 20, scores: [] },
      { name: "Final Report", weight: 40, scores: [] },
    ],
  },
  {
    name: "Database Systems",
    creditHours: 3,
    categories: [
      { name: "Labs", weight: 35, scores: [{ name: "SQL Joins", mark: 78, outOf: 100 }] },
      { name: "Midterm", weight: 25, scores: [{ name: "Relational Algebra", mark: 81, outOf: 100 }] },
      { name: "Final Exam", weight: 40, scores: [] },
    ],
  },
  {
    name: "Professional Practice",
    creditHours: 2,
    prerequisiteNote: "Complete the department ethics module before the final reflection.",
    categories: [
      { name: "Participation", weight: 30, scores: [{ name: "Weekly Seminars", mark: 100, outOf: 100 }] },
      { name: "Reflection", weight: 70, scores: [] },
    ],
  },
];

async function main() {
  await prisma.score.deleteMany();
  await prisma.category.deleteMany();
  await prisma.course.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.year.deleteMany();

  const yearTwo = await prisma.year.create({
    data: {
      label: "Year 2",
      semesters: {
        create: [
          {
            name: "Fall 2026",
            courses: { create: seededCourses.slice(0, 3).map(courseData) },
          },
          {
            name: "Spring 2027",
            courses: { create: seededCourses.slice(3).map(courseData) },
          },
        ],
      },
    },
    include: { semesters: { include: { courses: true } } },
  });

  console.log(`Seeded ${yearTwo.semesters.length} semesters and ${yearTwo.semesters.reduce((count, semester) => count + semester.courses.length, 0)} courses.`);
}

function courseData(course) {
  return {
    name: course.name,
    creditHours: course.creditHours,
    prerequisiteNote: course.prerequisiteNote,
    categories: {
      create: course.categories.map((category) => ({
        name: category.name,
        weight: category.weight,
        isComplete: category.scores.length > 0,
        scores: { create: category.scores },
      })),
    },
  };
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
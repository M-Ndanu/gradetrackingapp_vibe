import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: { semester: { include: { year: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <main className="app-shell">
      <p className="eyebrow">Grade tracker</p>
      <h1 className="display-title">Your courses</h1>
      <p className="mt-3 max-w-xl text-slate-600">Choose a course to manage its categories and scores.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`} className="panel transition hover:-translate-y-0.5 hover:shadow-lg">
            <p className="eyebrow">{course.semester.year.label} · {course.semester.name}</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">{course.name}</h2>
            <p className="mt-2 text-sm text-slate-500">{course.creditHours} credit hours</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
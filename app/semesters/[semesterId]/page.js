import Link from "next/link";
import { notFound } from "next/navigation";
import CourseSummaryCard from "@/app/components/CourseSummaryCard";
import GpaCard from "@/app/components/GpaCard";
import GpaTrendChart from "@/app/components/GpaTrendChart";
import { semesterSummary } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

export default async function SemesterPage({ params }) {
  const { semesterId } = await params;
  const semester = await prisma.semester.findUnique({
    where: { id: semesterId },
    include: {
      year: true,
      courses: {
        orderBy: { name: "asc" },
        include: { categories: { include: { scores: true } } },
      },
    },
  });

  if (!semester) {
    notFound();
  }

  const summary = semesterSummary(semester);

  return (
    <main className="app-shell">
      <Link href="/" className="back-link">← Dashboard</Link>
      <header className="mb-10">
        <p className="eyebrow">{summary.yearLabel}</p>
        <h1 className="display-title mt-2">{summary.name}</h1>
        <p className="mt-3 text-slate-600">A focused view of this semester&apos;s courses.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <GpaCard label="Current GPA" value={summary.currentGpa} detail="Based on courses with scores" />
        <GpaCard label="Projected GPA" value={summary.projectedGpa} emptyLabel="Not enough data for a projection" detail="Based on saved course targets" />
      </div>
      {summary.missingTargetCourses.length > 0 && <p className="mt-3 text-sm text-slate-600">Projected GPA is based on partial data. Missing targets: {summary.missingTargetCourses.join(", ")}.</p>}

      <div className="mt-6"><GpaTrendChart semesters={[summary]} /></div>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Coursework</p><h2 className="section-title mt-2">Courses this semester</h2></div><span className="text-sm text-slate-500">{summary.courses.length} total</span></div>
        {summary.courses.length === 0 ? <p className="empty-state">No courses yet. Add your first course.</p> : <div className="mt-5 grid gap-4 md:grid-cols-2">{summary.courses.map((course) => <CourseSummaryCard key={course.id} course={course} />)}</div>}
      </section>
    </main>
  );
}
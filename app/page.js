import Link from "next/link";
import CourseSummaryCard from "@/app/components/CourseSummaryCard";
import GpaCard from "@/app/components/GpaCard";
import GpaTrendChart from "@/app/components/GpaTrendChart";
import SemesterCard from "@/app/components/SemesterCard";
import StaleDataBanner from "@/app/components/StaleDataBanner";
import {
  DEFAULT_PROJECTION_TARGET,
  semesterSummary,
  staleCourseReasons,
} from "@/lib/dashboard";
import { calculateGpa, calculateProjectedGpa } from "@/lib/calculations";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const semesters = await prisma.semester.findMany({
    include: {
      year: true,
      courses: {
        orderBy: { name: "asc" },
        include: { categories: { include: { scores: true } } },
      },
    },
  });
  const newestFirst = [...semesters].sort((left, right) => right.createdAt - left.createdAt);
  const summaries = newestFirst.map((semester) => semesterSummary(semester, DEFAULT_PROJECTION_TARGET));
  const allCourses = newestFirst.flatMap((semester) => semester.courses);
  const courseSummaries = summaries.flatMap((semester) => semester.courses);
  const staleCourses = allCourses
    .map((course) => ({ id: course.id, name: course.name, reasons: staleCourseReasons(course) }))
    .filter((course) => course.reasons.length > 0);
  const currentGpa = calculateGpa(allCourses);
  const projectedGpa = calculateProjectedGpa(allCourses, DEFAULT_PROJECTION_TARGET);
  const trend = [...summaries].reverse();

  return (
    <main className="app-shell">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Grade tracker</p>
          <h1 className="display-title mt-2">Welcome back, Cindy.</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">A clear view of where your grades stand and what is still within reach.</p>
        </div>
        <Link href="/courses" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Manage courses</Link>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <GpaCard label="Overall GPA" value={currentGpa} detail="Current credit-hour-weighted GPA" />
        <GpaCard label="Projected GPA" value={projectedGpa} detail={`If in-progress courses reach ${DEFAULT_PROJECTION_TARGET}%`} />
      </section>

      <div className="mt-6"><StaleDataBanner staleCourses={staleCourses} /></div>
      <div className="mt-6"><GpaTrendChart semesters={trend} /></div>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">By term</p><h2 className="section-title mt-2">Your semesters</h2></div><span className="text-sm text-slate-500">Newest first</span></div>
        {summaries.length === 0 ? <p className="empty-state">No semesters yet. Add your first semester.</p> : <div className="mt-5 flex gap-4 overflow-x-auto pb-4">{summaries.map((semester) => <SemesterCard key={semester.id} semester={semester} />)}</div>}
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Across every term</p><h2 className="section-title mt-2">Course snapshot</h2></div><Link href="/courses" className="text-sm font-semibold text-teal-800">View all courses →</Link></div>
        {allCourses.length === 0 ? <p className="empty-state">No courses yet. Add your first course.</p> : <div className="mt-5 grid gap-4 md:grid-cols-2">{allCourses.map((course) => <CourseSummaryCard key={course.id} course={courseSummaries.find((summary) => summary.id === course.id)} />)}</div>}
      </section>
    </main>
  );
}

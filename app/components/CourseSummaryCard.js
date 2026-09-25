import Link from "next/link";

export default function CourseSummaryCard({ course }) {
  const gradeClass = course.grade ? `grade-band-${course.grade.colorBand}` : "";

  return (
    <Link href={`/courses/${course.id}`} className="block rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-950">{course.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{course.creditHours} credit hours</p>
        </div>
        {course.grade ? <div className={`rounded-xl px-3 py-2 text-right ${gradeClass}`}><p className="text-xl font-bold">{course.grade.percentage}%</p><p className="text-xs font-semibold">{course.grade.letter}{course.grade.isFail ? " · Fail" : ""}</p></div> : <span className="text-sm font-semibold text-slate-400">No scores yet</span>}
      </div>
    </Link>
  );
}
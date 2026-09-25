import Link from "next/link";

export default function SemesterCard({ semester }) {
  return (
    <Link href={`/semesters/${semester.id}`} className="min-w-72 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">
      <p className="eyebrow">{semester.yearLabel}</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-950">{semester.name}</h3>
      <div className="mt-5 flex items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current</p><p className="text-2xl font-bold text-slate-950">{semester.currentGpa === null ? "—" : semester.currentGpa.toFixed(2)}</p></div>
        <div className="text-right"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Projected</p><p className="text-2xl font-bold text-teal-800">{semester.projectedGpa === null ? "—" : semester.projectedGpa.toFixed(2)}</p></div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{semester.courses.length} course{semester.courses.length === 1 ? "" : "s"}</p>
    </Link>
  );
}
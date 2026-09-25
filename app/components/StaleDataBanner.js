export default function StaleDataBanner({ staleCourses }) {
  if (staleCourses.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
      <p className="eyebrow text-amber-700">Needs attention</p>
      <h2 className="mt-2 text-lg font-bold">Some course data may be stale</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {staleCourses.map((course) => <li key={course.id}><strong>{course.name}:</strong> {course.reasons.join(", ")}.</li>)}
      </ul>
    </section>
  );
}
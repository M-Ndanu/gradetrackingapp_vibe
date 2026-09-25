function formatGpa(value) {
  return value === null ? "—" : value.toFixed(2);
}

export default function GpaTrendChart({ semesters }) {
  const points = semesters
    .map((semester, index) => ({ semester, index }))
    .filter(({ semester }) => semester.currentGpa !== null)
    .map(({ semester, index }) => ({
      ...semester,
      x: semesters.length === 1 ? 50 : (index / (semesters.length - 1)) * 100,
      y: 100 - ((semester.currentGpa ?? 0) / 4) * 100,
    }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <section className="panel">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Progress</p>
          <h2 className="section-title mt-2">Semester GPA trend</h2>
        </div>
        <span className="text-sm text-slate-500">Current GPA</span>
      </div>
      {points.length === 0 ? (
        <p className="empty-state">No graded courses yet. Your GPA trend will appear here.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <svg viewBox="0 0 100 120" className="h-64 min-w-[32rem] w-full" role="img" aria-label="Current GPA by semester">
            <line x1="0" y1="0" x2="0" y2="100" stroke="#cbd5e1" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="100" y2="100" stroke="#cbd5e1" strokeWidth="0.5" />
            <text x="1" y="4" fontSize="4" fill="#64748b">4.0</text>
            <text x="1" y="54" fontSize="4" fill="#64748b">2.0</text>
            <text x="1" y="99" fontSize="4" fill="#64748b">0.0</text>
            {line && <polyline points={line} fill="none" stroke="#0f766e" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />}
            {points.map((point) => (
              <g key={point.id}>
                <circle cx={point.x} cy={point.y} r="1.8" fill="#0f766e" />
                <text x={point.x} y="108" textAnchor="middle" fontSize="3.5" fill="#334155">{point.name}</text>
                <text x={point.x} y={Math.max(point.y - 4, 5)} textAnchor="middle" fontSize="4" fontWeight="700" fill="#0f172a">{formatGpa(point.currentGpa)}</text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </section>
  );
}
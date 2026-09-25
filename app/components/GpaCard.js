export default function GpaCard({ label, value, detail, emptyLabel = "—" }) {
  return (
    <div className="panel">
      <p className="eyebrow">{label}</p>
      <p className="mt-3 text-5xl font-bold tracking-tight text-slate-950">{value === null ? emptyLabel : value.toFixed(2)}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}
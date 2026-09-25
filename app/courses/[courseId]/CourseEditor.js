"use client";

import { useState } from "react";
import { projectCourseGrade } from "@/lib/calculations";

function SubmitButton({ children, pendingLabel = "Saving...", className = "" }) {
  return (
    <button
      type="submit"
      className={`rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      <span className="peer-data-[pending=true]:hidden">{children}</span>
      <span className="hidden peer-data-[pending=true]:inline">{pendingLabel}</span>
    </button>
  );
}

function ActionForm({ action, children, onResult, className = "", ...props }) {
  async function handleSubmit(formData) {
    const result = await action(formData);
    onResult(result);
  }

  return <form action={handleSubmit} className={className} {...props}>{children}</form>;
}

function ScoreRow({ score, updateScore, deleteScore, onResult }) {
  return (
    <div className="grid gap-3 border-t border-slate-200 py-4 md:grid-cols-[1fr_110px_110px_auto] md:items-end">
      <ActionForm action={updateScore} onResult={onResult} className="contents">
        <input type="hidden" name="scoreId" value={score.id} />
        <label className="text-sm font-medium text-slate-600">
          Name
          <input name="name" defaultValue={score.name} className="field mt-1" required />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Mark
          <input name="mark" type="number" min="0" step="any" defaultValue={score.mark} className="field mt-1" required />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Out of
          <input name="outOf" type="number" min="0.01" step="any" defaultValue={score.outOf} className="field mt-1" required />
        </label>
        <div className="flex gap-2">
          <SubmitButton>Save</SubmitButton>
          <button type="button" className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" onClick={() => document.getElementById(`delete-score-${score.id}`).requestSubmit()}>Delete</button>
        </div>
      </ActionForm>
      <ActionForm action={deleteScore} onResult={onResult} className="hidden" id={`delete-score-${score.id}`}>
        <input type="hidden" name="scoreId" value={score.id} />
      </ActionForm>
    </div>
  );
}

function CategorySection({ category, updateCategory, deleteCategory, createScore, updateScore, deleteScore, onResult }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="border-t border-slate-200 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setExpanded(!expanded)} className="flex items-center gap-3 text-left">
          <span className="text-xl text-slate-400">{expanded ? "−" : "+"}</span>
          <span>
            <span className="block text-lg font-semibold text-slate-950">{category.name}</span>
            <span className="text-sm text-slate-500">{category.weight}% weight · {category.scores.length ? `${category.scores.length} score${category.scores.length === 1 ? "" : "s"}` : "No scores yet"}</span>
          </span>
        </button>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${category.isComplete ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
          {category.isComplete ? "Complete" : "In progress"}
        </span>
      </div>

      {expanded && (
        <div className="mt-5 pl-0 md:pl-9">
          <ActionForm action={updateCategory} onResult={onResult} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_120px_auto_auto] md:items-end">
            <input type="hidden" name="categoryId" value={category.id} />
            <label className="text-sm font-medium text-slate-600">Category name<input name="name" defaultValue={category.name} className="field mt-1" required /></label>
            <label className="text-sm font-medium text-slate-600">Weight %<input name="weight" type="number" min="0" max="100" step="any" defaultValue={category.weight} className="field mt-1" required /></label>
            <label className="flex items-center gap-2 pb-2 text-sm font-medium text-slate-600"><input name="isComplete" type="checkbox" defaultChecked={category.isComplete} /> Complete</label>
            <div className="flex gap-2"><SubmitButton>Save category</SubmitButton><button type="button" className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" onClick={() => document.getElementById(`delete-category-${category.id}`).requestSubmit()}>Delete</button></div>
          </ActionForm>
          <ActionForm action={deleteCategory} onResult={onResult} className="hidden" id={`delete-category-${category.id}`}>
            <input type="hidden" name="categoryId" value={category.id} />
          </ActionForm>

          <div className="mt-5">
            {category.scores.length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">No scores yet. Add your first one.</p> : category.scores.map((score) => <ScoreRow key={score.id} score={score} updateScore={updateScore} deleteScore={deleteScore} onResult={onResult} />)}
          </div>

          <ActionForm action={createScore} onResult={onResult} className="mt-4 grid gap-3 rounded-2xl border border-dashed border-slate-300 p-4 md:grid-cols-[1fr_110px_110px_auto] md:items-end">
            <input type="hidden" name="categoryId" value={category.id} />
            <label className="text-sm font-medium text-slate-600">New score<input name="name" placeholder="Quiz 1" className="field mt-1" required /></label>
            <label className="text-sm font-medium text-slate-600">Mark<input name="mark" type="number" min="0" step="any" className="field mt-1" required /></label>
            <label className="text-sm font-medium text-slate-600">Out of<input name="outOf" type="number" min="0.01" step="any" className="field mt-1" required /></label>
            <SubmitButton>Add score</SubmitButton>
          </ActionForm>
        </div>
      )}
    </section>
  );
}

function ProjectionPanel({ course, updateCourseTarget, onResult }) {
  const [target, setTarget] = useState(course.targetPercentage === null ? "" : String(course.targetPercentage));
  const targetPercentage = Number(target);
  const hasTarget = target.trim() !== "" && Number.isFinite(targetPercentage);
  const projection = hasTarget ? projectCourseGrade(course, targetPercentage, [50, 75, 100]) : null;

  const statusMessage = projection && {
    secured: "This target is already secured.",
    "out-of-reach": "This target is out of reach with the remaining work.",
    "in-progress": `You need an average of ${projection.neededAverage.toFixed(1)}% on the remaining work.`,
  }[projection.status];

  return (
    <section className="panel">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Target grade</p>
          <h2 className="section-title mt-2">Plan your finish</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-500">See what average you need on incomplete categories to reach your target percentage.</p>
        </div>
        <ActionForm action={updateCourseTarget} onResult={onResult} className="flex items-end gap-2">
          <input type="hidden" name="courseId" value={course.id} />
          <label className="w-32 text-sm font-semibold text-slate-600">
            Target %
            <input
              className="field mt-1 text-lg font-bold"
              type="number"
              min="0"
              max="100"
              step="1"
              name="targetPercentage"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
            />
          </label>
          <SubmitButton>Save target</SubmitButton>
        </ActionForm>
      </div>

      {!hasTarget ? <p className="mt-6 rounded-2xl bg-slate-100 p-5 text-sm font-semibold text-slate-600">Enter and save a target percentage to see the projection.</p> : <div className={`mt-6 rounded-2xl p-5 ${projection.status === "out-of-reach" ? "bg-red-50 text-red-900" : projection.status === "secured" ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
        <p className="text-lg font-bold">{statusMessage}</p>
        <p className="mt-2 text-sm opacity-80">{projection.remainingWeight}% of the course remains. {projection.earned.toFixed(1)} percentage points are secured.</p>
      </div>}

      {projection && <div className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Sample outcomes</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {projection.samples.map((sample) => (
            <div key={sample.average} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">{sample.average}% remaining average</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">{sample.percentage}%</p>
              <p className="text-sm font-semibold text-slate-600">{sample.letter} · {sample.points.toFixed(1)} points</p>
              {sample.isFail && <p className="mt-1 text-xs font-bold text-red-700">Fail</p>}
            </div>
          ))}
        </div>
      </div>}
    </section>
  );
}

export default function CourseEditor({ course, actions }) {
  const [message, setMessage] = useState(null);
  const totalWeight = course.categories.reduce((sum, category) => sum + category.weight, 0);
  const weightIsValid = Math.abs(totalWeight - 100) < 0.000001;

  function handleResult(result) {
    setMessage(result.success ? { type: "success", text: result.success } : { type: "error", text: result.error });
  }

  return (
    <div className="space-y-8">
      {message && <div role="status" className={`rounded-2xl px-4 py-3 text-sm font-semibold ${message.type === "success" ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"}`}>{message.text}</div>}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">{course.semester.year.label} · {course.semester.name}</p><h1 className="display-title">{course.name}</h1><p className="mt-2 text-slate-600">{course.creditHours} credit hours{course.prerequisiteNote ? ` · ${course.prerequisiteNote}` : ""}</p></div>
        <div className={`rounded-2xl px-5 py-4 ${weightIsValid ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}><p className="text-xs font-bold uppercase tracking-wider">Weight total</p><p className="text-3xl font-bold">{totalWeight}%</p><p className="text-sm">{weightIsValid ? "Balanced" : "Adjust to 100%"}</p></div>
      </div>

      <ProjectionPanel course={course} updateCourseTarget={actions.updateCourseTarget} onResult={handleResult} />

      <section className="panel">
        <div className="mb-2 flex items-center justify-between gap-4"><div><h2 className="section-title">Categories</h2><p className="text-sm text-slate-500">Organize your course work and keep the weights balanced.</p></div></div>
        {course.categories.length === 0 ? <p className="empty-state">No categories yet. Add your first one.</p> : course.categories.map((category) => <CategorySection key={category.id} category={category} {...actions} onResult={handleResult} />)}
        <ActionForm action={actions.createCategory} onResult={handleResult} className="mt-6 grid gap-3 rounded-2xl bg-slate-950 p-4 md:grid-cols-[1fr_120px_auto_auto] md:items-end">
          <input type="hidden" name="courseId" value={course.id} />
          <label className="text-sm font-medium text-slate-300">New category<input name="name" placeholder="Final exam" className="field mt-1" required /></label>
          <label className="text-sm font-medium text-slate-300">Weight %<input name="weight" type="number" min="0" max="100" step="any" className="field mt-1" required /></label>
          <label className="flex items-center gap-2 pb-2 text-sm font-medium text-slate-300"><input name="isComplete" type="checkbox" /> Complete</label>
          <SubmitButton className="bg-white text-slate-950 hover:bg-slate-200">Add category</SubmitButton>
        </ActionForm>
      </section>
    </div>
  );
}
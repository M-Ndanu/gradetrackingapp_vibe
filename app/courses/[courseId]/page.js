import Link from "next/link";
import { notFound } from "next/navigation";
import CourseEditor from "./CourseEditor";
import {
  createCategory,
  createScore,
  deleteCategory,
  deleteScore,
  updateCategory,
  updateScore,
} from "./actions";
import { prisma } from "@/lib/prisma";

export default async function CoursePage({ params }) {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      semester: { include: { year: true } },
      categories: { include: { scores: { orderBy: { createdAt: "asc" } } }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <main className="app-shell">
      <Link href="/courses" className="back-link">← All courses</Link>
      <CourseEditor
        course={course}
        actions={{ createCategory, updateCategory, deleteCategory, createScore, updateScore, deleteScore }}
      />
    </main>
  );
}
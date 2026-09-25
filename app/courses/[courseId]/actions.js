"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function requiredText(value, fieldName) {
  const text = String(value ?? "").trim();

  if (!text) {
    throw new Error(`${fieldName} is required.`);
  }

  return text;
}

function positiveNumber(value, fieldName) {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${fieldName} must be greater than zero.`);
  }

  return number;
}

function nonNegativeNumber(value, fieldName) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${fieldName} cannot be negative.`);
  }

  return number;
}

function optionalPercentage(value, fieldName) {
  const text = String(value ?? "").trim();

  if (!text) {
    return null;
  }

  const number = Number(text);
  if (!Number.isFinite(number) || number < 0 || number > 100) {
    throw new Error(`${fieldName} must be between 0 and 100.`);
  }

  return number;
}

async function ensureCourse(courseId) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { categories: true },
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  return course;
}

async function ensureCategory(categoryId) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { course: true },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  return category;
}

async function validateWeightTotal(courseId, categoryId, nextWeight) {
  const course = await ensureCourse(courseId);
  const total = course.categories.reduce(
    (sum, category) => sum + (category.id === categoryId ? nextWeight : category.weight),
    0,
  );

  if (total > 100) {
    throw new Error(`Category weights cannot exceed 100%. Current total would be ${total}%.`);
  }
}

function resultOrError(callback) {
  return callback().catch((error) => ({
    error: error instanceof Error ? error.message : "Unable to save changes.",
  }));
}

export async function createCategory(formData) {
  return resultOrError(async () => {
    const courseId = requiredText(formData.get("courseId"), "Course");
    const name = requiredText(formData.get("name"), "Category name");
    const weight = nonNegativeNumber(formData.get("weight"), "Weight");

    await validateWeightTotal(courseId, null, weight);
    await prisma.category.create({
      data: { courseId, name, weight, isComplete: formData.get("isComplete") === "on" },
    });

    revalidatePath(`/courses/${courseId}`);
    return { success: "Category saved." };
  });
}

export async function updateCategory(formData) {
  return resultOrError(async () => {
    const categoryId = requiredText(formData.get("categoryId"), "Category");
    const category = await ensureCategory(categoryId);
    const name = requiredText(formData.get("name"), "Category name");
    const weight = nonNegativeNumber(formData.get("weight"), "Weight");

    await validateWeightTotal(category.courseId, categoryId, weight);
    await prisma.category.update({
      where: { id: categoryId },
      data: { name, weight, isComplete: formData.get("isComplete") === "on" },
    });

    revalidatePath(`/courses/${category.courseId}`);
    return { success: "Category updated." };
  });
}

export async function deleteCategory(formData) {
  return resultOrError(async () => {
    const categoryId = requiredText(formData.get("categoryId"), "Category");
    const category = await ensureCategory(categoryId);

    await prisma.category.delete({ where: { id: categoryId } });
    revalidatePath(`/courses/${category.courseId}`);
    return { success: "Category deleted." };
  });
}

export async function createScore(formData) {
  return resultOrError(async () => {
    const categoryId = requiredText(formData.get("categoryId"), "Category");
    const category = await ensureCategory(categoryId);
    const name = requiredText(formData.get("name"), "Score name");
    const mark = nonNegativeNumber(formData.get("mark"), "Mark");
    const outOf = positiveNumber(formData.get("outOf"), "Out of");

    if (mark > outOf) {
      throw new Error("Mark cannot be greater than the total possible mark.");
    }

    await prisma.score.create({ data: { categoryId, name, mark, outOf } });
    revalidatePath(`/courses/${category.courseId}`);
    return { success: "Score saved." };
  });
}

export async function updateScore(formData) {
  return resultOrError(async () => {
    const scoreId = requiredText(formData.get("scoreId"), "Score");
    const score = await prisma.score.findUnique({
      where: { id: scoreId },
      include: { category: true },
    });

    if (!score) {
      throw new Error("Score not found.");
    }

    const name = requiredText(formData.get("name"), "Score name");
    const mark = nonNegativeNumber(formData.get("mark"), "Mark");
    const outOf = positiveNumber(formData.get("outOf"), "Out of");

    if (mark > outOf) {
      throw new Error("Mark cannot be greater than the total possible mark.");
    }

    await prisma.score.update({ where: { id: scoreId }, data: { name, mark, outOf } });
    revalidatePath(`/courses/${score.category.courseId}`);
    return { success: "Score updated." };
  });
}

export async function deleteScore(formData) {
  return resultOrError(async () => {
    const scoreId = requiredText(formData.get("scoreId"), "Score");
    const score = await prisma.score.findUnique({
      where: { id: scoreId },
      include: { category: true },
    });

    if (!score) {
      throw new Error("Score not found.");
    }

    await prisma.score.delete({ where: { id: scoreId } });
    revalidatePath(`/courses/${score.category.courseId}`);
    return { success: "Score deleted." };
  });
}

export async function updateCourseTarget(formData) {
  return resultOrError(async () => {
    const courseId = requiredText(formData.get("courseId"), "Course");
    const course = await ensureCourse(courseId);
    const targetPercentage = optionalPercentage(formData.get("targetPercentage"), "Target percentage");

    await prisma.course.update({ where: { id: courseId }, data: { targetPercentage } });
    revalidatePath(`/courses/${courseId}`);
    revalidatePath(`/semesters/${course.semesterId}`);
    revalidatePath("/");
    return { success: targetPercentage === null ? "Target cleared." : "Target saved." };
  });
}
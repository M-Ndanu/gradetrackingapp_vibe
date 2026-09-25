const {
  calculateCourseGrade,
  calculateGpa,
  calculateProjectedGpaFromTargets,
} = require("./calculations");

const STALE_AFTER_DAYS = 14;

function courseSummary(course) {
  const grade = calculateCourseGrade(course.categories);

  return {
    id: course.id,
    name: course.name,
    creditHours: course.creditHours,
    grade,
    hasScores: grade !== null,
  };
}

function semesterSummary(semester) {
  const projection = calculateProjectedGpaFromTargets(semester.courses);

  return {
    id: semester.id,
    name: semester.name,
    yearLabel: semester.year.label,
    currentGpa: calculateGpa(semester.courses),
    projectedGpa: projection.gpa,
    missingTargetCourses: projection.missingCourses,
    hasPartialProjectionData: projection.hasPartialData,
    courses: semester.courses.map((course) => courseSummary(course)),
  };
}

function getCourseActivityDate(course) {
  const dates = [course.updatedAt, ...course.categories.flatMap((category) => [
    category.updatedAt,
    ...category.scores.map((score) => score.updatedAt),
  ])].filter(Boolean).map((date) => new Date(date).getTime());

  return new Date(Math.max(...dates));
}

function staleCourseReasons(course, now = new Date(), staleAfterDays = STALE_AFTER_DAYS) {
  const reasons = [];

  if (course.categories.length === 0) {
    reasons.push("No categories yet");
  }

  if (course.categories.some((category) => category.scores.length === 0)) {
    reasons.push("A category has no scores");
  }

  const ageInDays = (new Date(now).getTime() - getCourseActivityDate(course).getTime()) / (1000 * 60 * 60 * 24);
  if (ageInDays >= staleAfterDays) {
    reasons.push(`No updates for ${staleAfterDays}+ days`);
  }

  return reasons;
}

module.exports = {
  STALE_AFTER_DAYS,
  courseSummary,
  semesterSummary,
  getCourseActivityDate,
  staleCourseReasons,
};
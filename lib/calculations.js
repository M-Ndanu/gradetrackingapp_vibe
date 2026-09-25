const { getGradeForPercentage } = require("./gradeScale");

function categoryAverage(scores) {
  if (!scores || scores.length === 0) {
    return null;
  }

  const totals = scores.reduce(
    (result, score) => {
      if (!Number.isFinite(score.mark) || !Number.isFinite(score.outOf) || score.outOf <= 0) {
        throw new Error("Scores must have a finite mark and a positive outOf value.");
      }

      return {
        marks: result.marks + score.mark,
        outOf: result.outOf + score.outOf,
      };
    },
    { marks: 0, outOf: 0 },
  );

  return (totals.marks / totals.outOf) * 100;
}

function validateCategoryWeights(categories) {
  const total = categories.reduce((sum, category) => sum + category.weight, 0);

  return {
    total,
    isValid: Math.abs(total - 100) < 0.000001,
  };
}

function roundCoursePercentage(percent) {
  return Math.round(percent);
}

function calculateCoursePercentage(categories) {
  const scoredCategories = categories
    .map((category) => ({ ...category, average: categoryAverage(category.scores) }))
    .filter((category) => category.average !== null);

  if (scoredCategories.length === 0) {
    return null;
  }

  const weightTotal = scoredCategories.reduce((sum, category) => sum + category.weight, 0);
  const weightedTotal = scoredCategories.reduce(
    (sum, category) => sum + category.average * category.weight,
    0,
  );

  return weightedTotal / weightTotal;
}

function calculateCourseGrade(categories) {
  const percentage = calculateCoursePercentage(categories);

  if (percentage === null) {
    return null;
  }

  const roundedPercentage = roundCoursePercentage(percentage);

  return {
    percentage: roundedPercentage,
    ...getGradeForPercentage(roundedPercentage),
  };
}

function calculateGpa(courses) {
  const gradedCourses = courses
    .map((course) => ({ course, grade: calculateCourseGrade(course.categories) }))
    .filter(({ grade }) => grade !== null);

  const totalCredits = gradedCourses.reduce((sum, { course }) => sum + course.creditHours, 0);

  if (totalCredits === 0) {
    return null;
  }

  const qualityPoints = gradedCourses.reduce(
    (sum, { course, grade }) => sum + grade.points * course.creditHours,
    0,
  );

  return qualityPoints / totalCredits;
}

function calculateProjectedGpa(courses, targetPercentage) {
  const gradedCourses = courses
    .map((course) => {
      const currentGrade = calculateCourseGrade(course.categories);
      const hasRemainingWork = course.categories.some(
        (category) => !category.isComplete,
      );

      if (!currentGrade) {
        return null;
      }

      const projectedGrade = hasRemainingWork
        ? getGradeForPercentage(roundCoursePercentage(targetPercentage))
        : currentGrade;

      return { course, grade: projectedGrade };
    })
    .filter(Boolean);

  const totalCredits = gradedCourses.reduce((sum, { course }) => sum + course.creditHours, 0);

  if (totalCredits === 0) {
    return null;
  }

  const qualityPoints = gradedCourses.reduce(
    (sum, { course, grade }) => sum + grade.points * course.creditHours,
    0,
  );

  return qualityPoints / totalCredits;
}

function calculateProjectedGpaFromTargets(courses) {
  const inProgressCourses = courses.filter((course) => (
    course.categories.some((category) => !category.isComplete)
  ));
  const missingCourses = inProgressCourses.filter(
    (course) => !Number.isFinite(course.targetPercentage),
  );
  const targetedCourses = inProgressCourses.filter(
    (course) => Number.isFinite(course.targetPercentage),
  );

  if (inProgressCourses.length > 0 && targetedCourses.length === 0) {
    return {
      gpa: null,
      missingCourses: missingCourses.map((course) => course.name),
      hasInProgressCourses: true,
      hasPartialData: false,
    };
  }

  const gradedCourses = courses
    .map((course) => {
      const currentGrade = calculateCourseGrade(course.categories);
      const isInProgress = inProgressCourses.some(({ id }) => id === course.id);

      if (!currentGrade || (isInProgress && !Number.isFinite(course.targetPercentage))) {
        return null;
      }

      const grade = isInProgress
        ? getGradeForPercentage(roundCoursePercentage(course.targetPercentage))
        : currentGrade;

      return { course, grade };
    })
    .filter(Boolean);
  const totalCredits = gradedCourses.reduce((sum, { course }) => sum + course.creditHours, 0);

  if (totalCredits === 0) {
    return {
      gpa: null,
      missingCourses: missingCourses.map((course) => course.name),
      hasInProgressCourses: inProgressCourses.length > 0,
      hasPartialData: missingCourses.length > 0,
    };
  }

  const qualityPoints = gradedCourses.reduce(
    (sum, { course, grade }) => sum + grade.points * course.creditHours,
    0,
  );

  return {
    gpa: qualityPoints / totalCredits,
    missingCourses: missingCourses.map((course) => course.name),
    hasInProgressCourses: inProgressCourses.length > 0,
    hasPartialData: missingCourses.length > 0,
  };
}

function projectCourseGrade(course, targetPercentage, sampleAverages = [50, 75, 100]) {
  const earned = course.categories.reduce((sum, category) => {
    if (!category.isComplete) {
      return sum;
    }

    const average = categoryAverage(category.scores);
    return average === null ? sum : sum + (average * category.weight) / 100;
  }, 0);

  const remainingWeight = course.categories.reduce(
    (sum, category) => (category.isComplete ? sum : sum + category.weight),
    0,
  );

  const neededAverage = remainingWeight === 0
    ? null
    : ((targetPercentage - earned) / remainingWeight) * 100;

  const samples = sampleAverages.map((average) => {
    const finalPercentage = earned + (average * remainingWeight) / 100;
    const roundedPercentage = roundCoursePercentage(finalPercentage);

    return {
      average,
      percentage: roundedPercentage,
      ...getGradeForPercentage(roundedPercentage),
    };
  });

  let status = "in-progress";
  if (remainingWeight === 0 || neededAverage <= 0) {
    status = "secured";
  } else if (neededAverage > 100) {
    status = "out-of-reach";
  }

  return { earned, remainingWeight, neededAverage, status, samples };
}

module.exports = {
  categoryAverage,
  validateCategoryWeights,
  roundCoursePercentage,
  calculateCoursePercentage,
  calculateCourseGrade,
  calculateGpa,
  calculateProjectedGpa,
  calculateProjectedGpaFromTargets,
  projectCourseGrade,
};
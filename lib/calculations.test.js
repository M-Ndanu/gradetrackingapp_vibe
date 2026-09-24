const assert = require("node:assert/strict");
const test = require("node:test");

const {
  calculateCourseGrade,
  calculateGpa,
  calculateProjectedGpa,
  categoryAverage,
  projectCourseGrade,
  roundCoursePercentage,
  validateCategoryWeights,
} = require("./calculations");
const { getGradeForPercentage } = require("./gradeScale");

const score = (mark, outOf = 100) => ({ mark, outOf });
const category = (weight, scores, isComplete = false) => ({ weight, scores, isComplete });

test("calculates a category average from total marks over total possible marks", () => {
  assert.equal(categoryAverage([score(8, 10), score(17, 20)]), 83.33333333333334);
  assert.equal(categoryAverage([]), null);
});

test("validates the course weight total", () => {
  assert.deepEqual(validateCategoryWeights([category(40, []), category(60, [])]), {
    total: 100,
    isValid: true,
  });
  assert.equal(validateCategoryWeights([category(40, []), category(50, [])]).isValid, false);
});

test("rounds course percentages in one named operation before grade lookup", () => {
  assert.equal(roundCoursePercentage(86.5), 87);
  assert.deepEqual(calculateCourseGrade([
    category(100, [score(86.5)]),
  ]), {
    percentage: 87,
    letter: "A-",
    points: 3.7,
    colorBand: "dark-green",
    isFail: false,
  });
});

test("uses only scored categories in the current course grade", () => {
  assert.deepEqual(calculateCourseGrade([
    category(30, [score(80)]),
    category(70, []),
  ]), {
    percentage: 80,
    letter: "B",
    points: 3.0,
    colorBand: "light-green",
    isFail: false,
  });
});

test("uses the exact grade boundaries and marks every percentage below 70 as fail", () => {
  assert.equal(getGradeForPercentage(90).letter, "A");
  assert.equal(getGradeForPercentage(87).letter, "A-");
  assert.equal(getGradeForPercentage(74).letter, "C+");
  assert.equal(getGradeForPercentage(70).letter, "C");
  assert.equal(getGradeForPercentage(69).letter, "C-");
  assert.equal(getGradeForPercentage(69).isFail, true);
  assert.equal(getGradeForPercentage(60).points, 0.7);
  assert.equal(getGradeForPercentage(59).letter, "F");
  assert.equal(getGradeForPercentage(59).colorBand, "red");
});

test("calculates credit-hour-weighted GPA and excludes courses with no scores", () => {
  assert.equal(calculateGpa([
    { creditHours: 3, categories: [category(100, [score(90)])] },
    { creditHours: 1, categories: [category(100, [score(80)])] },
    { creditHours: 4, categories: [category(100, [])] },
  ]), 3.75);
  assert.equal(calculateGpa([{ creditHours: 3, categories: [category(100, [])] }]), null);
});

test("projects the needed remaining average and sample final grades", () => {
  const result = projectCourseGrade({
    categories: [
      category(40, [score(80)], true),
      category(60, [], false),
    ],
  }, 75, [50, 100]);

  assert.equal(result.earned, 32);
  assert.equal(result.remainingWeight, 60);
  assert.equal(result.neededAverage, 71.66666666666667);
  assert.equal(result.status, "in-progress");
  assert.deepEqual(result.samples.map((sample) => sample.percentage), [62, 92]);
});

test("reports secured and out-of-reach target projections", () => {
  assert.equal(projectCourseGrade({
    categories: [category(100, [score(85)], true)],
  }, 80).status, "secured");

  assert.equal(projectCourseGrade({
    categories: [category(80, [score(50)], true), category(20, [], false)],
  }, 95).status, "out-of-reach");
});

test("projects in-progress courses at the target while keeping completed courses current", () => {
  assert.equal(calculateProjectedGpa([
    {
      creditHours: 3,
      categories: [category(50, [score(90)], true), category(50, [], false)],
    },
    {
      creditHours: 1,
      categories: [category(100, [score(80)], true)],
    },
  ], 100), 3.75);
});
const assert = require("node:assert/strict");
const test = require("node:test");

const { staleCourseReasons } = require("./dashboard");

const courseWith = (overrides = {}) => ({
  updatedAt: new Date("2026-09-20T00:00:00Z"),
  categories: [],
  ...overrides,
});

test("flags courses with no categories", () => {
  assert.deepEqual(
    staleCourseReasons(courseWith(), new Date("2026-09-24T00:00:00Z")),
    ["No categories yet"],
  );
});

test("flags empty categories and courses with no updates for 14 days", () => {
  assert.deepEqual(
    staleCourseReasons(courseWith({
      updatedAt: new Date("2026-09-01T00:00:00Z"),
      categories: [{ updatedAt: new Date("2026-09-01T00:00:00Z"), scores: [] }],
    }), new Date("2026-09-24T00:00:00Z")),
    ["A category has no scores", "No updates for 14+ days"],
  );
});

test("uses the newest nested update when checking staleness", () => {
  assert.deepEqual(
    staleCourseReasons(courseWith({
      updatedAt: new Date("2026-09-01T00:00:00Z"),
      categories: [{
        updatedAt: new Date("2026-09-01T00:00:00Z"),
        scores: [{ updatedAt: new Date("2026-09-20T00:00:00Z") }],
      }],
    }), new Date("2026-09-24T00:00:00Z")),
    [],
  );
});
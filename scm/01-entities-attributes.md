# Release 1 — Entities & Attributes

Source of truth: `prisma/schema.prisma` as of Gantt Bar 6 (all build phases complete).

## Entity: Year
| Attribute | Type | Notes |
|---|---|---|
| id | String (PK) | cuid, auto-generated |
| label | String | e.g. "Year 2" |
| createdAt | DateTime | audit field |
| updatedAt | DateTime | audit field |

**Relationship:** Year 1—* Semester (one Year has many Semesters)

## Entity: Semester
| Attribute | Type | Notes |
|---|---|---|
| id | String (PK) | cuid |
| name | String | e.g. "Semester 1" |
| yearId | String (FK → Year.id) | |
| createdAt | DateTime | audit field |
| updatedAt | DateTime | audit field |

**Constraint:** name is unique within a given yearId
**Relationship:** Semester 1—* Course

## Entity: Course
| Attribute | Type | Notes |
|---|---|---|
| id | String (PK) | cuid |
| name | String | |
| creditHours | Int | |
| prerequisiteNote | String? | optional |
| targetPercentage | Float? | optional; drives the target-grade projection feature |
| semesterId | String (FK → Semester.id) | |
| createdAt | DateTime | audit field |
| updatedAt | DateTime | audit field |

**Constraint:** name is unique within a given semesterId
**Relationship:** Course 1—* Category

## Entity: Category
| Attribute | Type | Notes |
|---|---|---|
| id | String (PK) | cuid |
| name | String | e.g. "Assignments", "Exam" |
| weight | Float | percentage weight within the course |
| isComplete | Boolean | default false; marks category as finished for projection logic |
| courseId | String (FK → Course.id) | |
| createdAt | DateTime | audit field |
| updatedAt | DateTime | audit field |

**Constraint:** name is unique within a given courseId
**Relationship:** Category 1—* Score

## Entity: Score
| Attribute | Type | Notes |
|---|---|---|
| id | String (PK) | cuid |
| name | String | e.g. "Quiz 1" |
| mark | Float | points earned |
| outOf | Float | points possible |
| categoryId | String (FK → Category.id) | |
| createdAt | DateTime | audit field |
| updatedAt | DateTime | audit field |

## Hierarchy summary
Year → Semester → Course → Category → Score (each arrow is one-to-many, cascade delete downward)

All grade totals (category %, course grade, semester GPA, year GPA, degree GPA) are **computed at read time**, never stored as columns — this is a deliberate design decision, not an oversight, and worth a line in your write-up if the rubric asks about derived vs. stored data.

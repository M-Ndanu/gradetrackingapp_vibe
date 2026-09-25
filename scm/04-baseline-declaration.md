# Baseline 1 Declaration — gradetracker (Release 1)

## What this is
This document formally declares **Baseline 1**: the point at which the Configuration
Items listed in `03-ci-register.md` are frozen and approved. From this point forward,
any change to a listed CI must be proposed, justified, and tracked as a Change Request
(see `05-change-requests.md`) rather than edited freely.

## Scope
Baseline 1 covers:
- The complete application as built across all development phases (app routes,
  UI components, business logic, database schema, test suite)
- The Release 1 SCM documentation itself: entities & attributes, ERD, and the CI
  register (this baseline includes the artifacts that describe it — a common and
  correct pattern in SCM, since the documentation is itself a Configuration Item)

## Configuration Items included
All 17 CIs listed in `03-ci-register.md`, each at version **1.0**.

## Identification
- **Git tag:** `baseline-1`
- **Repository:** `gradetrackerapp_vibe` (to be pushed to GitHub as part of this
  baselining step — see setup notes below)
- The tag is the permanent identifier for this baseline. Rather than hardcoding a
  commit hash here (which would need updating if history is later reorganized),
  this document treats "the commit pointed to by `baseline-1`" as the authoritative
  reference.

## Approval
Solo project — approval authority is the developer (Cindy), acting as sole
stakeholder and reviewer. In a team setting this section would name whoever signs
off (tech lead, product owner, etc.) before a baseline is finalized.

## Effective from
The commit that adds this file, `01-entities-attributes.md`, `02-erd.dbml`,
`02-erd.png`, and `03-ci-register.md` to the repository, tagged `baseline-1`.

## What happens next
Any further change to a Baseline 1 CI — a schema change, a new feature, a bug fix —
gets logged as a Change Request first. Approved CRs, once implemented and merged,
move the project toward Baseline 2.

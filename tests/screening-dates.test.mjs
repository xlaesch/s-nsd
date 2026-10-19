import test from "node:test";
import assert from "node:assert/strict";
import { normalizeScreeningDates } from "../src/screening-dates.mjs";

// Pure date rules only: no form interaction, submissions or network calls.
test("dates before 21 December are allowed and every distinct proposed date is preserved", () => {
  const dates = ["2027-01-08", "2026-10-19", "2026-12-20", "2027-01-08"];
  assert.deepEqual(normalizeScreeningDates(dates), ["2026-10-19", "2026-12-20", "2027-01-08"]);
  assert.deepEqual(dates, ["2027-01-08", "2026-10-19", "2026-12-20", "2027-01-08"]);
});
test("at least one valid date is required and blank selections are rejected", () => {
  for (const dates of [[], [""], ["2026-12-21", ""]]) {
    assert.throws(() => normalizeScreeningDates(dates));
  }
});
test("calendar validity is checked without local timezone shifts", () => {
  assert.deepEqual(normalizeScreeningDates(["2028-02-29", "2026-12-21"]), ["2026-12-21", "2028-02-29"]);
  for (const date of ["2027-02-29", "2027-04-31", "2027-13-01", "21/12/2026"]) {
    assert.throws(() => normalizeScreeningDates([date]));
  }
});

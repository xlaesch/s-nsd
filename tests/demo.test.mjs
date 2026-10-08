import test from "node:test";
import assert from "node:assert/strict";
import {
  approveApplication,
  calculateStats,
  validBooking,
} from "../src/demo.mjs";
const app = {
  id: "a",
  status: "pending",
  organisation: "Collectif Test",
  city: "Paris",
  venue: "Test Venue",
  date: "2026-12-21",
  time: "20:00",
  accessibility: "unknown",
  booking: "",
  x: 51,
  y: 30,
};
test("approval publishes a screening and marks the application approved without mutating inputs", () => {
  const applications = [app],
    screenings = [];
  const next = approveApplication(applications, screenings, "a");
  assert.equal(next.applications[0].status, "approved");
  assert.equal(next.screenings[0].venue, "Test Venue");
  assert.equal(next.screenings[0].id, "application-a");
  assert.equal(app.status, "pending");
  assert.equal(screenings.length, 0);
});
test("approval is idempotent, including repeated and unknown application IDs", () => {
  const once = approveApplication([app], [], "a");
  const twice = approveApplication(once.applications, once.screenings, "a");
  assert.deepEqual(twice, once);
  assert.deepEqual(
    approveApplication(once.applications, once.screenings, "missing"),
    once,
  );
});
test("multiple screenings for one partner and city count once for each unique total", () => {
  const screenings = [
    { partnerId: "same", city: " Paris " },
    { partnerId: "same", city: "paris" },
    { partnerId: "another", city: "Lyon" },
  ];
  assert.deepEqual(calculateStats(screenings), {
    screenings: 3,
    partners: 2,
    cities: 2,
    karaoke: 51,
    cocktails: 69,
  });
  assert.deepEqual(calculateStats([]), {
    screenings: 0,
    partners: 0,
    cities: 0,
    karaoke: 0,
    cocktails: 0,
  });
});
test("booking links accept only HTTP(S) or an empty value", () => {
  for (const valid of ["", "https://example.com/book", "http://example.com"])
    assert.equal(validBooking(valid), true);
  for (const invalid of [
    "javascript:alert(1)",
    "data:text/html,test",
    "file:///etc/passwd",
    "not a url",
  ])
    assert.equal(validBooking(invalid), false);
});

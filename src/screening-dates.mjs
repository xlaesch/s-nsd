export const SCREENING_START_DATE = "2026-12-21";

/** Validate, deduplicate and order proposed dates for the email payload.
 * @param {string[]} values
 * @returns {string[]}
 */
export function normalizeScreeningDates(values) {
  const dates = values.map((value) => value.trim());
  if (!dates.length || dates.some((date) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < SCREENING_START_DATE) return true;
    const parsed = new Date(`${date}T00:00:00Z`);
    return !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date;
  })) throw new Error("Choose valid screening dates on or after 21 December 2026.");
  return [...new Set(dates)].sort();
}

export const STORAGE_KEY = "s-nsd-demo-v1";
export function approveApplication(applications, screenings, id) {
  const app = applications.find((item) => item.id === id);
  if (!app || app.status === "approved") return { applications, screenings };
  return {
    applications: applications.map((item) =>
      item.id === id ? { ...item, status: "approved" } : item,
    ),
    screenings: screenings.some((item) => item.id === `application-${id}`)
      ? screenings
      : [
          ...screenings,
          {
            id: `application-${id}`,
            partnerId: app.organisation.trim().toLocaleLowerCase("fr"),
            city: app.city,
            venue: app.venue,
            date: app.date,
            time: app.time,
            accessibility: app.accessibility,
            booking: app.booking,
            x: app.x,
            y: app.y,
            sample: true,
          },
        ],
  };
}
export function calculateStats(screenings) {
  const partners = new Set(screenings.map((item) => item.partnerId)).size;
  const cities = new Set(
    screenings.map((item) => item.city.trim().toLocaleLowerCase("fr")),
  ).size;
  return {
    screenings: screenings.length,
    partners,
    cities,
    karaoke: screenings.length * 17,
    cocktails: screenings.length * 23,
  };
}
export function validBooking(value) {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

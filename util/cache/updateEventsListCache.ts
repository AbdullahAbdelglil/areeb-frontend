import { EventDetailsDTO } from "@/app/types/EventDetailsDTO";

export function updateEventsListCache(event: EventDetailsDTO): void {
  const email = localStorage.getItem('userEmail');
  if (!email) return;

  const key = `home-page-events-${email}`;
  const cached = sessionStorage.getItem(key);
  if (!cached) return;

  const parsed = JSON.parse(cached);
  const updated = parsed.map((e: any) =>
    e.id === event.id ? { ...e, booked: true } : e
  );
  sessionStorage.setItem(key, JSON.stringify(updated));
}

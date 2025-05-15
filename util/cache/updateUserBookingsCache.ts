import { EventDetailsDTO } from "@/app/types/EventDetailsDTO";

export function updateUserBookingsCache(event: EventDetailsDTO): void {
  const email = localStorage.getItem('userEmail');
  if (!email) return;

  const key = `user-bookings-${email}`;
  const cached = sessionStorage.getItem(key);
  if (!cached) return;

  const parsed = JSON.parse(cached);
  const newBooking = {
    id: Date.now(),
    event,
    bookingDate: new Date().toISOString(),
  };

  sessionStorage.setItem(key, JSON.stringify([newBooking, ...parsed]));
}

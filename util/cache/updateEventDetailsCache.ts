import { EventDetailsDTO } from "@/app/types/EventDetailsDTO";

export function updateEventDetailsCache(event: EventDetailsDTO): void {
  sessionStorage.setItem(`event-details-${event.id}`, JSON.stringify(event));
  sessionStorage.setItem(`event-details-${event.id}-timestamp`, Date.now().toString());
}

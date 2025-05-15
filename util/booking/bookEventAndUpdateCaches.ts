
import { handleBooking } from '@/services/bookingsApi';
import { updateEventDetailsCache } from '../cache/updateEventDetailsCache';
import { updateEventsListCache } from '../cache/updateEventsListCache';
import { updateUserBookingsCache } from '../cache/updateUserBookingsCache';
import { EventDetailsDTO } from '@/app/types/EventDetailsDTO';

export async function bookEventAndUpdateCaches(event: EventDetailsDTO): Promise<EventDetailsDTO> {
  await handleBooking(event.id);

  const updatedEvent = { ...event, booked: true };
  
  updateEventDetailsCache(updatedEvent);
  updateEventsListCache(updatedEvent);
  updateUserBookingsCache(updatedEvent);

  return updatedEvent;
}

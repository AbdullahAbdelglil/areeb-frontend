// src/services/eventsApi.ts
import { EventDetailsDTO } from '@/app/types/EventDetailsDTO';
import { api } from './api';


export interface BookingDTO {
  id: number;
  user: null;
  event: EventDetailsDTO;
  bookingDate: string;
}

// get paginated bookings
export const getUserBookings = async (page: number, size: number) => {
  const params: any = { page, size };
  const response = await api.get<BookingDTO[]>('/user/bookings', { params });
  console.log(`bookings ${response}`)
  return response.data;
};

// Cancel a booking
export const cancelBooking = async (bookingId: number) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) throw new Error('Access token not found');

  await api.delete(`/user/cancel-booking/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const handleBooking = async (eventId: number) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) throw new Error('Access token not found');

  await api.post(`/user/book-event/${eventId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
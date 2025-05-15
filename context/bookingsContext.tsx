'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { BookingDTO } from '@/services/bookingsApi';
import { cancelBooking, getUserBookings } from '@/services/bookingsApi';

interface BookingsContextType {
  bookings: BookingDTO[];
  loading: boolean;
  loadMore: () => void;
  cancelBookingById: (id: number) => void;
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

// Get user-specific cache key
const BASE_BOOKINGS_CACHE_KEY = 'user-bookings';
const getUserCacheKey = () => {
  const userEmail = localStorage.getItem('userEmail');
  return `${BASE_BOOKINGS_CACHE_KEY}-${userEmail}`;
};

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const cacheKey = getUserCacheKey();

  const fetchBookings = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const newBookings = await getUserBookings(page, 9);
      const updatedBookings = [...bookings, ...newBookings];
      setBookings(updatedBookings);
      setPage((prev) => prev + 1);
      setHasMore(newBookings.length > 0);
      sessionStorage.setItem(cacheKey, JSON.stringify(updatedBookings));
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  }, [bookings, page, hasMore, loading, cacheKey]);

  const cancelBookingById = async (id: number) => {
    try {
      await cancelBooking(id);
      const updated = bookings.filter((b) => b.id !== id);
      setBookings(updated);
      sessionStorage.setItem(cacheKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Cancel failed', err);
    }
  };

  const addNewBooking = (newBooking: BookingDTO) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    sessionStorage.setItem(cacheKey, JSON.stringify(updated));
  };

  useEffect(() => {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      setBookings(parsed);
      setPage(Math.ceil(parsed.length / 9));
    } else {
      fetchBookings();
    }
  }, [cacheKey]);

  return (
    <BookingsContext.Provider value={{ bookings, loading, loadMore: fetchBookings, cancelBookingById }}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookingsContext = () => {
  const context = useContext(BookingsContext);
  if (!context) throw new Error('useBookingsContext must be used within BookingsProvider');
  return context;
};

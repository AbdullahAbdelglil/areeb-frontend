'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Category, getCategories, getHomePageEvents } from '@/services/eventsApi';
import { toast } from 'sonner';
import { HomePageEventDTO } from '@/app/types/HomePageEventDTO';

interface EventsContextProps {
  events: HomePageEventDTO[];
  categories: Category[];
  selectedCategoryId: number | null;
  loading: boolean;
  setSelectedCategoryId: (id: number | null) => void;
  loadMore: () => void;
  hasNewEvents: boolean;
  showNewEvents: () => void;
  setEventBookingStatus: (eventId: number, booked: boolean) => void;
}

const EventsContext = createContext<EventsContextProps | undefined>(undefined);

const BASE_EVENTS_CACHE_KEY = 'home-page-events';
const BASE_CATEGORIES_CACHE_KEY = 'home-page-categories';

const getUserCacheKey = () => {
  const userId = localStorage.getItem('userEmail');
  return `${BASE_EVENTS_CACHE_KEY}-${userId}`;
};

const getCategoriesCacheKey = () => {
  const userId = localStorage.getItem('userEmail');
  return `${BASE_CATEGORIES_CACHE_KEY}-${userId}`;
};

export const EventsProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<HomePageEventDTO[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newEvents, setNewEvents] = useState<HomePageEventDTO[]>([]);
  const [hasNewEvents, setHasNewEvents] = useState(false);
  const pageSize = 9;

  // Load more events (pagination)
  const loadEvents = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const cacheKey = getUserCacheKey();

    try {
      const data = await getHomePageEvents(page, pageSize);
      if (data.length === 0) setHasMore(false);
      else {
        const updated = [...events, ...data];
        setEvents(updated);
        sessionStorage.setItem(cacheKey, JSON.stringify(updated));
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, selectedCategoryId, events]);

  const showNewEvents = () => {
    const updated = [...newEvents, ...events];
    setEvents(updated);
    sessionStorage.setItem(getUserCacheKey(), JSON.stringify(updated));
    setHasNewEvents(false);
    setNewEvents([]);
  };

  // ✅ Load categories with caching
  useEffect(() => {
    const cacheKey = getCategoriesCacheKey();
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsed: Category[] = JSON.parse(cached);
        if (parsed.length > 0) {
          setCategories(parsed);
          return;
        }
      } catch (e) {
        console.warn('Failed to parse cached categories', e);
      }
    }

    // Fetch fresh if no cache
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        sessionStorage.setItem(cacheKey, JSON.stringify(cats));
      } catch (err) {
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Fetch events on category change
  useEffect(() => {
    const fetchEventsByCategory = async () => {
      setLoading(true);
      const cacheKey = getUserCacheKey();

      try {
        const data = await getHomePageEvents(0, pageSize);
        setEvents(data);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        setPage(1);
        setHasMore(data.length === pageSize);
      } catch (err) {
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    const cacheKey = getUserCacheKey();
    if (selectedCategoryId === null) {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed: HomePageEventDTO[] = JSON.parse(cached);
          if (parsed.length > 0) {
            setEvents(parsed);
            setPage(Math.ceil(parsed.length / pageSize));
            return;
          }
        } catch (e) {
          console.warn('Failed to parse cached events', e);
        }
      }
    }

    fetchEventsByCategory();
  }, [selectedCategoryId]);

  const setEventBookingStatus = (eventId: number, booked: boolean) => {
  setEvents((prevEvents) => {
    const updatedEvents = prevEvents.map((event) =>
      event.id === eventId ? { ...event, booked } : event
    );
    sessionStorage.setItem(getUserCacheKey(), JSON.stringify(updatedEvents));
    return updatedEvents;
  });
};

  return (
    <EventsContext.Provider
      value={{
        events,
        categories,
        selectedCategoryId,
        loading,
        setSelectedCategoryId,
        loadMore: loadEvents,
        hasNewEvents,
        showNewEvents,
        setEventBookingStatus,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEventsContext must be used within EventsProvider');
  }
  return context;
};

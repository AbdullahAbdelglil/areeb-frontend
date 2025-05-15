'use client';

import { useEffect, useRef, useCallback } from 'react';
import { EventsProvider, useEventsContext } from '@/context/eventsContext';
import EventCard from './EventCard';
import CategoryFilter from './CategoryFilter';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EventsTab() {
  const { events, categories, selectedCategoryId, setSelectedCategoryId, loadMore, loading, hasNewEvents, showNewEvents } = useEventsContext();

  const router = useRouter();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadEvents = useCallback(() => {
    if (loading || !events.length) return;
    loadMore();
  }, [events, loading, loadMore]);

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadEvents();
        }
      },
      { threshold: 1 }
    );
    observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loadEvents]);


  return (
    <EventsProvider>
      <div className="space-y-10 max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20 mb-10">
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard event={event} />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        )}

        {hasNewEvents && (
          <div className="text-center">
            <button onClick={showNewEvents} className="text-blue-500 mt-4">
              New Events (Click to see)
            </button>
          </div>
        )}

        <div ref={observerRef} />
      </div>
    </EventsProvider>
  );
}

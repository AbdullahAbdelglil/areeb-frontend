'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { useEventsContext } from '@/context/eventsContext';
import { Button } from '@/components/ui/button';
import { Image, Calendar, MapPin, Ticket, CheckCircle, Loader2 } from 'lucide-react';
import { bookEventAndUpdateCaches } from '@/util/booking/bookEventAndUpdateCaches';
import { EventDetailsDTO } from '@/app/types/EventDetailsDTO';


export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventDetailsDTO>();
  const [loading, setLoading] = useState(true);
  const { showNewEvents } = useEventsContext();
  const [bookLoading, setBookLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      const cacheKey = `event-details-${id}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        setEvent(JSON.parse(cached));
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/user/event/${id}`);
        setEvent(res.data);
        sessionStorage.setItem(cacheKey, JSON.stringify(res.data));
      } catch {
        toast.error('Failed to load event details');
        router.push('/user/homepage');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, router]);

  const handleBooking = async () => {
    if (!event) return;
    try {
      setBookLoading(true);
      const updated = await bookEventAndUpdateCaches(event);
      setEvent(updated);
      toast.success('Booked successfully!');
    } catch {
      toast.error('Booking failed');
    } finally {
      setBookLoading(false);
    }
  };


  if (loading || !event)
    return (
      <div className="text-center py-20 bg-[#0D1B2A] min-h-screen">
        <span className="inline-flex items-center gap-2 text-[#E0E1DD]">
          <motion.span
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-[#778DA9]"
            aria-label="Loading Spinner"
          />
          Loading event details...
        </span>
      </div>
    );

  return (
    <div className="bg-[#0D1B2A] min-h-screen py-12 px-4 sm:px-6 md:px-10 lg:px-16 flex justify-center">
      <div className="w-full max-w-2xl bg-[#1B263B] text-[#E0E1DD] rounded-2xl shadow-xl border border-[#415A77] space-y-8 p-6">
        <div className="relative overflow-hidden w-full h-80 rounded-xl">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a3d6a] via-[#27496d] to-[#6a7c8a] flex items-center justify-center text-white rounded-xl">
              <Image className="w-12 h-12 opacity-70" />
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-md opacity-90">{event.description}</p>
          <p className="text-sm opacity-90">{event.agenda}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-[#778DA9]">
              <MapPin className="w-4 h-4" /> {event.venue}
            </span>
            <span className="flex items-center gap-1 text-[#778DA9]">
              <Calendar className="w-4 h-4" /> {event.date}
            </span>
            <span className="flex items-center gap-1  text-white bg-gradient-to-r from-[#132b4b] to-[#6a7c8a] px-3 py-1 rounded-full shadow-md">
              {event.price > 0 ? `${event.price} $` : 'Free'}
            </span>
          </div>

          {event.booked ? (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#132b4b] to-[#6a7c8a] text-white px-4 py-2 rounded-full text-base font-medium shadow-md">
              <CheckCircle className="w-5 h-5" />
              Booked
            </div>
          ) : (
            <Button
              onClick={handleBooking}
              disabled={bookLoading}
              className="bg-[#0D1B2A] text-[#E0E1DD] hover:bg-[#415A77] transition-all duration-300 ease-in-out gap-2"
            >
              {bookLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
              {bookLoading ? 'Booking...' : 'Book Now'}
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

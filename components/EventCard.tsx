'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Eye,
  Ticket,
  Calendar,
  Image,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { bookEventAndUpdateCaches } from '@/util/booking/bookEventAndUpdateCaches';
import {
  HomePageEventDTO,
  mapHomePageToEventDetails,
} from '@/app/types/HomePageEventDTO';
import {
  mapEventDetailsToHomePage,
} from '@/app/types/EventDetailsDTO';
import { getEventDetails } from '@/services/eventsApi';

interface Props {
  event: HomePageEventDTO;
}

export default function EventCard({ event }: Props) {
  const [bookingLoading, setBookingLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localEvent, setLocalEvent] = useState(event); 
  const router = useRouter();

  const handleBooking = async () => {
    try {
      setBookingLoading(true);
      const updated = await bookEventAndUpdateCaches(mapHomePageToEventDetails(localEvent));
      setLocalEvent(mapEventDetailsToHomePage(updated)); 
      toast.success('✅ Booked successfully!');
    } catch {
      toast.error('Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDetails = async (id: number) => {
  try {
    setLoading(true);
    console.log('Fetching event details for id:', id);

    const data = await getEventDetails(id);
    console.log('Event details fetched:', data);
    sessionStorage.setItem(`event-details-${id}`, JSON.stringify(data));

    router.push(`/user/event/${id}`);
    console.log('Router push called');
  } catch (error) {
    console.error('Error fetching event details or routing:', error);
    toast.error('No details found');
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col justify-between bg-[#1B263B] text-[#E0E1DD] shadow-xl rounded-2xl overflow-hidden border border-[#415A77] group transition-transform transform duration-500 ease-in-out hover:scale-105 relative w-full">
        {/* Image */}
        <div className="relative w-full h-80 overflow-hidden">
          {localEvent.imageUrl ? (
            <img
              src={localEvent.imageUrl}
              alt={localEvent.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a3d6a] via-[#27496d] to-[#6a7c8a] flex items-center justify-center text-white">
              <Image className="w-10 h-10 opacity-70" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
        </div>

        {/* Content */}
        <CardContent className="flex flex-col flex-grow p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{localEvent.title}</h2>
            <span className="text-md text-[#778DA9] flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(localEvent.date), 'dd MMM yyyy')}
            </span>
          </div>

          {/* Description */}
          <p className="text-md opacity-90 line-clamp-3">{localEvent.description}</p>

          {/* Category + Price */}
          <div className="flex justify-between items-center">
            <span className="text-sm px-4 py-1 rounded-full bg-gradient-to-r from-[#1a3d6a] to-[#6a7c8a] text-white shadow-md">
              {localEvent.category}
            </span>
            <span className="text-sm px-4 py-1 rounded-full bg-gradient-to-r from-[#1a3d6a] to-[#6a7c8a] text-white shadow-md">
              {localEvent.price > 0 ? `$${localEvent.price.toFixed(2)}` : 'Free'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 gap-4 mt-auto">
            <Button
              onClick={() => handleDetails(localEvent.id)}
              disabled={loading}
              variant="ghost"
              aria-busy={loading}
              className="border border-[#778DA9] text-[#E0E1DD] hover:bg-[#415A77] hover:text-white transition-all duration-300 ease-in-out gap-2 flex-1"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>{loading ? 'Loading...' : 'Details'}</span>
            </Button>

            {localEvent.booked ? (
              <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#132b4b] to-[#6a7c8a] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md flex-1 text-center">
                <CheckCircle className="w-4 h-4" />
                Booked
              </div>
            ) : (
              <Button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="bg-[#0D1B2A] text-[#E0E1DD] hover:bg-[#415A77] transition-all duration-300 ease-in-out gap-2 flex-1"
              >
                {bookingLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Ticket className="w-4 h-4" />
                )}
                <span>{bookingLoading ? 'Booking...' : 'Book Now'}</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { BookingDTO } from '@/services/bookingsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Image, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useBookingsContext } from '@/context/bookingsContext';
import { useEventsContext } from '@/context/eventsContext';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';

interface Props {
  booking: BookingDTO;
}

export default function BookingCard({ booking }: Props) {
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { cancelBookingById } = useBookingsContext();
  const { setEventBookingStatus } = useEventsContext(); // optional

  const onConfirmCancel = async () => {
    setLoadingCancel(true);
    try {
      await cancelBookingById(booking.id); // remove from cache
      setEventBookingStatus(booking.event.id, booking.event.booked); // set booked = false in Events tab
      toast.success('Booking canceled');
    } catch {
      toast.error('Failed to cancel booking');
    } finally {
      setLoadingCancel(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="h-full"
    >
      <Card className="h-full flex flex-col justify-between bg-[#1B263B] text-[#E0E1DD] shadow-xl rounded-2xl overflow-hidden border border-[#415A77] group transition-transform transform duration-500 ease-in-out hover:scale-105 relative w-[calc(100%)]">
        {/* IMAGE */}
        <div className="relative overflow-hidden w-full h-80">
          {booking.event.imageUrl ? (
            <img
              src={booking.event.imageUrl}
              alt={booking.event.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a3d6a] via-[#27496d] to-[#6a7c8a] flex items-center justify-center text-white">
              <Image className="w-10 h-10 opacity-70" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
        </div>

        {/* CONTENT */}
        <CardContent className="flex flex-col flex-grow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#E0E1DD]">{booking.event.name}</h2>
            <span className="text-md text-[#778DA9] flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(booking.event.date), 'dd MMM yyyy')}
            </span>
          </div>

          <p className="text-md text-[#E0E1DD] opacity-90 line-clamp-3">{booking.event.description}</p>

          <span className="absolute top-3 right-3 px-4 py-1 rounded-full bg-gradient-to-r from-[#1a3d6a] to-[#6a7c8a] text-white text-sm hover:scale-105 transform transition duration-300 ease-in-out shadow-md">
            {booking.event.price > 0 ? `$${booking.event.price.toFixed(2)}` : 'Free'}
          </span>

          <span className="text-md text-[#778DA9] flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Booked at: {format(new Date(booking.bookingDate), 'dd MMM yyyy')}
          </span>

          {/* Cancel Button with Alert */}
          <div className="flex justify-between items-center mt-auto pt-4">
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
              <AlertDialogTrigger asChild>
                <Button
                  className="border border-[#778DA9] text-[#E0E1DD] hover:bg-[#415A77] hover:text-white transition-all duration-300 ease-in-out gap-2"
                  variant="ghost"
                >
                  <X className="w-4 h-4" />
                  Cancel Booking
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#1B263B] border border-[#415A77] text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will cancel your booking for <b>{booking.event.name}</b>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-600 text-white">Cancel</AlertDialogCancel>
                  <Button
                    onClick={onConfirmCancel}
                    disabled={loadingCancel}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {loadingCancel ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Canceling...
                      </>
                    ) : (
                      'Yes, Cancel it'
                    )}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

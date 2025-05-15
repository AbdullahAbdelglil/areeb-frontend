// src/app/user/BookingsTab.tsx
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { BookingsProvider, useBookingsContext } from '@/context/bookingsContext';
import BookingCard from './BookingCard';
import { Loader2 } from 'lucide-react';


function BookingsTabContent() {
    const { bookings, loading, loadMore, cancelBookingById } = useBookingsContext();
    const observerRef = useRef<HTMLDivElement | null>(null);

    const loadBookings = useCallback(() => {
        if (loading || !bookings.length) return;
        loadMore();
    }, [bookings, loading, loadMore]);

    useEffect(() => {
        if (!observerRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadBookings();
                }
            },
            { threshold: 1 }
        );
        observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [loadBookings]);


    return (
        <div className="space-y-10 max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20 mb-10 mt-15">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking}/>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center items-center py-4">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
            )}

            <div ref={observerRef} />
        </div>
    );
}

export default function BookingsTab() {
    return (
        <BookingsProvider>
            <BookingsTabContent />
        </BookingsProvider>
    );
} 
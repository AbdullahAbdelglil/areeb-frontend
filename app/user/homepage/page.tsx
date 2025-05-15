'use client';

import EventsTab from '@/components/EventsTab';
import BookingsTab from '@/components/BookingsTab'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { EventsProvider } from '@/context/eventsContext';
import { BookingsProvider } from '@/context/bookingsContext';

export default function UserHomePage() {
  const [activeTab, setActiveTab] = useState('events');

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-[#E0E1DD] px-4 sm:px-8 md:px-16 lg:px-24 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-screen-2xl mx-auto w-full space-y-12"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 max-w-md mx-auto gap-4 bg-transparent mb-6">
            <TabsTrigger
              value="events"
              className={`text-lg md:text-xl py-3 rounded-xl font-semibold tracking-wide transition-all duration-300 text-center ${activeTab === 'events'
                ? 'bg-gradient-to-r from-[#1a3d6a] to-[#6a7c8a] text-white shadow-md'
                : 'hover:bg-[#1B263B] hover:text-white text-[#A9B4C2]'
                }`}
            >
              Areeb Events
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className={`text-lg md:text-xl py-3 rounded-xl font-semibold tracking-wide transition-all duration-300 text-center ${activeTab === 'bookings'
                ? 'bg-gradient-to-r from-[#1a3d6a] to-[#6a7c8a] text-white shadow-md'
                : 'hover:bg-[#1B263B] hover:text-white text-[#A9B4C2]'
                }`}
            >
              My Bookings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="events">
            <EventsProvider>
              <EventsTab />
            </EventsProvider>
          </TabsContent>
          <TabsContent value="bookings">
            <BookingsProvider>
              <BookingsTab />
            </BookingsProvider>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>

  );
}

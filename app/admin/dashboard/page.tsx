'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getAdminDashboard } from '@/services/adminApi';
import { AdminViewEventDTO } from '@/app/types/AdminEvent';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [events, setEvents] = useState<AdminViewEventDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const eventIdsRef = useRef<Set<number>>(new Set());

    const fetchEvents = useCallback(
        async (pageToFetch: number) => {
            if (loading || !hasMore) return;

            setLoading(true);
            try {
                const data = await getAdminDashboard(pageToFetch, 10);

                const newEvents = data.filter((event: { id: number; }) => !eventIdsRef.current.has(event.id));

                if (newEvents.length > 0) {
                    setEvents((prev) => [...prev, ...newEvents]);
                    newEvents.forEach((event: { id: number; }) => eventIdsRef.current.add(event.id));
                }

                if (data.length < 10) {
                    setHasMore(false);
                } else {
                    setPage(pageToFetch); // update current page only after successful fetch
                }
            } catch (err) {
                console.error('Failed to fetch admin events', err);
            } finally {
                setLoading(false);
            }
        },
        [hasMore, loading]
    );

    useEffect(() => {
        fetchEvents(0);
    }, []);

    useEffect(() => {
  if (!hasMore || loading) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        fetchEvents(page + 1); // pass the next page directly
      }
    },
    { threshold: 1 }
  );

  const ref = observerRef.current;
  if (ref) observer.observe(ref);

  return () => {
    if (ref) observer.unobserve(ref);
  };
}, [hasMore, loading, page, fetchEvents]);

    return (
        <div
            className="min-h-screen w-full px-4 sm:px-8 md:px-12 lg:px-20 pt-10 bg-black text-white"
            style={{
                backgroundImage:
                    'radial-gradient(circle at center, rgba(30,64,175,0.3) 0%, black 70%)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            <h1 className="text-4xl font-extrabold mb-8 text-center text-white tracking-wide">
                Admin Dashboard
            </h1>

            <div className="overflow-x-auto rounded-xl border border-[#334155] shadow-xl backdrop-blur-md bg-white/5">
                <table className="min-w-full text-base text-left text-white">
                    <thead className="bg-[#1E293B] text-[#CBD5E1] uppercase tracking-wide">
                        <tr>
                            <th className="px-6 py-4">Event</th>
                            <th className="px-6 py-4">Bookings</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr
                                key={event.id}
                                className="border-t border-[#334155] hover:bg-[#0f172a] transition duration-300"
                            >
                                <td className="px-6 py-5 font-semibold text-[#E2E8F0]">{event.name}</td>
                                <td className="px-6 py-5 text-[#E2E8F0]">{event.numberOfBookings}</td>
                                <td className="px-6 py-5 text-[#E2E8F0]">
                                    {event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
                                </td>
                                <td className="px-6 py-5 text-[#E2E8F0]">
                                    {new Date(event.date).toLocaleDateString()}
                                </td>
                                <td className="px-10 py-6 flex justify-center gap-6">
                                    <Button
                                        onClick={() => router.push(`/admin/event/${event.id}`)}
                                        size="sm"
                                        variant="ghost"
                                        className="group relative text-blue-400 hover:text-blue-100 hover:bg-blue-800/30 rounded-lg 
                      transition-all duration-300 transform hover:scale-105 shadow hover:shadow-blue-600"
                                    >
                                        <Eye className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs bg-blue-800/80 px-2 py-0.5 rounded-md transition-opacity duration-300">
                                            View
                                        </span>
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="group relative text-purple-400 hover:text-purple-100 hover:bg-purple-800/30 rounded-lg 
                      transition-all duration-300 transform hover:scale-105 shadow hover:shadow-purple-600"
                                    >
                                        <Pencil className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.9)]" />
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs bg-purple-900/90 px-2 py-0.5 rounded-md transition-opacity duration-300">
                                            Edit
                                        </span>
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="group relative text-red-400 hover:text-red-100 hover:bg-red-800/30 rounded-lg 
                      transition-all duration-300 transform hover:scale-105 shadow hover:shadow-red-600"
                                    >
                                        <Trash className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.9)]" />
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs bg-red-800/90 px-2 py-0.5 rounded-md transition-opacity duration-300">
                                            Delete
                                        </span>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div ref={observerRef} className="h-[100px] flex justify-center items-center">
                    {loading && hasMore && (
                        <Loader2 className="w-6 h-6 animate-spin text-blue-300" />
                    )}
                    {!hasMore && (
                        <p className="text-sm text-gray-400 italic py-4">No more events to show.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

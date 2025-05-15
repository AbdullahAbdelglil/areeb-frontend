'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAdminEventDetails } from '@/services/adminApi';
import { AdminViewEventDTO } from '@/app/types/AdminEvent';
import { Loader2, ArrowLeft, Upload } from 'lucide-react';
import axios from 'axios';
import { api } from '@/services/api';

export default function AdminEventDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<AdminViewEventDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await getAdminEventDetails(id!);
                setEvent(data);
            } catch (err) {
                console.error('Failed to fetch event details', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !event) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);

        try {
            await api.post(
                `/admin/events/${event.id}/upload-image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', 
                    },
                }
            );

            // Refresh event details after upload
            const data = await getAdminEventDetails(id!);
            setEvent(data);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Image upload failed.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen px-6 md:px-20 py-10 bg-black text-white animate-pulse space-y-10">
                {/* Title Placeholder */}
                <div className="w-48 h-10 bg-gray-800 rounded-md" />

                {/* Main Grid: Text Left, Image Right */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Left: Text Skeleton */}
                    <div className="space-y-4">
                        <div className="h-6 w-3/4 bg-gray-700 rounded" />
                        <div className="h-6 w-1/2 bg-gray-700 rounded" />
                        <div className="h-6 w-2/3 bg-gray-700 rounded" />
                        <div className="h-6 w-1/3 bg-gray-700 rounded" />
                        <div className="h-6 w-1/2 bg-gray-700 rounded" />
                    </div>

                    {/* Right: Image Placeholder */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-md h-[280px] bg-gray-800 rounded-2xl border border-gray-700 shadow-lg" />
                    </div>
                </div>

                {/* Users Table Placeholder */}
                <div className="space-y-4 mt-12">
                    <div className="h-8 w-60 bg-purple-900 rounded-md" />
                    <div className="w-full border border-purple-800 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-2 bg-purple-900 text-purple-200">
                            <div className="h-10 bg-purple-800" />
                            <div className="h-10 bg-purple-800" />
                        </div>
                        {/* Simulate 3 loading rows */}
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="grid grid-cols-2 border-t border-purple-700">
                                <div className="h-8 bg-purple-950" />
                                <div className="h-8 bg-purple-950" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }


    if (!event) {
        return (
            <div className="text-center text-white mt-20">
                <p>Event not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white p-6 md:p-12 lg:p-20 bg-[#000] bg-gradient-to-br from-[#001f3f] via-[#000] to-black">
            {/* Back Button */}
            <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center gap-2 mb-8 text-indigo-400 hover:text-indigo-200 transition duration-300"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-md font-medium">Back to Dashboard</span>
            </button>

            {/* Event Title */}
            <h1 className="text-4xl font-bold mb-6 text-indigo-400">{event.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg items-start">
                {/* Left: Event Details */}
                <div className="space-y-4 order-1 md:order-none">
                    <p><span className="font-semibold text-indigo-300">Description:</span> {event.description}</p>
                    <p><span className="font-semibold text-indigo-300">Venue:</span> {event.venue}</p>
                    <p><span className="font-semibold text-indigo-300">Date:</span> {new Date(event.date).toLocaleString()}</p>
                    <p><span className="font-semibold text-indigo-300">Price:</span> {event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}</p>
                    {event.agenda && (
                        <p><span className="font-semibold text-indigo-300">Agenda:</span> {event.agenda}</p>
                    )}
                    {event.numberOfBookings !== undefined && (
                        <p><span className="font-semibold text-indigo-300">Total Bookings:</span> {event.numberOfBookings}</p>
                    )}
                </div>

                {/* Right: Image or Upload */}
                <div className="flex flex-col items-center justify-center">
                    {event.imageUrl ? (
                        <img
                            src={event.imageUrl}
                            alt={event.name}
                            className="
    w-full 
    max-w-md 
    h-[280px] 
    rounded-2xl 
    shadow-[0_12px_35px_rgba(0,0,0,0.6)] 
    border 
    border-indigo-500 
    object-cover 
    transition-transform 
    duration-300 
    hover:scale-105 
    hover:shadow-[0_16px_45px_rgba(99,102,241,0.4)]
  "
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-400 p-6 rounded-xl">
                            <p className="mb-4 text-indigo-200">No image uploaded</p>
                            <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                {uploading ? 'Uploading...' : 'Upload Image'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUploadImage}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Users Who Booked */}
            {event.users && event.users.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-300">Users Who Booked</h2>
                    <div className="overflow-x-auto border border-purple-800 rounded-lg">
                        <table className="min-w-full text-left text-white">
                            <thead className="bg-purple-900 text-purple-200">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.users.map((user, index) => (
                                    <tr
                                        key={index}
                                        className="border-t border-purple-800 hover:bg-purple-950 transition-colors"
                                    >
                                        <td className="px-6 py-3">{`${user.firstName} ${user.lastName}` || 'N/A'}</td>
                                        <td className="px-6 py-3">{user.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

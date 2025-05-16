'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { FilePen, Loader2 } from 'lucide-react';
import { getCategories, Category } from '@/services/eventsApi';
import { getAdminEventDetails, updateEvent } from '@/services/adminApi';
import { mapEventFormToEventDTO } from '@/app/types/EventDTO';

export default function UpdateEventPage() {
  const router = useRouter();
  const params = useParams();

  // Force id to always be string or undefined
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

  const [form, setForm] = useState({
    name: '',
    description: '',
    agenda: '',
    categoryId: '',
    date: '',
    venue: '',
    price: '',
    imageUrl: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingEventData, setLoadingEventData] = useState(true);

  // Fetch event details
  useEffect(() => {
    if (!id) {
      console.warn('No event ID found in params');
      return;
    }

    const fetchEventDetails = async () => {
      try {
        const data = await getAdminEventDetails(id);
        setForm({
          name: data.name || '',
          description: data.description || '',
          agenda: data.agenda || '',
          categoryId: data.category?.id || '',
          date: data.date?.split('T')[0] || '',
          venue: data.venue || '',
          price: data.price?.toString() || '',
          imageUrl: data.imageUrl || '',
        });
        console.log('Loaded event data:', data);
      } catch (err) {
        console.error('Error fetching event:', err);
        toast.error('Failed to load event data');
      } finally {
        setLoadingEventData(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Event name is required.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';
    if (!form.venue.trim()) newErrors.venue = 'Venue is required.';
    if (!form.date) {
      newErrors.date = 'Date is required.';
    } else if (new Date(form.date) <= new Date()) {
      newErrors.date = 'Date must be in the future.';
    }
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await updateEvent(id!, mapEventFormToEventDTO(id!, form));
      toast.success('Event updated successfully!');
      router.push('/admin/dashboard');
    } catch (err) {
      toast.error('Failed to update event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!id) {
    return (
      <div className="text-white text-center mt-20 text-lg">
        No event ID provided in the URL.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-[#0f172a] to-black px-4 pt-14 text-white">
      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide flex items-center justify-center gap-3">
        <FilePen className="w-8 h-8 text-blue-400" />
        Update Event
      </h1>

      {loadingEventData ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] space-y-6 border border-gray-700"
        >
          {/* Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="peer w-full bg-black/60 border border-gray-600 text-white px-4 pt-6 pb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-transparent"
                placeholder="Event Name"
              />
              <label
                htmlFor="name"
                className="absolute text-sm text-gray-400 left-4 top-2.5 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-400"
              >
                Event Name *
              </label>
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="relative">
              <input
                name="venue"
                type="text"
                value={form.venue}
                onChange={handleChange}
                className="peer w-full bg-black/60 border border-gray-600 text-white px-4 pt-6 pb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-transparent"
                placeholder="Venue"
              />
              <label
                htmlFor="venue"
                className="absolute text-sm text-gray-400 left-4 top-2.5 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-400"
              >
                Venue *
              </label>
              {errors.venue && <p className="text-red-400 text-sm mt-1">{errors.venue}</p>}
            </div>
          </div>

          <div>
            <textarea
              name="description"
              placeholder="Event Description *"
              value={form.description}
              onChange={handleChange}
              className="w-full h-28 px-4 py-3 rounded-lg bg-black/60 text-white border border-gray-600 focus:ring-2 focus:ring-blue-600"
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <textarea
              name="agenda"
              placeholder="Agenda (optional)"
              value={form.agenda}
              onChange={handleChange}
              className="w-full h-24 px-4 py-3 rounded-lg bg-black/60 text-white border border-gray-600 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black/60 text-white border border-gray-600 focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black/60 text-white border border-gray-600 focus:ring-2 focus:ring-blue-600"
              />
              {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
            </div>

            <input
              name="price"
              type="text"
              placeholder="Price (optional)"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black/60 text-white border border-gray-600 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="
              w-full py-4 rounded-xl font-semibold text-xl
              bg-gradient-to-r from-blue-600/40 via-blue-500/30 to-blue-400/20
              backdrop-blur-md 
              border border-white/20 
              text-white 
              shadow-lg shadow-blue-700/30
              hover:bg-gradient-to-r hover:from-blue-500/60 hover:via-blue-400/40 hover:to-blue-300/30
              hover:shadow-blue-600/60
              transition-all duration-500 ease-in-out
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                Updating...
              </span>
            ) : (
              'Update'
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

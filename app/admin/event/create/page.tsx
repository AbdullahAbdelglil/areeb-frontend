'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/services/adminApi';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { FilePen, Loader2 } from 'lucide-react';
import { getCategories, Category } from '@/services/eventsApi';

export default function CreateEventPage() {
  const router = useRouter();
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

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      await createEvent({
        ...form,
        price: form.price ? parseFloat(form.price) : 0.0,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      });
      toast.success('Event created successfully!');
      router.push('/admin/dashboard');
    } catch (err) {
      toast.error('Failed to create event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-[#0f172a] to-black px-4 pt-14 text-white">
      <h1 className="text-4xl font-extrabold text-center text-white mb-10 tracking-wide flex items-center justify-center gap-3">
        <FilePen className="w-8 h-8 text-blue-400" />
        Create New Event
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] space-y-6 border border-gray-700"
      >
        {/* Grouped fields */}
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
              id="venue"
              name="venue"
              type="text"
              value={form.venue}
              onChange={handleChange}
              placeholder="Venue"
              className="peer w-full bg-black/60 border border-gray-600 text-white px-4 pt-6 pb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-transparent"
            />
            <label
              htmlFor="venue"
              className="absolute left-4 top-2.5 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-400"
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
              Saving...
            </span>
          ) : (
            'Save'
          )}
        </Button>
      </form>
    </div>
  );

}

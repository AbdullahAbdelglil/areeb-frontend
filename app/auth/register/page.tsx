'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register as registerUser } from '@/services/authService';
import { Loader2 } from 'lucide-react';

interface RegisterForm {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

interface FormErrors {
  firstName?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)
    ) {
      newErrors.password =
        'Password must include uppercase, lowercase, number, and special character';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setErrors({});
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      await registerUser(formData);
      router.push('/auth/login');
    } catch (err: any) {
      console.error(`Registration failed: ${err?.response?.data?.message}`);
      setSubmitError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white"
      style={{
        backgroundColor: '#000',
        backgroundImage: 'radial-gradient(circle at center, rgba(0,102,255,0.4) 0%, black 60%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/70 p-6 rounded-2xl shadow-lg w-full max-w-md backdrop-blur"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {/* First Name */}
        <label className="block mb-2 font-medium">First Name</label>
        <input
          type="text"
          name="firstName"
          className="w-full px-4 py-2 mb-1 rounded-md border border-gray-600 bg-gray-800 text-white"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        {errors.firstName && <p className="text-red-500 text-sm mb-2">{errors.firstName}</p>}

        {/* Last Name */}
        <label className="block mb-2 font-medium">Last Name</label>
        <input
          type="text"
          name="lastName"
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-600 bg-gray-800 text-white"
          value={formData.lastName}
          onChange={handleChange}
        />

        {/* Email */}
        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          name="email"
          className="w-full px-4 py-2 mb-1 rounded-md border border-gray-600 bg-gray-800 text-white"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

        {/* Password */}
        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          name="password"
          className="w-full px-4 py-2 mb-1 rounded-md border border-gray-600 bg-gray-800 text-white"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

        {/* Submit Error */}
        {submitError && <p className="text-red-500 text-sm mb-4">{submitError}</p>}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-md transition mt-4
        ${loading ? 'bg-areeb.primary/80 cursor-not-allowed' : 'bg-areeb.primary hover:bg-blue-700'}
        text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
          aria-busy={loading}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{loading ? 'Registering...' : 'Register'}</span>
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/auth/login" className="text-areeb.primary hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

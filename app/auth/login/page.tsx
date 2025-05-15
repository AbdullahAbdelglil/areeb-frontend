'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import { Loader2 } from 'lucide-react';


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try { 
      // Call login API
      const { accessToken, refreshToken } = await login({ email, password });

      // Decode JWT payload
      const payloadBase64 = accessToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const { role, sub: userEmail } = decodedPayload;

      // Store tokens and user email
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', userEmail);

      // Navigate based on role
      if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (role === 'USER') {
        router.push('/user/homepage');
      } else {
        setError('Unsupported role');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
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
        onSubmit={handleLogin}
        className="bg-gray-900/70 p-6 rounded-2xl shadow-lg w-full max-w-md backdrop-blur"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-600 bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-600 bg-gray-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-md transition
        ${loading ? 'bg-areeb.primary/80 cursor-not-allowed' : 'bg-areeb.primary hover:bg-blue-700'}
        text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
          aria-busy={loading}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{loading ? 'Logging in...' : 'Login'}</span>
        </button>

        <p className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <a href="/auth/register" className="text-areeb.primary hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}

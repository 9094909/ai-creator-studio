'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { validateEmail } from '@/lib/validation';
import { getAuthErrorMessage } from '@/lib/error-handler';
import { apiPost } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Get user from backend
      await apiPost('/api/users/login', {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      });

      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error: any) {
      setErrors({ submit: getAuthErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Sync user in backend
      await apiPost('/api/users/login', {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        avatar: result.user.photoURL,
      });

      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error: any) {
      setErrors({ submit: getAuthErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-black border border-border rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-secondary mb-6">Sign in to your account</p>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-900 bg-opacity-30 border border-green-700 rounded text-green-400">
              {successMessage}
            </div>
          )}

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-400">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:border-primary text-foreground ${
                  errors.email ? 'border-red-500' : 'border-border'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:border-primary text-foreground ${
                  errors.password ? 'border-red-500' : 'border-border'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-secondary">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-background border border-border text-foreground py-2 rounded-lg font-medium hover:bg-secondary hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Processing...' : '🔗 Sign in with Google'}
          </button>

          <p className="text-center text-secondary text-sm mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

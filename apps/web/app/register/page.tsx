'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { validateEmail, validatePassword, validateName } from '@/lib/validation';
import { getAuthErrorMessage } from '@/lib/error-handler';
import { apiPost } from '@/lib/api-client';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateName(formData.name)) {
      newErrors.name = 'Name must be between 2 and 100 characters';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create user in backend
      await apiPost('/api/users/register', {
        uid: userCredential.user.uid,
        email: formData.email,
        name: formData.name,
      });

      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error: any) {
      setErrors({ submit: getAuthErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Create user in backend
      await apiPost('/api/users/register', {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName || 'User',
        avatar: result.user.photoURL,
      });

      setSuccessMessage('Account created successfully! Redirecting...');
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-secondary mb-6">Join AI Creator Studio today</p>

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

          <form onSubmit={handleEmailRegister} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:border-primary text-foreground ${
                  errors.name ? 'border-red-500' : 'border-border'
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:border-primary text-foreground ${
                  errors.confirmPassword ? 'border-red-500' : 'border-border'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating account...' : 'Create Account'}
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
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full bg-background border border-border text-foreground py-2 rounded-lg font-medium hover:bg-secondary hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Processing...' : '🔗 Sign up with Google'}
          </button>

          <p className="text-center text-secondary text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

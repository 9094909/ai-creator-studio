'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet, apiPut } from '@/lib/api-client';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const data = await apiGet<UserProfile>('/api/users/profile');
        setProfile(data);
        setFormData({ name: data.name });
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const updated = await apiPut<UserProfile>('/api/users/profile', formData);
      setProfile(updated);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to logout');
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-background">
      {/* Header */}
      <nav className="border-b border-border bg-black bg-opacity-50 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground">AI Creator Studio</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-secondary hover:text-foreground transition">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="rounded bg-destructive px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">Profile Settings</h2>
          <p className="text-secondary mt-2">Manage your account information</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-400">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-900 bg-opacity-30 border border-green-700 rounded text-green-400">
            {successMessage}
          </div>
        )}

        {/* Profile Card */}
        <div className="rounded-lg border border-border bg-background p-8">
          {profile && (
            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="h-20 w-20 rounded-full" />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{profile.name}</h3>
                  <p className="text-secondary">{profile.email}</p>
                </div>
              </div>

              <hr className="border-border" />

              {/* Account Info */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">Account Information</h4>
                <div className="space-y-3 text-secondary text-sm">
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="text-foreground font-mono">{profile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Member Since:</span>
                    <span className="text-foreground">{new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* Edit Profile */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition"
                >
                  Edit Profile
                </button>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-background border border-border text-foreground py-2 rounded-lg font-medium hover:bg-secondary hover:bg-opacity-10 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

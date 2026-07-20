'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '@/lib/api-client';

interface UserStats {
  projectsCount: number;
  contentsCount: number;
  totalLikes: number;
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const data = await apiGet<UserStats>('/api/users/stats');
        setStats(data);
      } catch (err) {
        setError('Failed to load stats');
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to logout');
    }
  };

  if (loading) {
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
            <Link href="/profile" className="text-secondary hover:text-foreground transition">
              Profile
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
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-400">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {user?.displayName || user?.email?.split('@')[0]}!
          </h2>
          <p className="text-secondary">Here's what you've been creating</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="rounded-lg border border-border bg-background p-6">
            <div className="text-4xl font-bold text-primary mb-2">
              {loadingStats ? '-' : stats?.projectsCount || 0}
            </div>
            <p className="text-secondary">Projects</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-6">
            <div className="text-4xl font-bold text-primary mb-2">
              {loadingStats ? '-' : stats?.contentsCount || 0}
            </div>
            <p className="text-secondary">Content Pieces</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-6">
            <div className="text-4xl font-bold text-primary mb-2">
              {loadingStats ? '-' : stats?.totalLikes || 0}
            </div>
            <p className="text-secondary">Total Likes</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-border bg-background p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/projects/new"
              className="rounded-lg border border-primary bg-primary bg-opacity-10 p-6 text-center hover:bg-opacity-20 transition"
            >
              <div className="text-2xl mb-2">📁</div>
              <div className="font-semibold text-foreground">Create Project</div>
              <div className="text-sm text-secondary">Start a new project</div>
            </Link>
            <Link
              href="/content/new"
              className="rounded-lg border border-primary bg-primary bg-opacity-10 p-6 text-center hover:bg-opacity-20 transition"
            >
              <div className="text-2xl mb-2">✍️</div>
              <div className="font-semibold text-foreground">Create Content</div>
              <div className="text-sm text-secondary">Write new content</div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

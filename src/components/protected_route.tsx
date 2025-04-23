'use client';

import { useAuth } from '@/context/auth_context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading, don't do anything yet
    if (loading) return;

    // Case 1: If the user is not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    // Case 2: Role-based redirection based on user role
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        // Admin route
        // Continue to the page as this user is an admin
        return;
      } else if (user?.role === 'agent') {
        // Agent route
        router.push('/agent/dashboard');
        return;
      } else if (user?.role === 'tenant') {
        // Tenant route
        router.push('/tenant');
        return;
      } else {
        // Handle case where role is not recognized
        router.push('/unauthorized');
        return;
      }
    }

  }, [isAuthenticated, loading, router, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

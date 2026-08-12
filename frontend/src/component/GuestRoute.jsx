import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Guards "/", "/sign-in", "/sign-up". An already-logged-in user landing on
// any of these gets bounced straight into the dashboard instead of seeing
// the marketing page or auth forms again.
export default function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-post-green animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard/new-post" replace />;
  }

  return <Outlet />;
}

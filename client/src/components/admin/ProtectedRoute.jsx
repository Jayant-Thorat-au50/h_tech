import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentAdmin } from '../../features/authSlice.js';

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const { isAuthenticated, initialized, loading } = useSelector((state) => state.auth);
  const isDevelopmentDemo = import.meta.env.DEV;

  useEffect(() => {
    if (!isDevelopmentDemo && !initialized) {
      dispatch(fetchCurrentAdmin());
    }
  }, [initialized, dispatch, isDevelopmentDemo]);

  if (isDevelopmentDemo) {
    return <Outlet />;
  }

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="px-6 py-4 rounded-2xl bg-white shadow text-sm font-bold text-slate-700 animate-pulse">
          Verifying H-Tech Admin Session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

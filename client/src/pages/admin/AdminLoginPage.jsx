import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Mail, ArrowLeft } from 'lucide-react';
import SEO from '../../components/shared/SEO.jsx';
import { loginAdmin, clearAuthError, fetchCurrentAdmin } from '../../features/authSlice.js';

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, initialized } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('admin@htechcomputer.com');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!initialized) {
      dispatch(fetchCurrentAdmin());
    }
  }, [initialized, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginAdmin({ email, password }));
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center px-4 py-12">
      <SEO title="Admin Login" noindex />

      <div className="w-full max-w-md rounded-[28px] border border-[#E7ECF3] bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.09)] sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/brand/logo.png"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/brand/logo-fallback.svg';
            }}
            alt="H-Tech Computer Wholesale"
            className="h-11 mx-auto"
          />
          <h1 className="text-2xl font-extrabold tracking-tight text-[#172033] pt-2">
            H-Tech Admin Console
          </h1>
          <p className="text-xs text-slate-500">
            Authorized access for H-Tech Computer Wholesale (Karad)
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold tracking-wide text-slate-600 mb-1.5"
            >
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-htech-blue/30"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold tracking-wide text-slate-600 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-htech-blue/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#1769D2] hover:bg-[#1259B6] disabled:opacity-60 text-white font-bold text-sm shadow-[0_8px_18px_rgba(23,105,210,0.2)] transition"
          >
            {loading ? 'Signing in...' : 'Sign In to Admin Console'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-htech-navy"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

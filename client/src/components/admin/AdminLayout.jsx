import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  Layers,
  Award,
  Sparkles,
  Users,
  HeartHandshake,
  MapPin,
  Newspaper,
  MessageSquare,
  Settings,
  KeyRound,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import SEO from '../shared/SEO.jsx';
import ToastContainer from '../shared/ToastContainer.jsx';
import { logoutAdmin } from '../../features/authSlice.js';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Categories', path: '/admin/categories', icon: Layers },
  { name: 'Brands', path: '/admin/brands', icon: Award },
  { name: 'Special Offers', path: '/admin/offers', icon: Sparkles },
  { name: 'Customer Photos', path: '/admin/customers', icon: Users },
  { name: 'Charity Photos', path: '/admin/charity', icon: HeartHandshake },
  { name: 'Branches', path: '/admin/branches', icon: MapPin },
  { name: 'Tech Updates', path: '/admin/tech-updates', icon: Newspaper },
  { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
  { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  { name: 'Change Password', path: '/admin/password', icon: KeyRound },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isDevelopmentDemo = import.meta.env.DEV;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    if (isDevelopmentDemo) {
      navigate('/');
      return;
    }
    await dispatch(logoutAdmin());
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell flex min-h-screen bg-[#F4F7FB] text-[#172033]">
      <SEO title="Admin Console" noindex />

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-40 w-[270px] shrink-0 border-r border-[#E7ECF3] bg-white text-slate-600 shadow-[8px_0_32px_rgba(15,23,42,0.025)] flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 overflow-y-auto">
          <div className="flex items-center justify-between mb-7 pb-5 border-b border-[#EEF1F6]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F2F4] text-[#596273]">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold tracking-tight text-[#30343B]">
                  H-Tech <span className="text-[#626A76]">Admin</span>
                </div>
                <div className="mt-0.5 text-[9px] font-medium tracking-wide text-slate-400">
                  KARAD WHOLESALE CONSOLE
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition ${
                      isActive
                        ? 'bg-[#EAF2FF] text-[#1769D2]'
                        : 'text-slate-600 hover:bg-[#F5F7FA] hover:text-[#172033]'
                    }`
                  }
                >
                  <Icon className="w-[17px] h-[17px] shrink-0 opacity-80" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#EEF1F6] space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#E7ECF3] bg-white hover:bg-[#F7F9FC] text-xs font-semibold text-slate-700 transition"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isDevelopmentDemo ? 'Exit Demo' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 border-b border-[#E8E7E4] bg-[#FBFAF8]/95 px-4 sm:px-8 py-3 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#E7ECF3] bg-white text-slate-600 hover:bg-slate-50"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Administration
              </p>
              <h1 className="text-xs sm:text-sm font-semibold text-[#30343B]">
                Content Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isDevelopmentDemo && (
              <span className="hidden sm:inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 ring-1 ring-inset ring-amber-200">
                DEMO
              </span>
            )}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEECE8] text-[11px] font-semibold text-[#596273]">
              {(user?.email?.[0] || 'D').toUpperCase()}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[9px] text-slate-400">
                {isDevelopmentDemo && !user ? 'Local preview' : 'Signed in as'}
              </p>
              <p className="max-w-[190px] truncate text-[11px] font-semibold text-slate-700">
                {user?.email || (isDevelopmentDemo ? 'Admin demo' : 'Admin')}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-7 lg:p-9 overflow-y-auto">
          {isDevelopmentDemo && (
            <div
              role="status"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3.5 text-sm text-amber-900 shadow-sm"
            >
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
              <span>
                Development demo mode: this admin UI is open locally. Admin API changes still
                require an authenticated session.
              </span>
            </div>
          )}
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}

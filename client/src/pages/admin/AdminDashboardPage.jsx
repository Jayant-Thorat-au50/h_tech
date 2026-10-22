import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Package,
  Sparkles,
  MessageSquare,
  Award,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { fetchAdminStats } from '../../features/contentSlice.js';
import { buildWhatsAppUrl } from '../../utils/whatsapp.js';

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const { adminStats, recentEnquiries } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const cards = [
    {
      label: 'Total Products',
      value: adminStats?.productsCount ?? '—',
      to: '/admin/products',
      icon: Package,
      color: 'bg-blue-50 text-htech-blue',
    },
    {
      label: 'Active Offers',
      value: adminStats?.activeOffersCount ?? '—',
      to: '/admin/offers',
      icon: Sparkles,
      color: 'bg-amber-50 text-htech-orange',
    },
    {
      label: 'New Enquiries',
      value: adminStats?.newEnquiriesCount ?? '—',
      to: '/admin/enquiries',
      icon: MessageSquare,
      color: 'bg-emerald-50 text-htech-green',
    },
    {
      label: 'Hardware Brands',
      value: adminStats?.brandsCount ?? '—',
      to: '/admin/brands',
      icon: Award,
      color: 'bg-purple-50 text-htech-purple',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Dashboard Overview</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage H-Tech Computer Wholesale catalog, offers, galleries, branches, and customer
          enquiries.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              to={c.to}
              className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {c.label}
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{c.value}</div>
              </div>
              <div className={`p-3.5 rounded-2xl ${c.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Enquiries Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800">Recent Dealer & Web Enquiries</h3>
          <Link
            to="/admin/enquiries"
            className="inline-flex items-center gap-1 text-xs font-bold text-htech-blue hover:underline"
          >
            <span>Manage All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold">
                <th className="py-3 px-4">Customer / Shop</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Reply</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No enquiries recorded yet.
                  </td>
                </tr>
              ) : (
                recentEnquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{enq.name}</td>
                    <td className="py-3.5 px-4 text-slate-700">{enq.phone}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-md truncate">{enq.message}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                          enq.status === 'new'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enq.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={buildWhatsAppUrl(
                          `Hello ${enq.name}, thank you for contacting H-Tech Computer Wholesale (Karad) regarding: "${enq.message}".`,
                          enq.phone
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-htech-green text-white text-xs font-bold"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

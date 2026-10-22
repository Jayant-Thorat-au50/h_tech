import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, Trash2 } from 'lucide-react';
import {
  fetchAdminEnquiries,
  updateAdminEnquiryStatus,
  deleteAdminEnquiry,
} from '../../features/enquiriesSlice.js';
import { addToast } from '../../features/uiSlice.js';
import { buildWhatsAppUrl } from '../../utils/whatsapp.js';

export default function AdminEnquiriesPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.enquiries);

  useEffect(() => {
    dispatch(fetchAdminEnquiries());
  }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    const res = await dispatch(updateAdminEnquiryStatus({ id, status }));
    if (!res.error) {
      dispatch(addToast({ type: 'success', message: `Status updated to "${status}"` }));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete enquiry from "${name}"?`)) return;
    await dispatch(deleteAdminEnquiry(id));
    dispatch(addToast({ type: 'success', message: 'Enquiry deleted.' }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Customer & Dealer Enquiries
        </h2>
        <p className="text-xs text-slate-500">
          Track status (new → contacted → closed) and reply directly on WhatsApp.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Name & Phone</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading enquiries...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                items.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{enq.name}</div>
                      <a
                        href={`tel:${enq.phone}`}
                        className="text-xs font-semibold text-htech-blue hover:underline"
                      >
                        {enq.phone}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 max-w-md text-slate-700">{enq.message}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      {enq.sourcePage}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
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
                        <span>Reply</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(enq._id, enq.name)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

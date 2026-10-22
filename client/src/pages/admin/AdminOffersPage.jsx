import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import {
  fetchAdminOffers,
  createAdminOffer,
  updateAdminOffer,
  deleteAdminOffer,
} from '../../features/contentSlice.js';
import { addToast } from '../../features/uiSlice.js';

const toInputDate = (d) => {
  if (!d) return new Date().toISOString().split('T')[0];
  return new Date(d).toISOString().split('T')[0];
};

const emptyOffer = {
  title: '',
  badge: 'Special Offer',
  discountText: '',
  description: '',
  type: 'best-deal',
  image: '',
  imagePublicId: '',
  gradient: 'from-blue-900 via-indigo-900 to-slate-900',
  ctaLabel: 'Claim Offer on WhatsApp',
  startDate: toInputDate(new Date()),
  endDate: toInputDate(new Date(Date.now() + 30 * 86400000)),
  isActive: true,
  order: 1,
};

export default function AdminOffersPage() {
  const dispatch = useDispatch();
  const { adminOffers } = useSelector((state) => state.content);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyOffer);

  useEffect(() => {
    dispatch(fetchAdminOffers());
  }, [dispatch]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyOffer, order: adminOffers.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (o) => {
    setEditingId(o._id);
    setForm({
      title: o.title || '',
      badge: o.badge || 'Special Offer',
      discountText: o.discountText || '',
      description: o.description || '',
      type: o.type || 'best-deal',
      image: o.image || '',
      imagePublicId: o.imagePublicId || '',
      gradient: o.gradient || 'from-blue-900 via-indigo-900 to-slate-900',
      ctaLabel: o.ctaLabel || 'Claim Offer on WhatsApp',
      startDate: toInputDate(o.startDate),
      endDate: toInputDate(o.endDate),
      isActive: o.isActive !== false,
      order: o.order ?? 1,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(new Date(form.endDate).setHours(23, 59, 59, 999)).toISOString(),
    };
    const res = editingId
      ? await dispatch(updateAdminOffer({ id: editingId, payload }))
      : await dispatch(createAdminOffer(payload));

    if (!res.error) {
      dispatch(addToast({ type: 'success', message: 'Offer saved!' }));
      setModalOpen(false);
    } else {
      dispatch(addToast({ type: 'error', message: res.payload || 'Error saving offer' }));
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete offer "${title}"?`)) return;
    await dispatch(deleteAdminOffer(id));
    dispatch(addToast({ type: 'success', message: 'Offer deleted.' }));
  };

  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Manage Special Offers
          </h2>
          <p className="text-xs text-slate-500">
            Only offers that are Active and within Start/End dates appear on the public website.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-htech-orange text-white text-xs sm:text-sm font-bold shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Offer</span>
        </button>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Validity Window</th>
                <th className="py-3 px-4">Live Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminOffers.map((o) => {
                const isLive =
                  o.isActive && new Date(o.startDate) <= now && new Date(o.endDate) >= now;
                return (
                  <tr key={o._id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{o.title}</div>
                      <div className="text-xs text-slate-500">{o.discountText}</div>
                    </td>
                    <td className="py-3 px-4 uppercase text-xs font-bold text-slate-600">
                      {o.type}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {toInputDate(o.startDate)} → {toInputDate(o.endDate)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isLive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isLive ? 'Live on Site' : 'Expired / Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEdit(o)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-htech-blue"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(o._id, o.title)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingId ? 'Edit Offer' : 'Create Offer'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Offer Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Offer Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="best-deal">Best Deal</option>
                    <option value="new-launch">New Launch</option>
                    <option value="seasonal">Seasonal Offer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Discount / Highlight Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.discountText}
                    onChange={(e) => setForm({ ...form, discountText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <ImageUploader
                label="Offer Banner Image"
                value={form.image}
                onChange={({ url, publicId }) =>
                  setForm({ ...form, image: url, imagePublicId: publicId })
                }
              />

              <label className="inline-flex items-center gap-2 font-bold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded"
                />
                <span>Active Offer</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-htech-navy text-white font-bold"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

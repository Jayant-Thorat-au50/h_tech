import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  fetchBranches,
  createAdminBranch,
  updateAdminBranch,
  deleteAdminBranch,
} from '../../features/contentSlice.js';
import { addToast } from '../../features/uiSlice.js';

const emptyBranch = {
  name: '',
  isHeadOffice: false,
  address: '',
  mobile: '',
  whatsapp: '',
  landline: '',
  email: '',
  mapUrl: '',
  order: 1,
};

export default function AdminBranchesPage() {
  const dispatch = useDispatch();
  const { branches } = useSelector((state) => state.content);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyBranch);

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyBranch, order: branches.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditingId(b._id);
    setForm({
      name: b.name || '',
      isHeadOffice: Boolean(b.isHeadOffice),
      address: b.address || '',
      mobile: b.mobile || '',
      whatsapp: b.whatsapp || '',
      landline: b.landline || '',
      email: b.email || '',
      mapUrl: b.mapUrl || '',
      order: b.order ?? 1,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const res = editingId
      ? await dispatch(updateAdminBranch({ id: editingId, payload: form }))
      : await dispatch(createAdminBranch(form));

    if (!res.error) {
      dispatch(addToast({ type: 'success', message: 'Branch saved!' }));
      setModalOpen(false);
    } else {
      dispatch(addToast({ type: 'error', message: res.payload || 'Error saving branch' }));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete branch "${name}"?`)) return;
    await dispatch(deleteAdminBranch(id));
    dispatch(addToast({ type: 'success', message: 'Branch deleted.' }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Manage Branches</h2>
          <p className="text-xs text-slate-500">
            Configure Karad Head Office and any additional regional branches.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-htech-blue text-white text-xs sm:text-sm font-bold shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Branch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {branches.map((b) => (
          <div
            key={b._id}
            className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                    b.isHeadOffice
                      ? 'bg-blue-100 text-htech-blue'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {b.isHeadOffice ? 'Head Office' : 'Branch'}
                </span>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={() => openEdit(b)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-htech-blue"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(b._id, b.name)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900">{b.name}</h3>
              <p className="text-xs sm:text-sm text-slate-600">{b.address}</p>
              <div className="pt-2 text-xs text-slate-700 space-y-1">
                <div>
                  <strong>Mobile:</strong> {b.mobile}
                </div>
                {b.landline && (
                  <div>
                    <strong>Landline:</strong> {b.landline}
                  </div>
                )}
                {b.email && (
                  <div>
                    <strong>Email:</strong> {b.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingId ? 'Edit Branch' : 'Add Branch'}
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
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Full Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Mobile *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Landline
                  </label>
                  <input
                    type="text"
                    value={form.landline}
                    onChange={(e) => setForm({ ...form, landline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    WhatsApp URL
                  </label>
                  <input
                    type="text"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Google Maps Link
                </label>
                <input
                  type="text"
                  value={form.mapUrl}
                  onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <label className="inline-flex items-center gap-2 font-bold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.isHeadOffice}
                  onChange={(e) => setForm({ ...form, isHeadOffice: e.target.checked })}
                  className="rounded"
                />
                <span>Mark as Primary Head Office</span>
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
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

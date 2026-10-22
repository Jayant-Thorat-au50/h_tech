import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  fetchAdminTechUpdates,
  createAdminTechUpdate,
  updateAdminTechUpdate,
  deleteAdminTechUpdate,
} from '../../features/contentSlice.js';
import { addToast } from '../../features/uiSlice.js';

const emptyUpdate = {
  type: 'news',
  title: '',
  summary: '',
  url: '',
  isActive: true,
  order: 1,
};

export default function AdminTechUpdatesPage() {
  const dispatch = useDispatch();
  const { techUpdates } = useSelector((state) => state.content);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyUpdate);

  useEffect(() => {
    dispatch(fetchAdminTechUpdates());
  }, [dispatch]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyUpdate, order: techUpdates.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditingId(u._id);
    setForm({
      type: u.type || 'news',
      title: u.title || '',
      summary: u.summary || '',
      url: u.url || '',
      isActive: u.isActive !== false,
      order: u.order ?? 1,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const res = editingId
      ? await dispatch(updateAdminTechUpdate({ id: editingId, payload: form }))
      : await dispatch(createAdminTechUpdate(form));

    if (!res.error) {
      dispatch(addToast({ type: 'success', message: 'Tech update saved!' }));
      setModalOpen(false);
    } else {
      dispatch(addToast({ type: 'error', message: res.payload || 'Error saving update' }));
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await dispatch(deleteAdminTechUpdate(id));
    dispatch(addToast({ type: 'success', message: 'Deleted.' }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Manage Tech Updates
          </h2>
          <p className="text-xs text-slate-500">
            Manage Tech News, Product Updates, and Useful Links cards.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-htech-purple text-white text-xs sm:text-sm font-bold shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Entry</span>
        </button>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold">
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Title & Summary</th>
                <th className="py-3 px-4">URL</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {techUpdates.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 uppercase text-xs font-extrabold text-htech-purple">
                    {u.type}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{u.title}</div>
                    <div className="text-xs text-slate-500">{u.summary}</div>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-xs text-htech-blue">{u.url}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => openEdit(u)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-htech-blue"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(u._id, u.title)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingId ? 'Edit Tech Update' : 'Add Tech Update'}
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
                  Card Type *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <option value="news">Tech News</option>
                  <option value="product-update">Product Update</option>
                  <option value="useful-link">Useful Link</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Title *
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
                  Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Destination URL (optional)
                </label>
                <input
                  type="text"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

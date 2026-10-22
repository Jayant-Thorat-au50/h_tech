import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import {
  fetchAdminCustomers,
  createAdminCustomer,
  updateAdminCustomer,
  deleteAdminCustomer,
  fetchAdminCharity,
  createAdminCharity,
  updateAdminCharity,
  deleteAdminCharity,
} from '../../features/contentSlice.js';
import { addToast } from '../../features/uiSlice.js';

export default function AdminGalleryPage({ mode = 'customers' }) {
  const dispatch = useDispatch();
  const isCharity = mode === 'charity';
  const items = useSelector((state) =>
    isCharity ? state.content.charityPhotos : state.content.customerPhotos
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    image: '',
    imagePublicId: '',
    caption: '',
    order: 1,
    isActive: true,
  });

  useEffect(() => {
    if (isCharity) dispatch(fetchAdminCharity());
    else dispatch(fetchAdminCustomers());
  }, [isCharity, dispatch]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      image: '',
      imagePublicId: '',
      caption: '',
      order: items.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({
      image: p.image || '',
      imagePublicId: p.imagePublicId || '',
      caption: p.caption || '',
      order: p.order ?? 1,
      isActive: p.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.image) {
      dispatch(addToast({ type: 'error', message: 'Please upload or provide an image URL.' }));
      return;
    }

    const res = isCharity
      ? editingId
        ? await dispatch(updateAdminCharity({ id: editingId, payload: form }))
        : await dispatch(createAdminCharity(form))
      : editingId
      ? await dispatch(updateAdminCustomer({ id: editingId, payload: form }))
      : await dispatch(createAdminCustomer(form));

    if (!res.error) {
      dispatch(addToast({ type: 'success', message: 'Photo saved!' }));
      setModalOpen(false);
    } else {
      dispatch(addToast({ type: 'error', message: res.payload || 'Error saving photo' }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo from the gallery?')) return;
    if (isCharity) await dispatch(deleteAdminCharity(id));
    else await dispatch(deleteAdminCustomer(id));
    dispatch(addToast({ type: 'success', message: 'Photo deleted.' }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {isCharity ? 'Manage Charity Photos' : 'Manage Customer Photos'}
          </h2>
          <p className="text-xs text-slate-500">
            Upload photos and captions for the public {isCharity ? 'H-Tech Charity' : 'Customers'}{' '}
            gallery.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-htech-blue text-white text-xs sm:text-sm font-bold shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <div
            key={p._id}
            className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="h-48 bg-slate-900 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.caption}
                  onError={(e) => {
                    e.currentTarget.src = '/brand/logo-fallback.svg';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-xs sm:text-sm font-bold text-slate-800">{p.caption}</p>
              </div>
            </div>
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">Order #{p.order}</span>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-htech-blue"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p._id)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingId ? 'Edit Photo' : 'Add Gallery Photo'}
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
              <ImageUploader
                label="Gallery Image *"
                value={form.image}
                onChange={({ url, publicId }) =>
                  setForm({ ...form, image: url, imagePublicId: publicId })
                }
              />
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Caption *
                </label>
                <input
                  type="text"
                  required
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
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
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

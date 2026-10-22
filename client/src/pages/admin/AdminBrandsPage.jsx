import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import {
  fetchBrands,
  createAdminBrand,
  updateAdminBrand,
  deleteAdminBrand,
} from '../../features/catalogSlice.js';
import { addToast } from '../../features/uiSlice.js';

const emptyBrand = {
  name: '',
  logo: '',
  logoPublicId: '',
  website: '',
  description: '',
  isHardwareBrand: false,
  order: 1,
};

export default function AdminBrandsPage() {
  const dispatch = useDispatch();
  const { brands } = useSelector((state) => state.catalog);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyBrand);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyBrand, order: brands.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditingId(b._id);
    setForm({
      name: b.name || '',
      logo: b.logo || '',
      logoPublicId: b.logoPublicId || '',
      website: b.website || '',
      description: b.description || '',
      isHardwareBrand: Boolean(b.isHardwareBrand),
      order: b.order ?? 1,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const res = editingId
      ? await dispatch(updateAdminBrand({ id: editingId, payload: form }))
      : await dispatch(createAdminBrand(form));

    if (!res.error) {
      dispatch(addToast({ type: 'success', message: 'Brand saved!' }));
      setModalOpen(false);
    } else {
      dispatch(addToast({ type: 'error', message: res.payload || 'Error saving brand' }));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete brand "${name}"?`)) return;
    await dispatch(deleteAdminBrand(id));
    dispatch(addToast({ type: 'success', message: 'Brand deleted.' }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Manage Brands</h2>
          <p className="text-xs text-slate-500">
            Authorized partner brands and H-Tech Hardware Brands (e.g., NEED).
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-htech-blue text-white text-xs sm:text-sm font-bold shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold">
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {brands.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-mono text-xs text-slate-500">{b.order}</td>
                <td className="py-3 px-4 flex items-center gap-3">
                  {b.logo && (
                    <img
                      src={b.logo}
                      alt={b.name}
                      className="h-8 w-16 object-contain rounded bg-slate-900 p-1"
                    />
                  )}
                  <span className="font-bold text-slate-900">{b.name}</span>
                </td>
                <td className="py-3 px-4">
                  {b.isHardwareBrand ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">
                      H-Tech Hardware Brand
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                      Partner Brand
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingId ? 'Edit Brand' : 'Add Brand'}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Brand Name *
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
                    Order
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <ImageUploader
                label="Brand Logo"
                value={form.logo}
                onChange={({ url, publicId }) =>
                  setForm({ ...form, logo: url, logoPublicId: publicId })
                }
              />

              <label className="inline-flex items-center gap-2 font-bold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.isHardwareBrand}
                  onChange={(e) => setForm({ ...form, isHardwareBrand: e.target.checked })}
                  className="rounded"
                />
                <span>Show on Hardware Brands Page (e.g. NEED)</span>
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
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import ImageUploader from '../../components/admin/ImageUploader.jsx';
import {
  fetchAdminProducts,
  fetchCategories,
  fetchBrands,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from '../../features/catalogSlice.js';
import { addToast } from '../../features/uiSlice.js';

const emptyProduct = {
  name: '',
  brand: '',
  category: '',
  shortDescription: '',
  description: '',
  price: '',
  specsText: '',
  imageUrl: '',
  imagePublicId: '',
  warrantyNote: '1-year on-site hardware warranty',
  isFeatured: false,
  isActive: true,
  order: 1,
};

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const { adminProducts, categories, brands, loading } = useSelector((state) => state.catalog);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyProduct,
      brand: brands[0]?._id || '',
      category: categories[0]?._id || '',
    });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name || '',
      brand: p.brand?._id || p.brand || '',
      category: p.category?._id || p.category || '',
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      price: p.price ?? '',
      specsText: (p.specs || []).join('\n'),
      imageUrl: p.images?.[0]?.url || '',
      imagePublicId: p.images?.[0]?.publicId || '',
      warrantyNote: p.warrantyNote || '',
      isFeatured: Boolean(p.isFeatured),
      isActive: p.isActive !== false,
      order: p.order ?? 1,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      shortDescription: form.shortDescription,
      description: form.description,
      price: Number(form.price),
      specs: form.specsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      images: form.imageUrl
        ? [{ url: form.imageUrl, publicId: form.imagePublicId || '' }]
        : [],
      warrantyNote: form.warrantyNote,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      order: Number(form.order) || 0,
    };

    const res = editingId
      ? await dispatch(updateAdminProduct({ id: editingId, payload }))
      : await dispatch(createAdminProduct(payload));

    if (!res.error) {
      dispatch(
        addToast({
          type: 'success',
          message: editingId ? 'Product updated!' : 'Product created!',
        })
      );
      setModalOpen(false);
    } else {
      dispatch(addToast({ type: 'error', message: res.payload || 'Error saving product' }));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;
    const res = await dispatch(deleteAdminProduct(id));
    if (!res.error) {
      dispatch(addToast({ type: 'success', message: 'Product deleted.' }));
    }
  };

  const filtered = adminProducts.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Manage Products</h2>
          <p className="text-xs text-slate-500">
            Add or edit products and their public prices in Indian rupees.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-htech-blue hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or brand..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">{p.order}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]?.url && (
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            className="w-12 h-10 object-contain rounded-lg bg-slate-900 p-1 shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          {p.isFeatured && (
                            <span className="text-[10px] font-bold text-htech-blue uppercase">
                              ★ Featured on Home
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {p.brand?.name || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{p.category?.name || '—'}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {Number.isFinite(p.price) ? `₹${p.price.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          p.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-htech-blue"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p._id, p.name)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600"
                        title="Delete"
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. HP Laptop 250R G10"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Public Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 45999"
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
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Brand *
                  </label>
                  <select
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Specifications (One per line)
                </label>
                <textarea
                  rows={4}
                  value={form.specsText}
                  onChange={(e) => setForm({ ...form, specsText: e.target.value })}
                  placeholder={'Core 5 / Core i5 14th Gen\n8GB RAM\n512GB NVMe SSD'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Warranty Note
                </label>
                <input
                  type="text"
                  value={form.warrantyNote}
                  onChange={(e) => setForm({ ...form, warrantyNote: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <ImageUploader
                label="Product Flyer / Image"
                value={form.imageUrl}
                onChange={({ url, publicId }) =>
                  setForm({ ...form, imageUrl: url, imagePublicId: publicId })
                }
              />

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="rounded"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="inline-flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span>Visible in Public Catalog</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-htech-navy text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

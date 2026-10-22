import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImageThunk } from '../../features/contentSlice.js';
import { addToast } from '../../features/uiSlice.js';

export default function ImageUploader({
  label = 'Upload Image',
  value = '', // URL string
  onChange, // ({ url, publicId }) => void
  folder = 'htech_wholesale',
}) {
  const dispatch = useDispatch();
  const uploading = useSelector((state) => state.content.uploading);
  const fileRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await dispatch(uploadImageThunk({ file, folder }));
    if (!res.error && res.payload?.url) {
      onChange({ url: res.payload.url, publicId: res.payload.publicId || '' });
      dispatch(addToast({ type: 'success', message: 'Image uploaded successfully!' }));
    } else {
      dispatch(
        addToast({ type: 'error', message: res.payload || 'Failed to upload image (Max 5MB)' })
      );
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
        {label}
      </label>

      <div className="flex flex-wrap items-center gap-4">
        {value ? (
          <div className="relative h-24 w-32 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 p-1">
            <img
              src={value}
              alt="Preview"
              onError={(e) => {
                e.currentTarget.src = '/brand/logo-fallback.svg';
              }}
              className="w-full h-full object-contain rounded-xl"
            />
            <button
              type="button"
              onClick={() => onChange({ url: '', publicId: '' })}
              className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : null}

        <div className="flex-1 min-w-[200px] space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-htech-blue" />
            ) : (
              <Upload className="w-4 h-4 text-htech-blue" />
            )}
            <span>{uploading ? 'Uploading...' : 'Choose Image File (JPG/PNG/WEBP)'}</span>
          </button>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange({ url: e.target.value, publicId: '' })}
            placeholder="Or paste image URL / data URI..."
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
          />
        </div>
      </div>
    </div>
  );
}

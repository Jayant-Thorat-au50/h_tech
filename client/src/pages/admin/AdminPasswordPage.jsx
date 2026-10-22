import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { KeyRound } from 'lucide-react';
import { updateAdminPassword } from '../../features/authSlice.js';
import { addToast } from '../../features/uiSlice.js';

export default function AdminPasswordPage() {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      dispatch(addToast({ type: 'error', message: 'New passwords do not match.' }));
      return;
    }
    setSaving(true);
    const res = await dispatch(updateAdminPassword({ currentPassword, newPassword }));
    setSaving(false);

    if (!res.error) {
      dispatch(addToast({ type: 'success', message: 'Admin password updated successfully!' }));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      dispatch(addToast({ type: 'error', message: res.payload || 'Password update failed' }));
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Change Admin Password
        </h2>
        <p className="text-xs text-slate-500">
          Update the login password for your H-Tech Admin Console account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 text-xs sm:text-sm"
      >
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
            Current Password *
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
            New Password (min 6 characters) *
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
            Confirm New Password *
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-htech-navy hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow transition"
        >
          <KeyRound className="w-4 h-4" />
          <span>{saving ? 'Updating...' : 'Update Password'}</span>
        </button>
      </form>
    </div>
  );
}

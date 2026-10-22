import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { removeToast } from '../../features/uiSlice.js';

export default function ToastContainer() {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.ui.toasts);

  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      dispatch(removeToast(latest.id));
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-50 flex flex-col gap-2.5 w-[92vw] max-w-sm pointer-events-none"
    >
      {toasts.map((t) => {
        const isError = t.type === 'error';
        const isInfo = t.type === 'info';
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-glass-lg border backdrop-blur-xl transition-all ${
              isError
                ? 'bg-rose-950/95 border-rose-500/40 text-white'
                : isInfo
                ? 'bg-slate-900/95 border-slate-700 text-white'
                : 'bg-emerald-950/95 border-emerald-500/40 text-white'
            }`}
          >
            {isError ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : isInfo ? (
              <Info className="w-5 h-5 text-sky-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button
              type="button"
              onClick={() => dispatch(removeToast(t.id))}
              className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

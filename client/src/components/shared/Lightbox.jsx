import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { closeLightbox, nextLightboxImage, prevLightboxImage } from '../../features/uiSlice.js';

export default function Lightbox() {
  const dispatch = useDispatch();
  const { isOpen, images, currentIndex } = useSelector((state) => state.ui.lightbox);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') dispatch(closeLightbox());
      if (e.key === 'ArrowRight') dispatch(nextLightboxImage());
      if (e.key === 'ArrowLeft') dispatch(prevLightboxImage());
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, dispatch]);

  if (!isOpen || !images || images.length === 0) return null;

  const current = images[currentIndex] || images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 sm:p-8"
      onClick={() => dispatch(closeLightbox())}
    >
      <button
        type="button"
        aria-label="Close lightbox"
        onClick={() => dispatch(closeLightbox())}
        className="absolute top-5 right-5 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(prevLightboxImage());
            }}
            className="absolute left-4 sm:left-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(nextLightboxImage());
            }}
            className="absolute right-4 sm:right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div
        className="max-w-5xl w-full flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-3xl bg-slate-900/60 border border-white/10 p-2">
          <img
            src={current.url || current.image}
            alt={current.caption || 'Gallery preview'}
            onError={(e) => {
              e.currentTarget.src = '/brand/logo-fallback.svg';
            }}
            className="max-h-[72vh] w-auto object-contain rounded-2xl"
          />
        </div>
        {current.caption && (
          <div className="text-center max-w-2xl px-4">
            <p className="text-white font-medium text-base sm:text-lg">{current.caption}</p>
            <p className="text-slate-400 text-xs mt-1">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

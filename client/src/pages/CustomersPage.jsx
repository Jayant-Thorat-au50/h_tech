import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Maximize2 } from 'lucide-react';
import SEO from '../components/shared/SEO.jsx';
import { fetchCustomers } from '../features/contentSlice.js';
import { openLightbox } from '../features/uiSlice.js';
import { optimizeImageUrl } from '../utils/cloudinaryUrl.js';

export default function CustomersPage() {
  const dispatch = useDispatch();
  const { customerPhotos } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleOpenLightbox = (index) => {
    dispatch(
      openLightbox({
        images: customerPhotos.map((p) => ({
          url: p.image,
          caption: p.caption,
        })),
        index,
      })
    );
  };

  return (
    <>
      <SEO
        title="Our Happy Customers — Photo Gallery"
        description="See bulk deliveries, computer lab installations, and our regional IT dealer network across Karad, Satara, Sangli, and Maharashtra."
        path="/customers"
      />

      <section className="bg-white border-b border-black/[0.06] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-htech-pink border border-rose-200 text-xs font-bold uppercase tracking-widest mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Partner & Institutional Gallery</span>
          </span>
          <h1 className="heading-section text-[#1D1D1F] mb-3">Our Happy Customers</h1>
          <p className="text-base sm:text-lg text-[#86868B] max-w-2xl">
            Every delivery represents a long-term partnership built on authentic hardware,
            transparent wholesale pricing, and reliable warranty support.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {customerPhotos.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <Users className="w-10 h-10 text-htech-pink mx-auto mb-3" />
            <h2 className="text-lg font-extrabold text-slate-900 mb-1">
              Customer gallery is being updated
            </h2>
            <p className="text-sm text-slate-600">
              New partner delivery photos from Karad Head Office will appear here shortly.
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {customerPhotos.map((photo, index) => (
              <div
                key={photo._id || index}
                className="break-inside-avoid group apple-bento-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => handleOpenLightbox(index)}
                  className="w-full text-left focus:outline-none"
                >
                  <div className="relative overflow-hidden bg-white">
                    <img
                      src={optimizeImageUrl(photo.image, 800)}
                      alt={photo.caption}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/brand/logo-fallback.svg';
                      }}
                      className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 text-[#1D1D1F] shadow-sm opacity-0 group-hover:opacity-100 transition">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <p className="text-sm font-bold text-[#1D1D1F] leading-snug">
                      {photo.caption}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

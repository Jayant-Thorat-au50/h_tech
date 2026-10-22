import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import SEO from '../components/shared/SEO.jsx';
import { fetchProductBySlug, clearCurrentProduct } from '../features/catalogSlice.js';
import { buildProductWhatsAppUrl } from '../utils/whatsapp.js';
import { optimizeImageUrl } from '../utils/cloudinaryUrl.js';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, detailLoading, error } = useSelector((state) => state.catalog);
  const settings = useSelector((state) => state.content.settings);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const whatsappNumber = settings?.whatsappNumber || '919372049568';
  const mobileNumber = settings?.primaryMobile || '+919371249568';

  useEffect(() => {
    setActiveImageIdx(0);
    dispatch(fetchProductBySlug(slug));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [slug, dispatch]);

  if (detailLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
          <div className="lg:col-span-6 h-96 rounded-3xl bg-slate-200" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-6 w-1/3 bg-slate-200 rounded" />
            <div className="h-10 w-3/4 bg-slate-200 rounded" />
            <div className="h-24 w-full bg-slate-200 rounded" />
            <div className="h-40 w-full bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Product Not Found</h1>
        <p className="text-sm text-slate-600 mb-6">
          This model may have been updated or moved in our wholesale catalog.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-htech-navy text-white text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalog</span>
        </Link>
      </div>
    );
  }

  const images =
    currentProduct.images && currentProduct.images.length > 0
      ? currentProduct.images
      : [{ url: '/brand/logo-fallback.svg' }];
  const mainImage = optimizeImageUrl(images[activeImageIdx]?.url || images[0]?.url, 900);
  const whatsappHref = buildProductWhatsAppUrl(currentProduct.name, whatsappNumber);

  return (
    <>
      <SEO
        title={`${currentProduct.name} — ${currentProduct.brand?.name || 'Wholesale'}`}
        description={currentProduct.shortDescription}
        path={`/products/${currentProduct.slug}`}
      />

      <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-htech-blue mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to H-Tech Product Catalog</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Product Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl bg-white border border-black/[0.08] shadow-apple-card p-6 h-[360px] sm:h-[440px] flex items-center justify-center overflow-hidden">
              <img
                src={mainImage}
                alt={currentProduct.name}
                onError={(e) => {
                  e.currentTarget.src = '/brand/logo-fallback.svg';
                }}
                className="max-h-full w-auto object-contain rounded-xl"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-20 w-24 rounded-2xl bg-white p-2 border-2 transition shrink-0 ${
                      idx === activeImageIdx ? 'border-htech-blue' : 'border-black/[0.08] opacity-70'
                    }`}
                  >
                    <img
                      src={optimizeImageUrl(img.url, 200)}
                      alt={`${currentProduct.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Specs & Wholesale Enquiry Box */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-blue-50 text-htech-blue text-xs font-extrabold uppercase tracking-wider">
                {currentProduct.brand?.name || 'Authorized Brand'}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-white border border-black/[0.08] text-slate-700 text-xs font-bold">
                {currentProduct.category?.name || 'Hardware'}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                Enquire for dealer pricing
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight">
              {currentProduct.name}
            </h1>

            {Number.isFinite(currentProduct.price) && (
              <p className="text-2xl font-bold text-[#57534E]">
                ₹{currentProduct.price.toLocaleString('en-IN')}
              </p>
            )}

            <p className="text-sm sm:text-base text-[#86868B] leading-relaxed">
              {currentProduct.description || currentProduct.shortDescription}
            </p>

            {/* Technical Specifications Table */}
            <div className="rounded-3xl bg-white border border-black/[0.08] shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-white border-b border-black/[0.06] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-htech-blue" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#1D1D1F]">
                  Key Hardware Specifications
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {(currentProduct.specs || []).map((spec, idx) => (
                  <div key={idx} className="px-6 py-3.5 flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-htech-green shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warranty Note */}
            <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200 p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-htech-green shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                  Official Hardware Warranty
                </div>
                <p className="text-xs sm:text-sm text-emerald-800 font-medium mt-0.5">
                  {currentProduct.warrantyNote || '1-year on-site hardware warranty'}
                </p>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-htech-green hover:bg-emerald-600 text-white font-bold text-sm shadow-lg transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enquire on WhatsApp</span>
              </a>

              <a
                href={`tel:${mobileNumber}`}
                className="inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-htech-navy hover:bg-slate-800 text-white font-bold text-sm shadow-lg transition"
              >
                <Phone className="w-5 h-5" />
                <span>Call Wholesale Desk</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

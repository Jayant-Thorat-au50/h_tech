import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, Calendar, Sparkles } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/whatsapp.js';
import { optimizeImageUrl } from '../../utils/cloudinaryUrl.js';

export default function OffersCarousel({
  offers = [],
  whatsappNumber = '919372049568',
  variant = 'default',
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const isHero = variant === 'hero';

  const count = offers.length;

  const nextSlide = useCallback(() => {
    if (count <= 1) return;
    setCurrent((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    if (count <= 1) return;
    setCurrent((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setInterval(nextSlide, 5500);
    return () => clearInterval(timer);
  }, [paused, count, nextSlide]);

  if (!offers || count === 0) {
    return null;
  }

  const activeOffer = offers[current] || offers[0];
  const validUntil = activeOffer.endDate
    ? new Date(activeOffer.endDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Limited Period';

  const whatsappHref = buildWhatsAppUrl(
    `Hello H-Tech Computer Wholesale (Karad), I am interested in the offer: *${activeOffer.title}* (${activeOffer.discountText}).`,
    whatsappNumber
  );

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 45) prevSlide();
    else if (deltaX < -45) nextSlide();
    touchStartX.current = null;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Special Wholesale Offers"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={
        isHero
          ? 'mx-auto mt-8 w-full max-w-2xl text-left focus:outline-none'
          : 'py-10 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto focus:outline-none bg-white'
      }
    >
      <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 ${isHero ? 'mb-3' : 'gap-4 mb-6'}`}>
        <div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium mb-1.5 ${isHero ? 'text-amber-200' : 'text-htech-orange'}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHero ? 'Featured Wholesale Offer' : 'Active Wholesale Schemes'}</span>
          </span>
          <h2 className={`heading-section ${isHero ? 'text-lg text-white sm:text-xl' : 'text-[#1D1D1F]'}`}>
            {isHero ? 'Current Offer' : 'Special Offers & Spotlight Promos'}
          </h2>
        </div>
        <Link
          to="/offers"
          className={`text-xs sm:text-sm font-medium hover:underline transition ${isHero ? 'text-amber-200' : 'text-[#8B6F54]'}`}
        >
          View all active offers →
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={
          isHero
            ? 'relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] p-4 shadow-[0_12px_36px_rgba(0,0,0,0.2)] backdrop-blur-md sm:p-5'
            : 'relative overflow-hidden apple-bento-card p-6 sm:p-8 lg:p-10'
        }
      >
        <div className={`grid grid-cols-1 gap-4 items-center ${isHero ? 'sm:grid-cols-12' : 'lg:grid-cols-12 gap-6'}`}>
          {/* Left Content */}
          <div className={`${isHero ? 'sm:col-span-7 space-y-3' : 'lg:col-span-7 space-y-4'}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full border text-xs font-medium ${isHero ? 'bg-amber-200/10 border-amber-200/30 text-amber-100' : 'bg-amber-50 border-amber-200 text-htech-orange'}`}>
                {activeOffer.badge || 'Special Offer'}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs ${isHero ? 'bg-white/10 border-white/15 text-white/75' : 'bg-white border-black/[0.08] text-[#86868B]'}`}>
                <Calendar className={`w-3.5 h-3.5 ${isHero ? 'text-sky-200' : 'text-[#5B9DBB]'}`} />
                <span>Valid till {validUntil}</span>
              </span>
            </div>

            <h3 className={`font-semibold tracking-tight leading-snug ${isHero ? 'text-base text-white sm:text-lg' : 'text-xl sm:text-2xl text-[#1D1D1F]'}`}>
              {activeOffer.title}
            </h3>

            <div className={`inline-block px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold ${isHero ? 'bg-emerald-300/10 border-emerald-200/25 text-emerald-100' : 'bg-emerald-50 border-emerald-200 text-htech-green'}`}>
              {activeOffer.discountText}
            </div>

            <p className={`text-xs leading-relaxed max-w-2xl ${isHero ? 'text-white/75' : 'sm:text-sm text-[#86868B]'}`}>
              {activeOffer.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-htech-green hover:bg-emerald-600 text-white font-medium text-xs sm:text-sm shadow-sm transition ${isHero ? 'px-4 py-2' : ''}`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{activeOffer.ctaLabel || 'Enquire on WhatsApp'}</span>
              </a>
              <Link
                to="/offers"
                className={`text-xs sm:text-sm ${isHero ? 'rounded-full border border-white/20 px-4 py-2 text-white/90 transition hover:bg-white/10' : 'apple-pill-outline'}`}
              >
                All Schemes
              </Link>
            </div>
          </div>

          {/* Right Promo Artwork */}
          <div className={`${isHero ? 'sm:col-span-5' : 'lg:col-span-5'}`}>
            {activeOffer.image && (
              <div className={`rounded-2xl overflow-hidden border p-2 ${isHero ? 'bg-white/95 border-white/20' : 'bg-white border-black/[0.08]'}`}>
                <img
                  src={optimizeImageUrl(activeOffer.image, 800)}
                  alt={activeOffer.title}
                  onError={(e) => {
                    e.currentTarget.src = '/brand/logo-fallback.svg';
                  }}
                  className={`w-full object-contain rounded-xl ${isHero ? 'h-28 sm:h-36' : 'h-48 sm:h-56'}`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls & Progress Dots */}
        {count > 1 && (
          <div className={`flex items-center justify-between gap-4 ${isHero ? 'mt-4 pt-3 border-t border-white/15' : 'mt-6 pt-5 border-t border-black/[0.06]'}`}>
            <div className="flex items-center gap-2" role="tablist" aria-label="Offer slides">
              {offers.map((offer, idx) => (
                <button
                  key={offer._id || idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === current}
                  aria-label={`Slide ${idx + 1}: ${offer.title}`}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === current
                      ? `w-7 ${isHero ? 'bg-white' : 'bg-[#1D1D1F]'}`
                      : `w-2 ${isHero ? 'bg-white/35 hover:bg-white/60' : 'bg-black/20 hover:bg-black/40'}`
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous offer slide"
                onClick={prevSlide}
                className={`p-2 rounded-full transition ${isHero ? 'bg-white/10 hover:bg-white/20 border border-white/15 text-white' : 'bg-white hover:bg-slate-50 border border-black/[0.1] text-[#1D1D1F]'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next offer slide"
                onClick={nextSlide}
                className={`p-2 rounded-full transition ${isHero ? 'bg-white/10 hover:bg-white/20 border border-white/15 text-white' : 'bg-white hover:bg-slate-50 border border-black/[0.1] text-[#1D1D1F]'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}

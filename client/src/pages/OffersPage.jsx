import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sparkles, Calendar, MessageCircle, Tag } from 'lucide-react';
import SEO from '../components/shared/SEO.jsx';
import { fetchOffers } from '../features/contentSlice.js';
import { buildWhatsAppUrl } from '../utils/whatsapp.js';
import { optimizeImageUrl } from '../utils/cloudinaryUrl.js';

const TABS = [
  { id: 'all', label: 'All Active Offers' },
  { id: 'best-deal', label: 'Best Deals' },
  { id: 'new-launch', label: 'New Launches' },
  { id: 'seasonal', label: 'Seasonal Offers' },
];

export default function OffersPage() {
  const dispatch = useDispatch();
  const { offers, settings } = useSelector((state) => state.content);
  const [activeTab, setActiveTab] = useState('all');

  const whatsappNumber = settings?.whatsappNumber || '919372049568';

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  const filteredOffers =
    activeTab === 'all' ? offers : offers.filter((o) => o.type === activeTab);

  return (
    <>
      <SEO
        title="Special Offers — Best Deals, New Launches & Seasonal Schemes"
        description="Explore active wholesale hardware schemes, HP & Dell bulk deals, NEED accessories combos, and Solar & Street-Light promotions at H-Tech Karad."
        path="/offers"
      />

      <section className="bg-white border-b border-black/[0.06] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-htech-orange border border-amber-200 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Best Deals | New Launches | Seasonal Offers</span>
          </span>
          <h1 className="heading-section text-[#1D1D1F] mb-3">Special Wholesale Offers</h1>
          <p className="text-base sm:text-lg text-[#86868B] max-w-2xl">
            Live promotional slabs, new hardware launches, and seasonal dealer schemes from H-Tech
            Computer Wholesale, Karad.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-8" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-htech-orange text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {filteredOffers.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <Tag className="w-10 h-10 text-htech-orange mx-auto mb-3" />
            <h2 className="text-lg font-extrabold text-slate-900 mb-1">
              No active schemes in this category right now
            </h2>
            <p className="text-sm text-slate-600 mb-5">
              Switch tabs or message our wholesale desk on WhatsApp for today's spot lot pricing.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold"
            >
              Show All Active Offers
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredOffers.map((offer) => {
              const validUntil = offer.endDate
                ? new Date(offer.endDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Limited Time';
              const waHref = buildWhatsAppUrl(
                `Hello H-Tech Computer Wholesale (Karad), I want to claim the offer: *${offer.title}* (${offer.discountText}).`,
                whatsappNumber
              );

              return (
                <article
                  key={offer._id}
                  className="apple-bento-card p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold uppercase tracking-wider text-htech-orange">
                        {offer.badge || 'Special Offer'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/[0.08] text-xs text-[#86868B]">
                        <Calendar className="w-3.5 h-3.5 text-htech-blue" />
                        <span>Valid till {validUntil}</span>
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1D1D1F]">
                      {offer.title}
                    </h2>

                    <div className="inline-block px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm sm:text-base font-bold text-htech-green">
                      {offer.discountText}
                    </div>

                    <p className="text-sm sm:text-base text-[#86868B] leading-relaxed">
                      {offer.description}
                    </p>

                    <div className="pt-2">
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-htech-green hover:bg-emerald-600 text-white font-bold text-sm shadow-sm transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{offer.ctaLabel || 'Claim Offer on WhatsApp'}</span>
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    {offer.image && (
                      <div className="rounded-2xl overflow-hidden bg-white border border-black/[0.08] p-2">
                        <img
                          src={optimizeImageUrl(offer.image, 800)}
                          alt={offer.title}
                          onError={(e) => {
                            e.currentTarget.src = '/brand/logo-fallback.svg';
                          }}
                          className="w-full h-56 object-contain rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

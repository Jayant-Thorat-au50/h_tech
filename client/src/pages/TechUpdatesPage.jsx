import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Radio,
  Newspaper,
  PackagePlus,
  Link2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import SEO from '../components/shared/SEO.jsx';
import { fetchTechUpdates, fetchSettings } from '../features/contentSlice.js';

export default function TechUpdatesPage() {
  const dispatch = useDispatch();
  const { techUpdates, settings } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchTechUpdates());
    dispatch(fetchSettings());
  }, [dispatch]);

  const channelUrl =
    settings?.whatsappChannelUrl || 'https://whatsapp.com/channel/0029VaHtechWholesaleKarad';
  const channelTitle =
    settings?.whatsappChannelTitle ||
    'Laptop, Desktop Computer, Digital Gadgets, Mobiles Wholesale';

  const newsItems = techUpdates.filter((u) => u.type === 'news');
  const productUpdates = techUpdates.filter((u) => u.type === 'product-update');
  const usefulLinks = techUpdates.filter((u) => u.type === 'useful-link');

  return (
    <>
      <SEO
        title="Latest Tech Updates — WhatsApp Channel, Tech News & Useful Links"
        description="Stay updated with H-Tech Computer Wholesale Karad: Official WhatsApp Channel, Tech News, Product Updates, and Useful Warranty Links."
        path="/tech-updates"
      />

      <section className="bg-white border-b border-black/[0.06] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-htech-purple mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to H-Tech Home</span>
          </Link>

          <div className="block">
            <span className="inline-block px-3.5 py-1 rounded-full bg-purple-50 text-htech-purple border border-purple-200 text-xs font-bold uppercase tracking-widest mb-3">
              Live Broadcast & Resources
            </span>
            <h1 className="heading-section text-[#1D1D1F] mb-3">Latest Tech Updates</h1>
            <p className="text-base sm:text-lg text-[#86868B] max-w-2xl">
              Follow our official wholesale WhatsApp broadcast channel, industry hardware news,
              fresh stock arrivals, and manufacturer warranty portals.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Cards Layout matching Image 4 */}
      <section className="bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: WhatsApp Channel */}
          <div className="apple-bento-card p-7 sm:p-9 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-htech-green">
                  <Radio className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-htech-green text-xs font-bold uppercase tracking-wider">
                  Card 01 • Live Channel
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F]">
                WhatsApp Channel
              </h2>
              <p className="text-base sm:text-lg font-bold text-htech-green">{channelTitle}</p>
              <p className="text-sm text-[#86868B] leading-relaxed">
                Get instant notifications on new laptop lots, carton slab deals, price-drop alerts,
                and festive dealer schemes directly on your phone.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-black/[0.06]">
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-htech-green hover:bg-emerald-600 text-white font-extrabold text-sm shadow-sm transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Join Official WhatsApp Channel</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 2: Tech News */}
          <div className="apple-bento-card p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-htech-blue border border-blue-200">
                  <Newspaper className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                  Card 02 • Industry Feed
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#1D1D1F] mb-4">Tech News</h2>

              {newsItems.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  No tech news articles posted yet. Check back soon!
                </div>
              ) : (
                <div className="space-y-3.5">
                  {newsItems.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5 overflow-hidden"
                    >
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>
                      {item.url && (
                        <a
                          href={item.url}
                          target={item.url.startsWith('http') ? '_blank' : undefined}
                          rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-htech-blue hover:underline break-all max-w-full"
                        >
                          <span className="truncate max-w-[260px] sm:max-w-[380px]">
                            {item.url}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Product Updates */}
          <div className="apple-bento-card p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-purple-50 text-htech-purple border border-purple-200">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                  Card 03 • Stock Arrivals
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#1D1D1F] mb-4">Product Updates</h2>

              {productUpdates.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  No recent product updates available right now.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {productUpdates.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5 overflow-hidden"
                    >
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>
                      {item.url && (
                        <Link
                          to={item.url.startsWith('/') ? item.url : '/products'}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-htech-purple hover:underline break-all max-w-full"
                        >
                          <span>View Product in Catalog →</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Useful Links (Safe URL wrapping/truncation so long URLs never overflow) */}
          <div className="apple-bento-card p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-amber-50 text-htech-orange border border-amber-200">
                  <Link2 className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                  Card 04 • Dealer Portals
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#1D1D1F] mb-4">Useful Links</h2>

              {usefulLinks.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  No useful links listed yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {usefulLinks.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 overflow-hidden"
                    >
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-htech-blue hover:underline max-w-full overflow-hidden"
                          title={item.url}
                        >
                          <span className="truncate block max-w-full">{item.url}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to H-Tech Home</span>
          </Link>
        </div>
      </section>
    </>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Cpu,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  Trash2,
} from 'lucide-react';
import SEO from '../components/shared/SEO.jsx';
import { apiClient, extractErrorMessage } from '../utils/apiClient.js';
import { buildWhatsAppUrl } from '../utils/whatsapp.js';
import { optimizeImageUrl } from '../utils/cloudinaryUrl.js';
import { useSelector } from 'react-redux';

const PAGE_SIZE = 100;

const formatPrice = (price) =>
  `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function BuildPcPage() {
  const prefersReducedMotion = useReducedMotion();
  const whatsappNumber = useSelector(
    (state) => state.content.settings?.whatsappNumber || '919372049568'
  );
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;
    setLoading(true);
    setError('');

    apiClient
      .get('/products', { params: { page, limit: PAGE_SIZE, sort: 'order' } })
      .then(({ data }) => {
        if (!isCurrentRequest) return;
        setProducts(Array.isArray(data.products) ? data.products : []);
        setTotalPages(Math.max(1, Number(data.totalPages) || 1));
      })
      .catch((requestError) => {
        if (isCurrentRequest) {
          setError(extractErrorMessage(requestError, 'Products could not be loaded. Please try again.'));
        }
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [page]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      [
        product.name,
        product.brand?.name,
        product.category?.name,
        product.shortDescription,
        ...(product.specs || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [products, search]);

  const selectedProducts = Object.values(selected);
  const subtotal = selectedProducts.reduce(
    (sum, item) => sum + (Number.isFinite(item.product.price) ? item.product.price * item.quantity : 0),
    0
  );
  const unpricedCount = selectedProducts.filter(
    ({ product }) => !Number.isFinite(product.price)
  ).length;

  const changeQuantity = (key, amount) => {
    setSelected((current) => {
      const item = current[key];
      if (!item) return current;
      const quantity = item.quantity + amount;
      if (quantity < 1) return current;
      return { ...current, [key]: { ...item, quantity } };
    });
  };

  const addProduct = (product) => {
    const key = product._id || product.slug;
    setSelected((current) => ({
      ...current,
      [key]: current[key]
        ? { ...current[key], quantity: current[key].quantity + 1 }
        : { product, quantity: 1 },
    }));
  };

  const quoteMessage = [
    'Hello H-Tech, please share a quote for this custom PC build:',
    ...selectedProducts.map(({ product, quantity }) => {
      const linePrice = Number.isFinite(product.price)
        ? ` — ${quantity} × ${formatPrice(product.price)}`
        : ` — ${quantity} × price on request`;
      return `• ${product.name}${linePrice}`;
    }),
    `Listed-price subtotal: ${formatPrice(subtotal)}`,
    'Please confirm availability and final dealer pricing.',
  ].join('\n');

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111F] text-white">
      <SEO
        title="Build a Custom PC"
        description="Choose products for your custom PC build and review listed-price totals before requesting a quote from H-Tech."
        path="/build-pc"
      />

      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0B1B2E] px-4 py-9 sm:px-6 sm:py-14">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_20%,rgba(14,165,233,0.22),transparent_42%),radial-gradient(ellipse_at_15%_100%,rgba(37,99,235,0.18),transparent_38%)]" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-36 -z-10 h-[26rem] w-[26rem] rounded-full border border-sky-300/10"
          animate={prefersReducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-8 rounded-full border border-dashed border-sky-300/10" />
          <div className="absolute left-8 top-16 h-2 w-2 rounded-full bg-sky-300/70 shadow-[0_0_22px_rgba(125,211,252,0.9)]" />
        </motion.div>
        <motion.div
          className="relative mx-auto flex max-w-[1200px] flex-col justify-between gap-8 lg:flex-row lg:items-end"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="max-w-2xl">
            <Link
              to="/"
              className="mb-7 inline-flex items-center gap-2 text-xs font-medium text-slate-300 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to H-Tech
            </Link>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              <Sparkles className="h-4 w-4" />
              Custom PC Builder
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Build your next
              <span className="block bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                great setup.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Find the right components, shape your build, and request a tailored quote from our team.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur lg:self-auto">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
              <Cpu className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold text-white">Your build, your way</p>
              <p className="mt-0.5 text-[11px] text-slate-400">Components & pricing in one place</p>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 lg:py-10">
        <section aria-labelledby="builder-products-title" className="order-2 lg:order-1">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="builder-products-title" className="text-base font-semibold text-white">
                Available products
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Showing page {page} of {totalPages}
              </p>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search this page"
                aria-label="Search products on this page"
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/10"
              />
            </label>
          </div>

          {error && (
            <div role="alert" className="rounded-2xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-200">
              {error}
            </div>
          )}
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-slate-300">
              Loading products…
            </div>
          ) : !error && filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-slate-300">
              No products match that search.
            </div>
          ) : !error ? (
            <motion.div
              className="space-y-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: prefersReducedMotion ? 0 : 0.055 },
                },
              }}
            >
              {filteredProducts.map((product) => {
                const key = product._id || product.slug;
                const quantity = selected[key]?.quantity || 0;
                const imageUrl = optimizeImageUrl(product.images?.[0]?.url, 320);
                return (
                  <motion.article
                    key={key}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    className="group flex flex-col gap-4 rounded-2xl border border-white/[0.09] bg-[#0D1B2B] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-colors hover:border-sky-300/25 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-br from-[#242424] to-[#171717] p-2 sm:h-28 sm:w-28">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.src = '/brand/logo-fallback.svg';
                          }}
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                          {product.brand?.name || 'H-Tech'}
                          {product.category?.name ? ` · ${product.category.name}` : ''}
                        </p>
                        <h3 className="mt-1 text-sm font-semibold text-white">{product.name}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                          {product.shortDescription || 'Product details available on request.'}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {Number.isFinite(product.price)
                            ? formatPrice(product.price)
                            : 'Price on request'}
                        </p>
                      </div>
                    </div>
                    {quantity ? (
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          aria-label={`Decrease ${product.name} quantity`}
                          onClick={() => changeQuantity(key, -1)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-200 transition hover:border-sky-300/30 hover:bg-sky-300/10"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-white">{quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${product.name} quantity`}
                          onClick={() => changeQuantity(key, 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-200 transition hover:border-sky-300/30 hover:bg-sky-300/10"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addProduct(product)}
                        className="inline-flex items-center justify-center gap-1.5 self-end rounded-full bg-sky-400 px-4 py-2 text-xs font-semibold text-[#06111F] transition hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 sm:self-center"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </button>
                    )}
                  </motion.article>
                );
              })}
            </motion.div>
          ) : null}

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-slate-400">
                Page {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>

        <aside className="sticky top-16 z-20 order-1 max-h-[40vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0D1B2B] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)] lg:order-2 lg:top-24 lg:max-h-none lg:overflow-visible lg:self-start">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400/10">
              <ShoppingCart className="h-4 w-4 text-sky-300" />
            </span>
            <h2 className="text-sm font-semibold text-white">Your build</h2>
            <span className="ml-auto rounded-full border border-sky-300/15 bg-sky-300/10 px-2.5 py-1 text-[10px] font-semibold text-sky-200">
              {selectedProducts.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>

          <AnimatePresence mode="wait">
            {selectedProducts.length === 0 ? (
              <motion.p
                key="empty-build"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="py-8 text-center text-xs leading-5 text-slate-400"
              >
                Add products to see your build and price details.
              </motion.p>
            ) : (
              <motion.ul
                key="selected-build"
                className="mt-4 divide-y divide-white/[0.08]"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
              {selectedProducts.map(({ product, quantity }) => {
                const key = product._id || product.slug;
                return (
                  <motion.li
                    key={key}
                    layout
                    initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    className="flex items-start gap-3 py-3"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-medium text-white">{product.name}</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {quantity} × {Number.isFinite(product.price) ? formatPrice(product.price) : 'Price on request'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="whitespace-nowrap text-xs font-semibold text-white">
                        {Number.isFinite(product.price)
                          ? formatPrice(product.price * quantity)
                          : 'On request'}
                      </p>
                      <button
                        type="button"
                        aria-label={`Remove ${product.name}`}
                        onClick={() =>
                          setSelected((current) => {
                            const next = { ...current };
                            delete next[key];
                            return next;
                          })
                        }
                        className="mt-1 text-slate-500 transition hover:text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.li>
                );
              })}
              </motion.ul>
            )}
          </AnimatePresence>

          <div className="mt-2 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-300">Listed-price subtotal</span>
              <strong className="text-lg text-white">{formatPrice(subtotal)}</strong>
            </div>
            {unpricedCount > 0 && (
              <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                {unpricedCount} selected {unpricedCount === 1 ? 'item has' : 'items have'} no listed
                price and will need a quote.
              </p>
            )}
            <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
              Listed prices are indicative. Availability, taxes, and final dealer pricing are
              confirmed by H-Tech.
            </p>
            <a
              href={selectedProducts.length ? buildWhatsAppUrl(quoteMessage, whatsappNumber) : undefined}
              target={selectedProducts.length ? '_blank' : undefined}
              rel={selectedProducts.length ? 'noopener noreferrer' : undefined}
              aria-disabled={!selectedProducts.length}
              onClick={(event) => {
                if (!selectedProducts.length) event.preventDefault();
              }}
              className={`mt-4 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-xs font-semibold transition ${
                selectedProducts.length
                  ? 'bg-emerald-400 text-[#052018] shadow-[0_8px_24px_rgba(52,211,153,0.18)] hover:bg-emerald-300'
                  : 'pointer-events-none bg-white/[0.08] text-slate-500'
              }`}
            >
              Request quote on WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

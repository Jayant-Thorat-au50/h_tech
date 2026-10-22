import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  RotateCcw,
  PackageSearch,
} from 'lucide-react';
import SEO from '../components/shared/SEO.jsx';
import CustomSelect from '../components/shared/CustomSelect.jsx';
import ProductCard from '../components/products/ProductCard.jsx';
import {
  setCategoryFilter,
  setBrandFilter,
  setSearchFilter,
  setSortFilter,
  setPriceRange,
  setFiltersFromUrl,
  resetFilters,
} from '../features/filtersSlice.js';
import { fetchProducts, fetchCategories, fetchBrands } from '../features/catalogSlice.js';
import { buildProductWhatsAppUrl } from '../utils/whatsapp.js';
import { optimizeImageUrl } from '../utils/cloudinaryUrl.js';

const SORT_OPTIONS = [
  { value: 'order', label: 'Featured & Recommended' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

const normalizeMaxPrice = (value) =>
  value === '' || value === 'unlimited' ? undefined : value;

export default function ProductsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { category, brand, search, sort, minPrice, maxPrice } = useSelector((state) => state.filters);
  const { products, categories, brands, loading, total, error } = useSelector((state) => state.catalog);
  const settings = useSelector((state) => state.content.settings);

  const whatsappNumber = settings?.whatsappNumber || '919372049568';
  const mobileNumber = settings?.primaryMobile || '+919371249568';
  const hasValidPriceRange =
    (!minPrice || Number.isFinite(Number(minPrice)) && Number(minPrice) >= 0) &&
    (!maxPrice || maxPrice === 'unlimited' || Number.isFinite(Number(maxPrice)) && Number(maxPrice) >= 0) &&
    (!minPrice || !maxPrice || maxPrice === 'unlimited' || Number(minPrice) <= Number(maxPrice));

  useEffect(() => {
    const urlCat = searchParams.get('category') || 'all';
    const urlBrand = searchParams.get('brand') || 'all';
    const urlSearch = searchParams.get('search') || '';
    const urlSort = searchParams.get('sort') || 'order';
    const urlMinPrice = searchParams.get('minPrice') ?? '0';
    const urlMaxPrice = searchParams.get('maxPrice') || '';
    dispatch(
      setFiltersFromUrl({
        category: urlCat,
        brand: urlBrand,
        search: urlSearch,
        sort: urlSort,
        minPrice: urlMinPrice,
        maxPrice: normalizeMaxPrice(urlMaxPrice),
      })
    );
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    if (
      (!urlMinPrice || Number.isFinite(Number(urlMinPrice)) && Number(urlMinPrice) >= 0) &&
      (!urlMaxPrice || urlMaxPrice === 'unlimited' || Number.isFinite(Number(urlMaxPrice)) && Number(urlMaxPrice) >= 0) &&
      (!urlMinPrice || !urlMaxPrice || urlMaxPrice === 'unlimited' || Number(urlMinPrice) <= Number(urlMaxPrice))
    ) {
      dispatch(
        fetchProducts({
          category: urlCat,
          brand: urlBrand,
          search: urlSearch,
          sort: urlSort,
          minPrice: urlMinPrice,
          maxPrice: urlMaxPrice === 'unlimited' ? '' : urlMaxPrice,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    if (!hasValidPriceRange) return;

    const nextParams = {};
    if (category && category !== 'all') nextParams.category = category;
    if (brand && brand !== 'all') nextParams.brand = brand;
    if (search && search.trim() !== '') nextParams.search = search.trim();
    if (sort && sort !== 'order') nextParams.sort = sort;
    if (minPrice !== '' && minPrice !== '0') nextParams.minPrice = minPrice;
    if (maxPrice !== '') nextParams.maxPrice = maxPrice;

    setSearchParams(nextParams, { replace: true });
    dispatch(
      fetchProducts({
        category,
        brand,
        search,
        sort,
        minPrice,
        maxPrice: normalizeMaxPrice(maxPrice),
      })
    );
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  return (
    <div className="bg-white text-[#1D1D1F] min-h-screen">
      <SEO
        title="H-Tech Product Catalog"
        description="Browse laptops, desktops, printers, monitors, CCTV & NEED hardware at H-Tech Computer Wholesale Karad. Contact us on WhatsApp for availability and dealer pricing."
        path="/products"
      />

      {/* Apple Store Style Header */}
      <section className="bg-white border-b border-black/[0.06] py-14 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="apple-eyebrow mb-2">Wholesale Distribution Catalog</p>
          <h1 className="heading-section text-[#1D1D1F] mb-3">H-Tech Product Catalog.</h1>
          <p className="text-lg sm:text-xl text-[#86868B] max-w-2xl font-normal">
            Browse products and contact us on WhatsApp for availability and dealer pricing.
          </p>
        </div>
      </section>

      {/* Filter Bar & Bento Product Grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto bg-white">
        <div className="rounded-[28px] bg-white border border-black/[0.08] shadow-apple-card p-6 sm:p-7 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Search Box */}
            <div className="md:col-span-5">
              <label
                htmlFor="catalog-search"
                className="block text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-1.5"
              >
                Search Model or Spec
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#86868B] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="catalog-search"
                  type="text"
                  value={search}
                  onChange={(e) => dispatch(setSearchFilter(e.target.value))}
                  placeholder="e.g. HP 250R G10, Core i5, NVMe, Ink Tank..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-black/[0.12] text-sm text-[#1D1D1F] focus:border-[#0071E3] focus:outline-none transition"
                />
              </div>
            </div>

            {/* Custom Category Select */}
            <div className="md:col-span-4">
              <CustomSelect
                label="Hardware Category"
                value={category}
                options={categoryOptions}
                onChange={(val) => dispatch(setCategoryFilter(val))}
              />
            </div>

            {/* Custom Sort Select */}
            <div className="md:col-span-3">
              <CustomSelect
                label="Sort By"
                value={sort}
                options={SORT_OPTIONS}
                onChange={(val) => dispatch(setSortFilter(val))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end max-w-xl">
            <div>
              <label htmlFor="minimum-price" className="block text-xs font-semibold text-[#86868B] mb-1.5">
                Minimum price (₹)
              </label>
              <input
                id="minimum-price"
                type="number"
                min="0"
                step="1"
                value={minPrice}
                onChange={(e) => dispatch(setPriceRange({ minPrice: e.target.value }))}
                placeholder="No minimum"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-black/[0.12] text-sm focus:border-[#8B6F54] focus:outline-none transition"
              />
            </div>
            <span className="hidden sm:block pb-3 text-sm text-[#86868B]">to</span>
            <div>
              <label htmlFor="maximum-price" className="block text-xs font-semibold text-[#86868B] mb-1.5">
                Maximum price (₹)
              </label>
              <input
                id="maximum-price"
                type="number"
                min="0"
                step="1"
                value={maxPrice}
                onChange={(e) => dispatch(setPriceRange({ maxPrice: e.target.value }))}
                placeholder="No maximum"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-black/[0.12] text-sm focus:border-[#8B6F54] focus:outline-none transition"
              />
            </div>
          </div>
          {!hasValidPriceRange && (
            <p role="alert" className="text-xs text-rose-600">
              Enter non-negative prices and ensure the minimum does not exceed the maximum.
            </p>
          )}

          {/* Brand Filter Chips */}
          <div className="pt-3 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B] mr-1">
                Brands:
              </span>
              <button
                type="button"
                onClick={() => dispatch(setBrandFilter('all'))}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                  brand === 'all'
                    ? 'bg-[#1D1D1F] text-white'
                    : 'bg-white border border-black/[0.1] text-[#1D1D1F] hover:border-black/30'
                }`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b._id || b.slug}
                  type="button"
                  onClick={() => dispatch(setBrandFilter(b.slug))}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                    brand === b.slug
                      ? 'bg-[#0071E3] text-white'
                      : 'bg-white border border-black/[0.1] text-[#1D1D1F] hover:border-black/30'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {(category !== 'all' || brand !== 'all' || search !== '' || sort !== 'order' || (minPrice !== '' && minPrice !== '0') || maxPrice !== '') && (
              <button
                type="button"
                onClick={() => dispatch(resetFilters())}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0066CC] hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset filters</span>
              </button>
            )}
              <button
                type="button"
                onClick={handleSearch}
                disabled={!hasValidPriceRange || loading}
                className="inline-flex items-center gap-2 rounded-full bg-[#0071E3] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0077ED] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search Products</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 mb-4 flex items-center justify-between text-xs text-[#86868B] px-1">
          <span>
            Showing <strong className="text-[#1D1D1F]">{products.length}</strong> of{' '}
            <strong className="text-[#1D1D1F]">{total}</strong> wholesale models
          </span>
          <span>Enquire for dealer pricing</span>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Products could not be loaded. {error}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-[28px] bg-white border border-black/[0.08] p-6 h-[460px] animate-pulse flex flex-col justify-between"
              >
                <div className="h-52 rounded-2xl bg-slate-100" />
                <div className="space-y-3">
                  <div className="h-4 w-1/3 bg-slate-100 rounded" />
                  <div className="h-6 w-3/4 bg-slate-100 rounded" />
                  <div className="h-16 w-full bg-slate-100 rounded" />
                </div>
                <div className="h-10 w-full bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="apple-bento-card p-12 text-center max-w-xl mx-auto my-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-black/[0.08] text-[#0071E3] flex items-center justify-center mb-4">
              <PackageSearch className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-[#1D1D1F] mb-2">
              No matching hardware found
            </h2>
            <p className="text-sm text-[#86868B] mb-6">
              We stock hundreds of additional configurations at our Karad warehouse. Reset your
              filters or message us directly on WhatsApp for custom requirements.
            </p>
            <button
              type="button"
              onClick={() => dispatch(resetFilters())}
              className="px-6 py-3 rounded-full bg-[#0071E3] text-white text-xs font-medium hover:bg-[#0077ED] transition"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const flyerUrl = optimizeImageUrl(product.images?.[0]?.url, 700);
              const whatsappHref = buildProductWhatsAppUrl(product.name, whatsappNumber);

              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  imageUrl={flyerUrl}
                  whatsappHref={whatsappHref}
                  mobileNumber={mobileNumber}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

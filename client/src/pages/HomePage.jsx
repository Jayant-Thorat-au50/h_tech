import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Phone,
  Cpu,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  HeartHandshake,
  Package,
  Search,
  X,
} from "lucide-react";
import SEO from "../components/shared/SEO.jsx";
import QuickTiles from "../components/home/QuickTiles.jsx";
import OffersCarousel from "../components/home/OffersCarousel.jsx";
import DigitalWingsCards from "../components/home/DigitalWingsCards.jsx";
import Counter from "../components/shared/Counter.jsx";
import PushNotificationBanner from "../components/shared/PushNotificationBanner.jsx";
import { openLightbox } from "../features/uiSlice.js";
import {
  fetchFeaturedProducts,
  fetchBrands,
  fetchCategories,
} from "../features/catalogSlice.js";
import { fetchOffers, fetchCustomers } from "../features/contentSlice.js";
import {
  buildWhatsAppUrl,
  buildProductWhatsAppUrl,
} from "../utils/whatsapp.js";
import { optimizeImageUrl } from "../utils/cloudinaryUrl.js";
import { apiClient, extractErrorMessage } from "../utils/apiClient.js";

const MotionLink = motion(Link);

function ProductImageGallery({ product }) {
  const images = (product.images || []).filter((image) => image?.url);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef(null);
  const didSwipe = useRef(false);
  const activeImage = images[activeIndex] || images[0];

  const showImage = (index) => {
    setActiveIndex((index + images.length) % images.length);
  };

  const handleTouchStart = (event) => {
    if (images.length < 2) return;
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event) => {
    if (!touchStart.current || images.length < 2) return;
    const deltaX = event.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    didSwipe.current = true;
    showImage(activeIndex + (deltaX < 0 ? 1 : -1));
  };

  const handleImageClick = (event) => {
    if (!didSwipe.current) return;
    event.preventDefault();
    didSwipe.current = false;
  };

  return (
    <div
      className="relative mb-5 h-44 overflow-hidden bg-[#F3F3F1] sm:h-48"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Link
        to={`/products/${product.slug}`}
        onClick={handleImageClick}
        aria-label={`View ${product.name}`}
        className="group flex h-full items-center justify-center"
        style={{ touchAction: "pan-y" }}
      >
        <img
          src={optimizeImageUrl(activeImage?.url, 700)}
          alt={`${product.name}${images.length > 1 ? ` - image ${activeIndex + 1}` : ""}`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = "/brand/logo-fallback.svg";
          }}
          className="max-h-full max-w-full w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </Link>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label={`Previous image of ${product.name}`}
            onClick={() => showImage(activeIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-[#57534E] shadow-sm transition hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Next image of ${product.name}`}
            onClick={() => showImage(activeIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 text-[#57534E] shadow-sm transition hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div
            className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5"
            aria-label={`${activeIndex + 1} of ${images.length} product images`}
          >
            {images.map((image, index) => (
              <button
                key={`${image.url}-${index}`}
                type="button"
                aria-label={`Show image ${index + 1} of ${product.name}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => showImage(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex ? "w-4 bg-[#57534E]" : "w-1.5 bg-black/25"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    featuredProducts,
    featuredLoading,
    featuredError,
    brands,
    categories,
  } = useSelector((state) => state.catalog);
  const { offers, customerPhotos, settings } = useSelector(
    (state) => state.content,
  );
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchResultsQuery, setSearchResultsQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchBrands());
    dispatch(fetchCategories());
    dispatch(fetchOffers());
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults(null);
      setSearchResultsQuery("");
      setSearchLoading(false);
      setSearchError("");
      return undefined;
    }

    const controller = new AbortController();
    let isCurrentRequest = true;
    setSearchLoading(true);
    setSearchError("");

    const timeoutId = setTimeout(async () => {
      try {
        const params = { search: query, page: 1, limit: 100, sort: "order" };
        const { data } = await apiClient.get("/products", {
          params,
          signal: controller.signal,
        });
        const results = Array.isArray(data.products) ? [...data.products] : [];
        const totalPages = Math.max(1, Number(data.totalPages) || 1);

        for (let firstPage = 2; firstPage <= totalPages; firstPage += 5) {
          const pages = Array.from(
            { length: Math.min(5, totalPages - firstPage + 1) },
            (_, index) => firstPage + index,
          );
          const pageResponses = await Promise.all(
            pages.map((page) =>
              apiClient.get("/products", {
                params: { ...params, page },
                signal: controller.signal,
              }),
            ),
          );
          pageResponses.forEach(({ data: pageData }) => {
            if (Array.isArray(pageData.products)) results.push(...pageData.products);
          });
        }

        if (isCurrentRequest) {
          setSearchResults(results);
          setSearchResultsQuery(query);
        }
      } catch (requestError) {
        if (isCurrentRequest) {
          setSearchResults([]);
          setSearchResultsQuery(query);
          setSearchError(
            extractErrorMessage(requestError, "Products could not be searched. Please try again."),
          );
        }
      } finally {
        if (isCurrentRequest) setSearchLoading(false);
      }
    }, 300);

    return () => {
      isCurrentRequest = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery]);

  useEffect(() => {
    if (selectedCat === "all" || searchQuery.trim()) {
      setCategoryProducts([]);
      setCategoryLoading(false);
      setCategoryError("");
      return undefined;
    }

    const controller = new AbortController();
    let isCurrentRequest = true;
    setCategoryProducts([]);
    setCategoryLoading(true);
    setCategoryError("");

    const loadCategoryProducts = async () => {
      try {
        const params = {
          page: 1,
          limit: 100,
          sort: "order",
        };
        const { data } = await apiClient.get(
          `/categories/${encodeURIComponent(selectedCat)}/products`,
          {
            params,
            signal: controller.signal,
          },
        );
        if (!Array.isArray(data.products)) {
          throw new Error("The product catalog returned an invalid response.");
        }

        const results = [...data.products];
        const totalPages = Math.max(1, Number(data.totalPages) || 1);
        for (let page = 2; page <= totalPages; page += 1) {
          const { data: pageData } = await apiClient.get(
            `/categories/${encodeURIComponent(selectedCat)}/products`,
            {
              params: { ...params, page },
              signal: controller.signal,
            },
          );
          if (!Array.isArray(pageData.products)) {
            throw new Error("The product catalog returned an invalid response.");
          }
          results.push(...pageData.products);
        }

        if (isCurrentRequest) setCategoryProducts(results);
      } catch (requestError) {
        if (isCurrentRequest) {
          setCategoryProducts([]);
          setCategoryError(
            extractErrorMessage(
              requestError,
              "Products in this category could not be loaded. Please try again.",
            ),
          );
        }
      } finally {
        if (isCurrentRequest) setCategoryLoading(false);
      }
    };

    loadCategoryProducts();
    return () => {
      isCurrentRequest = false;
      controller.abort();
    };
  }, [selectedCat, searchQuery]);

  const headline =
    settings?.heroHeadline || "Technology, wholesale — delivered with trust.";
  const subline =
    settings?.heroSubline ||
    "Laptops, desktops, printers, accessories and the digital future.";
  const whatsappNumber = settings?.whatsappNumber || "919372049568";
  const mobileNumber = settings?.primaryMobile || "+919371249568";

  const heroWhatsAppHref = buildWhatsAppUrl(
    "Hello H-Tech Computer Wholesale (Karad), I would like to enquire about wholesale dealer stock and pricing.",
    whatsappNumber,
  );

  const allHomeProducts = featuredProducts || [];
  const homeCategoryFilters = [
    { id: "all", label: "All Products" },
    ...categories.map((category) => ({
      id: category.slug,
      label: category.name,
    })),
  ];
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const currentSearchResults =
    normalizedQuery && searchResultsQuery === searchQuery.trim() ? searchResults || [] : [];
  const categoryFilteredProducts =
    selectedCat === "all" ? allHomeProducts : categoryProducts;
  const displayedProducts = (normalizedQuery
    ? currentSearchResults
    : categoryFilteredProducts
  ).filter((product) => {
    if (selectedCat === "all") return true;
    return product.category?.slug === selectedCat;
  });
  const isSearchPending =
    Boolean(normalizedQuery) &&
    (searchLoading || searchResultsQuery !== searchQuery.trim());
  const isHomeProductsPending =
    !normalizedQuery && selectedCat === "all" && featuredLoading;
  const isCategoryPending = !normalizedQuery && categoryLoading;
  const homeProductsError =
    !normalizedQuery && selectedCat === "all" ? featuredError : "";
  const searchSuggestions =
    normalizedQuery && searchResultsQuery === searchQuery.trim()
      ? currentSearchResults
      : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  const SEARCH_SUGGESTIONS = [
    "HP Laptop",
    "Core i5",
    "Printer",
    "Monitor",
    "CCTV",
    "Solar",
  ];

  return (
    <div className="bg-white text-[#1D1D1F]">
      <SEO
        title="Technology, Wholesale — Delivered with Trust"
        description="H-Tech Computer Wholesale, Karad (Maharashtra) — Authorized wholesale distributor of HP, Dell, Lenovo, ASUS, Canon, Epson & NEED Hardware."
        path="/"
      />

      {/* 1. HERO SECTION WITH ANIMATED DARK AMBIENT BACKGROUND */}
      <section className="relative overflow-hidden bg-[#303030] border-b border-white/10 py-16 sm:py-24">
        <div
          aria-hidden="true"
          className="hero-background-flow pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="hero-pastel-orb-1 absolute -left-24 top-0 h-72 w-72 rounded-full bg-sky-400/35 blur-3xl" />
          <div className="hero-pastel-orb-2 absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-amber-200/25 blur-3xl" />
          <div className="hero-bubble hero-bubble-one absolute left-[14%] top-[18%] h-4 w-4 rounded-full border border-white/35 bg-sky-200/20" />
          <div className="hero-bubble hero-bubble-two absolute right-[22%] top-[20%] h-7 w-7 rounded-full border border-white/25 bg-orange-200/15" />
          <div className="hero-bubble hero-bubble-three absolute bottom-[16%] left-[24%] h-3 w-3 rounded-full bg-white/25" />
        </div>
        <MotionLink
          to="/build-pc"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="hero-custom-pc-bubble absolute right-[5%] top-[43%] z-20 hidden xl:inline-flex items-center gap-2.5 rounded-full border border-white/35 bg-white/15 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md transition-colors hover:bg-white/25"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-300 text-[#303030]">
            <Cpu className="h-4 w-4" />
          </span>
          <span>Build Your Custom PC</span>
          <ChevronRight className="h-4 w-4 text-orange-200" />
        </MotionLink>

        <div className="relative z-10 max-w-[820px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-[12px] sm:text-[13px] font-medium text-rose-300 mb-2.5">
            H-Tech Computer Wholesale • Karad
          </p>

          <h1 className="heading-hero text-[clamp(1.5rem,2.2vw+0.35rem,2.2rem)] text-white max-w-2xl mx-auto">
            {headline}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-white/70 font-normal max-w-xl mx-auto leading-relaxed">
            {subline}
          </p>

          <PushNotificationBanner />

          {/* Homepage Product Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            aria-label="Search products"
            className="mt-7 max-w-2xl mx-auto"
          >
            <div className="relative">
            <div className="relative z-10 flex items-center bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] focus-within:shadow-[0_10px_36px_rgba(0,113,227,0.18)] transition">
              <Search className="w-5 h-5 text-[#86868B] absolute left-5 pointer-events-none" />
              <input
                id="home-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search laptops, printers, brands or specs…"
                aria-label="Search products"
                aria-autocomplete="list"
                aria-expanded={searchSuggestions.length > 0}
                aria-controls="home-search-suggestions"
                className="w-full bg-transparent pr-32 py-4 rounded-full text-sm sm:text-[15px] text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                style={{ paddingLeft: "3.25rem" }}
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-[7.5rem] p-1.5 rounded-full text-[#86868B] hover:text-[#1D1D1F] transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#57534E] hover:bg-[#44403C] text-white text-[13.5px] font-medium transition"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
            {searchSuggestions.length > 0 && (
              <ul
                id="home-search-suggestions"
                role="listbox"
                aria-label="Matching products"
                className="relative z-20 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-black/10 bg-white py-2 text-left shadow-xl"
              >
                {searchSuggestions.map((product) => (
                  <li key={product._id || product.slug} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected="false"
                      onClick={() => navigate(`/products/${product.slug}`)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition hover:bg-[#F5F5F4] focus:bg-[#F5F5F4] focus:outline-none"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[#1D1D1F]">
                          {product.name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-[#737373]">
                          {[product.brand?.name, product.category?.name]
                            .filter(Boolean)
                            .join(" · ") || "View product details"}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#86868B]" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            </div>

            {/* Quick Suggestions */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[12px] text-white/70">Popular:</span>
              {SEARCH_SUGGESTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 rounded-full bg-white text-[12px] font-medium text-[#1D1D1F]/80 shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:text-[#8B6F54] transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#57534E] hover:bg-[#44403C] text-white font-medium text-[13.5px] transition shadow-sm"
            >
              <span>Explore All Products</span>
            </Link>

            <a
              href={heroWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-[#8B6F54] border border-[#8B6F54]/35 font-medium text-[13.5px] transition"
            >
              <MessageCircle className="w-4 h-4 text-[#1FA34A]" />
              <span>Chat on WhatsApp</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
            <MotionLink
              to="/build-pc"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="hero-custom-pc-bubble inline-flex xl:hidden items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2.5 text-[13px] font-semibold text-white shadow-md backdrop-blur-md transition-colors hover:bg-white/25"
            >
              <Cpu className="h-4 w-4 text-orange-200" />
              <span>Build Your Custom PC</span>
            </MotionLink>
          </div>

          <OffersCarousel
            offers={offers}
            whatsappNumber={whatsappNumber}
            variant="hero"
          />
        </div>
      </section>

      {/* 2. MULTIPLE PRODUCTS LISTED IMMEDIATELY AFTER HERO SECTION (Sample, Test & Wholesale Products) */}
      <section
        id="home-products"
        className="scroll-mt-24 py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto bg-white border-b border-black/[0.06]"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6258] mb-1">
              <Package className="w-3.5 h-3.5" />
              <span>Wholesale Catalog • Sample & Test Lineup</span>
            </div>
            <h2 className="heading-section text-[#1D1D1F]">
              Featured, Sample & Test Products
            </h2>
            <p className="text-xs sm:text-sm text-[#86868B] mt-1">
              Browse laptops, desktops, printers, monitors, Need accessories,
              and test kits — contact us on WhatsApp for dealer pricing.
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm apple-link inline-flex items-center gap-1 shrink-0"
          >
            <span>
              Open full product catalog ({allHomeProducts.length} items)
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Active search status */}
        {normalizedQuery && (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#86868B]">
            <span aria-live="polite">
              {isSearchPending
                ? "Searching all products…"
                : `${displayedProducts.length} result${displayedProducts.length === 1 ? "" : "s"} for `}
              {!isSearchPending && (
                <strong className="text-[#1D1D1F]">“{searchQuery.trim()}”</strong>
              )}
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-1 text-[#8B6F54] hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear search</span>
            </button>
          </div>
        )}
        {searchError && normalizedQuery && (
          <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {searchError}
          </div>
        )}
        {homeProductsError && (
          <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Products could not be loaded. {homeProductsError}
          </div>
        )}
        {categoryError && !normalizedQuery && (
          <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Products in this category could not be loaded. {categoryError}
          </div>
        )}

        {/* Quick Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {homeCategoryFilters.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition ${
                selectedCat === cat.id
                  ? "bg-[#1D1D1F] text-white shadow-sm"
                  : "bg-white text-[#1D1D1F] border border-black/[0.1] hover:border-black/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Empty search state */}
        {(isSearchPending || isHomeProductsPending || isCategoryPending) && (
          <div role="status" className="rounded-2xl border border-black/[0.06] bg-[#F8F8F7] p-8 text-center text-sm text-[#737373]">
            {isSearchPending
              ? "Searching products…"
              : isCategoryPending
                ? "Loading category products…"
                : "Loading products…"}
          </div>
        )}

        {displayedProducts.length === 0 &&
          !isSearchPending &&
          !isHomeProductsPending &&
          !isCategoryPending &&
          !searchError &&
          !homeProductsError && (
          <div className="apple-bento-card p-10 text-center max-w-lg mx-auto">
            <Search className="w-8 h-8 text-[#6AAFD6] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">
              {normalizedQuery || selectedCat !== "all"
                ? "No products match your search"
                : "No products are available right now"}
            </h3>
            <p className="text-sm text-[#86868B] mb-5">
              {normalizedQuery || selectedCat !== "all"
                ? "Try another keyword, or search our full catalog for more models."
                : "Please check back soon or browse the full catalog."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCat("all");
                }}
                className="px-5 py-2.5 rounded-full bg-white text-[#1D1D1F] text-[13px] font-medium shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
              >
                Show all products
              </button>
              <Link
                to={`/products?search=${encodeURIComponent(searchQuery.trim())}`}
                className="px-5 py-2.5 rounded-full bg-[#57534E] hover:bg-[#44403C] text-white text-[13px] font-medium"
              >
                Search full catalog
              </Link>
            </div>
          </div>
        )}

        {/* Multi-Product Grid */}
        {!isSearchPending &&
          !isHomeProductsPending &&
          !isCategoryPending &&
          !searchError &&
          !homeProductsError &&
          !categoryError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedProducts.map((product, idx) => {
            const waLink = buildProductWhatsAppUrl(
              product.name,
              whatsappNumber,
            );
            return (
              <motion.div
                key={product._id || product.slug}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.48,
                  delay: (idx % 3) * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              className="home-product-card p-4 sm:p-5 flex flex-col justify-between"
              >
              <div>
                <ProductImageGallery product={product} />

                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold tracking-wide text-[#5B9DBB]">
                      {product.brand?.name || "H-Tech"}
                    </span>
                    <span className="text-[11px] text-[#86868B] truncate">
                      {product.category?.name || "Hardware"}
                    </span>
                  </div>

                  <Link to={`/products/${product.slug}`} className="group">
                    <h3 className="text-[16px] sm:text-[17px] leading-snug font-semibold tracking-[-0.02em] text-[#1D1D1F] group-hover:text-[#8B6F54] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-[12px] leading-relaxed text-[#737373] line-clamp-2 mt-1.5 mb-4">
                    {product.shortDescription}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {(product.specs || []).slice(0, 3).map((spec, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[11.5px] leading-snug text-[#404040]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1FA34A] shrink-0 mt-px" />
                        <span className="line-clamp-1">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 space-y-2.5">
                  <div className="flex items-center justify-between gap-3 text-[11.5px]">
                    <span className="font-semibold text-[#404040]">
                      {Number.isFinite(product.price)
                        ? `₹${product.price.toLocaleString('en-IN')}`
                        : 'Dealer pricing'}
                    </span>
                    <Link
                      to={`/products/${product.slug}`}
                      className="apple-link inline-flex items-center"
                    >
                      <span>View specs</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-full bg-[#57534E] hover:bg-[#44403C] text-white text-[11.5px] font-medium transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`tel:${mobileNumber}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-full bg-white border border-black/[0.12] hover:border-black/30 text-[#1D1D1F] text-[11.5px] font-medium transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        )}
      </section>

      {/* 3. APPLE BENTO STORE TILES (6 Colour-Accented Tiles from Image 1) */}
      <QuickTiles />

      {/* 4. SPECIAL OFFERS CAROUSEL (Active Only + Solar & Street-Light Promo) */}
      <div className="bg-white border-t border-black/[0.06] py-4">
        <OffersCarousel offers={offers} whatsappNumber={whatsappNumber} />
      </div>

      {/* 5. EXPLORE H-TECH'S NEW DIGITAL WINGS */}
      <DigitalWingsCards />

      {/* 6. BRAND LOGO MARQUEE (HP, Dell, Lenovo, ASUS, Canon, Epson, NEED) */}
      <section className="py-10 bg-white border-y border-black/[0.06] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-5 flex items-center justify-between">
          <p className="apple-eyebrow">
            Authorized Wholesale & Proprietary Brands
          </p>
          <Link
            to="/products"
            className="text-[12.5px] apple-link inline-flex items-center gap-0.5"
          >
            <span>Browse all brands</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="relative flex overflow-x-hidden">
          <div className="flex items-center gap-4 animate-marquee whitespace-nowrap py-1.5">
            {[...brands, ...brands].map((brand, idx) => (
              <Link
                key={`${brand._id || brand.slug}_${idx}`}
                to={`/products?brand=${brand.slug}`}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-[18px] bg-white border border-black/[0.08] hover:border-[#6AAFD6] shadow-sm transition shrink-0"
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-7 w-16 object-contain rounded"
                  />
                ) : null}
                <div className="text-left">
                  <div className="text-[13px] font-semibold text-[#1D1D1F]">
                    {brand.name}
                  </div>
                  {brand.isHardwareBrand && (
                    <div className="text-[10.5px] font-medium text-[#0E9AA7]">
                      H-Tech Brand
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CUSTOMERS PHOTO STRIP ON WHITE */}
      <section className="py-14 bg-white border-b border-black/[0.06]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
            <div>
              <p className="apple-eyebrow mb-1.5">Partner Stories</p>
              <h2 className="heading-section text-[#1D1D1F]">
                Our Happy Customers.
              </h2>
            </div>
            <Link
              to="/customers"
              className="text-[13px] apple-link inline-flex items-center"
            >
              <span>Open full gallery</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {customerPhotos.slice(0, 4).map((photo, index) => (
              <motion.button
                key={photo._id || index}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.48,
                  delay: index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() =>
                  dispatch(
                    openLightbox({
                      images: customerPhotos.map((p) => ({
                        url: p.image,
                        caption: p.caption,
                      })),
                      index,
                    }),
                  )
                }
                className="group text-left apple-bento-card overflow-hidden"
              >
                <div className="h-44 overflow-hidden bg-white">
                  <img
                    src={optimizeImageUrl(photo.image, 600)}
                    alt={photo.caption}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/brand/logo-fallback.svg";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3.5">
                  <p className="text-[12.5px] font-medium text-[#1D1D1F] line-clamp-2">
                    {photo.caption}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* 8. H-TECH CHARITY TEASER ON PURE WHITE */}
      <section className="py-14 sm:py-16 bg-white border-b border-black/[0.06] text-[#1D1D1F]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-[#0E9AA7]">
                <HeartHandshake className="w-4 h-4" />
                <span>H-Tech Charity • Small Steps, Big Impact</span>
              </div>
              <h2 className="heading-section text-[#1D1D1F]">
                We don't just build networks — we build futures.
              </h2>
              <p className="text-[#86868B] text-sm sm:text-base leading-relaxed">
                From Diwali ration distribution for 108 families and school kits
                in remote villages to free CCTV installations in rural schools
                and refurbished computer donations.
              </p>
              <div className="pt-1">
                <Link
                  to="/charity"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#57534E] hover:bg-[#44403C] text-white font-medium text-[13px] transition"
                >
                  <span>Read our Charity Story</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              {[
                {
                  end: 108,
                  suffix: "+",
                  color: "text-[#0E9AA7]",
                  title: "Families Supported",
                  desc: "Annual Diwali food & essentials drive",
                },
                {
                  end: 25,
                  suffix: "+",
                  color: "text-[#5B9DBB]",
                  title: "Rural Schools Reached",
                  desc: "School supplies & free CCTV surveillance",
                },
                {
                  end: 150,
                  suffix: "+",
                  color: "text-[#F28C0F]",
                  title: "Computers & Dealers",
                  desc: "Bridging the rural digital divide",
                },
                {
                  end: 100,
                  suffix: "%",
                  color: "text-[#1FA34A]",
                  title: "Community Commitment",
                  desc: "Empowering IT dealers across Maharashtra",
                },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className="apple-bento-card p-5"
                >
                  <div
                    className={`text-2xl sm:text-3xl font-semibold ${stat.color} mb-1.5`}
                  >
                    <Counter end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div className="text-[13.5px] font-semibold text-[#1D1D1F]">
                    {stat.title}
                  </div>
                  <p className="text-[11.5px] text-[#86868B] mt-0.5">
                    {stat.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL APPLE-STYLE STORE CALLOUT ON WHITE */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[900px] mx-auto text-center bg-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="apple-bento-card p-8 sm:p-10 space-y-4"
        >
          <p className="apple-eyebrow">Partner With H-Tech Karad</p>
          <h2 className="heading-section text-[#1D1D1F]">
            Ready for wholesale dealer pricing?
          </h2>
          <p className="text-[#86868B] max-w-lg mx-auto text-sm sm:text-base">
            Visit our Head Office at Warunji, Karad (Beside Sahyadri Hospital)
            or connect directly with our wholesale desk on WhatsApp.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={heroWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#57534E] hover:bg-[#44403C] text-white font-medium text-[13.5px] transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Wholesale Desk</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full bg-white border border-black/[0.12] hover:border-black/30 text-[#1D1D1F] font-medium text-[13.5px] transition"
            >
              <span>Contact & Head Office</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

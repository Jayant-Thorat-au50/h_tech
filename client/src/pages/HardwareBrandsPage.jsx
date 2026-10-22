import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Cpu,
  HardDrive,
  Zap,
  Keyboard,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import SEO from '../components/shared/SEO.jsx';
import { fetchBrands, fetchProducts } from '../features/catalogSlice.js';
import { buildWhatsAppUrl, buildProductWhatsAppUrl } from '../utils/whatsapp.js';
import { optimizeImageUrl } from '../utils/cloudinaryUrl.js';

const NEED_CATEGORIES = [
  {
    title: 'ATX Cabinets & Enclosures',
    desc: 'Heavy-gauge 0.5mm SPCC matte black chassis with front USB 3.0 and optimized airflow for Indian desktops.',
    icon: HardDrive,
  },
  {
    title: 'Surge-Protected SMPS Units',
    desc: 'ProPower 600W+ peak power supplies engineered with voltage fluctuation guards for regional power grids.',
    icon: Zap,
  },
  {
    title: 'Keyboards & Optical Mice',
    desc: '2.4GHz wireless combos and spill-resistant wired peripherals with UV-coated keycaps.',
    icon: Keyboard,
  },
  {
    title: 'Cables, Toners & CCTV Gear',
    desc: 'High-purity HDMI/VGA cables, POE switches, and surveillance power boxes backed by counter replacement warranty.',
    icon: ShieldCheck,
  },
];

export default function HardwareBrandsPage() {
  const dispatch = useDispatch();
  const { brands, products } = useSelector((state) => state.catalog);
  const settings = useSelector((state) => state.content.settings);

  const whatsappNumber = settings?.whatsappNumber || '919372049568';

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchProducts({ brand: 'need' }));
  }, [dispatch]);

  const hardwareBrands = brands.filter((b) => b.isHardwareBrand);
  const dealerCtaUrl = buildWhatsAppUrl(
    'Hello H-Tech Computer Wholesale (Karad), I would like to become an authorized dealer / enquire about NEED Hardware Brands.',
    whatsappNumber
  );

  return (
    <div className="bg-white text-[#1D1D1F] min-h-screen">
      <SEO
        title="Hardware Brands — Discover NEED & Future H-Tech Brands"
        description="Discover NEED and future H-Tech hardware brands: cabinets, surge-protected SMPS, wireless keyboards, mice, and CCTV peripherals engineered by H-Tech Karad."
        path="/hardware-brands"
      />

      {/* NEED Brand Hero on White */}
      <section className="bg-white py-16 sm:py-22 border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[#0E9AA7] text-xs font-bold uppercase tracking-widest">
              <Cpu className="w-4 h-4" />
              <span>H-Tech Digital Wing 01 • Proprietary Hardware</span>
            </span>

            <h1 className="heading-hero text-[#1D1D1F]">
              Discover <span className="text-[#0E9AA7]">NEED</span> & Future H-Tech Hardware Brands.
            </h1>

            <p className="text-base sm:text-xl text-[#86868B] leading-relaxed">
              Built on years of wholesale ground experience in Maharashtra, <strong>NEED</strong>{' '}
              delivers rugged, high-margin computer peripherals, cabinets, SMPS units, and
              accessories backed by hassle-free H-Tech counter replacement support.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <a
                href={dealerCtaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-sm shadow-sm transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Apply for NEED Dealer Stock</span>
              </a>
              <Link
                to="/products?brand=need"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white border border-black/[0.12] hover:border-black/30 text-[#1D1D1F] font-medium text-sm transition"
              >
                <span>View NEED Products in Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Active Hardware Brands from DB (`isHardwareBrand: true`) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 bg-white">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#0E9AA7]">
            Proprietary Lineup
          </span>
          <h2 className="heading-section text-[#1D1D1F] mt-1 mb-8">
            Active H-Tech Hardware Brands
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {hardwareBrands.map((brand) => (
              <div
                key={brand._id || brand.slug}
                className="lg:col-span-7 apple-bento-card p-7 sm:p-9 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-14 w-auto object-contain rounded-xl"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-[#0E9AA7]">{brand.name}</span>
                    )}
                    <span className="px-3.5 py-1 rounded-full bg-teal-50 text-[#0E9AA7] border border-teal-200 text-xs font-bold uppercase tracking-wider">
                      Flagship Hardware Brand
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#1D1D1F]">
                    {brand.name} — Engineered for System Integrators & Retailers
                  </h3>
                  <p className="text-sm sm:text-base text-[#86868B] leading-relaxed">
                    {brand.description ||
                      'High-reliability computer cabinets, SMPS power supplies, keyboards, mice, and networking accessories.'}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#86868B]">
                    Direct Factory Allocation • Karad Hub
                  </span>
                  <Link
                    to={`/products?brand=${brand.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066CC] hover:underline"
                  >
                    <span>Browse {brand.name} Models</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}

            {/* More H-Tech Brands Coming Soon Teaser on White */}
            <div className="lg:col-span-5 apple-bento-card p-7 sm:p-9 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 text-[#0E9AA7] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>R&D Pipeline</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1D1D1F]">
                  More H-Tech brands coming soon
                </h3>
                <p className="text-sm text-[#86868B] leading-relaxed">
                  We are expanding our proprietary hardware portfolio to include commercial UPS
                  systems, high-speed NVMe SSD modules, and smart solar-powered surveillance kits.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-black/[0.06] text-xs text-[#86868B]">
                New brands marked as <code>isHardwareBrand</code> in the Admin Console appear here
                automatically.
              </div>
            </div>
          </div>
        </div>

        {/* Category Overview */}
        <div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] mb-6">
            NEED Hardware Category Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NEED_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className="apple-bento-card p-6 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0E9AA7] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#1D1D1F]">{cat.title}</h3>
                  <p className="text-xs text-[#86868B] leading-relaxed">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* NEED Featured Products */}
        {products.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-6">
              Featured NEED Hardware Models
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="apple-bento-card p-6 flex flex-col sm:flex-row gap-6 items-center"
                >
                  <img
                    src={optimizeImageUrl(p.images?.[0]?.url, 400)}
                    alt={p.name}
                    className="w-40 h-32 object-contain rounded-2xl bg-white border border-black/[0.06] p-2 shrink-0"
                  />
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-bold text-[#1D1D1F]">{p.name}</h3>
                    <p className="text-xs text-[#86868B]">{p.shortDescription}</p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <a
                        href={buildProductWhatsAppUrl(p.name, whatsappNumber)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0071E3] text-white text-xs font-medium"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Dealer Price</span>
                      </a>
                      <Link
                        to={`/products/${p.slug}`}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-black/[0.12] text-[#1D1D1F] text-xs font-medium"
                      >
                        Specs →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShieldCheck,
  Target,
  Cpu,
  Sparkles,
  Globe,
  MessageCircle,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import SEO from '../components/shared/SEO.jsx';
import Counter from '../components/shared/Counter.jsx';
import { fetchBrands } from '../features/catalogSlice.js';
import { fetchSettings } from '../features/contentSlice.js';
import { buildWhatsAppUrl } from '../utils/whatsapp.js';

export default function AboutPage() {
  const dispatch = useDispatch();
  const { brands } = useSelector((state) => state.catalog);
  const { settings } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchSettings());
  }, [dispatch]);

  const story =
    settings?.aboutBlocks?.story ||
    "Headquartered at Swami-Amal-Dutta' Bunglow, Besides 'Sahyadri' Hospital, Old Koyana Bridge Road, Warunji, Karad – 415124, H-Tech Computer Wholesale is a trusted computer and IT hardware wholesaler serving dealers, institutions, and businesses across Maharashtra. Founded in [TODO: confirm with client — Year Established] by [TODO: confirm with client — Founders & Leadership Team], we bridge global hardware brands with regional IT partners.";

  const mission =
    settings?.aboutBlocks?.mission ||
    'To empower IT dealers, system integrators, and institutions with authentic wholesale hardware, transparent dealer support, and next-generation digital wings across hardware brands, AI software, and web experiences.';

  const whatWeDo =
    settings?.aboutBlocks?.whatWeDo ||
    'We distribute laptops, desktops, printers, networking gear, CCTV systems, solar & street-light solutions, and proprietary hardware under the NEED brand — backed by our Einstein Team AI & Software division and Website Development studio.';

  const milestonesNote =
    settings?.aboutBlocks?.milestonesNote ||
    '[TODO: confirm with client — Key Awards, Certifications & Exact Dealer Network Count]';

  const whatsappHref = buildWhatsAppUrl(
    'Hello H-Tech Computer Wholesale (Karad), I would like to connect regarding a wholesale partnership.',
    settings?.whatsappNumber || '919372049568'
  );

  return (
    <>
      <SEO
        title="About Us — Brand Story, Mission & Digital Wings"
        description="Learn about H-Tech Computer Wholesale in Warunji, Karad (415124) — distributing HP, Dell, Lenovo, ASUS, Canon, Epson, NEED hardware, AI software & web development."
        path="/about"
      />

      {/* Hero Section */}
      <section className="bg-white border-b border-black/[0.06] py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-htech-blue text-xs font-bold uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            <span>Warunji, Karad – 415124 • Maharashtra</span>
          </span>
          <h1 className="heading-hero text-[#1D1D1F]">
            Technology, wholesale — delivered with trust.
          </h1>
          <p className="text-base sm:text-xl text-[#86868B] max-w-3xl mx-auto leading-relaxed">
            Hardware brands for today. Intelligent software for tomorrow.
          </p>
        </div>
      </section>

      {/* Brand Story, Mission & What We Do */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 apple-bento-card p-7 sm:p-10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-htech-blue">
              Our Brand Story
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F]">
              Karad’s Premier Computer & IT Hardware Wholesaler
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {story}
            </p>

            {/* Transparent Placeholder Notice for Client Verification */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Admin Editable Content: </span>
                Historical details marked with <code>[TODO: confirm with client]</code> ({milestonesNote}) can be updated anytime from the H-Tech Admin Console → Site Settings.
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex-1 apple-bento-card p-7 sm:p-8 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-htech-blue">
                <Target className="w-4 h-4" />
                <span>Our Mission</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#1D1D1F]">
                Empowering Regional IT Dealers
              </h3>
              <p className="text-sm text-[#86868B] leading-relaxed">{mission}</p>
            </div>

            <div className="flex-1 apple-bento-card p-7 sm:p-8 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-htech-green">
                <ShieldCheck className="w-4 h-4" />
                <span>What We Do</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#1D1D1F]">
                End-to-End Hardware & Digital Ecosystem
              </h3>
              <p className="text-sm text-[#86868B] leading-relaxed">{whatWeDo}</p>
            </div>
          </div>
        </div>

        {/* Animated Key Figures */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="apple-bento-card p-6 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-htech-blue mb-1">
              <Counter end={7} suffix="+" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#1D1D1F]">Core Hardware Brands</div>
            <div className="text-xs text-[#86868B] mt-0.5">HP, Dell, Lenovo, ASUS, Canon, Epson, NEED</div>
          </div>

          <div className="apple-bento-card p-6 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-htech-green mb-1">
              <Counter end={3} />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#1D1D1F]">Digital Wings</div>
            <div className="text-xs text-[#86868B] mt-0.5">Hardware, AI Software & Web Studio</div>
          </div>

          <div className="apple-bento-card p-6 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-htech-teal mb-1">
              <Counter end={108} suffix="+" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#1D1D1F]">Families Supported</div>
            <div className="text-xs text-[#86868B] mt-0.5">Via H-Tech Charity initiatives</div>
          </div>

          <div className="apple-bento-card p-6 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-htech-purple mb-1">
              <Counter end={415124} />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#1D1D1F]">Warunji, Karad Hub</div>
            <div className="text-xs text-[#86868B] mt-0.5">Beside Sahyadri Hospital, Karad</div>
          </div>
        </div>

        {/* Partner Brand Strip */}
        <div className="apple-bento-card p-7 sm:p-9">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#86868B] mb-6 text-center">
            Brands We Distribute & Build
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {brands.map((b) => (
              <Link
                key={b._id || b.slug}
                to={`/products?brand=${b.slug}`}
                className="p-4 rounded-2xl bg-white hover:bg-blue-50/40 border border-black/[0.08] flex flex-col items-center justify-center text-center transition"
              >
                <span className="text-base font-extrabold text-[#1D1D1F]">{b.name}</span>
                <span className="text-[10px] font-semibold text-[#86868B] mt-0.5">
                  {b.isHardwareBrand ? 'H-Tech Brand' : 'Wholesale'}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Digital Wings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/hardware-brands"
            className="apple-bento-card p-6 space-y-2"
          >
            <Cpu className="w-7 h-7 text-htech-teal" />
            <h3 className="text-lg font-extrabold text-[#1D1D1F]">Hardware Brands</h3>
            <p className="text-xs sm:text-sm text-[#86868B]">
              Discover NEED and future H-Tech hardware brands engineered for Indian dealers.
            </p>
          </Link>

          <Link
            to="/ai-software"
            className="apple-bento-card p-6 space-y-2"
          >
            <Sparkles className="w-7 h-7 text-htech-purple" />
            <h3 className="text-lg font-extrabold text-[#1D1D1F]">AI & Software</h3>
            <p className="text-xs sm:text-sm text-[#86868B]">
              Enter the Einstein Team technology and software division for business automation.
            </p>
          </Link>

          <Link
            to="/web-development"
            className="apple-bento-card p-6 space-y-2"
          >
            <Globe className="w-7 h-7 text-htech-blue" />
            <h3 className="text-lg font-extrabold text-[#1D1D1F]">Website Development</h3>
            <p className="text-xs sm:text-sm text-[#86868B]">
              Professional websites, PWAs and digital experiences tailored for modern enterprises.
            </p>
          </Link>
        </div>

        {/* Bottom CTA */}
        <div className="apple-bento-card p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F]">
            Connect with H-Tech Computer Wholesale, Karad
          </h2>
          <p className="text-sm sm:text-base text-[#86868B] max-w-xl mx-auto">
            Swami-Amal-Dutta' Bunglow, Besides 'Sahyadri' Hospital, Old Koyana Bridge Road,
            Warunji, Karad – 415124.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-htech-green hover:bg-emerald-600 text-white font-bold text-sm transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <Link
              to="/contact"
              className="apple-pill-outline"
            >
              <span>Contact Page</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

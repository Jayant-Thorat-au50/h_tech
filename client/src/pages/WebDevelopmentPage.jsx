import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Globe,
  Smartphone,
  ShoppingBag,
  Layers,
  Send,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import SEO from '../components/shared/SEO.jsx';
import { submitPublicEnquiry, resetEnquirySubmission } from '../features/enquiriesSlice.js';
import { addToast } from '../features/uiSlice.js';
import { buildWhatsAppUrl } from '../utils/whatsapp.js';

const SERVICES = [
  {
    title: 'Corporate & Wholesale Websites',
    desc: 'Fast, SEO-optimized, mobile-first websites with Apple-grade typography, 3D motion, and admin consoles.',
    icon: Globe,
  },
  {
    title: 'Progressive Web Apps (PWAs)',
    desc: 'Installable web apps that work smoothly on mobile and desktop with offline caching and push readiness.',
    icon: Smartphone,
  },
  {
    title: 'B2B Product Catalogs & E-Commerce',
    desc: 'Custom dealer catalogs, WhatsApp ordering flows, and high-conversion digital storefronts.',
    icon: ShoppingBag,
  },
  {
    title: 'Custom Web Portals & Admin Consoles',
    desc: 'Role-protected dashboards, enquiry CRMs, and real-time analytics built on the MERN stack.',
    icon: Layers,
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Discovery & Architecture', desc: 'Aligning on brand goals, sitemap, and user journeys.' },
  { step: '02', title: 'UI/UX & Interactive Prototyping', desc: 'Crafting clean, generous layouts and responsive components.' },
  { step: '03', title: 'Full-Stack MERN Engineering', desc: 'Building fast Vite + React frontends and secure Node/Mongo APIs.' },
  { step: '04', title: 'QA, SEO & Cloud Launch', desc: 'Performance tuning, JSON-LD SEO, PWA setup, and deployment.' },
];

const TECH_BADGES = [
  'React 18',
  'Vite',
  'Tailwind CSS',
  'Redux Toolkit',
  'Three.js 3D',
  'Node.js',
  'Express',
  'MongoDB Atlas',
  'Cloudinary',
  'PWA Ready',
];

const SAMPLE_WORK = [
  {
    title: 'B2B Hardware Wholesale Portal (Sample Placeholder)',
    category: 'MERN Catalog + Admin Console',
    desc: 'Interactive dealer catalog with 3D hero, instant WhatsApp deep-links, and dynamic offer management.',
  },
  {
    title: 'Industrial Solar & Infrastructure Showcase (Sample Placeholder)',
    category: 'Corporate Website + Lead Engine',
    desc: 'High-impact product showcase for solar street-light and green energy project tenders.',
  },
  {
    title: 'Regional Healthcare & Diagnostics PWA (Sample Placeholder)',
    category: 'Progressive Web App',
    desc: 'Mobile-first appointment and patient report portal engineered for fast 4G/5G loading.',
  },
];

export default function WebDevelopmentPage() {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.content.settings);
  const { submitting, submitSuccess } = useSelector((state) => state.enquiries);

  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    projectType: 'Corporate / Wholesale Website',
    message: '',
  });

  useEffect(() => {
    return () => {
      dispatch(resetEnquirySubmission());
    };
  }, [dispatch]);

  const whatsappNumber = settings?.whatsappNumber || '919372049568';

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.phone || !quoteForm.message) {
      dispatch(addToast({ type: 'error', message: 'Please complete all required fields.' }));
      return;
    }

    const res = await dispatch(
      submitPublicEnquiry({
        name: quoteForm.name,
        phone: quoteForm.phone,
        message: `[Web Dev Quote — ${quoteForm.projectType}] ${quoteForm.message}`,
        sourcePage: '/web-development',
      })
    );

    if (!res.error) {
      dispatch(
        addToast({
          type: 'success',
          message: 'Quote request received! Our web studio team will contact you.',
        })
      );
    } else {
      dispatch(addToast({ type: 'error', message: res.payload || 'Could not submit quote' }));
    }
  };

  const whatsappQuoteHref = buildWhatsAppUrl(
    `Hello H-Tech Website Development Studio (Karad), my name is *${
      quoteForm.name || 'Client'
    }* (${quoteForm.phone || ''}). Project Type: *${quoteForm.projectType}*. Details: ${
      quoteForm.message || 'I would like a website / PWA quote.'
    }`,
    whatsappNumber
  );

  return (
    <>
      <SEO
        title="Website Development — Websites, PWAs & Digital Experiences"
        description="Professional websites, PWAs, B2B catalogs, and digital experiences built by H-Tech Computer Wholesale's Website Development Wing in Karad."
        path="/web-development"
      />

      {/* Hero */}
      <section className="bg-white border-b border-black/[0.06] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-htech-blue border border-blue-200 text-xs font-bold uppercase tracking-widest">
              <Globe className="w-4 h-4" />
              <span>H-Tech Digital Wing 03 • Web Studio</span>
            </span>
            <h1 className="heading-hero text-[#1D1D1F]">
              Professional websites, PWAs and digital experiences.
            </h1>
            <p className="text-base sm:text-xl text-[#86868B] leading-relaxed">
              We design and engineer fast, mobile-first web applications, B2B wholesale portals,
              and progressive web apps that elevate your brand.
            </p>
            <div className="pt-2">
              <a
                href="#get-a-quote"
                className="apple-pill-blue"
              >
                <span>Get a Website Quote</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        {/* Services */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-htech-blue">
            What We Build
          </span>
          <h2 className="heading-section text-[#1D1D1F] mt-1 mb-8">Web & Digital Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.title}
                  className="apple-bento-card p-6 space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-htech-blue flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1D1D1F]">{srv.title}</h3>
                  <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">{srv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4-Step Process */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-htech-teal">
            How We Work
          </span>
          <h2 className="heading-section text-[#1D1D1F] mt-1 mb-8">4-Step Delivery Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((p) => (
              <div
                key={p.step}
                className="apple-bento-card p-6 space-y-2"
              >
                <span className="text-xs font-mono font-bold text-htech-blue">STEP {p.step}</span>
                <h3 className="text-lg font-extrabold text-[#1D1D1F]">{p.title}</h3>
                <p className="text-xs text-[#86868B] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Badge Row */}
        <div className="apple-bento-card p-7 sm:p-9 text-center">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#86868B] mb-5">
            Modern Production Tech Stack
          </h3>
          <div className="flex flex-wrap justify-center gap-2.5">
            {TECH_BADGES.map((badge) => (
              <span
                key={badge}
                className="px-4 py-2 rounded-full bg-white text-[#1D1D1F] text-xs sm:text-sm font-bold border border-black/[0.08]"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Sample Work Placeholder Grid */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-htech-purple">
            Reference Architectures
          </span>
          <h2 className="heading-section text-htech-navy mt-1 mb-8">
            Sample Work & Concept Showcase
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_WORK.map((work) => (
              <div
                key={work.title}
                className="apple-bento-card p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-htech-purple text-[11px] font-semibold mb-3">
                    {work.category}
                  </span>
                  <h3 className="heading-card text-[#1D1D1F] mb-2">{work.title}</h3>
                  <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">{work.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 text-xs font-semibold text-slate-400">
                  Customizable Template Architecture
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Get a Quote Form (Saved as Enquiry + Offered on WhatsApp) */}
        <div
          id="get-a-quote"
          className="apple-bento-card p-7 sm:p-10 max-w-3xl mx-auto"
        >
          <span className="text-xs font-semibold text-htech-blue">
            Project Inquiry
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] mt-1 mb-2">
            Get a Quote for Your Website or PWA
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6">
            Your quote request is saved directly to the H-Tech Admin Console and can also be sent
            immediately via WhatsApp.
          </p>

          {submitSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900 text-xs sm:text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-htech-green shrink-0" />
              <span>Quote request saved! We will get back to you shortly.</span>
            </div>
          )}

          <form onSubmit={handleQuoteSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="quote-name"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                >
                  Your Name / Company *
                </label>
                <input
                  id="quote-name"
                  type="text"
                  required
                  value={quoteForm.name}
                  onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                  placeholder="Your Name or Business"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-htech-blue/30"
                />
              </div>

              <div>
                <label
                  htmlFor="quote-phone"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                >
                  Phone / WhatsApp Number *
                </label>
                <input
                  id="quote-phone"
                  type="tel"
                  required
                  value={quoteForm.phone}
                  onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-htech-blue/30"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="quote-type"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Project Type
              </label>
              <input
                id="quote-type"
                type="text"
                value={quoteForm.projectType}
                onChange={(e) => setQuoteForm({ ...quoteForm, projectType: e.target.value })}
                placeholder="e.g. Corporate Website, B2B Catalog, PWA..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-htech-blue/30"
              />
            </div>

            <div>
              <label
                htmlFor="quote-message"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
              >
                Project Goals & Requirements *
              </label>
              <textarea
                id="quote-message"
                rows={4}
                required
                value={quoteForm.message}
                onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                placeholder="Describe your pages, features, or timeline..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-htech-blue/30"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-htech-navy hover:bg-slate-800 disabled:opacity-60 text-white font-bold text-sm shadow transition"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Saving Quote...' : 'Submit Quote Request'}</span>
              </button>

              <a
                href={whatsappQuoteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-htech-green hover:bg-emerald-600 text-white font-bold text-sm shadow transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Also Send on WhatsApp</span>
              </a>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

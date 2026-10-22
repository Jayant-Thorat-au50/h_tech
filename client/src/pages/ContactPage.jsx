import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Phone,
  MessageCircle,
  PhoneCall,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Building2,
  Send,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import SEO from '../components/shared/SEO.jsx';
import { fetchBranches, fetchSettings } from '../features/contentSlice.js';
import { submitPublicEnquiry, resetEnquirySubmission } from '../features/enquiriesSlice.js';
import { addToast } from '../features/uiSlice.js';
import { buildWhatsAppUrl } from '../utils/whatsapp.js';

export default function ContactPage() {
  const dispatch = useDispatch();
  const { branches, settings } = useSelector((state) => state.content);
  const { submitting, submitSuccess } = useSelector((state) => state.enquiries);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchSettings());
    return () => {
      dispatch(resetEnquirySubmission());
    };
  }, [dispatch]);

  const headOffice = branches?.find((b) => b.isHeadOffice) || {
    name: 'H-Tech Computer Wholesale',
    address:
      "Swami-Amal-Dutta' Bunglow, Besides 'Sahyadri' Hospital, Old Koyana Bridge Road, Warunji, Karad – 415124",
    mobile: '+919371249568',
    whatsapp: 'https://wa.me/919372049568',
    landline: '02164228793',
    email: 'admin@htechcomputer.com',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Sahyadri+Hospital+Old+Koyana+Bridge+Road+Warunji+Karad+415124',
  };

  const otherBranches = (branches || []).filter((b) => !b.isHeadOffice);

  const tickerItems =
    settings?.ledPhoneNumbers?.length > 0
      ? settings.ledPhoneNumbers
      : [
          `MOBILE: ${headOffice.mobile}`,
          'BUSINESS WHATSAPP: +91 93720 49568',
          `LANDLINE: ${headOffice.landline}`,
          `EMAIL: ${headOffice.email}`,
          'HEAD OFFICE: WARUNJI, KARAD – 415124',
        ];

  const glossyButtons = [
    {
      label: 'Call Mobile',
      sub: headOffice.mobile,
      href: `tel:${headOffice.mobile}`,
      icon: Phone,
      gradient: 'from-blue-600 to-blue-800',
    },
    {
      label: 'WhatsApp',
      sub: 'Business Chat',
      href: headOffice.whatsapp || 'https://wa.me/919372049568',
      icon: MessageCircle,
      gradient: 'from-emerald-500 to-emerald-700',
    },
    {
      label: 'Landline',
      sub: headOffice.landline,
      href: `tel:${headOffice.landline}`,
      icon: PhoneCall,
      gradient: 'from-amber-500 to-orange-700',
    },
    {
      label: 'Email Desk',
      sub: headOffice.email,
      href: `mailto:${headOffice.email}`,
      icon: Mail,
      gradient: 'from-indigo-600 to-purple-800',
    },
    {
      label: 'Google Map',
      sub: 'Warunji, Karad',
      href:
        headOffice.mapUrl ||
        'https://www.google.com/maps/search/?api=1&query=Sahyadri+Hospital+Old+Koyana+Bridge+Road+Warunji+Karad+415124',
      icon: MapPin,
      gradient: 'from-teal-500 to-teal-800',
    },
    {
      label: 'Instagram',
      sub: '@htechcomputer',
      href: settings?.socialLinks?.instagram || 'https://instagram.com/htechcomputerwholesale',
      icon: Instagram,
      gradient: 'from-pink-500 to-rose-700',
    },
    {
      label: 'Facebook',
      sub: 'Official Page',
      href: settings?.socialLinks?.facebook || 'https://facebook.com/htechcomputerwholesale',
      icon: Facebook,
      gradient: 'from-blue-700 to-slate-900',
    },
    {
      label: 'YouTube',
      sub: 'Channel',
      href: settings?.socialLinks?.youtube || 'https://youtube.com/@htechcomputerwholesale',
      icon: Youtube,
      gradient: 'from-red-600 to-rose-900',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      dispatch(addToast({ type: 'error', message: 'Please fill in all fields.' }));
      return;
    }
    const res = await dispatch(
      submitPublicEnquiry({
        ...formData,
        sourcePage: '/contact',
      })
    );
    if (!res.error) {
      dispatch(
        addToast({
          type: 'success',
          message: 'Enquiry sent! Our Karad team will contact you shortly.',
        })
      );
    } else {
      dispatch(addToast({ type: 'error', message: res.payload || 'Submission failed' }));
    }
  };

  const prefilledWhatsAppHref = buildWhatsAppUrl(
    `Hello H-Tech Computer Wholesale (Karad), my name is *${
      formData.name || 'Dealer Partner'
    }* (${formData.phone || ''}). Enquiry: ${
      formData.message || 'Please share dealer availability and pricing.'
    }`,
    settings?.whatsappNumber || '919372049568'
  );

  return (
    <>
      <SEO
        title="Contact Us — Head Office Karad & Branches"
        description="Contact H-Tech Computer Wholesale at Swami-Amal-Dutta' Bunglow, Besides Sahyadri Hospital, Old Koyana Bridge Road, Warunji, Karad – 415124. Call +919371249568."
        path="/contact"
      />

      {/* 1. RED LED-STYLE PHONE-NUMBER TICKER AT THE TOP (Image 2) */}
      <div className="led-matrix-bg border-b-2 border-red-900/70 py-3 overflow-hidden select-none">
        <div className="flex items-center whitespace-nowrap animate-ticker">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
            <span
              key={idx}
              className="mx-8 font-mono text-sm sm:text-base font-bold tracking-widest led-text-glow inline-flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 2. PAGE HEADER & 8 GLOSSY 3D ICON BUTTONS */}
      <section className="bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-blue-50 text-htech-blue text-xs font-bold uppercase tracking-widest mb-3">
            Direct Wholesale Desk
          </span>
          <h1 className="heading-section text-[#1D1D1F] mb-3">
            H-Tech Contacts & Branches
          </h1>
          <p className="text-sm sm:text-base text-[#86868B]">
            Tap any quick-connect button below to call, WhatsApp, email, or navigate directly to our
            Head Office in Karad.
          </p>
        </div>

        {/* 8 Glossy 3D Icon Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-14">
          {glossyButtons.map((btn) => {
            const Icon = btn.icon;
            const isExternal = btn.href.startsWith('http');
            return (
              <a
                key={btn.label}
                data-scroll-card
                href={btn.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={`group relative overflow-hidden rounded-3xl p-4 sm:p-5 text-white bg-gradient-to-br ${btn.gradient} shadow-glass hover:shadow-xl border border-white/25 transform transition hover:-translate-y-1 flex flex-col items-center text-center`}
              >
                <div className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/20 blur-xl" />
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center mb-2.5 shadow-inner group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs sm:text-sm font-semibold">{btn.label}</div>
                <div className="text-[11px] text-white/80 font-medium truncate max-w-full mt-0.5">
                  {btn.sub}
                </div>
              </a>
            );
          })}
        </div>

        {/* 3. HEAD OFFICE CARD & OTHER BRANCHES CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
          {/* Head Office Card */}
          <div className="lg:col-span-7 apple-bento-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-htech-blue text-xs font-extrabold uppercase tracking-wider mb-4">
                <Building2 className="w-4 h-4" />
                <span>Head Office — Karad</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-htech-navy mb-3">
                {headOffice.name}
              </h2>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                {headOffice.address}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <a
                  href={`tel:${headOffice.mobile}`}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-htech-blue transition flex items-center gap-3"
                >
                  <div className="p-2.5 rounded-xl bg-blue-50 text-htech-blue">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400">Mobile</div>
                    <div className="font-extrabold text-slate-900">{headOffice.mobile}</div>
                  </div>
                </a>

                <a
                  href={headOffice.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-htech-green transition flex items-center gap-3"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-htech-green">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400">
                      Business WhatsApp
                    </div>
                    <div className="font-extrabold text-slate-900">+91 93720 49568</div>
                  </div>
                </a>

                <a
                  href={`tel:${headOffice.landline}`}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-amber-500 transition flex items-center gap-3"
                >
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-400">Landline</div>
                    <div className="font-extrabold text-slate-900">{headOffice.landline}</div>
                  </div>
                </a>

                <a
                  href={`mailto:${headOffice.email}`}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-purple-500 transition flex items-center gap-3"
                >
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase text-slate-400">Email</div>
                    <div className="font-extrabold text-slate-900 truncate">
                      {headOffice.email}
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Beside Sahyadri Hospital, Old Koyana Bridge Road, Warunji
              </span>
              <a
                href={headOffice.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-htech-blue hover:underline"
              >
                <span>Open Directions</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Other Branches Card (with Admin-Ready Empty State) */}
          <div className="lg:col-span-5 apple-bento-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-4">
                <MapPin className="w-4 h-4 text-htech-teal" />
                <span>Regional Network</span>
              </div>
              <h2 className="text-xl font-bold text-[#1D1D1F] mb-3">Other Branches</h2>

              {otherBranches.length === 0 ? (
                <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-6 text-center my-4 space-y-2">
                  <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">
                    All Wholesale Operations Currently Centralized at Karad Head Office
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upcoming regional branch locations and partner distribution hubs will appear
                    here automatically as they are added via the H-Tech Admin Console.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {otherBranches.map((br) => (
                    <div
                      key={br._id}
                      className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5"
                    >
                      <h3 className="font-bold text-slate-900 text-sm">{br.name}</h3>
                      <p className="text-xs text-slate-600">{br.address}</p>
                      <div className="flex flex-wrap gap-3 pt-1 text-xs font-bold text-htech-blue">
                        <a href={`tel:${br.mobile}`}>Mob: {br.mobile}</a>
                        {br.landline && <a href={`tel:${br.landline}`}>Tel: {br.landline}</a>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              Fast daily dispatch across Satara, Karad, Sangli, Kolhapur & Western Maharashtra.
            </div>
          </div>
        </div>

        {/* 4. ENQUIRY FORM + EMBEDDED MAP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Enquiry Form */}
          <div className="lg:col-span-6 apple-bento-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#1D1D1F] mb-2">
              Send a Wholesale Enquiry
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Submit your requirement below to save it directly to our Karad wholesale console, or
              send simultaneously on WhatsApp.
            </p>

            {submitSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-htech-green shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="font-bold">Enquiry logged in H-Tech Console!</p>
                  <p className="mt-0.5">
                    You can also click "Also send on WhatsApp" below for instant live chat.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="enq-name"
                  className="block text-xs font-semibold text-slate-600 mb-1.5"
                >
                  Your Name / Shop Name *
                </label>
                <input
                  id="enq-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rajesh Patil — Sai Computers"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-htech-blue/30"
                />
              </div>

              <div>
                <label
                  htmlFor="enq-phone"
                  className="block text-xs font-semibold text-slate-600 mb-1.5"
                >
                  Mobile / WhatsApp Number *
                </label>
                <input
                  id="enq-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-htech-blue/30"
                />
              </div>

              <div>
                <label
                  htmlFor="enq-message"
                  className="block text-xs font-semibold text-slate-600 mb-1.5"
                >
                  Products / Quantities Required *
                </label>
                <textarea
                  id="enq-message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us the models, quantities, or dealer enquiry details..."
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-htech-blue/30"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-60 text-white font-semibold text-xs sm:text-sm shadow-sm transition"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit Enquiry'}</span>
                </button>

                <a
                  href={prefilledWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-htech-green hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-sm transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Also send on WhatsApp</span>
                </a>
              </div>
            </form>
          </div>

          {/* Embedded Google Map */}
          <div className="lg:col-span-6 apple-bento-card overflow-hidden min-h-[380px] flex flex-col">
            <div className="px-6 py-4 bg-white border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-htech-red" />
                <span className="text-xs font-semibold text-slate-800">
                  Warunji, Karad – 415124 (Beside Sahyadri Hospital)
                </span>
              </div>
              <a
                href={headOffice.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-htech-blue hover:underline"
              >
                Larger Map →
              </a>
            </div>
            <iframe
              title="H-Tech Computer Wholesale Karad Map"
              src="https://www.google.com/maps?q=Sahyadri+Hospital+Warunji+Karad+415124&output=embed"
              className="w-full flex-1 border-0 min-h-[340px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}

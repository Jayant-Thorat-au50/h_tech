import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  HeartHandshake,
  Gift,
  BookOpen,
  ShieldCheck,
  Monitor,
  Briefcase,
  Maximize2,
} from 'lucide-react';
import SEO from '../components/shared/SEO.jsx';
import Counter from '../components/shared/Counter.jsx';
import { fetchCharity } from '../features/contentSlice.js';
import { openLightbox } from '../features/uiSlice.js';
import { optimizeImageUrl } from '../utils/cloudinaryUrl.js';

const IMPACT_INITIATIVES = [
  {
    title: 'Diwali food distribution to 108 families',
    description:
      'Every festive season, H-Tech Charity organizes a dedicated ration, sweets, and essentials drive reaching 108 underprivileged families across Karad and neighboring villages.',
    icon: Gift,
    accent: 'bg-amber-50 text-amber-600 border-amber-200',
    stat: '108 Families',
  },
  {
    title: 'School supplies for children in remote villages',
    description:
      'Equipping young learners in rural Zilla Parishad schools with backpacks, notebooks, geometry sets, and learning aids so financial barriers never halt education.',
    icon: BookOpen,
    accent: 'bg-sky-50 text-sky-600 border-sky-200',
    stat: 'Rural Students',
  },
  {
    title: 'Free CCTV security systems installed in rural schools',
    description:
      'Deploying our technical expertise and surveillance hardware to install complimentary 24/7 CCTV security systems that keep rural school campuses safe.',
    icon: ShieldCheck,
    accent: 'bg-blue-50 text-htech-blue border-blue-200',
    stat: 'Safe Campuses',
  },
  {
    title: 'Refurbished computers donated to bridge the digital divide',
    description:
      'Testing, upgrading, and donating complete desktop computer systems to rural classrooms and community learning centers so village youth gain hands-on digital literacy.',
    icon: Monitor,
    accent: 'bg-purple-50 text-purple-600 border-purple-200',
    stat: 'Digital Literacy',
  },
  {
    title: 'Helping IT dealers start and grow their own business',
    description:
      'Mentoring aspiring computer technicians and first-generation entrepreneurs with wholesale guidance, honest allocation, and steady post-sales backing.',
    icon: Briefcase,
    accent: 'bg-teal-50 text-htech-teal border-teal-200',
    stat: 'Dealer Empowerment',
  },
];

export default function CharityPage() {
  const dispatch = useDispatch();
  const { charityPhotos, settings } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchCharity());
  }, [dispatch]);

  const handleOpenLightbox = (index) => {
    dispatch(
      openLightbox({
        images: charityPhotos.map((p) => ({
          url: p.image,
          caption: p.caption,
        })),
        index,
      })
    );
  };

  return (
    <div className="bg-white text-[#1D1D1F] min-h-screen">
      <SEO
        title="H-Tech Charity: Small Steps, Big Impact"
        description="Discover H-Tech Charity initiatives in Karad: Diwali food distribution to 108 families, rural school supplies, free school CCTV, and computer donations."
        path="/charity"
      />

      {/* Hero Banner on White */}
      <section className="bg-white border-b border-black/[0.06] py-16 sm:py-22">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[#0E9AA7] text-xs font-bold uppercase tracking-widest">
            <HeartHandshake className="w-4 h-4" />
            <span>Community & Social Responsibility</span>
          </span>
          <h1 className="heading-hero text-[#1D1D1F]">
            H-Tech Charity: Small Steps, Big Impact
          </h1>
          <p className="text-base sm:text-xl text-[#86868B] max-w-3xl mx-auto leading-relaxed">
            {settings?.charityIntroText ||
              'At H-Tech Computer Wholesale, our responsibility extends far beyond supplying enterprise hardware. Through H-Tech Charity, every milestone we achieve fuels community upliftment across rural Maharashtra.'}
          </p>
        </div>
      </section>

      {/* 5 Core Impact Cards on White */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0E9AA7]">
            Our Five Pillars of Giving
          </span>
          <h2 className="heading-section text-[#1D1D1F] mt-2">
            Turning wholesale growth into grassroots change.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {IMPACT_INITIATIVES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="apple-bento-card p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className={`p-3.5 rounded-2xl border ${item.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white border border-black/[0.08] text-[#1D1D1F] text-xs font-semibold">
                      {item.stat}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] mb-2.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#86868B] leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-5 mt-6 border-t border-black/[0.06] flex items-center justify-between text-xs font-bold text-[#0E9AA7]">
                  <span>Pillar 0{idx + 1}</span>
                  <span>Ongoing Initiative</span>
                </div>
              </div>
            );
          })}

          {/* Summary Counter Card on White */}
          <div className="apple-bento-card p-7 flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-[#0E9AA7] text-xs font-bold uppercase tracking-wider mb-4">
                Measurable Impact
              </span>
              <div className="text-4xl sm:text-5xl font-bold text-[#0E9AA7] mb-2">
                <Counter end={108} suffix="+" />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">
                Families & Rural Classrooms Empowered
              </h3>
              <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
                Every order placed with H-Tech Computer Wholesale Karad directly supports our
                seasonal food drives, school safety installations, and digital literacy donations.
              </p>
            </div>
            <div className="pt-5 mt-6 border-t border-black/[0.06] text-xs font-bold uppercase tracking-wider text-[#0E9AA7]">
              Karad • Satara • Rural Maharashtra
            </div>
          </div>
        </div>
      </section>

      {/* Charity Photo Gallery on White (Zero Broken Images — Graceful Fallbacks) */}
      <section className="py-16 bg-white border-t border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0E9AA7]">
              Moments of Impact
            </span>
            <h2 className="heading-section text-[#1D1D1F] mt-1">Charity Photo Gallery</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {charityPhotos.map((photo, index) => (
              <button
                key={photo._id || index}
                type="button"
                onClick={() => handleOpenLightbox(index)}
                className="group text-left apple-bento-card overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-52 w-full bg-white overflow-hidden">
                  <img
                    src={optimizeImageUrl(photo.image, 700)}
                    alt={photo.caption}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/brand/logo-fallback.svg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs sm:text-sm font-semibold text-[#1D1D1F] leading-snug">
                    {photo.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Signature Statement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center bg-white">
        <blockquote className="apple-bento-card p-8 sm:p-12">
          <HeartHandshake className="w-10 h-10 text-[#0E9AA7] mx-auto mb-4" />
          <p className="text-xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight leading-snug">
            "At H-Tech Computer Wholesale, we don't just build networks — we build futures."
          </p>
          <footer className="mt-4 text-xs font-bold uppercase tracking-widest text-[#86868B]">
            H-Tech Charity • Karad, Maharashtra
          </footer>
        </blockquote>
      </section>
    </div>
  );
}

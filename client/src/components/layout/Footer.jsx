import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Send,
  Instagram,
  Facebook,
  Youtube,
  Share2,
  Radio,
  ArrowUpRight,
} from 'lucide-react';

export default function Footer() {
  const settings = useSelector((state) => state.content.settings);
  const branches = useSelector((state) => state.content.branches);

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

  const mobile = settings?.primaryMobile || headOffice.mobile || '+919371249568';
  const whatsappUrl = settings?.whatsappUrl || headOffice.whatsapp || 'https://wa.me/919372049568';
  const landline = settings?.landline || headOffice.landline || '02164228793';
  const email = settings?.email || headOffice.email || 'admin@htechcomputer.com';
  const mapUrl =
    settings?.socialLinks?.mapUrl ||
    headOffice.mapUrl ||
    'https://www.google.com/maps/search/?api=1&query=Sahyadri+Hospital+Old+Koyana+Bridge+Road+Warunji+Karad+415124';
  const channelUrl =
    settings?.whatsappChannelUrl || 'https://whatsapp.com/channel/0029VaHtechWholesaleKarad';

  const socialButtons = [
    { label: 'Call', href: `tel:${mobile}`, icon: Phone },
    { label: 'WhatsApp', href: whatsappUrl, icon: MessageCircle },
    {
      label: 'Telegram',
      href: settings?.socialLinks?.telegram || 'https://t.me/htechcomputerwholesale',
      icon: Send,
    },
    {
      label: 'Facebook',
      href: settings?.socialLinks?.facebook || 'https://facebook.com/htechcomputerwholesale',
      icon: Facebook,
    },
    {
      label: 'YouTube',
      href: settings?.socialLinks?.youtube || 'https://youtube.com/@htechcomputerwholesale',
      icon: Youtube,
    },
    {
      label: 'Pinterest',
      href: settings?.socialLinks?.pinterest || 'https://pinterest.com/htechcomputerwholesale',
      icon: Share2,
    },
    {
      label: 'Instagram',
      href: settings?.socialLinks?.instagram || 'https://instagram.com/htechcomputerwholesale',
      icon: Instagram,
    },
  ];

  return (
    <footer className="bg-[#303030] text-[#C7C7C7] border-t border-white/[0.08] pt-12 pb-10 text-[12px] leading-relaxed">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6">
        {/* Top Footnote Strip (Apple-style fine print) */}
        <div className="pb-6 mb-8 border-b border-white/[0.12] text-[11px] text-[#A3A3A3] space-y-2">
          <p>
            1. Wholesale dealer pricing is available upon direct verification via WhatsApp or at our
            Karad Head Office. All brand names, logos (HP, Dell, Lenovo, ASUS, Canon, Epson, NEED)
            are trademarks of their respective owners.
          </p>
          <p>
            {settings?.footerText ||
              'H-Tech Computer Wholesale — Premier IT hardware distributor in Karad, Maharashtra. Hardware brands for today. Intelligent software for tomorrow.'}
          </p>
        </div>

        {/* Multi-column Apple Directory Sitemap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-white/[0.12]">
          {/* Col 1: Brand & Broadcast Channel */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/brand/logo.png"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/brand/logo-fallback.svg';
                }}
                alt="H-Tech Computer Wholesale"
                className="h-8 w-auto"
              />
            </Link>

            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#3A3A3A] border border-white/[0.1] hover:border-[#8BBFD8]/50 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-[#1FA34A]/10 text-[#1FA34A] shrink-0">
                  <Radio className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-white group-hover:text-[#A9D5EA]">
                    Official WhatsApp Channel
                  </div>
                  <div className="text-[11px] text-[#B0B0B0] truncate">
                    {settings?.whatsappChannelTitle ||
                      'Laptop, Desktop Computer, Digital Gadgets, Mobiles Wholesale'}
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#A3A3A3] group-hover:text-[#A9D5EA] shrink-0" />
            </a>

            {/* 7 Social Icons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {socialButtons.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={s.label}
                    title={s.label}
                    className="p-2 rounded-full bg-[#3A3A3A] border border-white/[0.12] text-[#D0D0D0] hover:text-[#A9D5EA] hover:border-[#A9D5EA]/50 transition"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: Explore & Sitemap */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-[12px] font-semibold text-white">Explore H-Tech</h3>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link to="/" className="hover:text-white hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white hover:underline">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-white hover:underline">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link to="/customers" className="hover:text-white hover:underline">
                  Our Customers
                </Link>
              </li>
              <li>
                <Link to="/tech-updates" className="hover:text-white hover:underline">
                  Latest Tech Updates
                </Link>
              </li>
              <li>
                <Link to="/charity" className="hover:text-white hover:underline">
                  H-Tech Charity
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:underline">
                  About H-Tech
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:underline">
                  Contact & Branches
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Digital Wings */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-[12px] font-semibold text-white">Digital Wings</h3>
            <ul className="space-y-2.5 text-[12px]">
              <li>
                <Link to="/hardware-brands" className="hover:text-white hover:underline block">
                  <span className="font-medium text-[#E5E5E5]">Hardware Brands (NEED)</span>
                  <span className="block text-[11px] text-[#A3A3A3]">
                    Discover NEED & future H-Tech hardware
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/ai-software" className="hover:text-white hover:underline block">
                  <span className="font-medium text-[#E5E5E5]">AI & Software Division</span>
                  <span className="block text-[11px] text-[#A3A3A3]">
                    Einstein Team technology & software
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/web-development" className="hover:text-white hover:underline block">
                  <span className="font-medium text-[#E5E5E5]">Website Development</span>
                  <span className="block text-[11px] text-[#A3A3A3]">
                    Professional websites, PWAs & digital experiences
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Head Office Karad */}
          <div className="lg:col-span-3 space-y-2">
            <h3 className="text-[12px] font-semibold text-white">Head Office — Karad</h3>
            <div className="space-y-1.5 text-[12px]">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B0B0B0] shrink-0 mt-1" />
                <span>{headOffice.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B0B0B0] shrink-0" />
                <a href={`tel:${mobile}`} className="hover:text-white hover:underline">
                  Mob: {mobile}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B0B0B0] shrink-0" />
                <a href={`tel:${landline}`} className="hover:text-white hover:underline">
                  Landline: {landline}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-[#1FA34A] shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline"
                >
                  WhatsApp: +91 93720 49568
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B0B0B0] shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white hover:underline break-all"
                >
                  {email}
                </a>
              </p>
              <div className="pt-1">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[12px] text-[#A9D5EA] hover:text-white hover:underline font-medium"
                >
                  <span>Find us on Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Line */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#A3A3A3]">
          <p>
            Copyright © {new Date().getFullYear()} H-Tech Computer Wholesale, Karad (Maharashtra).
            All rights reserved.
          </p>
          <p>India (Maharashtra • PIN 415124)</p>
        </div>
      </div>
    </footer>
  );
}

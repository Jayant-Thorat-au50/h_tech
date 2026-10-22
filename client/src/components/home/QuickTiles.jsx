import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PhoneCall,
  Package,
  Users,
  Sparkles,
  Newspaper,
  HeartHandshake,
  ChevronRight,
} from 'lucide-react';

const TILES = [
  {
    eyebrow: 'Connect & Branches',
    title: 'H-Tech Contacts',
    subtitle: 'Call | WhatsApp | Connect',
    detail: 'Head Office | Branches | Get in Touch',
    badges: ['Call', 'WhatsApp', 'Instagram', 'Facebook', 'YouTube'],
    to: '/contact',
    icon: PhoneCall,
    accentHex: '#6B6258',
    chipBg: 'bg-[#6B6258]',
    eyebrowColor: 'text-[#6B6258]',
    glowGradient: 'from-[#6B6258]/8 via-transparent to-transparent',
  },
  {
    eyebrow: 'Authorized Wholesale',
    title: 'Product Gallery',
    subtitle: 'Laptops, Desktops, Printers & More',
    detail: 'Browse authorized hardware & enquire for dealer pricing',
    badges: ['HP', 'Dell', 'Lenovo', 'ASUS', 'Canon', 'Epson', 'Need'],
    to: '/products',
    icon: Package,
    accentHex: '#5B9DBB',
    chipBg: 'bg-[#5B9DBB]',
    eyebrowColor: 'text-[#5B9DBB]',
    glowGradient: 'from-[#5B9DBB]/8 via-transparent to-transparent',
  },
  {
    eyebrow: 'Partner Network',
    title: 'Our Customers',
    subtitle: 'Photo Gallery',
    detail: 'Bulk deliveries, institutional labs & happy dealer partners',
    badges: ['Dealer Network', 'Lab Setups', 'Partner Meetups'],
    to: '/customers',
    icon: Users,
    accentHex: '#9B8067',
    chipBg: 'bg-[#9B8067]',
    eyebrowColor: 'text-[#9B8067]',
    glowGradient: 'from-[#9B8067]/8 via-transparent to-transparent',
  },
  {
    eyebrow: 'Limited-Period Schemes',
    title: 'Special Offer',
    subtitle: 'Best Deals | New Launches | Seasonal Offers',
    detail: 'Exclusive carton slabs, festive schemes & solar promos',
    badges: ['Best Deals', 'New Launches', 'Seasonal Offers'],
    to: '/offers',
    icon: Sparkles,
    accentHex: '#A47C52',
    chipBg: 'bg-[#A47C52]',
    eyebrowColor: 'text-[#A47C52]',
    glowGradient: 'from-[#A47C52]/10 via-transparent to-transparent',
  },
  {
    eyebrow: 'Broadcast & Portals',
    title: 'Latest Tech Updates',
    subtitle: 'Channel & Industry Feed',
    detail: 'WhatsApp Channel, Tech News, Product Updates, Useful Links',
    badges: ['WhatsApp Channel', 'Tech News', 'Product Updates', 'Useful Links'],
    to: '/tech-updates',
    icon: Newspaper,
    accentHex: '#77808A',
    chipBg: 'bg-[#77808A]',
    eyebrowColor: 'text-[#68727C]',
    glowGradient: 'from-[#77808A]/8 via-transparent to-transparent',
  },
  {
    eyebrow: 'Community Initiative',
    title: 'H-Tech Charity',
    subtitle: 'Small Steps Big Impact',
    detail: 'Food drives, rural school supplies, free CCTV & digital literacy',
    badges: ['108 Families', 'Rural Schools', 'Free CCTV', 'Digital Divide'],
    to: '/charity',
    icon: HeartHandshake,
    accentHex: '#78917E',
    chipBg: 'bg-[#78917E]',
    eyebrowColor: 'text-[#68816E]',
    glowGradient: 'from-[#78917E]/8 via-transparent to-transparent',
  },
];

export default function QuickTiles() {
  return (
    <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto bg-white">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="apple-eyebrow mb-1.5">The H-Tech Ecosystem</p>
        <h2 className="heading-section text-[#1D1D1F]">
          All the ways to experience H-Tech.
        </h2>
        <p className="text-sm sm:text-base text-[#86868B] mt-2 font-normal">
          Explore our wholesale catalog, active dealer schemes, community initiatives, and Karad
          Head Office desk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TILES.map((tile, idx) => {
          const Icon = tile.icon;
          return (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                to={tile.to}
                className="group relative overflow-hidden apple-bento-card p-6 sm:p-7 flex flex-col justify-between min-h-[240px] h-full"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tile.glowGradient} opacity-75 group-hover:opacity-100 transition`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${tile.chipBg} text-white flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="inline-flex items-center gap-0.5 text-[12px] font-medium text-[#8B6F54] group-hover:underline">
                      <span>Open</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>

                  <div className={`text-[12px] font-medium ${tile.eyebrowColor} mb-1`}>
                    {tile.eyebrow}
                  </div>

                  <h3 className="heading-card text-[#1D1D1F] mb-1">
                    {tile.title}
                  </h3>

                  <p className="text-[13px] font-medium text-[#1D1D1F]/80 mb-1">
                    {tile.subtitle}
                  </p>

                  <p className="text-[12px] text-[#86868B] leading-relaxed">{tile.detail}</p>
                </div>

                <div className="relative z-10 flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-black/[0.06]">
                  {tile.badges.map((b) => (
                    <span
                      key={b}
                      className="px-2.5 py-0.5 rounded-full bg-white border border-black/[0.08] text-[11px] font-medium text-[#1D1D1F]/75"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

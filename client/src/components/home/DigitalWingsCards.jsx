import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Sparkles, Globe, ChevronRight } from 'lucide-react';

const WINGS = [
  {
    badge: 'Division 01',
    title: 'Hardware Brands',
    subtitle: 'Discover Need and future H-Tech hardware brands',
    detail:
      'Proprietary cabinets, surge-protected power units, wireless keyboards, optical mice, and CCTV peripherals engineered for Indian conditions.',
    to: '/hardware-brands',
    icon: Cpu,
    accentText: 'text-[#78917E]',
    iconBg: 'bg-[#78917E] text-white',
    topBar: 'bg-[#78917E]',
  },
  {
    badge: 'Division 02',
    title: 'AI & Software',
    subtitle: 'Enter the Einstein Team technology and software division',
    detail:
      'Intelligent business automation, custom enterprise software, AI-assisted dealer workflows, and smart analytics built by the Einstein Team.',
    to: '/ai-software',
    icon: Sparkles,
    accentText: 'text-[#9B8067]',
    iconBg: 'bg-[#9B8067] text-white',
    topBar: 'bg-[#9B8067]',
  },
  {
    badge: 'Division 03',
    title: 'Website Development',
    subtitle: 'Professional websites, web apps and digital experiences',
    detail:
      'High-conversion corporate websites, progressive web apps, dealer catalogs, and custom web platforms crafted with clean design.',
    to: '/web-development',
    icon: Globe,
    accentText: 'text-[#5B9DBB]',
    iconBg: 'bg-[#5B9DBB] text-white',
    topBar: 'bg-[#5B9DBB]',
  },
];

export default function DigitalWingsCards() {
  return (
    <section className="py-14 sm:py-16 bg-white text-[#1D1D1F] border-t border-black/[0.06] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="apple-eyebrow mb-1.5">H-Tech Pro Ecosystem</p>
          <h2 className="heading-section text-[#1D1D1F] mb-2">
            Explore H-Tech's New Digital Wings.
          </h2>
          <p className="text-sm sm:text-base text-[#86868B] font-normal">
            Hardware brands for today. Intelligent software for tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {WINGS.map((wing, idx) => {
            const Icon = wing.icon;
            return (
              <motion.div
                key={wing.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  to={wing.to}
                  className="group relative overflow-hidden apple-bento-card p-6 sm:p-7 flex flex-col justify-between min-h-[260px] h-full"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-[12px] font-medium text-[#86868B]">
                        {wing.badge}
                      </span>
                      <div className={`p-2.5 rounded-xl shadow-sm ${wing.iconBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="heading-card text-[#1D1D1F] mb-1.5">
                      {wing.title}
                    </h3>
                    <p className={`text-[13px] font-medium ${wing.accentText} mb-2`}>
                      {wing.subtitle}
                    </p>
                    <p className="text-[12.5px] text-[#86868B] leading-relaxed">{wing.detail}</p>
                  </div>

                  <div className="relative z-10 pt-4 mt-5 border-t border-black/[0.06] flex items-center justify-between text-[12px] font-medium text-[#8B6F54] group-hover:underline">
                    <span>Learn more</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

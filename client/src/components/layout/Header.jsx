import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Cpu,
  Sparkles,
  Globe,
  MessageCircle,
  ChevronRight,
  KeyRound,
} from 'lucide-react';
import { setMobileMenuOpen, toggleMobileMenu } from '../../features/uiSlice.js';
import { buildWhatsAppUrl } from '../../utils/whatsapp.js';

const DIGITAL_WINGS_LINKS = [
  {
    name: 'Hardware Brands',
    path: '/hardware-brands',
    desc: 'Discover Need and future H-Tech hardware brands',
    icon: Cpu,
    accent: 'text-[#0E9AA7] bg-[#0E9AA7]/10',
  },
  {
    name: 'AI & Software',
    path: '/ai-software',
    desc: 'Enter the Einstein Team technology and software division',
    icon: Sparkles,
    accent: 'text-[#8B6F54] bg-[#8B6F54]/10',
  },
  {
    name: 'Website Development',
    path: '/web-development',
    desc: 'Professional websites, PWAs and digital experiences',
    icon: Globe,
    accent: 'text-[#6B6258] bg-[#6B6258]/10',
  },
];

const MAIN_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Offers', path: '/offers' },
  { name: 'Customers', path: '/customers' },
  { name: 'Tech Updates', path: '/tech-updates' },
  { name: 'Charity', path: '/charity' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
  const settings = useSelector((state) => state.content.settings);
  const adminEntryPath = import.meta.env.DEV ? '/admin' : '/admin/login';

  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileWingsOpen, setMobileWingsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    dispatch(setMobileMenuOpen(false));
    setDropdownOpen(false);
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const whatsappHref = buildWhatsAppUrl(
    'Hello H-Tech Computer Wholesale (Karad), I would like to enquire about wholesale dealer products.',
    settings?.whatsappNumber || '919372049568'
  );

  const isDigitalWingsActive = ['/hardware-brands', '/ai-software', '/web-development'].includes(
    location.pathname
  );

  return (
    <header
      className={`sticky top-0 z-40 bg-[#FAF9F6]/95 apple-glass-nav transition-all duration-300 ${
        scrolled ? 'h-16 shadow-sm' : 'h-20'
      }`}
    >
      <div className="max-w-[1280px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center shrink-0 focus:outline-none opacity-95 hover:opacity-100 transition"
          aria-label="H-Tech Computer Wholesale Home"
        >
          <img
            src="/brand/logo.png"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/brand/logo-fallback.svg';
            }}
            alt="H-Tech Computer Wholesale"
            className={`w-auto transition-all duration-300 ${scrolled ? 'h-9' : 'h-11'}`}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-5" aria-label="Main Navigation">
          {MAIN_LINKS.slice(0, 4).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `text-[13px] xl:text-sm tracking-[-0.01em] transition-colors ${
                  isActive
                    ? 'text-[#8B6F54] font-semibold'
                    : 'text-[#45413C] hover:text-[#8B6F54] font-medium'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Digital Wings Flyout */}
          <div
            ref={dropdownRef}
            className="relative py-2"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 text-[13px] xl:text-sm tracking-[-0.01em] transition-colors ${
                isDigitalWingsActive
                  ? 'text-[#8B6F54] font-semibold'
                  : 'text-[#45413C] hover:text-[#8B6F54] font-medium'
              }`}
            >
              <span>Digital Wings</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[360px] z-50">
                <div className="rounded-[24px] bg-white border border-black/[0.08] shadow-glass-lg p-3.5 space-y-1.5">
                  <div className="px-3 py-1.5 text-xs font-semibold text-[#86868B]">
                    Explore H-Tech's Digital Wings
                  </div>
                  {DIGITAL_WINGS_LINKS.map((wing) => {
                    const Icon = wing.icon;
                    return (
                      <Link
                        key={wing.path}
                        to={wing.path}
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#F5F5F7] transition group"
                      >
                        <div className={`p-2.5 rounded-xl shrink-0 ${wing.accent}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-[13px] font-semibold text-[#34312D] group-hover:text-[#8B6F54]">
                            <span>{wing.name}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                          </div>
                          <p className="text-xs text-[#86868B] leading-snug mt-0.5">
                            {wing.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {MAIN_LINKS.slice(4).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-[13px] xl:text-sm tracking-[-0.01em] transition-colors ${
                  isActive
                    ? 'text-[#8B6F54] font-semibold'
                    : 'text-[#45413C] hover:text-[#8B6F54] font-medium'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Right WhatsApp Pill CTA & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <Link
            to={adminEntryPath}
            className="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-[#8B6F54]/25 px-3 py-2 text-[11px] font-semibold text-[#6B6258] transition hover:border-[#8B6F54]/50 hover:bg-white/70 hover:text-[#8B6F54]"
          >
            <KeyRound className="h-4 w-4" />
            <span>Admin Sign In</span>
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#1FA34A] hover:bg-[#198A3E] text-white text-xs font-semibold shadow-sm transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => dispatch(toggleMobileMenu())}
            className="lg:hidden p-2 rounded-full text-[#45413C] hover:bg-black/5 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Curtain Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="lg:hidden fixed inset-x-0 top-16 bottom-0 h-[calc(100dvh-64px)] bg-[#F4F1EC] z-50 overflow-y-auto px-6 sm:px-8 py-6 sm:py-8 flex flex-col justify-between"
        >
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8B6F54]">
              Explore H-Tech
            </p>
            <motion.div
              className="border-t border-[#D8D1C8]"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
              }}
            >
            {MAIN_LINKS.slice(0, 4).map((item, index) => (
              <motion.div
                key={item.path}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-4 border-b border-[#D8D1C8] py-3.5 transition-colors ${
                      isActive ? 'text-[#8B6F54]' : 'text-[#303030] hover:text-[#8B6F54]'
                    }`
                  }
                >
                  <span className="w-5 text-[10px] font-medium tabular-nums tracking-[0.12em] text-[#8B6F54]/75">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[18px] font-medium tracking-[-0.035em]">{item.name}</span>
                </NavLink>
              </motion.div>
            ))}

            {/* Mobile Accordion for Digital Wings */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="border-b border-[#D8D1C8] py-3.5"
            >
              <button
                type="button"
                onClick={() => setMobileWingsOpen((prev) => !prev)}
                aria-expanded={mobileWingsOpen}
                className={`w-full flex items-center justify-between text-left transition-colors ${
                  isDigitalWingsActive ? 'text-[#8B6F54]' : 'text-[#303030] hover:text-[#8B6F54]'
                }`}
              >
                <span className="flex items-center gap-4">
                  <span className="w-5 text-[10px] font-medium tabular-nums tracking-[0.12em] text-[#8B6F54]/75">
                    05
                  </span>
                  <span className="text-[18px] font-medium tracking-[-0.035em]">Digital Wings</span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#8B6F54] transition-transform ${
                    mobileWingsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileWingsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="ml-9 mt-3 space-y-1 overflow-hidden border-l border-[#B9AA98] pl-4"
                >
                  {DIGITAL_WINGS_LINKS.map((wing, index) => (
                    <Link key={wing.path} to={wing.path} className="group flex items-start gap-3 py-2">
                      <span className="mt-1 text-[9px] font-medium tabular-nums text-[#8B6F54]/70">
                        0{index + 1}
                      </span>
                      <span>
                        <span className="block text-[14px] font-medium tracking-[-0.02em] text-[#303030] group-hover:text-[#8B6F54]">
                          {wing.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-relaxed text-[#737373]">
                          {wing.desc}
                        </span>
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {MAIN_LINKS.slice(4).map((item, index) => (
              <motion.div
                key={item.path}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 border-b border-[#D8D1C8] py-3.5 transition-colors ${
                      isActive ? 'text-[#8B6F54]' : 'text-[#303030] hover:text-[#8B6F54]'
                    }`
                  }
                >
                  <span className="w-5 text-[10px] font-medium tabular-nums tracking-[0.12em] text-[#8B6F54]/75">
                    {String(index + 6).padStart(2, '0')}
                  </span>
                  <span className="text-[18px] font-medium tracking-[-0.035em]">{item.name}</span>
                </NavLink>
              </motion.div>
            ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.2, ease: 'easeOut' }}
            className="pt-6 mt-8 border-t border-[#D8D1C8] space-y-3"
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#1FA34A] text-white font-semibold text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat on Business WhatsApp</span>
            </a>
            <Link
              to={adminEntryPath}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full border border-[#303030]/15 bg-white text-[#303030] font-semibold text-sm transition hover:border-[#8B6F54]/50 hover:text-[#8B6F54]"
            >
              <KeyRound className="w-5 h-5" />
              <span>Admin Sign In</span>
            </Link>
            <p className="text-center text-xs text-[#4B5563]">
              H-Tech Computer Wholesale • Warunji, Karad – 415124
            </p>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

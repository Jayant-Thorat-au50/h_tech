import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/whatsapp.js';

export default function FloatingActions() {
  const settings = useSelector((state) => state.content.settings);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 360);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const whatsappHref = buildWhatsAppUrl(
    'Hello H-Tech Computer Wholesale (Karad), I am browsing your website and would like dealer pricing details.',
    settings?.whatsappNumber || '919372049568'
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {showTop && (
        <button
          type="button"
          aria-label="Scroll back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-glass-lg border border-white/15 backdrop-blur transition"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-2.5 pl-4 pr-4 py-3.5 rounded-full bg-htech-green hover:bg-emerald-600 text-white font-bold text-sm shadow-glass-lg transition transform hover:-translate-y-0.5"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">WhatsApp Us</span>
      </a>
    </div>
  );
}

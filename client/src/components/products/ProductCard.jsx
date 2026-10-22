import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Heart, MessageCircle, Phone, ShieldCheck } from 'lucide-react';

export default function ProductCard({ product, imageUrl, whatsappHref, mobileNumber }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const hasPrice = Number.isFinite(product.price);

  return (
    <article className="apple-bento-card p-5 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)_220px] gap-5 md:gap-7 items-center">
        <div className="relative">
          <Link
            to={`/products/${product.slug}`}
            aria-label={`View ${product.name}`}
            className="flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-white p-3"
          >
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = '/brand/logo-fallback.svg';
              }}
              className="max-h-full w-auto object-contain transition-transform duration-500 hover:scale-105"
            />
          </Link>
          <button
            type="button"
            onClick={() => setIsWishlisted((current) => !current)}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={isWishlisted}
            className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#86868B] shadow-sm transition hover:text-rose-500"
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="font-semibold text-[#0071E3]">{product.brand?.name || 'H-Tech'}</span>
            <span className="text-[#86868B]">·</span>
            <span className="text-[#86868B]">{product.category?.name || 'IT Hardware'}</span>
          </div>

          <Link to={`/products/${product.slug}`}>
            <h2 className="heading-card mb-2 text-[#1D1D1F] transition hover:text-[#0071E3]">
              {product.name}
            </h2>
          </Link>

          {product.shortDescription && (
            <p className="mb-3 text-[13px] leading-relaxed text-[#86868B]">
              {product.shortDescription}
            </p>
          )}

          {(product.specs || []).length > 0 && (
            <ul className="space-y-1.5">
              {product.specs.slice(0, 5).map((spec, index) => (
                <li key={`${spec}-${index}`} className="flex items-start gap-2 text-[12px] text-[#1D1D1F]/85">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1FA34A]" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          )}

          {product.warrantyNote && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#52665a]">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#1FA34A]" />
              {product.warrantyNote}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-black/[0.06] pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
          <p className="text-xl font-semibold text-[#1D1D1F]">
            {hasPrice ? `₹${product.price.toLocaleString('en-IN')}` : 'Enquire for dealer pricing'}
          </p>
          <Link
            to={`/products/${product.slug}`}
            className="apple-link inline-flex items-center text-xs"
          >
            <span>Full specs</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0071E3] px-3 py-2.5 text-xs font-medium text-white transition hover:bg-[#0077ED]"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Enquire on WhatsApp</span>
          </a>
          <a
            href={`tel:${mobileNumber}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#F5F5F7] px-3 py-2.5 text-xs font-medium text-[#1D1D1F] transition hover:bg-[#E8E8ED]"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Call</span>
          </a>
        </div>
      </div>
    </article>
  );
}

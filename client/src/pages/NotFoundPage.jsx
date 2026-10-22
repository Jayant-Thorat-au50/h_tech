import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Package } from 'lucide-react';
import SEO from '../components/shared/SEO.jsx';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="404 — Page Not Found" noindex />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center rounded-3xl bg-white border border-slate-200/90 shadow-glass-lg p-8 sm:p-12 space-y-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 text-htech-red font-extrabold text-2xl">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-htech-navy">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            The page you are looking for might have been moved or does not exist. Use the links
            below to return to H-Tech Computer Wholesale.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-htech-navy hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition"
            >
              <Package className="w-4 h-4" />
              <span>Browse Product Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

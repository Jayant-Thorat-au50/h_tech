import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({
  title,
  description = 'H-Tech Computer Wholesale (Karad, Maharashtra) — Trusted distributor of HP, Dell, Lenovo, ASUS, Canon, Epson, NEED hardware, AI software & web experiences.',
  path = '/',
  noindex = false,
}) {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://htechcomputer.com';
  const fullTitle = title
    ? `${title} | H-Tech Computer Wholesale Karad`
    : 'H-Tech Computer Wholesale — Technology, Wholesale — Delivered with Trust (Karad)';
  const canonicalUrl = `${siteUrl.replace(/\/$/, '')}${path}`;

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    name: 'H-Tech Computer Wholesale',
    description,
    url: siteUrl,
    telephone: '+919371249568',
    email: 'admin@htechcomputer.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        "Swami-Amal-Dutta' Bunglow, Besides 'Sahyadri' Hospital, Old Koyana Bridge Road, Warunji",
      addressLocality: 'Karad',
      addressRegion: 'Maharashtra',
      postalCode: '415124',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://wa.me/919372049568',
      'https://instagram.com/htechcomputerwholesale',
      'https://facebook.com/htechcomputerwholesale',
      'https://youtube.com/@htechcomputerwholesale',
    ],
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="H-Tech Computer Wholesale" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {!noindex && (
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      )}
    </Helmet>
  );
}

import { Product } from '../models/Product.js';
import { env } from '../config/env.js';

const STATIC_ROUTES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/products', priority: '0.9', changefreq: 'daily' },
  { url: '/offers', priority: '0.9', changefreq: 'daily' },
  { url: '/customers', priority: '0.8', changefreq: 'weekly' },
  { url: '/contact', priority: '0.9', changefreq: 'monthly' },
  { url: '/charity', priority: '0.7', changefreq: 'monthly' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/hardware-brands', priority: '0.8', changefreq: 'weekly' },
  { url: '/ai-software', priority: '0.8', changefreq: 'weekly' },
  { url: '/web-development', priority: '0.8', changefreq: 'weekly' },
  { url: '/tech-updates', priority: '0.8', changefreq: 'daily' },
];

export const getSitemapXml = async (_req, res, next) => {
  try {
    const baseUrl = (env.CLIENT_URL.split(',')[0] || 'https://htechcomputer.com').replace(/\/$/, '');
    const products = await Product.find({ isActive: true }).select('slug updatedAt');

    const staticUrls = STATIC_ROUTES.map(
      (route) => `
  <url>
    <loc>${baseUrl}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    ).join('');

    const productUrls = products
      .map(
        (p) => `
  <url>
    <loc>${baseUrl}/products/${p.slug}</loc>
    <lastmod>${new Date(p.updatedAt || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      )
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${productUrls}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
};

export const getRobotsTxt = (_req, res) => {
  const baseUrl = (env.CLIENT_URL.split(',')[0] || 'https://htechcomputer.com').replace(/\/$/, '');
  const txt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(txt);
};

import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Brand } from '../models/Brand.js';
import { Product } from '../models/Product.js';
import { Offer } from '../models/Offer.js';
import { CustomerPhoto } from '../models/CustomerPhoto.js';
import { CharityPhoto } from '../models/CharityPhoto.js';
import { Branch } from '../models/Branch.js';
import { TechUpdate } from '../models/TechUpdate.js';
import { Enquiry } from '../models/Enquiry.js';
import { SiteSettings } from '../models/SiteSettings.js';

// Helper to create crisp SVG Data-URI flyers/logos so zero external URLs ever break offline or online
const createSvgDataUri = (svgString) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;

const makeBrandLogoSvg = (label, bg, fg = '#ffffff', sub = '') =>
  createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 140" width="320" height="140">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bg}" />
          <stop offset="100%" stop-color="#0B132B" />
        </linearGradient>
      </defs>
      <rect width="320" height="140" rx="24" fill="url(#bg)" />
      <text x="160" y="${sub ? '76' : '86'}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="40" fill="${fg}" letter-spacing="1.5">${label}</text>
      ${
        sub
          ? `<text x="160" y="108" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="600" font-size="13" fill="#93C5FD" letter-spacing="2">${sub}</text>`
          : ''
      }
    </svg>
  `);

const makeProductFlyerSvg = ({ badge, brand, title, subtitle, specs, accent = '#2F7BEA', darkBg = '#0B132B' }) =>
  createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 640" width="800" height="640">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${darkBg}" />
          <stop offset="55%" stop-color="#111C38" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
        <linearGradient id="screen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#06B6D4" />
        </linearGradient>
      </defs>
      <rect width="800" height="640" rx="32" fill="url(#g)" />
      <circle cx="680" cy="120" r="190" fill="${accent}" opacity="0.18" />
      <circle cx="120" cy="540" r="160" fill="#38BDF8" opacity="0.12" />
      <!-- Header Pill -->
      <rect x="48" y="42" width="210" height="38" rx="19" fill="${accent}" />
      <text x="153" y="66" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="14" fill="#ffffff" letter-spacing="1.2">${badge}</text>
      <text x="752" y="68" text-anchor="end" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="22" fill="#E2E8F0">${brand}</text>

      <!-- Hardware Illustration -->
      <g transform="translate(430, 150)">
        <rect x="20" y="10" width="280" height="185" rx="14" fill="#1E293B" stroke="#94A3B8" stroke-width="4" />
        <rect x="32" y="22" width="256" height="161" rx="8" fill="url(#screen)" />
        <text x="160" y="96" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="24" fill="#ffffff">${brand}</text>
        <text x="160" y="124" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="600" font-size="13" fill="#E0F2FE">H-TECH WHOLESALE KARAD</text>
        <path d="M0 196 L320 196 L345 218 L-25 218 Z" fill="#CBD5E1" />
        <rect x="125" y="198" width="70" height="7" rx="3" fill="#64748B" />
      </g>

      <!-- Flyer Typography -->
      <text x="48" y="145" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="34" fill="#ffffff">${title}</text>
      <text x="48" y="182" font-family="Inter, Arial, sans-serif" font-weight="600" font-size="18" fill="#93C5FD">${subtitle}</text>

      <!-- Spec Pills -->
      <g transform="translate(48, 220)">
        ${specs
          .slice(0, 5)
          .map(
            (s, idx) => `
          <rect x="0" y="${idx * 54}" width="355" height="44" rx="10" fill="#1E293B" fill-opacity="0.82" stroke="#334155" stroke-width="1.5" />
          <circle cx="22" cy="${idx * 54 + 22}" r="6" fill="#38BDF8" />
          <text x="40" y="${idx * 54 + 27}" font-family="Inter, Arial, sans-serif" font-weight="600" font-size="15" fill="#F8FAFC">${s}</text>
        `
          )
          .join('')}
      </g>

      <!-- Footer Banner -->
      <rect x="48" y="535" width="704" height="64" rx="16" fill="#0F172A" stroke="#334155" stroke-width="1.5" />
      <text x="74" y="573" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="18" fill="#F8FAFC">H-Tech Computer Wholesale • Karad</text>
      <text x="726" y="573" text-anchor="end" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="16" fill="#4ADE80">Enquire for Dealer Pricing →</text>
    </svg>
  `);

const makeSceneSvg = (title, subtitle, c1, c2, badge = 'H-TECH KARAD') =>
  createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="100%" stop-color="${c2}" />
        </linearGradient>
      </defs>
      <rect width="900" height="600" rx="28" fill="url(#bg)" />
      <circle cx="760" cy="130" r="220" fill="#ffffff" opacity="0.08" />
      <circle cx="140" cy="480" r="180" fill="#ffffff" opacity="0.06" />
      <rect x="60" y="60" width="220" height="42" rx="21" fill="#ffffff" fill-opacity="0.16" />
      <text x="170" y="87" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="14" fill="#ffffff" letter-spacing="1.5">${badge}</text>
      <text x="60" y="320" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="42" fill="#ffffff">${title}</text>
      <text x="60" y="370" font-family="Inter, Arial, sans-serif" font-weight="500" font-size="22" fill="#E2E8F0">${subtitle}</text>
      <text x="60" y="530" font-family="Inter, Arial, sans-serif" font-weight="600" font-size="16" fill="#CBD5E1">H-Tech Computer Wholesale • Warunji, Karad – 415124</text>
    </svg>
  `);

export const seedDatabase = async ({ clearExisting = true } = {}) => {
  if (env.NODE_ENV !== 'test') {
    throw new Error('Demo seed data is restricted to the automated test environment.');
  }

  if (clearExisting) {
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Product.deleteMany({}),
      Offer.deleteMany({}),
      CustomerPhoto.deleteMany({}),
      CharityPhoto.deleteMany({}),
      Branch.deleteMany({}),
      TechUpdate.deleteMany({}),
      Enquiry.deleteMany({}),
      SiteSettings.deleteMany({}),
    ]);
  }

  // 1. Seed Admin User
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
  const adminUser = await User.create({
    name: env.ADMIN_NAME,
    email: env.ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    role: 'admin',
  });

  // 2. Seed Categories
  const categoriesData = [
    { name: 'Laptops', slug: 'laptops', order: 1 },
    { name: 'Desktops & All-in-Ones', slug: 'desktops-aio', order: 2 },
    { name: 'Printers & Scanners', slug: 'printers-scanners', order: 3 },
    { name: 'Monitors & Displays', slug: 'monitors-displays', order: 4 },
    { name: 'Networking & CCTV', slug: 'networking-cctv', order: 5 },
    { name: 'Computer Accessories', slug: 'accessories', order: 6 },
    { name: 'Solar & LED Solutions', slug: 'solar-led', order: 7 },
    { name: 'PC Components & Gaming', slug: 'pc-components-gaming', order: 8 },
  ];
  const categories = await Category.insertMany(categoriesData);
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

  // 3. Seed Brands (HP, Dell, Lenovo, ASUS, Canon, Epson, NEED)
  const brandsData = [
    {
      name: 'HP',
      slug: 'hp',
      logo: makeBrandLogoSvg('HP', '#0096D6', '#ffffff', 'AUTHORIZED WHOLESALE'),
      website: 'https://www.hp.com/in-en/home.html',
      description: 'Enterprise & business laptops, LaserJet printers, and commercial desktops.',
      isHardwareBrand: false,
      order: 1,
    },
    {
      name: 'Dell',
      slug: 'dell',
      logo: makeBrandLogoSvg('DELL', '#007DB8', '#ffffff', 'COMMERCIAL PARTNER'),
      website: 'https://www.dell.com/en-in',
      description: 'Latitude, Vostro & Inspiron notebooks, OptiPlex desktops, and UltraSharp monitors.',
      isHardwareBrand: false,
      order: 2,
    },
    {
      name: 'Lenovo',
      slug: 'lenovo',
      logo: makeBrandLogoSvg('LENOVO', '#E2231A', '#ffffff', 'THINK & IDEAPAD'),
      website: 'https://www.lenovo.com/in/en/',
      description: 'ThinkPad, ThinkBook, IdeaPad laptops and commercial Tiny desktops.',
      isHardwareBrand: false,
      order: 3,
    },
    {
      name: 'ASUS',
      slug: 'asus',
      logo: makeBrandLogoSvg('ASUS', '#00539B', '#ffffff', 'EXPERTBOOK & VIVOBOOK'),
      website: 'https://www.asus.com/in/',
      description: 'ExpertBook business series, VivoBook, TUF gaming laptops, and monitors.',
      isHardwareBrand: false,
      order: 4,
    },
    {
      name: 'Canon',
      slug: 'canon',
      logo: makeBrandLogoSvg('CANON', '#BC0024', '#ffffff', 'PIXMA & IMAGECLASS'),
      website: 'https://in.canon/',
      description: 'High-volume G-series ink tank printers, laser printers, and document scanners.',
      isHardwareBrand: false,
      order: 5,
    },
    {
      name: 'Epson',
      slug: 'epson',
      logo: makeBrandLogoSvg('EPSON', '#003399', '#ffffff', 'ECOTANK & POS'),
      website: 'https://www.epson.co.in/',
      description: 'EcoTank color printers, dot-matrix billing printers, and business projectors.',
      isHardwareBrand: false,
      order: 6,
    },
    {
      name: 'NEED',
      slug: 'need',
      logo: makeBrandLogoSvg('NEED', '#0E9AA7', '#ffffff', 'H-TECH HARDWARE BRAND'),
      website: '/hardware-brands',
      description:
        'Flagship H-Tech proprietary hardware brand delivering high-reliability cabinets, SMPS power supplies, keyboards, mice, cables, and CCTV accessories engineered for Indian conditions.',
      isHardwareBrand: true,
      order: 7,
    },
  ];
  const brands = await Brand.insertMany(brandsData);
  const brandMap = Object.fromEntries(brands.map((b) => [b.slug, b._id]));

  // 4. Seed Products (Flagship HP Laptop 250R G10 and clearly marked sample products)
  const productsData = [
    {
      name: 'HP Laptop 250R G10',
      slug: 'hp-laptop-250r-g10',
      brand: brandMap.hp,
      category: catMap['laptops'],
      shortDescription:
        'Commercial 15.6" FHD business laptop powered by Intel Core 5 / Core i5 14th Gen processor, 8GB DDR4 RAM, and 512GB NVMe SSD.',
      description:
        'Built for businesses, institutions, and IT dealers seeking dependable performance. The HP Laptop 250R G10 combines a thin-and-light dark ash silver chassis with 14th Generation Intel Core 5 / Core i5 processing power, super-fast 512GB PCIe NVMe storage, Wi-Fi 6 connectivity, and a crisp 15.6-inch Full HD LED anti-glare display.',
      specs: [
        'Intel Core 5 / Core i5 14th Gen Processor',
        '8GB DDR4 High-Speed RAM (Expandable)',
        '512GB PCIe NVMe M.2 SSD Storage',
        '15.6" FHD (1920 x 1080) LED Anti-Glare Display',
        '1080p FHD TrueVision Camera with Dual Array Mic',
        'Intel Wi-Fi 6 AX201 (2x2) and Bluetooth 5.3',
        'Spill-resistant full-size keyboard with numeric keypad',
        '1-Year On-Site Hardware Warranty',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'DEALER BESTSELLER',
            brand: 'HP',
            title: 'HP Laptop 250R G10',
            subtitle: 'Core 5 / Core i5 14th Gen • 15.6" FHD LED',
            specs: [
              'Core 5 / Core i5 14th Gen Processor',
              '8GB RAM • 512GB NVMe SSD',
              '15.6" FHD LED Anti-Glare Display',
              '1080p FHD Camera • Wi-Fi 6',
              '1-Year On-Site Hardware Warranty',
            ],
            accent: '#2F7BEA',
          }),
          publicId: 'seed_hp_250r_g10',
        },
      ],
      warrantyNote: '1-year on-site hardware warranty directly supported by HP India.',
      isFeatured: true,
      isActive: true,
      order: 1,
    },
    {
      name: 'Dell Vostro 3520 Business Laptop (Sample)',
      slug: 'dell-vostro-3520-business-laptop',
      brand: brandMap.dell,
      category: catMap['laptops'],
      shortDescription:
        '[Sample Catalog Item] 15.6" FHD 120Hz business notebook with Intel Core i5 12th Gen, 16GB RAM, and 512GB NVMe SSD.',
      description:
        'Sample wholesale catalog listing for Dell Vostro 3520. Ideal for corporate deployments, colleges, and retail resellers across Satara, Karad, and Sangli districts.',
      specs: [
        'Intel Core i5-1235U 12th Gen (up to 4.40 GHz)',
        '16GB DDR4 RAM',
        '512GB M.2 PCIe NVMe SSD',
        '15.6" FHD WVA 120Hz 250 nits Anti-Glare Display',
        'ExpressCharge (80% in 60 minutes) & TPM 2.0 Security',
        '1-Year Dell Onsite ProSupport Warranty',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'SAMPLE CATALOG ITEM',
            brand: 'DELL',
            title: 'Dell Vostro 3520',
            subtitle: 'Intel Core i5 12th Gen • 120Hz FHD Display',
            specs: [
              'Core i5-1235U 12th Gen Processor',
              '16GB DDR4 RAM • 512GB NVMe SSD',
              '15.6" FHD 120Hz Anti-Glare Display',
              'Hardware TPM 2.0 & ExpressCharge',
              '1-Year Dell Onsite Warranty',
            ],
            accent: '#007DB8',
          }),
          publicId: 'seed_dell_vostro_3520',
        },
      ],
      warrantyNote: '1-Year Dell Onsite Hardware Warranty.',
      isFeatured: true,
      isActive: true,
      order: 2,
    },
    {
      name: 'Lenovo ThinkBook 15 G5 IRL (Sample)',
      slug: 'lenovo-thinkbook-15-g5-irl',
      brand: brandMap.lenovo,
      category: catMap['laptops'],
      shortDescription:
        '[Sample Catalog Item] Anodized aluminum business laptop with 13th Gen Intel Core i5, 16GB RAM, 512GB SSD, and fingerprint reader.',
      description:
        'Sample wholesale catalog listing for Lenovo ThinkBook 15 G5. Features MIL-STD-810H durability, dual-SSD expansion slot, and thunderbolt connectivity.',
      specs: [
        'Intel Core i5-1335U 13th Gen Processor',
        '16GB DDR4 3200MHz RAM',
        '512GB PCIe Gen4 NVMe SSD',
        '15.6" FHD IPS 300-nits Anti-Glare Display',
        'Touch Style Fingerprint Reader on Power Button',
        'Wi-Fi 6E & Backlit Keyboard',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'SAMPLE CATALOG ITEM',
            brand: 'LENOVO',
            title: 'ThinkBook 15 G5',
            subtitle: '13th Gen Core i5 • Aluminum Chassis',
            specs: [
              'Intel Core i5-1335U 13th Gen',
              '16GB RAM • 512GB Gen4 NVMe SSD',
              '15.6" FHD IPS Anti-Glare Screen',
              'Fingerprint Reader & Backlit KB',
              '1-Year Lenovo Premier Support',
            ],
            accent: '#E2231A',
          }),
          publicId: 'seed_lenovo_thinkbook_15',
        },
      ],
      warrantyNote: '1-Year Lenovo Onsite Warranty.',
      isFeatured: true,
      isActive: true,
      order: 3,
    },
    {
      name: 'ASUS ExpertBook B1502CBA (Sample)',
      slug: 'asus-expertbook-b1502cba',
      brand: brandMap.asus,
      category: catMap['laptops'],
      shortDescription:
        '[Sample Catalog Item] Ultra-durable commercial laptop with 180° lay-flat hinge, Intel Core i3/i5 12th Gen, and enterprise ports.',
      description:
        'Sample wholesale catalog listing for ASUS ExpertBook B1. Engineered for educational institutions, banking correspondents, and enterprise field teams.',
      specs: [
        'Intel Core i5-1235U Processor',
        '8GB DDR4 RAM (Upgradable to 40GB)',
        '512GB M.2 NVMe PCIe 4.0 SSD',
        '15.6" FHD 16:9 Wide-View Anti-Glare Display',
        'US MIL-STD 810H Military-Grade Standard',
        'HD Camera with Physical Privacy Shutter',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'SAMPLE CATALOG ITEM',
            brand: 'ASUS',
            title: 'ExpertBook B1502',
            subtitle: 'Military-Grade Commercial Notebook',
            specs: [
              'Intel Core i5 12th Gen Processor',
              '8GB RAM • 512GB PCIe 4.0 SSD',
              '180° Lay-Flat Hinge • Privacy Shutter',
              'Full I/O: RJ45 LAN, HDMI, USB-C',
              '1-Year ASUS Commercial Warranty',
            ],
            accent: '#6B3FD4',
          }),
          publicId: 'seed_asus_expertbook',
        },
      ],
      warrantyNote: '1-Year ASUS Commercial Onsite Warranty.',
      isFeatured: false,
      isActive: true,
      order: 4,
    },
    {
      name: 'HP Pro Tower 280 G9 Commercial Desktop PC (Sample)',
      slug: 'hp-pro-tower-280-g9-desktop',
      brand: brandMap.hp,
      category: catMap['desktops-aio'],
      shortDescription:
        '[Sample Catalog Item] Complete commercial desktop bundle with Intel Core i5 13th Gen, 8GB RAM, 512GB NVMe SSD, and 19.5" HP Monitor.',
      description:
        'Sample wholesale listing for offices, schools, and computer labs. Ready for bulk institutional billing and dealer distribution.',
      specs: [
        'Intel Core i5-13500 13th Gen (14 Cores)',
        '8GB DDR4-3200 RAM (2 DIMM Slots)',
        '512GB PCIe NVMe M.2 SSD',
        'HP P204v 19.5" HD+ LED Backlit Monitor',
        'HP Wired USB Keyboard & Optical Mouse Included',
        '3-Year Onsite Commercial Desktop Warranty',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'SAMPLE CATALOG ITEM',
            brand: 'HP',
            title: 'HP Pro Tower 280 G9',
            subtitle: 'Commercial Desktop + Monitor Bundle',
            specs: [
              'Intel Core i5-13500 13th Gen',
              '8GB DDR4 RAM • 512GB NVMe SSD',
              '19.5" HP LED Monitor Included',
              'USB Wired Keyboard & Optical Mouse',
              '3-Year Onsite Hardware Warranty',
            ],
            accent: '#1FA34A',
          }),
          publicId: 'seed_hp_pro_tower_280',
        },
      ],
      warrantyNote: '3-Year HP Onsite Commercial Desktop Warranty.',
      isFeatured: true,
      isActive: true,
      order: 5,
    },
    {
      name: 'Canon PIXMA G3770 Wireless Ink Tank Printer (Sample)',
      slug: 'canon-pixma-g3770-ink-tank-printer',
      brand: brandMap.canon,
      category: catMap['printers-scanners'],
      shortDescription:
        '[Sample Catalog Item] All-in-One Wi-Fi refillable ink tank printer (Print, Scan, Copy) with ultra-low cost per page and LCD screen.',
      description:
        'Sample wholesale listing for Canon PIXMA G3770. High page yield up to 7,600 color pages and 6,000 mono pages, with easy user-replaceable maintenance cartridge.',
      specs: [
        'Functions: Wireless Print, Scan, Copy',
        'Print Speed: 11.0 ipm (Black) / 6.0 ipm (Colour)',
        '1.35" Square Monochrome LCD Display',
        'Wi-Fi, AirPrint, Mopria & Canon PRINT Inkjet/SELPHY App',
        'Spill-free GI-71 Ink Bottles Included in Box',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'SAMPLE CATALOG ITEM',
            brand: 'CANON',
            title: 'Canon PIXMA G3770',
            subtitle: 'All-in-One Wi-Fi Ink Tank Printer',
            specs: [
              'Print • Scan • Copy + Wi-Fi Direct',
              'Up to 6,000 Black / 7,600 Colour Pages',
              '1.35" Guided LCD Panel',
              'User-Replaceable Maintenance Cartridge',
              '1-Year Canon Onsite Warranty',
            ],
            accent: '#E0245E',
          }),
          publicId: 'seed_canon_g3770',
        },
      ],
      warrantyNote: '1-Year or 30,000 pages Canon India Onsite Warranty.',
      isFeatured: true,
      isActive: true,
      order: 6,
    },
    {
      name: 'Epson EcoTank L3250 Wi-Fi All-in-One Printer (Sample)',
      slug: 'epson-ecotank-l3250-wifi-printer',
      brand: brandMap.epson,
      category: catMap['printers-scanners'],
      shortDescription:
        '[Sample Catalog Item] Heat-Free Technology EcoTank Wi-Fi printer delivering 4,500 black and 7,500 colour pages per refill set.',
      description:
        'Sample wholesale listing for Epson EcoTank L3250 — the preferred multifunction ink tank printer for CSC centers, cyber cafes, and offices.',
      specs: [
        'Print, Scan, Copy with Wi-Fi & Wi-Fi Direct',
        'Epson Heat-Free Technology for Low Power Consumption',
        'Up to 4,500 Pages (Black) & 7,500 Pages (Colour)',
        'Borderless Photo Printing up to 4R Size',
        'Epson Smart Panel Mobile App Setup',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'SAMPLE CATALOG ITEM',
            brand: 'EPSON',
            title: 'Epson EcoTank L3250',
            subtitle: 'Wi-Fi Multi-Function Ink Tank Printer',
            specs: [
              'Print, Scan, Copy + Wi-Fi Direct',
              '4,500 Black / 7,500 Colour Page Yield',
              'Epson Heat-Free Inverter Friendly',
              'Spill-Free Key-Lock Bottle Refill',
              '1-Year / 30,000 Pages Warranty',
            ],
            accent: '#003399',
          }),
          publicId: 'seed_epson_l3250',
        },
      ],
      warrantyNote: '1-Year or 30,000 pages Epson India Warranty.',
      isFeatured: false,
      isActive: true,
      order: 7,
    },
    {
      name: 'Dell 24" SE2422H Full HD Slim-Bezel Monitor (Sample)',
      slug: 'dell-se2422h-24-inch-fhd-monitor',
      brand: brandMap.dell,
      category: catMap['monitors-displays'],
      shortDescription:
        '[Sample Catalog Item] 23.8" Full HD (1920x1080) 75Hz VA panel monitor with ComfortView flicker-free screen and HDMI + VGA inputs.',
      description:
        'Sample wholesale catalog listing for Dell 24 Monitor SE2422H. Stocked in bulk for dealer Counter sales and office workstation setups.',
      specs: [
        '23.8" Full HD (1920 x 1080) at 75Hz Refresh Rate',
        '3000:1 High Contrast Ratio VA Panel',
        'HDMI (HDCP 1.4) and Legacy VGA Connectivity',
        'TÜV Certified ComfortView Low Blue Light',
        '3-Year Advanced Exchange Service & Warranty',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'SAMPLE CATALOG ITEM',
            brand: 'DELL',
            title: 'Dell 24" SE2422H',
            subtitle: 'Full HD 75Hz Slim-Bezel LED Monitor',
            specs: [
              '23.8" FHD (1920x1080) 75Hz Display',
              'HDMI + VGA Dual Input Ports',
              'ComfortView Flicker-Free Panel',
              'VESA Wall-Mount Compatible',
              '3-Year Dell Exchange Warranty',
            ],
            accent: '#0E9AA7',
          }),
          publicId: 'seed_dell_se2422h',
        },
      ],
      warrantyNote: '3-Year Dell Replacement Warranty.',
      isFeatured: false,
      isActive: true,
      order: 8,
    },
    {
      name: 'NEED ProPower 600W SMPS & ATX Cabinet Combo (Sample)',
      slug: 'need-propower-600w-smps-atx-cabinet-combo',
      brand: brandMap.need,
      category: catMap['accessories'],
      shortDescription:
        '[Sample Catalog Item] H-Tech NEED proprietary hardware brand mid-tower cabinet with heavy-duty 600W surge-protected SMPS and USB 3.0.',
      description:
        'Engineered under H-Tech’s own NEED hardware division specifically for system assemblers and IT dealers across Maharashtra.',
      specs: [
        'Heavy-Gauge 0.5mm SPCC Matte Black ATX Chassis',
        'NEED ProPower 600W Peak SMPS with Indian Voltage Surge Guard',
        'Front Panel: 1x USB 3.0, 2x USB 2.0, HD Audio Jacks',
        '120mm Silent Rear Cooling Fan Pre-Installed',
        'Supports ATX, Micro-ATX, and Mini-ITX Motherboards',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'H-TECH OWN BRAND',
            brand: 'NEED',
            title: 'NEED ProPower Combo',
            subtitle: 'ATX Cabinet + 600W Surge-Protected SMPS',
            specs: [
              'Proprietary H-Tech NEED Hardware',
              '600W Heavy-Duty Indian Grid SMPS',
              'Front USB 3.0 + HD Audio Panel',
              '120mm Silent Fan Pre-Installed',
              'Dealer Counter Replacement Warranty',
            ],
            accent: '#0E9AA7',
          }),
          publicId: 'seed_need_cabinet_combo',
        },
      ],
      warrantyNote: '2-Year H-Tech Counter Replacement Warranty on SMPS.',
      isFeatured: true,
      isActive: true,
      order: 9,
    },
    {
      name: 'NEED ErgoCombo Wireless Keyboard & Optical Mouse Set (Sample)',
      slug: 'need-ergocombo-wireless-keyboard-mouse',
      brand: brandMap.need,
      category: catMap['accessories'],
      shortDescription:
        '[Sample Catalog Item] 2.4GHz plug-and-play wireless chiclet keyboard and 1600 DPI optical mouse combo with single nano receiver.',
      description:
        'High-margin retail & wholesale mover from NEED Hardware Brands. UV-coated keycaps for long-lasting legend durability.',
      specs: [
        '2.4GHz Lag-Free Wireless up to 10 Meters Range',
        '104-Key Spill-Resistant Low-Profile Keyboard',
        'Adjustable 1000 / 1200 / 1600 DPI Ambidextrous Mouse',
        'Single Unified USB Nano Receiver',
        'Auto Power-Saving Sleep Mode for 12-Month Battery Life',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'H-TECH OWN BRAND',
            brand: 'NEED',
            title: 'NEED Wireless Combo',
            subtitle: '2.4GHz Silent Keyboard & 1600 DPI Mouse',
            specs: [
              'Single Nano USB Receiver (10m Range)',
              'Spill-Resistant UV-Coated Keycaps',
              '1600 DPI Precision Optical Sensor',
              'Auto Sleep Mode Battery Saver',
              '1-Year H-Tech Dealer Warranty',
            ],
            accent: '#F28C0F',
          }),
          publicId: 'seed_need_wireless_combo',
        },
      ],
      warrantyNote: '1-Year H-Tech Direct Replacement Warranty.',
      isFeatured: true,
      isActive: true,
      order: 10,
    },
    {
      name: 'Test Product 01 — Commercial 8-Channel Full-Color CCTV Kit (Test)',
      slug: 'test-product-01-8ch-cctv-surveillance-kit',
      brand: brandMap.need,
      category: catMap['networking-cctv'],
      shortDescription:
        '[Test Product] Complete 8-Channel 5MP ColorVu DVR + 6 Bullet/Dome Cameras + SMPS Power Supply & 3+1 Copper Roll.',
      description:
        'Test catalog product for commercial, school, and warehouse surveillance installations across Karad and Satara.',
      specs: [
        '8-Channel H.265+ 5MP Lite Digital Video Recorder',
        '6x 2.4MP Full-Color Night Vision Outdoor/Indoor Cameras',
        'NEED 8-Channel Heavy-Duty CCTV Power Supply',
        '90m Pure Copper 3+1 Coaxial Cable Roll',
        '2-Year Onsite & Counter Dealer Warranty',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'TEST PRODUCT',
            brand: 'NEED',
            title: '8-Ch Color CCTV Kit',
            subtitle: 'Test Catalog Item • Complete Surveillance Pack',
            specs: [
              '8-Ch H.265+ DVR + Mobile App View',
              '6x Full-Color Night Vision Cameras',
              'Heavy-Duty 8-Ch SMPS Power Unit',
              '90m Pure Copper 3+1 Cable Roll',
              '2-Year Dealer Warranty Support',
            ],
            accent: '#6B3FD4',
          }),
          publicId: 'seed_test_cctv_kit',
        },
      ],
      warrantyNote: '2-Year Dealer Warranty Support.',
      isFeatured: true,
      isActive: true,
      order: 11,
    },
    {
      name: 'Test Product 02 — All-in-One 120W Solar LED Street Light (Test)',
      slug: 'test-product-02-120w-solar-led-street-light',
      brand: brandMap.need,
      category: catMap['solar-led'],
      shortDescription:
        '[Test Product] IP66 waterproof integrated solar street light with LiFePO4 battery, radar motion sensor, and dusk-to-dawn controller.',
      description:
        'Test catalog product for Gram Panchayat tenders, industrial estates, housing societies, and campus lighting.',
      specs: [
        '120W High-Lumen SMD 5050 LED Array',
        'High-Efficiency Monocrystalline Solar Panel',
        'Built-in Long-Life LiFePO4 Lithium Battery Pack',
        'IP66 Die-Cast Aluminum Weatherproof Body',
        'Auto Dusk-to-Dawn + Microwave Motion Sensor',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'TEST PRODUCT',
            brand: 'NEED',
            title: '120W Solar Street Light',
            subtitle: 'Test Catalog Item • IP66 All-in-One LiFePO4',
            specs: [
              '120W High-Lumen SMD LED Array',
              'Integrated Monocrystalline Solar Panel',
              'Inbuilt LiFePO4 Lithium Battery',
              'IP66 Waterproof + Motion Sensor',
              '2-Year H-Tech Replacement Warranty',
            ],
            accent: '#F28C0F',
          }),
          publicId: 'seed_test_solar_light',
        },
      ],
      warrantyNote: '2-Year H-Tech Counter Warranty.',
      isFeatured: true,
      isActive: true,
      order: 12,
    },
    {
      name: 'ASUS TUF Gaming B760M WiFi Motherboard (Sample)',
      slug: 'asus-tuf-gaming-b760m-wifi-motherboard',
      brand: brandMap.asus,
      category: catMap['pc-components-gaming'],
      shortDescription:
        '[Sample Catalog Item] Micro-ATX gaming motherboard with DDR5 memory support, PCIe 4.0 graphics slot, and Wi-Fi connectivity.',
      description:
        'Sample PC component listing for custom gaming PC builds. Confirm exact model availability and compatibility before ordering.',
      specs: [
        'Intel LGA1700 Processor Socket',
        'DDR5 Memory Support',
        'PCIe 4.0 x16 Graphics Card Slot',
        'M.2 NVMe SSD Storage Slots',
        'Integrated Wi-Fi and 2.5Gb Ethernet',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'SAMPLE CATALOG ITEM',
            brand: 'ASUS TUF',
            title: 'Gaming B760M WiFi',
            subtitle: 'Micro-ATX DDR5 Motherboard',
            specs: [
              'Intel LGA1700 Processor Socket',
              'DDR5 Memory Support',
              'PCIe 4.0 Graphics Slot',
              'M.2 NVMe SSD Slots',
              'Wi-Fi + 2.5Gb Ethernet',
            ],
            accent: '#F28C0F',
          }),
          publicId: 'seed_asus_tuf_b760m',
        },
      ],
      warrantyNote: 'Manufacturer warranty; confirm coverage for the exact model.',
      isFeatured: true,
      isActive: true,
      order: 13,
    },
    {
      name: 'NEED RGB Gaming Keyboard & Mouse Combo (Sample)',
      slug: 'need-rgb-gaming-keyboard-mouse-combo',
      brand: brandMap.need,
      category: catMap['pc-components-gaming'],
      shortDescription:
        '[Sample Catalog Item] Wired RGB gaming keyboard and adjustable-DPI optical mouse combo for desktop gaming setups.',
      description:
        'Sample gaming peripheral bundle from the NEED hardware range. Confirm current stock and included accessories before ordering.',
      specs: [
        'Full-Size Keyboard with RGB Backlighting',
        'Adjustable-DPI Optical Gaming Mouse',
        'Wired USB Plug-and-Play Connection',
        'Dedicated Multimedia Function Keys',
        'Compatible with Windows Gaming PCs',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'H-TECH OWN BRAND',
            brand: 'NEED',
            title: 'RGB Gaming Combo',
            subtitle: 'Backlit Keyboard + Gaming Mouse',
            specs: [
              'Full-Size RGB Backlit Keyboard',
              'Adjustable-DPI Optical Mouse',
              'Wired USB Plug-and-Play',
              'Dedicated Multimedia Keys',
              'For Windows Gaming PCs',
            ],
            accent: '#6B3FD4',
          }),
          publicId: 'seed_need_rgb_gaming_combo',
        },
      ],
      warrantyNote: 'Confirm warranty coverage for the available model.',
      isFeatured: true,
      isActive: true,
      order: 14,
    },
    {
      name: 'NEED Stereo Gaming Headset with Microphone (Sample)',
      slug: 'need-stereo-gaming-headset-microphone',
      brand: brandMap.need,
      category: catMap['pc-components-gaming'],
      shortDescription:
        '[Sample Catalog Item] Over-ear wired gaming headset with boom microphone and in-line audio controls.',
      description:
        'Sample gaming audio accessory for PC and compatible console setups. Confirm connector and device compatibility before ordering.',
      specs: [
        'Over-Ear Cushioned Headphones',
        'Flexible Boom Microphone',
        'In-Line Volume and Mute Controls',
        'Wired Audio Connection',
        'Comfortable Adjustable Headband',
      ],
      images: [
        {
          url: makeProductFlyerSvg({
            badge: 'SAMPLE CATALOG ITEM',
            brand: 'NEED',
            title: 'Gaming Headset',
            subtitle: 'Stereo Audio + Boom Microphone',
            specs: [
              'Over-Ear Cushioned Design',
              'Flexible Boom Microphone',
              'In-Line Volume + Mute',
              'Wired Audio Connection',
              'Adjustable Headband',
            ],
            accent: '#0E9AA7',
          }),
          publicId: 'seed_need_gaming_headset',
        },
      ],
      warrantyNote: 'Confirm warranty coverage for the available model.',
      isFeatured: true,
      isActive: true,
      order: 15,
    },
  ];
  await Product.insertMany(productsData);

  // 5. Seed Offers (3 Active + 1 Expired to test date filtering)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const ninetyDaysAhead = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const offersData = [
    {
      title: 'Solar & Smart LED Street-Light Solutions',
      badge: 'Green Energy Division',
      discountText: 'Direct Factory Wholesale Pricing for Dealers & Gram Panchayats',
      description:
        'High-lumen IP66 waterproof All-in-One Solar Street Lights, LiFePO4 battery packs, and industrial LED floodlights. Ready stock in Karad with full project support.',
      type: 'new-launch',
      image: makeSceneSvg(
        'Solar & LED Street-Light Promo',
        'All-in-One Solar Street Lights • IP66 Waterproof • LiFePO4 Battery',
        '#065F46',
        '#0F172A',
        'SOLAR & INFRASTRUCTURE'
      ),
      imagePublicId: 'seed_offer_solar',
      gradient: 'from-emerald-900 via-teal-900 to-slate-900',
      ctaLabel: 'Enquire Solar Dealer Rates',
      startDate: thirtyDaysAgo,
      endDate: ninetyDaysAhead,
      isActive: true,
      order: 1,
    },
    {
      title: 'HP Laptop 250R G10 — Bulk Dealer Allocation',
      badge: 'Best Deal',
      discountText: 'Special Carton & 5+ Unit Dealer Slab Rates',
      description:
        'Core 5 / Core i5 14th Gen, 8GB DDR4, 512GB NVMe SSD, 15.6" FHD LED, Wi-Fi 6 & 1-Year Onsite Warranty. Immediate dispatch from Karad Head Office.',
      type: 'best-deal',
      image: makeSceneSvg(
        'HP 250R G10 Bulk Lot',
        '14th Gen Intel Core 5 / i5 • 8GB • 512GB NVMe • 15.6" FHD',
        '#1E3A8A',
        '#0B132B',
        'HOT DEALER LOT'
      ),
      imagePublicId: 'seed_offer_hp250r',
      gradient: 'from-blue-900 via-indigo-900 to-slate-950',
      ctaLabel: 'Get Dealer Price on WhatsApp',
      startDate: thirtyDaysAgo,
      endDate: ninetyDaysAhead,
      isActive: true,
      order: 2,
    },
    {
      title: 'Festive Season Partner Bonanza — NEED Hardware + Printers',
      badge: 'Seasonal Offer',
      discountText: 'Free NEED Wireless Combo on 10x Printer or Desktop Bundle Orders',
      description:
        'Stock up for the festive quarter with Canon & Epson Wi-Fi Ink Tank printers and NEED ProPower cabinets & accessories.',
      type: 'seasonal',
      image: makeSceneSvg(
        'Festive Dealer Bonanza',
        'Combo Schemes on Canon, Epson & NEED Hardware Peripherals',
        '#9A3412',
        '#431407',
        'SEASONAL SCHEME'
      ),
      imagePublicId: 'seed_offer_festive',
      gradient: 'from-amber-700 via-orange-900 to-slate-950',
      ctaLabel: 'Claim Festive Scheme',
      startDate: thirtyDaysAgo,
      endDate: ninetyDaysAhead,
      isActive: true,
      order: 3,
    },
    {
      title: 'Monsoon Clearance Lot (Expired Test Offer)',
      badge: 'Expired Offer',
      discountText: 'Past Monsoon Promo',
      description:
        'This offer has expired and must never be returned by the public /api/offers endpoint.',
      type: 'seasonal',
      image: '',
      gradient: 'from-slate-800 to-slate-950',
      ctaLabel: 'Expired',
      startDate: sixtyDaysAgo,
      endDate: thirtyDaysAgo,
      isActive: true,
      order: 4,
    },
  ];
  await Offer.insertMany(offersData);

  // 6. Seed Customer Photos
  const customerPhotosData = [
    {
      image: makeSceneSvg(
        'Bulk Laptop Delivery — Satara Dealer Partner',
        '25x HP & Dell Commercial Notebooks Dispatched from Karad Hub',
        '#1E40AF',
        '#0F172A',
        'HAPPY DEALER PARTNER'
      ),
      imagePublicId: 'seed_cust_1',
      caption: 'Bulk HP 250R G10 delivery to our esteemed retail partner in Satara District.',
      order: 1,
      isActive: true,
    },
    {
      image: makeSceneSvg(
        'College Computer Lab Setup — Karad',
        '40x Desktop Systems & Networking Rack Handover',
        '#065F46',
        '#0F172A',
        'INSTITUTIONAL DELIVERY'
      ),
      imagePublicId: 'seed_cust_2',
      caption: 'Complete 40-seat computer lab hardware supply for an engineering institute near Karad.',
      order: 2,
      isActive: true,
    },
    {
      image: makeSceneSvg(
        'Annual Dealer Meet & NEED Brand Showcase',
        '150+ Regional IT Dealers across Western Maharashtra',
        '#831843',
        '#0F172A',
        'PARTNER COMMUNITY'
      ),
      imagePublicId: 'seed_cust_3',
      caption: 'Regional IT dealers experiencing the new NEED hardware lineup at H-Tech Karad.',
      order: 3,
      isActive: true,
    },
    {
      image: makeSceneSvg(
        'Printer & CCTV Bulk Dispatch — Sangli & Kolhapur',
        'Canon & Epson EcoTank Printers + Surveillance Kits',
        '#4C1D95',
        '#0F172A',
        'WHOLESALE DISPATCH'
      ),
      imagePublicId: 'seed_cust_4',
      caption: 'Same-day wholesale dispatch of Canon & Epson ink-tank printers to Sangli dealers.',
      order: 4,
      isActive: true,
    },
  ];
  await CustomerPhoto.insertMany(customerPhotosData);

  // 7. Seed Charity Photos (No broken images!)
  const charityPhotosData = [
    {
      image: makeSceneSvg(
        'Diwali Food Distribution — 108 Families',
        'Sharing festive joy and essential ration kits across rural Karad',
        '#0F766E',
        '#042F2E',
        'H-TECH CHARITY'
      ),
      imagePublicId: 'seed_charity_1',
      caption: 'Diwali grocery and sweets distribution drive reaching 108 families in surrounding villages.',
      order: 1,
      isActive: true,
    },
    {
      image: makeSceneSvg(
        'School Supplies for Remote Villages',
        'Backpacks, notebooks, and stationery for bright young learners',
        '#0369A1',
        '#082F49',
        'EDUCATION FIRST'
      ),
      imagePublicId: 'seed_charity_2',
      caption: 'Distributing school kits and learning materials to students in remote Zilla Parishad schools.',
      order: 2,
      isActive: true,
    },
    {
      image: makeSceneSvg(
        'Free CCTV Security for Rural Schools',
        'Protecting rural classrooms and campuses with 24/7 surveillance',
        '#1D4ED8',
        '#172554',
        'SAFE SCHOOLS INITIATIVE'
      ),
      imagePublicId: 'seed_charity_3',
      caption: 'H-Tech technical team installing complimentary CCTV security systems at a rural school.',
      order: 3,
      isActive: true,
    },
    {
      image: makeSceneSvg(
        'Refurbished Computers to Bridge the Digital Divide',
        'Empowering rural students with hands-on computer literacy',
        '#6D28D9',
        '#2E1065',
        'DIGITAL LITERACY'
      ),
      imagePublicId: 'seed_charity_4',
      caption: 'Donating tested, ready-to-use desktop computers to rural schools and community centers.',
      order: 4,
      isActive: true,
    },
  ];
  await CharityPhoto.insertMany(charityPhotosData);

  // 8. Seed Branch — Exact Karad Head Office details from Image 2
  await Branch.create({
    name: 'H-Tech Computer Wholesale (Head Office)',
    isHeadOffice: true,
    address:
      "Swami-Amal-Dutta' Bunglow, Besides 'Sahyadri' Hospital, Old Koyana Bridge Road, Warunji, Karad – 415124",
    mobile: '+919371249568',
    whatsapp: 'https://wa.me/919372049568',
    landline: '02164228793',
    email: 'admin@htechcomputer.com',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Sahyadri+Hospital+Old+Koyana+Bridge+Road+Warunji+Karad+415124',
    order: 1,
  });

  // 9. Seed Tech Updates (News, Product Updates, Useful Links — including long URLs to verify truncation)
  const techUpdatesData = [
    {
      type: 'news',
      title: 'Intel 14th Gen Core 5 & Core 7 Commercial Laptops Now in Ready Stock at Karad',
      summary:
        'Next-generation power efficiency and AI-ready NPU support arrive in commercial notebook lineups for Maharashtra dealers.',
      url: 'https://www.intel.com/content/www/us/en/products/details/processors/core/ultra.html',
      publishedAt: new Date(),
      isActive: true,
      order: 1,
    },
    {
      type: 'news',
      title: 'Wi-Fi 6E & NVMe Gen4 Becoming Standard Across Educational Lab Tenders',
      summary:
        'Institutions upgrading computer labs in 2026 are prioritizing PCIe Gen4 SSDs and gigabit wireless reliability.',
      url: 'https://www.wi-fi.org/discover-wi-fi/wi-fi-certified-6',
      publishedAt: new Date(now.getTime() - 3 * 86400000),
      isActive: true,
      order: 2,
    },
    {
      type: 'product-update',
      title: 'New Arrival: HP Laptop 250R G10 (Core 5 / Core i5 14th Gen, 8GB, 512GB NVMe)',
      summary:
        'Fresh carton stock landed at Warunji, Karad Head Office. Contact us on WhatsApp for dealer slab pricing.',
      url: '/products/hp-laptop-250r-g10',
      publishedAt: new Date(),
      isActive: true,
      order: 1,
    },
    {
      type: 'product-update',
      title: 'NEED ProPower 600W SMPS & Wireless Combo Batch 2026 Now Available',
      summary:
        'Updated surge protection circuitry for rural voltage fluctuations plus 2-year counter replacement support.',
      url: '/hardware-brands',
      publishedAt: new Date(now.getTime() - 2 * 86400000),
      isActive: true,
      order: 2,
    },
    {
      type: 'useful-link',
      title: 'HP India Official Warranty Check & Serial Number Lookup Portal',
      summary: 'Verify on-site hardware warranty coverage and care pack status for any HP notebook or desktop.',
      url: 'https://support.hp.com/in-en/check-warranty/commercial-hardware-verification-portal-very-long-url-segment-to-test-clean-card-wrapping',
      publishedAt: new Date(),
      isActive: true,
      order: 1,
    },
    {
      type: 'useful-link',
      title: 'Dell India Service Tag Warranty & Driver Download Center',
      summary: 'Official Dell support portal for BIOS updates, service tag lookup, and ProSupport diagnostics.',
      url: 'https://www.dell.com/support/home/en-in?app=drivers&segment=wholesale-partner-resources-karad-maharashtra',
      publishedAt: new Date(),
      isActive: true,
      order: 2,
    },
  ];
  await TechUpdate.insertMany(techUpdatesData);

  // 10. Seed SiteSettings (Singleton)
  await SiteSettings.create({
    singletonKey: 'default',
    ledPhoneNumbers: [
      'MOBILE: +91 93712 49568',
      'BUSINESS WHATSAPP: +91 93720 49568',
      'LANDLINE: 02164-228793',
      'EMAIL: admin@htechcomputer.com',
      'HEAD OFFICE: WARUNJI, KARAD – 415124',
    ],
    primaryMobile: '+919371249568',
    whatsappNumber: '919372049568',
    whatsappUrl: 'https://wa.me/919372049568',
    landline: '02164228793',
    email: 'admin@htechcomputer.com',
    whatsappChannelUrl: 'https://whatsapp.com/channel/0029VaHtechWholesaleKarad',
    whatsappChannelTitle: 'Laptop, Desktop Computer, Digital Gadgets, Mobiles Wholesale',
    socialLinks: {
      instagram: 'https://instagram.com/htechcomputerwholesale',
      facebook: 'https://facebook.com/htechcomputerwholesale',
      youtube: 'https://youtube.com/@htechcomputerwholesale',
      telegram: 'https://t.me/htechcomputerwholesale',
      pinterest: 'https://pinterest.com/htechcomputerwholesale',
      mapUrl:
        'https://www.google.com/maps/search/?api=1&query=Sahyadri+Hospital+Old+Koyana+Bridge+Road+Warunji+Karad+415124',
    },
    heroHeadline: 'Technology, wholesale — delivered with trust.',
    heroSubline: 'Laptops, desktops, printers, accessories and the digital future.',
    footerText:
      'H-Tech Computer Wholesale — Premier IT hardware distributor in Karad, Maharashtra. Hardware brands for today. Intelligent software for tomorrow.',
    charityIntroText:
      'At H-Tech Computer Wholesale, our responsibility extends far beyond supplying enterprise hardware. Through H-Tech Charity, every milestone we achieve fuels community upliftment across rural Maharashtra.',
  });

  // 11. Seed a sample Enquiry for the Admin Dashboard
  await Enquiry.create({
    name: 'Shree Sai Computers (Satara)',
    phone: '+919822011223',
    message: 'Need dealer quote for 10 units of HP Laptop 250R G10 and 5 units of Canon G3770 printer.',
    productName: 'HP Laptop 250R G10',
    sourcePage: '/products',
    status: 'new',
  });

  console.log('🌱 Database seeded with H-Tech Karad data. Admin:', adminUser.email);
};

import { z } from 'zod';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Brand } from '../models/Brand.js';
import { Offer } from '../models/Offer.js';
import { CustomerPhoto } from '../models/CustomerPhoto.js';
import { CharityPhoto } from '../models/CharityPhoto.js';
import { Branch } from '../models/Branch.js';
import { TechUpdate } from '../models/TechUpdate.js';
import { Enquiry } from '../models/Enquiry.js';
import { SiteSettings } from '../models/SiteSettings.js';

const getProducts = async (req, res, next, categoryOverride) => {
  try {
    const {
      brand,
      search,
      sort = 'order',
      featured,
      maxPrice: requestedMaxPrice,
      page = '1',
      limit = '24',
    } = req.query;
const normalizePrice = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return value; // arrays etc. fall through to validation
  const trimmed = value.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'unlimited') return undefined;
  return trimmed;
};

const maxPrice = normalizePrice(requestedMaxPrice);
const minPrice = normalizePrice(req.query.minPrice) ?? (maxPrice !== undefined ? '0' : undefined);
    const category = categoryOverride ?? req.query.category;

    const filter = { isActive: true };

    const priceRange = {};
    for (const [key, value] of [['minPrice', minPrice], ['maxPrice', maxPrice]]) {
      if (value === undefined) continue;
      if (typeof value !== 'string' || value.trim() === '') {
        return res.status(400).json({ message: `${key} must be a non-negative number.` });
      }
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 0) {
        return res.status(400).json({ message: `${key} must be a non-negative number.` });
      }
      priceRange[key === 'minPrice' ? '$gte' : '$lte'] = parsed;
    }
    if (
      priceRange.$gte !== undefined &&
      priceRange.$lte !== undefined &&
      priceRange.$gte > priceRange.$lte
    ) {
      return res.status(400).json({ message: 'minPrice cannot be greater than maxPrice.' });
    }
    if (Object.keys(priceRange).length > 0) {
      filter.price = priceRange;
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (category && category !== 'all') {
      const catDoc = await Category.findOne({
        $or: [{ slug: category }, ...(category.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: category }] : [])],
      });
      if (catDoc) {
        filter.category = catDoc._id;
      } else {
        return res.json({ products: [], total: 0, page: 1, totalPages: 0 });
      }
    }

    if (brand && brand !== 'all') {
      const brandDoc = await Brand.findOne({
        $or: [{ slug: brand }, ...(brand.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: brand }] : [])],
      });
      if (brandDoc) {
        filter.brand = brandDoc._id;
      } else {
        return res.json({ products: [], total: 0, page: 1, totalPages: 0 });
      }
    }

    if (search && String(search).trim() !== '') {
      const escapedSearch = String(search)
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSearch, 'i');
      const [matchingBrands, matchingCategories] = await Promise.all([
        Brand.find({ name: regex }).select('_id').lean(),
        Category.find({ name: regex }).select('_id').lean(),
      ]);

      filter.$or = [
        { name: regex },
        { slug: regex },
        { shortDescription: regex },
        { description: regex },
        { specs: regex },
        { brand: { $in: matchingBrands.map(({ _id }) => _id) } },
        { category: { $in: matchingCategories.map(({ _id }) => _id) } },
      ];
    }

    let sortQuery = { order: 1, createdAt: -1 };
    if (sort === 'name-asc') sortQuery = { name: 1 };
    else if (sort === 'name-desc') sortQuery = { name: -1 };
    else if (sort === 'newest') sortQuery = { createdAt: -1 };

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 24));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('brand', 'name slug logo isHardwareBrand')
        .populate('category', 'name slug')
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

export const getPublicProducts = (req, res, next) => getProducts(req, res, next);

export const getPublicProductsByCategory = (req, res, next) =>
  getProducts(req, res, next, req.params.slug);

export const getPublicProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('brand', 'name slug logo website isHardwareBrand')
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

export const getPublicCategories = async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

export const getPublicBrands = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.hardwareOnly === 'true') {
      filter.isHardwareBrand = true;
    }
    const brands = await Brand.find(filter).sort({ order: 1, name: 1 });
    res.json({ brands });
  } catch (err) {
    next(err);
  }
};

export const getPublicOffers = async (req, res, next) => {
  try {
    const now = new Date();
    const filter = {
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    };
    if (req.query.type && req.query.type !== 'all') {
      filter.type = req.query.type;
    }
    const offers = await Offer.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ offers });
  } catch (err) {
    next(err);
  }
};

export const getPublicCustomers = async (_req, res, next) => {
  try {
    const photos = await CustomerPhoto.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ photos });
  } catch (err) {
    next(err);
  }
};

export const getPublicCharity = async (_req, res, next) => {
  try {
    const photos = await CharityPhoto.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ photos });
  } catch (err) {
    next(err);
  }
};

export const getPublicBranches = async (_req, res, next) => {
  try {
    const branches = await Branch.find().sort({ isHeadOffice: -1, order: 1 });
    res.json({ branches });
  } catch (err) {
    next(err);
  }
};

export const getPublicTechUpdates = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.type) {
      filter.type = req.query.type;
    }
    const updates = await TechUpdate.find(filter).sort({ order: 1, publishedAt: -1 });
    res.json({ updates });
  } catch (err) {
    next(err);
  }
};

export const getPublicSettings = async (_req, res, next) => {
  try {
    let settings = await SiteSettings.findOne({ singletonKey: 'default' });
    if (!settings) {
      settings = await SiteSettings.create({ singletonKey: 'default' });
    }
    res.json({ settings });
  } catch (err) {
    next(err);
  }
};

const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  phone: z.string().min(8, 'Please enter a valid phone number').max(25),
  message: z.string().min(5, 'Please include a short message').max(2000),
  productRef: z.string().optional().nullable(),
  productName: z.string().optional(),
  sourcePage: z.string().optional(),
});

export const createPublicEnquiry = async (req, res, next) => {
  try {
    const data = enquirySchema.parse(req.body);
    const enquiry = await Enquiry.create({
      name: data.name,
      phone: data.phone,
      message: data.message,
      productRef: data.productRef && data.productRef.match(/^[0-9a-fA-F]{24}$/) ? data.productRef : null,
      productName: data.productName || '',
      sourcePage: data.sourcePage || '/contact',
      status: 'new',
    });

    res.status(201).json({
      message: 'Thank you! Your enquiry has been received by H-Tech Karad.',
      enquiry,
    });
  } catch (err) {
    next(err);
  }
};

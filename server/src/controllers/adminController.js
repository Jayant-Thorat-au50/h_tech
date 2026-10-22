import slugify from 'slugify';
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
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendPushNotification } from '../services/pushNotifications.js';

const toSlug = (str) =>
  slugify(str || '', { lower: true, strict: true, trim: true }) || `item-${Date.now()}`;

// --- DASHBOARD STATS ---
export const getAdminStats = async (_req, res, next) => {
  try {
    const now = new Date();
    const [
      productsCount,
      categoriesCount,
      brandsCount,
      activeOffersCount,
      newEnquiriesCount,
      totalEnquiriesCount,
      recentEnquiries,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Brand.countDocuments(),
      Offer.countDocuments({ isActive: true, startDate: { $lte: now }, endDate: { $gte: now } }),
      Enquiry.countDocuments({ status: 'new' }),
      Enquiry.countDocuments(),
      Enquiry.find().sort({ createdAt: -1 }).limit(8),
    ]);

    res.json({
      stats: {
        productsCount,
        categoriesCount,
        brandsCount,
        activeOffersCount,
        newEnquiriesCount,
        totalEnquiriesCount,
      },
      recentEnquiries,
    });
  } catch (err) {
    next(err);
  }
};

// --- MEDIA UPLOAD / DELETE ---
export const uploadAdminImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }
    const folder = req.body.folder || 'htech_wholesale';
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, req.file.mimetype, folder);
    res.status(201).json(uploaded);
  } catch (err) {
    next(err);
  }
};


export const deleteAdminImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    await deleteFromCloudinary(publicId);
    res.json({ message: 'Image removed.' });
  } catch (err) {
    next(err);
  }
};

// --- PRODUCTS CRUD ---
export const getAdminProducts = async (_req, res, next) => {
  try {
    const products = await Product.find()
      .populate('brand', 'name slug logo')
      .populate('category', 'name slug')
      .sort({ order: 1, createdAt: -1 });
    res.json({ products });
  } catch (err) {
    next(err);
  }
};

export const createAdminProduct = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    payload.slug = payload.slug ? toSlug(payload.slug) : toSlug(payload.name);
    const existing = await Product.findOne({ slug: payload.slug });
    if (existing) {
      payload.slug = `${payload.slug}-${Date.now().toString(36).slice(-4)}`;
    }
    const product = await Product.create(payload);
    const populated = await product.populate(['brand', 'category']);
    void sendPushNotification({
      title: 'New product at H-Tech',
      body: populated.name,
      url: `/products/${populated.slug}`,
    }).catch((err) => console.error('Could not send new-product notification.', err));
    res.status(201).json({ product: populated });
  } catch (err) {
    next(err);
  }
};

export const updateAdminProduct = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.name && !payload.slug) {
      payload.slug = toSlug(payload.name);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).populate(['brand', 'category']);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    if (Array.isArray(product.images)) {
      for (const img of product.images) {
        if (img.publicId) await deleteFromCloudinary(img.publicId);
      }
    }
    res.json({ message: 'Product deleted.', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

// --- CATEGORIES CRUD ---
export const getAdminCategories = async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

export const createAdminCategory = async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      slug: req.body.slug ? toSlug(req.body.slug) : toSlug(req.body.name),
      order: Number(req.body.order) || 0,
    };
    const category = await Category.create(payload);
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
};

export const updateAdminCategory = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.name && !payload.slug) payload.slug = toSlug(payload.name);
    const category = await Category.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ category });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted.', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

// --- BRANDS CRUD ---
export const getAdminBrands = async (_req, res, next) => {
  try {
    const brands = await Brand.find().sort({ order: 1, name: 1 });
    res.json({ brands });
  } catch (err) {
    next(err);
  }
};

export const createAdminBrand = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      slug: req.body.slug ? toSlug(req.body.slug) : toSlug(req.body.name),
    };
    const brand = await Brand.create(payload);
    res.status(201).json({ brand });
  } catch (err) {
    next(err);
  }
};

export const updateAdminBrand = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.name && !payload.slug) payload.slug = toSlug(payload.name);
    const brand = await Brand.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!brand) return res.status(404).json({ message: 'Brand not found.' });
    res.json({ brand });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (brand?.logoPublicId) await deleteFromCloudinary(brand.logoPublicId);
    res.json({ message: 'Brand deleted.', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

// --- OFFERS CRUD ---
export const getAdminOffers = async (_req, res, next) => {
  try {
    const offers = await Offer.find().sort({ order: 1, createdAt: -1 });
    res.json({ offers });
  } catch (err) {
    next(err);
  }
};

export const createAdminOffer = async (req, res, next) => {
  try {
    const offer = await Offer.create(req.body);
    void sendPushNotification({
      title: 'New offer at H-Tech',
      body: offer.title,
      url: '/offers',
    }).catch((err) => console.error('Could not send new-offer notification.', err));
    res.status(201).json({ offer });
  } catch (err) {
    next(err);
  }
};

export const updateAdminOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ message: 'Offer not found.' });
    res.json({ offer });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (offer?.imagePublicId) await deleteFromCloudinary(offer.imagePublicId);
    res.json({ message: 'Offer deleted.', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

// --- CUSTOMER PHOTOS CRUD ---
export const getAdminCustomers = async (_req, res, next) => {
  try {
    const photos = await CustomerPhoto.find().sort({ order: 1, createdAt: -1 });
    res.json({ photos });
  } catch (err) {
    next(err);
  }
};

export const createAdminCustomer = async (req, res, next) => {
  try {
    const photo = await CustomerPhoto.create(req.body);
    res.status(201).json({ photo });
  } catch (err) {
    next(err);
  }
};

export const updateAdminCustomer = async (req, res, next) => {
  try {
    const photo = await CustomerPhoto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!photo) return res.status(404).json({ message: 'Customer photo not found.' });
    res.json({ photo });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminCustomer = async (req, res, next) => {
  try {
    const photo = await CustomerPhoto.findByIdAndDelete(req.params.id);
    if (photo?.imagePublicId) await deleteFromCloudinary(photo.imagePublicId);
    res.json({ message: 'Customer photo deleted.', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

// --- CHARITY PHOTOS CRUD ---
export const getAdminCharity = async (_req, res, next) => {
  try {
    const photos = await CharityPhoto.find().sort({ order: 1, createdAt: -1 });
    res.json({ photos });
  } catch (err) {
    next(err);
  }
};

export const createAdminCharity = async (req, res, next) => {
  try {
    const photo = await CharityPhoto.create(req.body);
    res.status(201).json({ photo });
  } catch (err) {
    next(err);
  }
};

export const updateAdminCharity = async (req, res, next) => {
  try {
    const photo = await CharityPhoto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!photo) return res.status(404).json({ message: 'Charity photo not found.' });
    res.json({ photo });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminCharity = async (req, res, next) => {
  try {
    const photo = await CharityPhoto.findByIdAndDelete(req.params.id);
    if (photo?.imagePublicId) await deleteFromCloudinary(photo.imagePublicId);
    res.json({ message: 'Charity photo deleted.', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

// --- BRANCHES CRUD ---
export const getAdminBranches = async (_req, res, next) => {
  try {
    const branches = await Branch.find().sort({ isHeadOffice: -1, order: 1 });
    res.json({ branches });
  } catch (err) {
    next(err);
  }
};

export const createAdminBranch = async (req, res, next) => {
  try {
    if (req.body.isHeadOffice) {
      await Branch.updateMany({}, { isHeadOffice: false });
    }
    const branch = await Branch.create(req.body);
    res.status(201).json({ branch });
  } catch (err) {
    next(err);
  }
};

export const updateAdminBranch = async (req, res, next) => {
  try {
    if (req.body.isHeadOffice) {
      await Branch.updateMany({ _id: { $ne: req.params.id } }, { isHeadOffice: false });
    }
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) return res.status(404).json({ message: 'Branch not found.' });
    res.json({ branch });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminBranch = async (req, res, next) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.json({ message: 'Branch deleted.', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

// --- TECH UPDATES CRUD ---
export const getAdminTechUpdates = async (_req, res, next) => {
  try {
    const updates = await TechUpdate.find().sort({ order: 1, publishedAt: -1 });
    res.json({ updates });
  } catch (err) {
    next(err);
  }
};

export const createAdminTechUpdate = async (req, res, next) => {
  try {
    const update = await TechUpdate.create(req.body);
    res.status(201).json({ update });
  } catch (err) {
    next(err);
  }
};

export const updateAdminTechUpdate = async (req, res, next) => {
  try {
    const update = await TechUpdate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!update) return res.status(404).json({ message: 'Tech update not found.' });
    res.json({ update });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminTechUpdate = async (req, res, next) => {
  try {
    await TechUpdate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tech update deleted.', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

// --- ENQUIRIES MANAGEMENT ---
export const getAdminEnquiries = async (_req, res, next) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('productRef', 'name slug')
      .sort({ createdAt: -1 });
    res.json({ enquiries });
  } catch (err) {
    next(err);
  }
};

export const updateAdminEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found.' });
    res.json({ enquiry });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminEnquiry = async (req, res, next) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enquiry deleted.', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

// --- SITE SETTINGS UPDATE ---
export const updateAdminSettings = async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      { singletonKey: 'default' },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json({ settings });
  } catch (err) {
    next(err);
  }
};

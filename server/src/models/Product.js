import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, min: 0 },
    specs: [{ type: String }],
    images: [productImageSchema],
    warrantyNote: { type: String, default: '1-Year Standard Manufacturer Hardware Warranty' },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'Product' }
);

productSchema.index({ name: 'text', shortDescription: 'text', description: 'text' });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

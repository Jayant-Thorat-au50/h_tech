import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logo: { type: String, default: '' },
    logoPublicId: { type: String, default: '' },
    website: { type: String, default: '' },
    description: { type: String, default: '' },
    isHardwareBrand: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'Brand' }
);

export const Brand = mongoose.models.Brand || mongoose.model('Brand', brandSchema);

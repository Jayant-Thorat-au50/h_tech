import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'Category' }
);

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

import mongoose from 'mongoose';

const techUpdateSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['news', 'product-update', 'useful-link'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    url: { type: String, default: '' },
    publishedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'TechUpdate' }
);

export const TechUpdate =
  mongoose.models.TechUpdate || mongoose.model('TechUpdate', techUpdateSchema);

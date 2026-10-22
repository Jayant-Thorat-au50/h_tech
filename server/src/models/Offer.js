import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    badge: { type: String, default: 'Special Offer', trim: true },
    discountText: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['best-deal', 'new-launch', 'seasonal'],
      default: 'best-deal',
    },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    gradient: {
      type: String,
      default: 'from-blue-900 via-indigo-900 to-slate-900',
    },
    ctaLabel: { type: String, default: 'Claim Offer on WhatsApp' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'Offer' }
);

export const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);

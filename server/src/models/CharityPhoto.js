import mongoose from 'mongoose';

const charityPhotoSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    imagePublicId: { type: String, default: '' },
    caption: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'CharityPhoto' }
);

export const CharityPhoto =
  mongoose.models.CharityPhoto || mongoose.model('CharityPhoto', charityPhotoSchema);

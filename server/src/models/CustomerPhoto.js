import mongoose from 'mongoose';

const customerPhotoSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    imagePublicId: { type: String, default: '' },
    caption: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'CustomerPhoto' }
);

export const CustomerPhoto =
  mongoose.models.CustomerPhoto || mongoose.model('CustomerPhoto', customerPhotoSchema);

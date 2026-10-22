import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    isHeadOffice: { type: Boolean, default: false },
    address: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    whatsapp: { type: String, default: '' },
    landline: { type: String, default: '' },
    email: { type: String, default: '' },
    mapUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'Branch' }
);

export const Branch = mongoose.models.Branch || mongoose.model('Branch', branchSchema);

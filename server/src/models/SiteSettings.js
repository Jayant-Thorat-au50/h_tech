import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: 'default', unique: true },
    ledPhoneNumbers: [{ type: String }],
    primaryMobile: { type: String, default: '+919371249568' },
    whatsappNumber: { type: String, default: '919372049568' },
    whatsappUrl: { type: String, default: 'https://wa.me/919372049568' },
    landline: { type: String, default: '02164228793' },
    email: { type: String, default: 'admin@htechcomputer.com' },
    whatsappChannelUrl: {
      type: String,
      default: 'https://whatsapp.com/channel/0029VaHtechWholesaleKarad',
    },
    whatsappChannelTitle: {
      type: String,
      default: 'Laptop, Desktop Computer, Digital Gadgets, Mobiles Wholesale',
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/htechcomputerwholesale' },
      facebook: { type: String, default: 'https://facebook.com/htechcomputerwholesale' },
      youtube: { type: String, default: 'https://youtube.com/@htechcomputerwholesale' },
      telegram: { type: String, default: 'https://t.me/htechcomputerwholesale' },
      pinterest: { type: String, default: 'https://pinterest.com/htechcomputerwholesale' },
      mapUrl: {
        type: String,
        default:
          'https://www.google.com/maps/search/?api=1&query=Sahyadri+Hospital+Old+Koyana+Bridge+Road+Warunji+Karad+415124',
      },
    },
    heroHeadline: {
      type: String,
      default: 'Technology, wholesale — delivered with trust.',
    },
    heroSubline: {
      type: String,
      default: 'Laptops, desktops, printers, accessories and the digital future.',
    },
    footerText: {
      type: String,
      default:
        'H-Tech Computer Wholesale — Premier IT hardware distributor in Karad, Maharashtra. Hardware brands for today. Intelligent software for tomorrow.',
    },
    charityIntroText: {
      type: String,
      default:
        'At H-Tech Computer Wholesale, our responsibility extends far beyond supplying enterprise hardware. Through H-Tech Charity, every milestone we achieve fuels community upliftment across rural Maharashtra.',
    },
    aboutBlocks: {
      story: {
        type: String,
        default:
          "Headquartered at Swami-Amal-Dutta' Bunglow, Besides 'Sahyadri' Hospital, Old Koyana Bridge Road, Warunji, Karad – 415124, H-Tech Computer Wholesale is a trusted computer and IT hardware wholesaler serving dealers, institutions, and businesses across Maharashtra. Founded in [TODO: confirm with client — Year Established] by [TODO: confirm with client — Founders & Leadership Team], we bridge global hardware brands with regional IT partners.",
      },
      mission: {
        type: String,
        default:
          'To empower IT dealers, system integrators, and institutions with authentic wholesale hardware, transparent dealer support, and next-generation digital wings across hardware brands, AI software, and web experiences.',
      },
      whatWeDo: {
        type: String,
        default:
          'We distribute laptops, desktops, printers, networking gear, CCTV systems, solar & street-light solutions, and proprietary hardware under the NEED brand — backed by our Einstein Team AI & Software division and Website Development studio.',
      },
      milestonesNote: {
        type: String,
        default:
          '[TODO: confirm with client — Key Awards, Certifications & Exact Dealer Network Count]',
      },
    },
  },
  { timestamps: true }
);

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);

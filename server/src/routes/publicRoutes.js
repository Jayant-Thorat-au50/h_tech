import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getPublicProducts,
  getPublicProductsByCategory,
  getPublicProductBySlug,
  getPublicCategories,
  getPublicBrands,
  getPublicOffers,
  getPublicCustomers,
  getPublicCharity,
  getPublicBranches,
  getPublicTechUpdates,
  getPublicSettings,
  createPublicEnquiry,
} from '../controllers/publicController.js';
import {
  getPushPublicKey,
  savePushSubscription,
  removePushSubscription,
} from '../controllers/pushController.js';

const router = express.Router();

const enquiryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many enquiries submitted. Please try again shortly or message us on WhatsApp.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/notifications/vapid-public-key', getPushPublicKey);
router.post('/notifications/subscriptions', savePushSubscription);
router.delete('/notifications/subscriptions', removePushSubscription);
router.get('/products', getPublicProducts);
router.get('/categories/:slug/products', getPublicProductsByCategory);
router.get('/products/:slug', getPublicProductBySlug);
router.get('/categories', getPublicCategories);
router.get('/brands', getPublicBrands);
router.get('/offers', getPublicOffers);
router.get('/customers', getPublicCustomers);
router.get('/charity', getPublicCharity);
router.get('/branches', getPublicBranches);
router.get('/tech-updates', getPublicTechUpdates);
router.get('/settings', getPublicSettings);
router.post('/enquiries', enquiryRateLimiter, createPublicEnquiry);

export default router;

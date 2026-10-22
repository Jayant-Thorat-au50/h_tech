import express from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { uploadImageMiddleware } from '../middleware/uploadMiddleware.js';
import {
  getAdminStats,
  uploadAdminImage,
  deleteAdminImage,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  getAdminBrands,
  createAdminBrand,
  updateAdminBrand,
  deleteAdminBrand,
  getAdminOffers,
  createAdminOffer,
  updateAdminOffer,
  deleteAdminOffer,
  getAdminCustomers,
  createAdminCustomer,
  updateAdminCustomer,
  deleteAdminCustomer,
  getAdminCharity,
  createAdminCharity,
  updateAdminCharity,
  deleteAdminCharity,
  getAdminBranches,
  createAdminBranch,
  updateAdminBranch,
  deleteAdminBranch,
  getAdminTechUpdates,
  createAdminTechUpdate,
  updateAdminTechUpdate,
  deleteAdminTechUpdate,
  getAdminEnquiries,
  updateAdminEnquiryStatus,
  deleteAdminEnquiry,
  updateAdminSettings,
} from '../controllers/adminController.js';

const router = express.Router();

// Protect all admin routes
router.use(requireAdmin);

router.get('/stats', getAdminStats);

// Media upload & delete
router.post('/upload', uploadImageMiddleware.single('image'), uploadAdminImage);
router.delete('/upload', deleteAdminImage);

// Products
router.get('/products', getAdminProducts);
router.post('/products', createAdminProduct);
router.put('/products/:id', updateAdminProduct);
router.delete('/products/:id', deleteAdminProduct);

// Categories
router.get('/categories', getAdminCategories);
router.post('/categories', createAdminCategory);
router.put('/categories/:id', updateAdminCategory);
router.delete('/categories/:id', deleteAdminCategory);

// Brands
router.get('/brands', getAdminBrands);
router.post('/brands', createAdminBrand);
router.put('/brands/:id', updateAdminBrand);
router.delete('/brands/:id', deleteAdminBrand);

// Offers
router.get('/offers', getAdminOffers);
router.post('/offers', createAdminOffer);
router.put('/offers/:id', updateAdminOffer);
router.delete('/offers/:id', deleteAdminOffer);

// Customers
router.get('/customers', getAdminCustomers);
router.post('/customers', createAdminCustomer);
router.put('/customers/:id', updateAdminCustomer);
router.delete('/customers/:id', deleteAdminCustomer);

// Charity
router.get('/charity', getAdminCharity);
router.post('/charity', createAdminCharity);
router.put('/charity/:id', updateAdminCharity);
router.delete('/charity/:id', deleteAdminCharity);

// Branches
router.get('/branches', getAdminBranches);
router.post('/branches', createAdminBranch);
router.put('/branches/:id', updateAdminBranch);
router.delete('/branches/:id', deleteAdminBranch);

// Tech Updates
router.get('/tech-updates', getAdminTechUpdates);
router.post('/tech-updates', createAdminTechUpdate);
router.put('/tech-updates/:id', updateAdminTechUpdate);
router.delete('/tech-updates/:id', deleteAdminTechUpdate);

// Enquiries
router.get('/enquiries', getAdminEnquiries);
router.patch('/enquiries/:id/status', updateAdminEnquiryStatus);
router.delete('/enquiries/:id', deleteAdminEnquiry);

// Site Settings
router.put('/settings', updateAdminSettings);

export default router;

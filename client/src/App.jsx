import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';

// Lazy-loaded Public Pages
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'));
const BuildPcPage = lazy(() => import('./pages/BuildPcPage.jsx'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'));
const OffersPage = lazy(() => import('./pages/OffersPage.jsx'));
const CustomersPage = lazy(() => import('./pages/CustomersPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const CharityPage = lazy(() => import('./pages/CharityPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const HardwareBrandsPage = lazy(() => import('./pages/HardwareBrandsPage.jsx'));
const AiSoftwarePage = lazy(() => import('./pages/AiSoftwarePage.jsx'));
const WebDevelopmentPage = lazy(() => import('./pages/WebDevelopmentPage.jsx'));
const TechUpdatesPage = lazy(() => import('./pages/TechUpdatesPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// Lazy-loaded Admin Pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage.jsx'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage.jsx'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage.jsx'));
const AdminBrandsPage = lazy(() => import('./pages/admin/AdminBrandsPage.jsx'));
const AdminOffersPage = lazy(() => import('./pages/admin/AdminOffersPage.jsx'));
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage.jsx'));
const AdminBranchesPage = lazy(() => import('./pages/admin/AdminBranchesPage.jsx'));
const AdminTechUpdatesPage = lazy(() => import('./pages/admin/AdminTechUpdatesPage.jsx'));
const AdminEnquiriesPage = lazy(() => import('./pages/admin/AdminEnquiriesPage.jsx'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage.jsx'));
const AdminPasswordPage = lazy(() => import('./pages/admin/AdminPasswordPage.jsx'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-htech-blue animate-spin" />
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/build-pc" element={<BuildPcPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/charity" element={<CharityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/hardware-brands" element={<HardwareBrandsPage />} />
          <Route path="/ai-software" element={<AiSoftwarePage />} />
          <Route path="/web-development" element={<WebDevelopmentPage />} />
          <Route path="/tech-updates" element={<TechUpdatesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Console Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="brands" element={<AdminBrandsPage />} />
            <Route path="offers" element={<AdminOffersPage />} />
            <Route path="customers" element={<AdminGalleryPage mode="customers" />} />
            <Route path="charity" element={<AdminGalleryPage mode="charity" />} />
            <Route path="branches" element={<AdminBranchesPage />} />
            <Route path="tech-updates" element={<AdminTechUpdatesPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="password" element={<AdminPasswordPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

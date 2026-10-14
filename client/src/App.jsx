import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'

// Common Components
import Navbar from './components/common/Navbar.jsx'
import Footer from './components/common/Footer.jsx'
import LoginModal from './components/common/LoginModal.jsx'
import ReferralModal from './components/common/ReferralModal.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import ProviderRoute from './components/common/ProviderRoute.jsx'
import AdminRoute from './components/common/AdminRoute.jsx'
import MobileBottomNav from './components/common/MobileBottomNav.jsx'
import DevToolbar from './components/common/DevToolbar.jsx'

// Pages
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import ProfilePage from './pages/auth/ProfilePage.jsx'
import ApplyProviderPage from './pages/auth/ApplyProviderPage.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import ProviderDashboardPage from './pages/provider/ProviderDashboardPage.jsx'
import RoomsPage from './pages/rooms/RoomsPage.jsx'
import TiffinsPage from './pages/tiffins/TiffinsPage.jsx'
import VehiclesPage from './pages/vehicles/VehiclesPage.jsx'
import DevicesPage from './pages/devices/DevicesPage.jsx'
import AiSearchPage from './pages/ai/AiSearchPage.jsx'
import ReferralPage from './pages/referral/ReferralPage.jsx'
import SavedPage from './pages/saved/SavedPage.jsx'
import RequestsPage from './pages/requests/RequestsPage.jsx'
import ListingDetailPage from './pages/marketplace/ListingDetailPage.jsx'

import AreaDetailPage from './pages/areas/AreaDetailPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-sandstone text-espresso font-sans pb-16 md:pb-0">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/refer" element={<ReferralPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/requests" element={<RequestsPage />} />

          {/* Dedicated Category Pages */}
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<ListingDetailPage />} />
          <Route path="/tiffin" element={<TiffinsPage />} />
          <Route path="/tiffins" element={<TiffinsPage />} />
          <Route path="/tiffin/:id" element={<ListingDetailPage />} />
          <Route path="/tiffins/:id" element={<ListingDetailPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicles/:id" element={<ListingDetailPage />} />
          <Route path="/laptops" element={<DevicesPage />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/laptops/:id" element={<ListingDetailPage />} />
          <Route path="/devices/:id" element={<ListingDetailPage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />

          {/* AI Companion Sathi */}
          <Route path="/ai" element={<AiSearchPage />} />
          <Route path="/ai-search" element={<AiSearchPage />} />

          {/* Indore Neighborhood Pages */}
          <Route path="/areas/:slug" element={<AreaDetailPage />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/apply-provider" element={<ApplyProviderPage />} />
          </Route>

          {/* Verified Provider Protected Routes */}
          <Route element={<ProviderRoute />}>
            <Route path="/provider" element={<ProviderDashboardPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Modals */}
      <LoginModal />
      <ReferralModal />

      {/* Mobile Sticky Navigation */}
      <MobileBottomNav />

      {/* Developer-only Toolbar (controlled via VITE_DEV_DEMO_MODE=true) */}
      <DevToolbar />

      {/* Modern Sonner Toast Notifications */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3500}
        toastOptions={{
          style: {
            borderRadius: '1rem',
            fontFamily: 'var(--font-sans, "Plus Jakarta Sans", sans-serif)',
            padding: '12px 16px',
            fontSize: '0.8125rem',
            fontWeight: '600',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          className: 'font-sans'
        }}
      />
    </div>
  )
}

export default App

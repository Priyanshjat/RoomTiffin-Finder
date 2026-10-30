import React, { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../../redux/features/auth/authSlice.js'
import {
  toggleLanguage,
  toggleTheme,
  setActiveCategory
} from '../../redux/features/ui/uiSlice.js'
import { translations } from '../../utils/translations.js'
import {
  Home,
  UtensilsCrossed,
  Sparkles,
  Gift,
  Wallet,
  LogOut,
  Menu,
  X,
  User,
  ShieldCheck,
  Lock,
  Heart,
  ClipboardList,
  MapPin,
  Globe,
  Briefcase,
  Sun,
  Moon
} from 'lucide-react'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { language = 'en', theme = 'light' } = useSelector((state) => state.ui)
  const t = translations[language] || translations.en
  const navigate = useNavigate()

  // Navbar gets the midnight look on dark-branded routes OR whenever dark theme is active
  const isDarkNav = (location.pathname === '/' || location.pathname === '/ai') || theme === 'dark'

  const handleLogout = () => {
    dispatch(logout())
    dispatch(reset())
    setMobileMenuOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 border-b ${
        isDarkNav
          ? 'bg-midnight/95 backdrop-blur-md border-midnight-border text-midnight-text'
          : 'bg-sandstone-light/95 backdrop-blur-md border-sandstone-border text-espresso'
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & City Chip */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-2.5 group"
              data-testid="navbar-logo"
            >
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-terracotta text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </span>
              <div>
                <div className="font-serif font-bold text-2xl tracking-tight leading-none flex items-center">
                  <span>{t.appName}</span>
                  <span className="text-saffron">.</span>
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-saffron flex items-center space-x-1 mt-0.5">
                  <span>Sathi AI</span>
                </div>
              </div>
            </Link>

            {/* City Badge: "Indore · more cities soon" */}
            <div
              className={`hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition ${
                isDarkNav
                  ? 'bg-midnight-card border-midnight-border text-midnight-muted'
                  : 'bg-sandstone border-sandstone-border text-espresso-muted'
              }`}
              data-testid="city-badge"
            >
              <MapPin className="w-3 h-3 text-saffron shrink-0" />
              <span>{t.cityBadge}</span>
            </div>
          </div>

          {/* Desktop Category Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" data-testid="navbar-category-links">
            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                  isActive
                    ? 'bg-terracotta text-white shadow-xs font-bold'
                    : isDarkNav
                    ? 'text-midnight-muted hover:text-white hover:bg-midnight-card'
                    : 'text-espresso-muted hover:text-espresso hover:bg-sandstone-dark'
                }`
              }
              data-testid="nav-link-rooms"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t.nav.rooms}</span>
            </NavLink>

            <NavLink
              to="/tiffin"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                  isActive
                    ? 'bg-mustard text-white shadow-xs font-bold'
                    : isDarkNav
                    ? 'text-midnight-muted hover:text-white hover:bg-midnight-card'
                    : 'text-espresso-muted hover:text-espresso hover:bg-sandstone-dark'
                }`
              }
              data-testid="nav-link-tiffin"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>{t.nav.tiffin}</span>
            </NavLink>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center space-x-2.5" data-testid="navbar-actions">
            
            {/* Sathi AI Shortcut Pill */}
            <Link
              to="/ai"
              data-testid="navbar-sathi-btn"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-saffron to-amber-500 hover:from-saffron-hover hover:to-amber-600 text-white shadow-saffron-glow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{t.nav.sathiAi}</span>
            </Link>

            {/* Language Switcher Pill */}
            <button
              type="button"
              onClick={() => dispatch(toggleLanguage())}
              data-testid="navbar-lang-toggle"
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border transition ${
                isDarkNav
                  ? 'bg-midnight-card border-midnight-border text-midnight-text hover:border-saffron'
                  : 'bg-white border-sandstone-border text-espresso hover:border-saffron'
              }`}
              title="Switch Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-saffron" />
              <span className="uppercase text-[11px]">{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Theme Toggle Pill (light / dark) */}
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              data-testid="navbar-theme-toggle"
              className={`p-2 rounded-full text-xs font-bold border transition ${
                isDarkNav
                  ? 'bg-midnight-card border-midnight-border text-midnight-text hover:border-saffron'
                  : 'bg-white border-sandstone-border text-espresso hover:border-saffron'
              }`}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-saffron" /> : <Moon className="w-4 h-4 text-espresso" />}
            </button>

            {/* Refer & Earn link */}
            <Link
              to="/refer"
              data-testid="navbar-refer-btn"
              className={`p-2 rounded-xl transition ${
                isDarkNav
                  ? 'text-midnight-muted hover:text-saffron hover:bg-midnight-card'
                  : 'text-espresso-muted hover:text-saffron hover:bg-sandstone-dark'
              }`}
              title={t.nav.refer}
            >
              <Gift className="w-4 h-4 text-saffron" />
            </Link>

            {/* Saved Bookmarks */}
            <Link
              to="/saved"
              data-testid="navbar-saved-link"
              className={`p-2 rounded-xl transition ${
                isDarkNav
                  ? 'text-midnight-muted hover:text-terracotta hover:bg-midnight-card'
                  : 'text-espresso-muted hover:text-terracotta hover:bg-sandstone-dark'
              }`}
              title={t.nav.saved}
            >
              <Heart className="w-4 h-4" />
            </Link>

            {/* List with Sathi / Provider Link */}
            <Link
              to="/apply-provider"
              data-testid="navbar-host-link"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1 transition ${
                isDarkNav
                  ? 'bg-midnight-card border-midnight-border text-midnight-muted hover:text-white'
                  : 'bg-white border-sandstone-border text-espresso-muted hover:text-espresso'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-saffron" />
              <span>{t.nav.becomeHost}</span>
            </Link>

            {/* User Session or Login Trigger */}
            {user ? (
              <div className="flex items-center space-x-2.5 pl-1" data-testid="navbar-user-profile">
                {user.userType === 'ADMIN' && (
                  <Link
                    to="/admin"
                    data-testid="navbar-admin-link"
                    className="flex items-center space-x-1 px-3 py-1.5 bg-saffron text-white rounded-xl text-xs font-bold hover:bg-saffron-hover transition shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}

                {user.userType === 'PROVIDER' && (
                  <Link
                    to="/provider"
                    data-testid="navbar-provider-link"
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100 transition"
                    title="Your Provider Dashboard"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Provider Hub</span>
                  </Link>
                )}

                <Link
                  to="/refer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald/15 text-emerald border border-emerald/30 rounded-full text-xs font-bold hover:bg-emerald/20 transition"
                  title="Wallet Credits"
                  data-testid="navbar-wallet-balance"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>₹{user.walletBalance ?? 250}</span>
                </Link>

                <Link to="/profile" className="flex items-center space-x-1.5 hover:opacity-85 transition">
                  <div className="w-8 h-8 rounded-full bg-saffron/20 text-saffron font-serif font-bold text-xs flex items-center justify-center border border-saffron/30">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  data-testid="navbar-logout-btn"
                  className={`p-2 rounded-lg transition ${
                    isDarkNav
                      ? 'text-midnight-muted hover:text-terracotta hover:bg-midnight-card'
                      : 'text-espresso-muted hover:text-terracotta hover:bg-sandstone-dark'
                  }`}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2" data-testid="navbar-auth-buttons">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  data-testid="navbar-login-btn"
                  className={`px-3 py-2 text-xs font-semibold rounded-xl transition ${
                    isDarkNav
                      ? 'text-midnight-muted hover:text-white'
                      : 'text-espresso-muted hover:text-espresso'
                  }`}
                >
                  <span>{t.nav.signIn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  data-testid="navbar-register-btn"
                  className="px-4 py-2 bg-saffron hover:bg-saffron-hover text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  <span>{t.nav.joinFree}</span>
                </button>
              </div>
            )}

          </div>

          {/* Mobile menu hamburger */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              data-testid="mobile-theme-btn"
              className="p-2 rounded-md border border-sandstone-border transition"
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-saffron" /> : <Moon className="w-4 h-4 text-espresso" />}
            </button>

            <button
              type="button"
              onClick={() => dispatch(toggleLanguage())}
              data-testid="mobile-lang-btn"
              className="px-2 py-1 rounded-md text-[11px] font-bold border border-sandstone-border"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="navbar-mobile-toggle"
              className="p-2 rounded-lg hover:bg-sandstone-dark transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 py-5 space-y-4 ${
            isDarkNav
              ? 'bg-midnight-card border-midnight-border text-midnight-text'
              : 'bg-sandstone-light border-sandstone-border text-espresso'
          }`}
          data-testid="navbar-mobile-menu"
        >
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-sandstone border border-sandstone-border text-xs font-bold flex items-center space-x-2 text-espresso"
            >
              <Home className="w-4 h-4 text-terracotta" />
              <span>{t.nav.rooms}</span>
            </Link>
            <Link
              to="/tiffin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-sandstone border border-sandstone-border text-xs font-bold flex items-center space-x-2 text-espresso"
            >
              <UtensilsCrossed className="w-4 h-4 text-mustard" />
              <span>{t.nav.tiffin}</span>
            </Link>
          </div>

          <Link
            to="/ai"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-saffron to-amber-500 text-white rounded-xl text-xs font-bold shadow-saffron-glow"
          >
            <Sparkles className="w-4 h-4" />
            <span>Chat with Sathi AI</span>
          </Link>

          {user && user.userType === 'PROVIDER' && (
            <Link
              to="/provider"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="mobile-nav-provider-link"
              className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold"
            >
              <Briefcase className="w-4 h-4" />
              <span>Provider Hub — My Listings & Requests</span>
            </Link>
          )}

          <div className="flex items-center justify-between text-xs pt-1 border-t border-sandstone-border/40">
            <Link to="/refer" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-saffron">
              {t.nav.refer} (₹200)
            </Link>
            <Link to="/apply-provider" onClick={() => setMobileMenuOpen(false)} className="font-semibold">
              {t.nav.becomeHost}
            </Link>
          </div>

          <button
            onClick={() => dispatch(toggleTheme())}
            className="flex items-center justify-between text-xs pt-1 border-t border-sandstone-border/40 w-full text-left"
          >
            <span className="font-semibold text-espresso-muted">Appearance</span>
            <span className="flex items-center space-x-1.5 font-bold text-espresso">
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-saffron" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </span>
          </button>

          {user ? (
            <div className="pt-2 border-t border-sandstone-border/40 flex justify-between items-center text-xs">
              <span className="font-bold">{user.name}</span>
              <button onClick={handleLogout} className="text-terracotta font-bold">
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                navigate('/login')
                setMobileMenuOpen(false)
              }}
              className="w-full py-2.5 bg-saffron text-white rounded-xl text-xs font-bold"
            >
              {t.nav.signIn} / {t.nav.joinFree}
            </button>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar

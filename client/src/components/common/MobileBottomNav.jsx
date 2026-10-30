import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { translations } from '../../utils/translations.js'
import { Home, Compass, Sparkles, Heart, User, Lock } from 'lucide-react'

const MobileBottomNav = () => {
  const { user } = useSelector((state) => state.auth)
  const { language = 'en' } = useSelector((state) => state.ui)
  const t = translations[language] || translations.en
  const navigate = useNavigate()
  const location = useLocation()

  const isDarkPage = location.pathname === '/' || location.pathname === '/ai'

  return (
    <nav
      aria-label="Mobile Navigation"
      data-testid="mobile-bottom-nav"
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 py-1.5 px-4 flex items-center justify-between border-t transition-colors shadow-2xl ${
        isDarkPage
          ? 'bg-midnight/95 backdrop-blur-lg border-midnight-border text-midnight-text'
          : 'bg-sandstone-light/95 backdrop-blur-lg border-sandstone-border text-espresso'
      }`}
    >
      {/* 1. Home */}
      <NavLink
        to="/"
        end
        data-testid="mobile-nav-home"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center text-[10px] font-bold transition flex-1 py-1 ${
            isActive ? 'text-saffron' : 'opacity-70 hover:opacity-100'
          }`
        }
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>{t.nav.home}</span>
      </NavLink>

      {/* 2. Explore / Rooms */}
      <NavLink
        to="/rooms"
        data-testid="mobile-nav-explore"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center text-[10px] font-bold transition flex-1 py-1 ${
            isActive ? 'text-terracotta' : 'opacity-70 hover:opacity-100'
          }`
        }
      >
        <Compass className="w-5 h-5 mb-0.5" />
        <span>Explore</span>
      </NavLink>

      {/* 3. CENTER HIGHLIGHTED SATHI AI BUTTON */}
      <div className="flex-1 flex justify-center -mt-5">
        <NavLink
          to="/ai"
          data-testid="mobile-nav-sathi"
          className={({ isActive }) =>
            `w-13 h-13 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 ${
              isActive
                ? 'bg-gradient-to-tr from-saffron to-amber-500 text-white ring-4 ring-saffron/30 scale-105'
                : 'bg-gradient-to-tr from-midnight-card via-midnight to-midnight-light border border-saffron/50 text-saffron ring-4 ring-midnight/40'
            }`
          }
          title="Sathi AI Planner"
        >
          <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
          <span className="text-[9px] font-black uppercase tracking-tighter text-white mt-0.5">SATHI</span>
        </NavLink>
      </div>

      {/* 4. Saved */}
      <NavLink
        to="/saved"
        data-testid="mobile-nav-saved"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center text-[10px] font-bold transition flex-1 py-1 ${
            isActive ? 'text-terracotta' : 'opacity-70 hover:opacity-100'
          }`
        }
      >
        <Heart className="w-5 h-5 mb-0.5" />
        <span>{t.nav.saved}</span>
      </NavLink>

      {/* 5. Profile or Sign In */}
      {user ? (
        <NavLink
          to="/profile"
          data-testid="mobile-nav-profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center text-[10px] font-bold transition flex-1 py-1 ${
              isActive ? 'text-saffron' : 'opacity-70 hover:opacity-100'
            }`
          }
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>{t.nav.profile}</span>
        </NavLink>
      ) : (
        <button
          type="button"
          onClick={() => navigate('/login')}
          data-testid="mobile-nav-signin"
          className="flex flex-col items-center justify-center text-[10px] font-bold opacity-70 hover:opacity-100 transition flex-1 py-1"
        >
          <Lock className="w-5 h-5 mb-0.5" />
          <span>{t.nav.signIn}</span>
        </button>
      )}
    </nav>
  )
}

export default MobileBottomNav

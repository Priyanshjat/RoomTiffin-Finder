import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { closeLoginModal } from '../../redux/features/ui/uiSlice.js'
import {
  X,
  Lock,
  User,
  UtensilsCrossed,
  Home,
  ArrowRight,
  Sparkles
} from 'lucide-react'

/**
 * LoginModal — a themed gateway instead of an inline auth form.
 * All sign-in / sign-up traffic is routed to the dedicated pages:
 *   /login    (beautiful split-screen sign in)
 *   /register  (beautiful split-screen create account)
 * The `loginModalMessage` context (e.g. "Sign in to schedule a free tour...")
 * is carried over and surfaced as a notice on those pages.
 */
const LoginModal = () => {
  const { isLoginModalOpen, loginModalMessage } = useSelector((state) => state.ui)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (!isLoginModalOpen) return null

  const go = (path, notice) => {
    dispatch(closeLoginModal())
    navigate(path, { state: notice ? { authNotice: notice } : {} })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/70 backdrop-blur-xs animate-in fade-in duration-200"
      data-testid="login-modal-overlay"
      onClick={() => dispatch(closeLoginModal())}
    >
      <div
        className="bg-white w-full max-w-sm rounded-3xl border border-sandstone-border shadow-2xl overflow-hidden relative"
        data-testid="login-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeLoginModal())}
          data-testid="login-modal-close-btn"
          className="absolute top-3.5 right-3.5 p-2 rounded-full text-espresso-muted hover:text-espresso hover:bg-sandstone-dark transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-7 pt-8 pb-5 text-center">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-terracotta-light text-terracotta rounded-full text-[11px] font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Marketplace Sign In</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-espresso mt-2.5" data-testid="login-modal-title">
            Almost there!
          </h2>
          <p className="text-xs text-espresso-muted mt-1.5 leading-relaxed" data-testid="login-modal-message">
            {loginModalMessage || 'Sign in to unlock exact addresses, host phone numbers, and apply wallet credits.'}
          </p>
        </div>

        {/* Contextual chips */}
        <div className="px-7 flex items-center justify-center gap-2 pb-5">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-sandstone border border-sandstone-border text-[10px] font-semibold text-espresso-muted">
            <Home className="w-3 h-3 text-saffron" />
            <span>Verified Rooms</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-sandstone border border-sandstone-border text-[10px] font-semibold text-espresso-muted">
            <UtensilsCrossed className="w-3 h-3 text-emerald" />
            <span>Home Tiffins</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-sandstone border border-sandstone-border text-[10px] font-semibold text-espresso-muted">
            <Sparkles className="w-3 h-3 text-teal" />
            <span>AI Search</span>
          </span>
        </div>

        {/* Gateway actions */}
        <div className="px-7 pb-7 space-y-3">
          <button
            type="button"
            onClick={() => go('/login', loginModalMessage)}
            className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-saffron to-terracotta hover:from-saffron-hover hover:to-terracotta text-white text-sm font-bold shadow-lg shadow-saffron/25 transition flex items-center justify-center space-x-2"
          >
            <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center">
              <Lock className="w-3 h-3" />
            </span>
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => go('/register', loginModalMessage)}
            className="w-full py-3 px-4 rounded-full border-2 border-sandstone-border text-espresso text-sm font-bold hover:border-saffron hover:text-saffron-dark transition flex items-center justify-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>Create a Free Account</span>
          </button>

          <p className="text-center text-[10.5px] text-espresso-light leading-relaxed pt-1">
            Free forever — no commissions, no brokerage, no hidden fees.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
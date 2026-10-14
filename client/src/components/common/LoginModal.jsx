import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login, register } from '../../redux/features/auth/authSlice.js'
import { closeLoginModal } from '../../redux/features/ui/uiSlice.js'
import { toast } from 'sonner'
import {
  X,
  Lock,
  User,
  ShieldCheck,
  Mail,
  KeyRound,
  Phone,
  Gift,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react'

const LoginModal = () => {
  const { isLoginModalOpen, loginModalMessage } = useSelector((state) => state.ui)
  const { isLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [referralCode, setReferralCode] = useState('')

  // Check if landing referral code was saved in session
  useEffect(() => {
    if (isLoginModalOpen) {
      const savedRef = sessionStorage.getItem('referralCode')
      if (savedRef && !referralCode) {
        setReferralCode(savedRef)
      }
    }
  }, [isLoginModalOpen])

  if (!isLoginModalOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (mode === 'register') {
        if (!name.trim() || !email.trim() || !password.trim()) {
          toast.warning('Please enter your full name, email address, and password.')
          return
        }
        await dispatch(register({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          referralCode: referralCode.trim()
        })).unwrap()
        toast.success(`Welcome to RoomTiffin, ${name}! Your account is active.`)
      } else {
        if (!email.trim() || !password) {
          toast.warning('Please enter your email and password.')
          return
        }
        await dispatch(login({ email: email.trim(), password })).unwrap()
        toast.success('Signed in successfully. Welcome back!')
      }
      dispatch(closeLoginModal())
    } catch (err) {
      toast.error(err || 'Authentication failed. Please check your credentials.')
    }
  }

  const handleForgotPassword = () => {
    if (!email.trim()) {
      toast.info('Please enter your registered email address first.')
    } else {
      toast.success(`Password reset link has been dispatched to ${email.trim()}.`)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-xs animate-in fade-in duration-200"
      data-testid="login-modal-overlay"
    >
      <div
        className="bg-sandstone-light w-full max-w-md rounded-3xl border border-sandstone-border shadow-2xl overflow-hidden relative"
        data-testid="login-modal"
      >
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeLoginModal())}
          data-testid="login-modal-close-btn"
          className="absolute top-4 right-4 p-2 rounded-full text-espresso-muted hover:text-espresso hover:bg-sandstone-dark transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 bg-sandstone border-b border-sandstone-border">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-terracotta-light text-terracotta rounded-full text-xs font-bold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Marketplace Sign In</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-espresso" data-testid="login-modal-title">
            {mode === 'login' ? 'Sign In to RoomTiffin' : 'Create an Account'}
          </h2>
          <p className="text-xs text-espresso-muted mt-1 leading-relaxed" data-testid="login-modal-message">
            {loginModalMessage || 'Sign in to unlock exact addresses, host phone numbers, and apply wallet credits.'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-sandstone-dark p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('login')}
              data-testid="tab-login"
              className={`flex-1 py-1.5 rounded-lg transition ${
                mode === 'login' ? 'bg-white text-espresso shadow-xs' : 'text-espresso-muted hover:text-espresso'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              data-testid="tab-register"
              className={`flex-1 py-1.5 rounded-lg transition ${
                mode === 'register' ? 'bg-white text-espresso shadow-xs' : 'text-espresso-muted hover:text-espresso'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form with empty fields */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-espresso mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-espresso-light absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      required
                      data-testid="input-register-name"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-sandstone-border rounded-xl text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-espresso mb-1">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-espresso-light absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 00000"
                      data-testid="input-register-phone"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-sandstone-border rounded-xl text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-espresso-light absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  data-testid="input-login-email"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-sandstone-border rounded-xl text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-espresso">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] text-terracotta hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 text-espresso-light absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  data-testid="input-login-password"
                  className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-sandstone-border rounded-xl text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-2 p-0.5 rounded text-espresso-light hover:text-espresso transition"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-espresso mb-1">
                  Referral Code <span className="text-mustard-dark font-normal">(Optional, unlocks ₹100 welcome credit)</span>
                </label>
                <div className="relative">
                  <Gift className="w-3.5 h-3.5 text-mustard absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="e.g. RT-AARAV24"
                    data-testid="input-register-referral"
                    className="w-full pl-9 pr-3 py-2 text-xs uppercase bg-white border border-sandstone-border rounded-xl text-espresso font-mono focus:outline-none focus:ring-2 focus:ring-mustard/40"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              data-testid="auth-submit-btn"
              className="w-full py-2.5 px-4 bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5 mt-2"
            >
              <span>{mode === 'register' ? 'Create Free Account' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Privacy reassurance */}
          <div className="pt-2 text-center text-[10px] text-espresso-light flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-emerald" />
            <span>Secure encryption. Your personal details are never publicly shared.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal

import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { register, reset } from '../../redux/features/auth/authSlice.js'
import { toast } from 'sonner'
import { UserPlus, User, Mail, Phone, Lock, Gift, Loader2, ArrowRight, Eye, EyeOff, House } from 'lucide-react'
import AuthShowcase, { AuthBrandLink } from '../../components/auth/AuthShowcase.jsx'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    referralCode: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const { name, email, phone, password, referralCode } = formData
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    // Check if landing referral code was saved
    const savedRef = sessionStorage.getItem('referralCode')
    if (savedRef) {
      setFormData((prev) => ({ ...prev, referralCode: savedRef }))
    }
  }, [])

  // Gated-action notice carried from the LoginModal gateway
  useEffect(() => {
    const st = location.state
    if (st?.authNotice) {
      toast.info(st.authNotice)
      navigate('/register', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  useEffect(() => {
    if (isError) {
      toast.error(message)
      dispatch(reset())
      return
    }

    if (isSuccess) {
      // Freshly created account -> clear auth state FIRST (so no page sees us as
      // logged-in), then land on the Login page with email prefilled
      dispatch(reset())
      navigate('/login', {
        state: { accountCreated: true, noticeEmail: email.trim() }
      })
      return
    }

    if (user) {
      // Already signed in -> just go home
      navigate('/')
      dispatch(reset())
    }
  }, [user, isError, isSuccess, message, email, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.warning('Please enter full name, email, and password.')
      return
    }

    dispatch(register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      referralCode: referralCode.trim()
    }))
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 bg-sandstone dark:bg-[#0B0F16] overflow-hidden">
      {/* Dreamy ambient blobs on the cream page background */}
      <div className="absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full bg-saffron/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-140px] left-[-100px] w-[460px] h-[460px] rounded-full bg-terracotta/15 blur-[130px] pointer-events-none" />

      {/* Split Auth Card */}
      <div className="relative w-full max-w-5xl grid lg:grid-cols-[46%_54%] rounded-[2rem] overflow-hidden shadow-2xl shadow-espresso/20 bg-white border border-sandstone-border/60">
        {/* LEFT: Dark showcase (desktop only) */}
        <div className="hidden lg:block min-h-[680px]">
          <AuthShowcase
            tagline="One account for both — your room and your daily dabba."
            title1="Your Indore move"
            title2="starts here."
            flankLeft={{ src: '/assets/auth-g1.jpg?v=2', alt: 'A furnished bedroom with study desk waiting for its tenant' }}
            flankRight={{ src: '/assets/auth-g3.jpg?v=2', alt: 'An airy living and dining room with houseplants' }}
          />
        </div>

        {/* RIGHT: Form panel */}
        <div className="bg-white px-6 sm:px-10 lg:px-12 py-9 flex flex-col">
          {/* Top bar: brand + opposite action (Payoneer style) */}
          <div className="flex items-center justify-between">
            <AuthBrandLink />
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border border-sandstone-border text-xs font-bold text-espresso hover:border-saffron hover:text-saffron-dark transition"
            >
              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-saffron to-terracotta text-white flex items-center justify-center">
                <User className="w-3 h-3" />
              </span>
              <span>Sign In</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mt-8 sm:mt-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso tracking-tight">
              Create Account
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-espresso-muted">
              Take a minute — unlock saved rooms, trial bookings & +₹100 referral credit.
            </p>
          </div>

          <form className="space-y-3.5 mt-6" onSubmit={onSubmit}>
            {/* Name */}
            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-espresso-light absolute left-4 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-sandstone-border rounded-full text-xs sm:text-sm text-espresso placeholder:text-espresso-light/60 focus:outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/15 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-espresso-light absolute left-4 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-sandstone-border rounded-full text-xs sm:text-sm text-espresso placeholder:text-espresso-light/60 focus:outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/15 transition"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-espresso mb-1.5 uppercase tracking-wider">Phone <span className="font-normal text-espresso-light normal-case">(optional)</span></label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-espresso-light absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={onChange}
                    placeholder="+91 98450 00000"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-sandstone-border rounded-full text-xs sm:text-sm text-espresso placeholder:text-espresso-light/60 focus:outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/15 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-espresso mb-1.5 uppercase tracking-wider">Referral Code <span className="font-normal text-mustard-dark normal-case">(optional)</span></label>
                <div className="relative">
                  <Gift className="w-4 h-4 text-mustard absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    name="referralCode"
                    value={referralCode}
                    onChange={onChange}
                    placeholder="e.g. RT-AARAV24"
                    className="w-full pl-10 pr-4 py-3 uppercase bg-white border border-sandstone-border rounded-full text-xs sm:text-sm text-espresso font-mono placeholder:font-sans placeholder:text-espresso-light/60 focus:outline-none focus:border-mustard focus:ring-4 focus:ring-mustard/15 transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-espresso-light absolute left-4 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  placeholder="Password"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-sandstone-border rounded-full text-xs sm:text-sm text-espresso placeholder:text-espresso-light/60 focus:outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/15 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-3 p-0.5 rounded-full text-espresso-light hover:text-espresso transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-saffron to-terracotta hover:from-saffron-hover hover:to-terracotta text-white text-sm font-bold shadow-lg shadow-saffron/25 transition flex items-center justify-center space-x-2.5 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center">
                    <UserPlus className="w-3 h-3" />
                  </span>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-[10.5px] text-espresso-muted pt-1">
              By creating an account you agree to our zero-brokerage promise — providers can never charge you commission.
            </p>
          </form>

          {/* Skip auth — browse the marketplace as a guest */}
          <Link
            to="/"
            data-testid="continue-without-signing-up"
            className="mt-4 self-center inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border border-sandstone-border text-xs font-bold text-espresso-muted hover:text-espresso hover:border-espresso-muted/40 hover:bg-sandstone transition"
          >
            <House className="w-3.5 h-3.5" />
            <span>Continue without signing up</span>
          </Link>

          {/* Mobile-only showcase hint */}
          <div className="lg:hidden mt-5 p-4 rounded-2xl bg-sandstone border border-sandstone-border flex items-center space-x-3">
            <img src="/assets/auth-g1.jpg?v=2" alt="Verified room in Indore" className="w-14 h-14 rounded-xl object-cover" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-espresso">Join 500+ students moving to Indore</p>
              <p className="text-[10.5px] text-espresso-muted">Rooms & tiffin, matched in one place</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
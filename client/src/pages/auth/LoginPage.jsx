import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { login, reset } from '../../redux/features/auth/authSlice.js'
import { toast } from 'sonner'
import { LogIn, Mail, Lock, Loader2, ArrowRight, ShieldCheck, Eye, EyeOff, House } from 'lucide-react'
import AuthShowcase, { AuthBrandLink } from '../../components/auth/AuthShowcase.jsx'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Block the "auto-home" redirect while this mount originated from account
  // registration (stale register feedback must not count as a sign-in).
  // Unblocked the moment the user actually submits a login.
  const fromRegisterRef = useRef(Boolean(location.state?.accountCreated))

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  // Coming from a gated action or a freshly created account -> contextual notice
  useEffect(() => {
    const st = location.state
    if (st?.authNotice) {
      toast.info(st.authNotice)
      navigate('/login', { replace: true, state: {} })
      return
    }
    if (st?.accountCreated) {
      if (st.noticeEmail) setFormData((prev) => ({ ...prev, email: st.noticeEmail }))
      if (!sessionStorage.getItem('accountCreatedToastShown')) {
        sessionStorage.setItem('accountCreatedToastShown', '1')
        toast.success('Account created! Sign in to start exploring Indore.')
      }
      // clear the router state safely (keeps react-router's history integrity)
      navigate('/login', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if ((isSuccess || user) && !fromRegisterRef.current) {
      toast.success(`Welcome back, ${user?.name || 'User'}!`)
      if (user?.userType === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.warning('Please enter both your email address and password.')
      return
    }

    // A real sign-in attempt: allow the post-success redirect again
    fromRegisterRef.current = false
    dispatch(login({ email: email.trim(), password }))
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 bg-sandstone dark:bg-[#0B0F16] overflow-hidden">
      {/* Dreamy ambient blobs on the cream page background */}
      <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-saffron/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-140px] right-[-100px] w-[460px] h-[460px] rounded-full bg-teal/15 blur-[130px] pointer-events-none" />

      {/* Split Auth Card */}
      <div className="relative w-full max-w-5xl grid lg:grid-cols-[46%_54%] rounded-[2rem] overflow-hidden shadow-2xl shadow-espresso/20 bg-white border border-sandstone-border/60">
        {/* LEFT: Dark showcase (desktop only) */}
        <div className="hidden lg:block min-h-[640px]">
          <AuthShowcase
            tagline="Zero-brokerage rooms & homestyle tiffin — all of Indore in one place."
            title1="Find your room."
            title2="Find your tiffin."
            flankLeft={{ src: '/assets/auth-g4.jpg?v=2', alt: 'Host handing over room keys at the door' }}
            flankRight={{ src: '/assets/auth-g2.jpg?v=2', alt: 'Two friends chatting over chai on a home sofa' }}
          />
        </div>

        {/* RIGHT: Form panel */}
        <div className="bg-white px-6 sm:px-10 lg:px-12 py-9 flex flex-col">
          {/* Top bar: brand + opposite action (Payoneer style) */}
          <div className="flex items-center justify-between">
            <AuthBrandLink />
            <Link
              to="/register"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border border-sandstone-border text-xs font-bold text-espresso hover:border-saffron hover:text-saffron-dark transition"
            >
              <span className="w-4 h-4 rounded-full bg-gradient-to-br from-saffron to-terracotta text-white flex items-center justify-center text-[9px] font-black">+</span>
              <span>Sign Up</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mt-10 sm:mt-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso tracking-tight">
              Sign In
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-espresso-muted">
              Welcome back — your saved rooms and tiffin picks are waiting.
            </p>
          </div>

          <form className="space-y-4 mt-7" onSubmit={onSubmit}>
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
                  placeholder="Email or username"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-sandstone-border rounded-full text-xs sm:text-sm text-espresso placeholder:text-espresso-light/60 focus:outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/15 transition"
                />
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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center">
                    <LogIn className="w-3 h-3" />
                  </span>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 flex items-center justify-center text-[11px] text-espresso-muted space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
              <span>Encrypted & secure — your details stay private</span>
            </div>
          </form>

          {/* Skip auth — browse the marketplace as a guest */}
          <Link
            to="/"
            data-testid="continue-without-signing-in"
            className="mt-4 self-center inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border border-sandstone-border text-xs font-bold text-espresso-muted hover:text-espresso hover:border-espresso-muted/40 hover:bg-sandstone transition"
          >
            <House className="w-3.5 h-3.5" />
            <span>Continue without signing in</span>
          </Link>

          {/* Mobile-only showcase hint */}
          <div className="lg:hidden mt-6 p-4 rounded-2xl bg-sandstone border border-sandstone-border flex items-center space-x-3">
            <img src="/assets/auth-g5.jpg?v=2" alt="Homestyle tiffin" className="w-14 h-14 rounded-xl object-cover" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-espresso">Zero-brokerage rooms & homestyle tiffin</p>
              <p className="text-[10.5px] text-espresso-muted">Verified providers across 12 Indore areas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
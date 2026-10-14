import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { register, reset } from '../../redux/features/auth/authSlice.js'
import { toast } from 'sonner'
import { UserPlus, User, Mail, Phone, Lock, Gift, Loader2, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    userType: 'USER',
    referralCode: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const { name, email, phone, password, userType, referralCode } = formData
  const dispatch = useDispatch()
  const navigate = useNavigate()

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

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      toast.success('Registration successful! Welcome to RoomTiffin Finder.')
      navigate('/')
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

    if (!name || !email || !password) {
      toast.warning('Please enter full name, email, and password.')
      return
    }

    dispatch(register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      userType,
      referralCode: referralCode.trim()
    }))
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-sandstone">
      <div className="max-w-md w-full space-y-6 bg-sandstone-light p-8 rounded-3xl border border-sandstone-border shadow-md">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-terracotta text-white mb-2 shadow-xs">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso tracking-tight">
            Create Your Account
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-espresso-muted">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-terracotta hover:underline">
              Sign in to your account
            </Link>
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-xs font-bold text-espresso mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-espresso-light absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                placeholder="e.g. Aarav Sharma"
                className="w-full pl-9 pr-3 py-2 bg-white border border-sandstone-border rounded-xl text-xs sm:text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-espresso mb-1">Account Role</label>
            <select
              name="userType"
              value={userType}
              onChange={onChange}
              className="w-full px-3 py-2 bg-white border border-sandstone-border rounded-xl text-xs sm:text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 transition"
            >
              <option value="USER">Normal User (Tenant / Renter)</option>
              <option value="ADMIN">Administrator (Platform Manager)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-espresso mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-espresso-light absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 bg-white border border-sandstone-border rounded-xl text-xs sm:text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-espresso mb-1">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-espresso-light absolute left-3 top-3 pointer-events-none" />
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={onChange}
                placeholder="+91 98450 00000"
                className="w-full pl-9 pr-3 py-2 bg-white border border-sandstone-border rounded-xl text-xs sm:text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-espresso mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-espresso-light absolute left-3 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={onChange}
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 bg-white border border-sandstone-border rounded-xl text-xs sm:text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-2.5 p-0.5 rounded text-espresso-light hover:text-espresso transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-espresso mb-1">
              Referral Code <span className="font-normal text-mustard-dark">(Optional: unlocks ₹100 welcome credit)</span>
            </label>
            <div className="relative">
              <Gift className="w-4 h-4 text-mustard absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                name="referralCode"
                value={referralCode}
                onChange={onChange}
                placeholder="e.g. RT-AARAV24"
                className="w-full pl-9 pr-3 py-2 uppercase bg-white border border-sandstone-border rounded-xl text-xs sm:text-sm text-espresso font-mono focus:outline-none focus:ring-2 focus:ring-mustard/40 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage

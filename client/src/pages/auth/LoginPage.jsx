import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { login, reset } from '../../redux/features/auth/authSlice.js'
import { toast } from 'sonner'
import { LogIn, Mail, Lock, Loader2, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
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

    dispatch(login({ email: email.trim(), password }))
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-sandstone">
      <div className="max-w-md w-full space-y-6 bg-sandstone-light p-8 rounded-3xl border border-sandstone-border shadow-md">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-terracotta text-white mb-3 shadow-xs">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso tracking-tight">
            Sign In to RoomTiffin
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-espresso-muted">
            Or{' '}
            <Link to="/register" className="font-semibold text-terracotta hover:underline">
              create a new account (+₹100 welcome bonus)
            </Link>
          </p>
        </div>

        <form className="space-y-4 pt-2" onSubmit={onSubmit}>
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
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-sandstone-border rounded-xl text-xs sm:text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 transition"
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
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-sandstone-border rounded-xl text-xs sm:text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 transition"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center text-[11px] text-espresso-muted flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
            <span>Secure encryption • Your account details are protected</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

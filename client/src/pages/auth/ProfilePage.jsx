import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProfile, updateProfile } from '../../redux/features/auth/authSlice.js'
import { toast } from 'sonner'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Wallet,
  Gift,
  Share2,
  Copy,
  CheckCircle,
  Briefcase,
  ShieldCheck,
  Loader2
} from 'lucide-react'

const ProfilePage = () => {
  const { user, isLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      })
    }
  }, [user])

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(updateProfile(formData)).unwrap()
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err || 'Failed to update profile')
    }
  }

  const handleCopyCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode)
      setCopied(true)
      toast.info('Referral code copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join RoomTiffin Finder and get ₹50 welcome bonus! Use my referral code: ${user?.referralCode || ''} at ${window.location.origin}/register`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
        <p className="text-sm text-gray-500">Manage your profile, wallet balance, and referral rewards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Cards (Wallet & Referrals) */}
        <div className="space-y-6">
          {/* Wallet Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Wallet Balance</span>
              <Wallet className="w-5 h-5 text-blue-200" />
            </div>
            <div className="text-3xl font-extrabold mb-1">
              ₹{user?.walletBalance || 0}
            </div>
            <p className="text-xs text-blue-100">
              Redeemable against your room and tiffin bookings!
            </p>
          </div>

          {/* Referral Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-orange-600 font-bold">
              <Gift className="w-5 h-5" />
              <span>Refer & Earn</span>
            </div>
            <p className="text-xs text-gray-600">
              Invite friends to RoomTiffin Finder. They get ₹50 on signup, and you get rewarded after their first booking!
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-600">Your Code</span>
                <div className="text-lg font-mono font-extrabold text-gray-900">
                  {user?.referralCode || 'N/A'}
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-2 text-gray-600 hover:text-orange-600 rounded-lg hover:bg-orange-100 transition"
                title="Copy Code"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={handleShareWhatsApp}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>

          {/* Role Status Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase">Account Type</span>
            <div className="flex items-center space-x-2 mt-2">
              {user?.userType === 'ADMIN' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Admin
                </span>
              )}
              {user?.userType === 'PROVIDER' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  <Briefcase className="w-3.5 h-3.5 mr-1" /> Verified Provider
                </span>
              )}
              {user?.userType === 'USER' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                  <User className="w-3.5 h-3.5 mr-1" /> Regular User / Tenant
                </span>
              )}
            </div>

            {user?.userType === 'USER' && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <a
                  href="/apply-provider"
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <span>Want to list your Room or Tiffin? Apply here &rarr;</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Update Profile Form */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Personal Details
          </h2>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Read-only)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={onChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address / Locality (Indore)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={onChange}
                  placeholder="e.g. Bhawarkua, Indore"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

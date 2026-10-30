import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { applyProvider } from '../../redux/features/auth/authSlice.js'
import authService from '../../services/authService.js'
import { toast } from 'sonner'
import {
  Briefcase,
  Home,
  UtensilsCrossed,
  CheckCircle,
  Clock,
  Building,
  Phone,
  MapPin,
  Loader2,
  Pencil,
  Save
} from 'lucide-react'

// Shared form fields used for both new applications and editing a pending application
const ProviderFormFields = ({ data, setData }) => {
  const onChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <>
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Select Your Primary Service *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { type: 'ROOM', label: 'Room / PG', icon: Home },
            { type: 'TIFFIN', label: 'Tiffin / Mess', icon: UtensilsCrossed },
          ].map((item) => {
            const Icon = item.icon
            const selected = data.providerType === item.type
            return (
              <button
                type="button"
                key={item.type}
                onClick={() => setData((prev) => ({ ...prev, providerType: item.type }))}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                  selected
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${selected ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="text-xs">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business / Hostel / Service Name *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Building className="w-5 h-5" />
          </div>
          <input
            type="text"
            name="businessName"
            value={data.businessName}
            onChange={onChange}
            required
            placeholder="e.g. Sharma PG & Rooms / Annapurna Rasoi"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact / Booking Phone Number *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Phone className="w-5 h-5" />
          </div>
          <input
            type="tel"
            name="contactNumber"
            value={data.contactNumber}
            onChange={onChange}
            required
            placeholder="9876543210"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Address / Operating Area (Indore) *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <MapPin className="w-5 h-5" />
          </div>
          <input
            type="text"
            name="businessAddress"
            value={data.businessAddress}
            onChange={onChange}
            required
            placeholder="e.g. Scheme 54, Near C21 Mall, Vijay Nagar, Indore"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description / Facilities Summary
        </label>
        <textarea
          name="description"
          rows={3}
          value={data.description}
          onChange={onChange}
          placeholder="Tell tenants about your rooms or meal plans..."
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  )
}

const ApplyProviderPage = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [existingProfile, setExistingProfile] = useState(null)
  const [fetchingProfile, setFetchingProfile] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingApplication, setEditingApplication] = useState(false)
  const [editData, setEditData] = useState(null)
  const [savingChanges, setSavingChanges] = useState(false)

  const [formData, setFormData] = useState({
    businessName: '',
    providerType: 'ROOM',
    contactNumber: user?.phone || '',
    businessAddress: '',
    description: '',
  })

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const data = await authService.getMyProviderProfile()
        setExistingProfile(data)
      } catch (err) {
        // Not a provider yet, this is expected
        setExistingProfile(null)
      } finally {
        setFetchingProfile(false)
      }
    }

    if (user) {
      fetchExisting()
    }
  }, [user])

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!formData.businessName || !formData.providerType || !formData.contactNumber || !formData.businessAddress) {
      toast.warning('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const res = await dispatch(applyProvider(formData)).unwrap()
      setExistingProfile(res)
      toast.success('Application submitted successfully! Awaiting admin verification.')
    } catch (err) {
      toast.error(err || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  const onUpdate = async (e) => {
    e.preventDefault()

    if (!editData.businessName || !editData.providerType || !editData.contactNumber || !editData.businessAddress) {
      toast.warning('Please fill in all required fields')
      return
    }

    setSavingChanges(true)
    try {
      const updated = await authService.updateProviderProfile(editData)
      setExistingProfile(updated)
      setEditingApplication(false)
      toast.success('Application details updated successfully!')
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update application'
      toast.error(message)
    } finally {
      setSavingChanges(false)
    }
  }

  if (fetchingProfile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  // If already applied
  if (existingProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          {existingProfile.isVerified ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">You are a Verified Provider!</h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Your business <strong>{existingProfile.businessName}</strong> ({existingProfile.providerType}) is verified. You can now add and manage listings in your Provider Hub.
              </p>
              <div className="pt-4">
                <a
                  href="/provider"
                  className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm"
                >
                  Go to Provider Dashboard
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Application Under Review</h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                We received your application for <strong>{existingProfile.businessName}</strong>. Our admin team verifies all providers to maintain community trust. You will be able to create listings once verified!
              </p>
              <div className="bg-gray-50 rounded-xl p-4 text-left max-w-md mx-auto text-xs text-gray-600 space-y-1">
                <div><strong>Category:</strong> {existingProfile.providerType}</div>
                <div><strong>Address:</strong> {existingProfile.businessAddress}</div>
                <div><strong>Contact:</strong> {existingProfile.contactNumber}</div>
                <div><strong>Status:</strong> <span className="text-amber-600 font-bold">Pending Admin Verification</span></div>
              </div>

              {editingApplication ? (
                <form onSubmit={onUpdate} className="mt-6 max-w-md mx-auto text-left space-y-5">
                  <ProviderFormFields data={editData} setData={setEditData} />
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingApplication(false)}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingChanges}
                      className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm disabled:opacity-50"
                    >
                      {savingChanges ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Update Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditData({
                      businessName: existingProfile.businessName || '',
                      providerType: existingProfile.providerType || 'ROOM',
                      contactNumber: existingProfile.contactNumber || '',
                      businessAddress: existingProfile.businessAddress || '',
                      description: existingProfile.description || '',
                    })
                    setEditingApplication(true)
                  }}
                  className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Application Details
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Become a Verified Provider</h1>
          <p className="text-sm text-gray-500 mt-1">
            List your rental rooms and homestyle tiffins in Indore
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <ProviderFormFields data={formData} setData={setFormData} />

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                'Submit Application for Verification'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApplyProviderPage

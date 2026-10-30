import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Plus,
  CheckCircle,
  Home,
  UtensilsCrossed,
  Pencil,
  Trash2,
  Loader2,
  ClipboardList,
  X,
  MapPin,
  Clock,
  Building2,
  Phone,
  FileText
} from 'lucide-react'
import {
  useMyProviderListings,
  useProviderInquiries,
  useCreateListing,
  useUpdateListing,
  useDeleteListing
} from '../../hooks/useProviderListings.js'
import { fetchMyProviderProfile, updateProviderProfile } from '../../services/providerService.js'
import ListingForm from '../../components/provider/ListingForm.jsx'

const GROUPS = [
  { key: 'rooms', apiCategory: 'rooms', title: 'Rooms & PGs', icon: Home, color: 'blue' },
  { key: 'tiffins', apiCategory: 'tiffin', title: 'Tiffin Services', icon: UtensilsCrossed, color: 'orange' }
]

const getGroupItemView = (group, item) => {
  switch (group.key) {
    case 'rooms':
      return {
        title: item.title,
        subtitle: `${item.roomType?.toUpperCase()} • Preferred: ${item.preferredTenant || 'ANY'}`,
        price: item.rent ? `₹${item.rent}/month` : '',
        image: item.images?.[0]
      }
    case 'tiffins':
      return {
        title: item.name,
        subtitle: `${item.cuisineType || ''} • ${item.mealType || ''}`,
        price: item.monthlyPrice ? `₹${item.monthlyPrice}/month` : '',
        image: item.images?.[0]
      }
    default:
      return { title: '-', subtitle: '', price: '', image: null }
  }
}

const ProviderDashboardPage = () => {
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('listings')
  // form state: null | { category, initial }
  const [formState, setFormState] = useState(null)

  // Business profile — the data the provider submitted with their application
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    businessName: '',
    providerType: 'ROOM',
    contactNumber: '',
    businessAddress: '',
    description: ''
  })
  const [savingProfile, setSavingProfile] = useState(false)

  const { data: listings, isLoading: loadingListings, isError } = useMyProviderListings(Boolean(user))
  const { data: inquiries, isLoading: loadingInquiries } = useProviderInquiries(Boolean(user))

  // Load the provider's pre-existing application data
  React.useEffect(() => {
    let alive = true
    fetchMyProviderProfile()
      .then((p) => {
        if (!alive || !p || !p.businessName) return
        setProfile(p)
        setProfileForm({
          businessName: p.businessName || '',
          providerType: p.providerType || 'ROOM',
          contactNumber: p.contactNumber || '',
          businessAddress: p.businessAddress || '',
          description: p.description || ''
        })
      })
      .catch(() => { /* no application on file yet */ })
      .finally(() => { if (alive) setProfileLoading(false) })
    return () => { alive = false }
  }, [])

  const saveProfile = async () => {
    if (!profileForm.businessName?.trim() || !profileForm.contactNumber?.trim() || !profileForm.businessAddress?.trim()) {
      toast.warning('Business name, contact number and address cannot be empty!')
      return
    }
    setSavingProfile(true)
    try {
      const updated = await updateProviderProfile(profileForm)
      setProfile(updated)
      setEditingProfile(false)
      toast.success('Business profile updated')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const createMutation = useCreateListing()
  const updateMutation = useUpdateListing()
  const deleteMutation = useDeleteListing()

  const listingsIndex = React.useMemo(() => {
    const map = {}
    if (listings) {
      GROUPS.forEach((g) => {
        ;(listings[g.key] || []).forEach((item) => { map[String(item._id)] = { item, group: g } })
      })
    }
    return map
  }, [listings])

  const handleSaved = async (apiCategory, initial, payload) => {
    if (initial?._id) {
      await updateMutation.mutateAsync({ category: apiCategory, id: initial._id, payload })
    } else {
      await createMutation.mutateAsync({ category: apiCategory, payload })
    }
    setFormState(null)
  }

  const handleDelete = async (group, item) => {
    if (!window.confirm(`Delete "${getGroupItemView(group, item).title}"? This cannot be undone.`)) return
    try {
      await deleteMutation.mutateAsync({ category: group.apiCategory, id: item._id })
      toast.success('Listing deleted successfully')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete listing')
    }
  }

  const totalListings = listings?.counts?.totalListings ?? 0
  const totalRequests = inquiries?.counts?.totalRequests ?? 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Briefcase className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Provider Hub</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            List, update and manage your rooms and tiffin services.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Verified Provider
          </span>
        </div>
      </div>

      {/* Business Profile — pre-existing data from the provider application */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm mt-6" data-testid="provider-profile-card">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-gray-900">My Business Profile</h2>
              <p className="text-xs text-gray-400">From your provider application — kept with your dashboard</p>
            </div>
          </div>
          {profile && !editingProfile && (
            <button
              type="button"
              onClick={() => setEditingProfile(true)}
              data-testid="provider-profile-edit"
              className="inline-flex items-center px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition"
            >
              <Pencil className="w-3.5 h-3.5 mr-1" />
              Edit
            </button>
          )}
        </div>

        {profileLoading ? (
          <div className="py-6 flex justify-center">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
        ) : !profile ? (
          <p className="text-center text-xs text-gray-400 py-6">
            No business profile found for this provider yet — apply via "Become a Host" to create one.
          </p>
        ) : editingProfile ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4" data-testid="provider-profile-form">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Business Name *</label>
              <input
                value={profileForm.businessName}
                onChange={(e) => setProfileForm((p) => ({ ...p, businessName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
              <select
                value={profileForm.providerType}
                onChange={(e) => setProfileForm((p) => ({ ...p, providerType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ROOM">Room / PG</option>
                <option value="TIFFIN">Tiffin / Mess</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Number *</label>
              <input
                value={profileForm.contactNumber}
                onChange={(e) => setProfileForm((p) => ({ ...p, contactNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Business Address *</label>
              <input
                value={profileForm.businessAddress}
                onChange={(e) => setProfileForm((p) => ({ ...p, businessAddress: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
              <textarea
                rows={2}
                value={profileForm.description}
                onChange={(e) => setProfileForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="sm:col-span-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveProfile}
                disabled={savingProfile}
                data-testid="provider-profile-save"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg disabled:opacity-60"
              >
                {savingProfile && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-700">
              <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold">{profile.businessName}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{profile.providerType === 'TIFFIN' ? 'Tiffin / Mess' : 'Room / PG'}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{profile.contactNumber}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="line-clamp-1">{profile.businessAddress}</span>
            </div>
            {profile.description && (
              <div className="sm:col-span-2 flex items-start space-x-2 text-gray-600">
                <FileText className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span className="text-[13px] leading-relaxed">{profile.description}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Listings</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalListings}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Active Listings</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{listings?.counts?.activeListings ?? 0}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Requests Received</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{totalRequests}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Wallet Balance</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">₹{user?.walletBalance || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mt-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('listings')}
          data-testid="provider-tab-listings"
          className={`pb-3 px-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'listings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          My Listings ({totalListings})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          data-testid="provider-tab-requests"
          className={`pb-3 px-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'requests' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Customer Requests ({totalRequests})
        </button>
      </div>

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <div className="mt-6">
          {loadingListings ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : isError ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500 text-sm">Could not load your listings. Is MongoDB running?</p>
            </div>
          ) : (
            <div className="space-y-8">
              {GROUPS.map((group) => {
                const items = listings?.[group.key] || []
                const Icon = group.icon
                return (
                  <div key={group.key} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                    <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                      <div className="flex items-center space-x-2">
                        <span className={`p-2 rounded-lg ${
                          group.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                          'bg-orange-50 text-orange-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </span>
                        <div>
                          <h2 className="text-base font-bold text-gray-900">{group.title}</h2>
                          <p className="text-xs text-gray-400">{items.length} listing(s)</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFormState({ category: group.key, apiCategory: group.apiCategory, initial: null })}
                        data-testid={`add-listing-btn-${group.key}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add {group.title.split(' ')[0]} Listing
                      </button>
                    </div>

                    {items.length === 0 ? (
                      <p className="text-center text-xs text-gray-400 py-8">
                        No {group.title.toLowerCase()} yet. Click "Add {group.title.split(' ')[0]} Listing" to publish your first one!
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                        {items.map((item) => {
                          const view = getGroupItemView(group, item)
                          return (
                            <div key={item._id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition group" data-testid={`listing-item-${item._id}`}>
                              <div className="h-32 bg-gray-100 overflow-hidden">
                                {view.image ? (
                                  <img src={view.image} alt={view.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Icon className="w-8 h-8" />
                                  </div>
                                )}
                              </div>
                              <div className="p-4 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{view.title}</h3>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                    item.isAvailable !== false ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                  }`}>
                                    {item.isAvailable !== false ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-500 line-clamp-1">{view.subtitle}</p>
                                <p className="text-sm font-bold text-blue-600">{view.price}</p>
                                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                  <button
                                    type="button"
                                    onClick={() => setFormState({ category: group.key, apiCategory: group.apiCategory, initial: item })}
                                    className="flex-1 flex items-center justify-center space-x-1 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(group, item)}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 flex items-center justify-center space-x-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="mt-6">
          {loadingInquiries ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : inquiries && inquiries.bookings?.length ? (
            <div className="space-y-4">
              {inquiries.bookings.map((req) => {
                const listingInfo = listingsIndex[String(req.listingId)]
                const when = `${req.date || ''} ${req.slot || ''}`.trim()
                return (
                  <div key={req._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm sm:flex sm:items-center sm:justify-between gap-4" data-testid={`provider-request-${req._id}`}>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          Tour / Trial
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700">
                          {req.status}
                        </span>
                        {req.discountApplied > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            ₹{req.discountApplied} Wallet Discount
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {listingInfo
                          ? getGroupItemView(listingInfo.group, listingInfo.item).title
                          : req.listingId}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><ClipboardList className="w-3.5 h-3.5 text-gray-400" /> {req.user?.name || 'Registered User'}</span>
                        {when && (<span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gray-400" /> {when}</span>)}
                        {req.user?.phone && (
                          <span className="font-semibold text-gray-700">📞 {req.user.phone}</span>
                        )}
                        {listingInfo && (
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {listingInfo.item.locality || listingInfo.item.neighborhood || ''}</span>
                        )}
                      </div>
                    </div>
                    <Link
                      to="/requests"
                      className="mt-3 sm:mt-0 shrink-0 inline-flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold transition"
                    >
                      Contact via Requests Page
                    </Link>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <ClipboardList className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-gray-500 text-sm mt-3">No customer requests on your listings yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Listing Overlay */}
      {formState && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-start p-4 overflow-y-auto" data-testid="listing-form-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {formState.initial?._id ? 'Edit Listing' : 'New Listing'}
              </h2>
              <button
                type="button"
                onClick={() => setFormState(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ListingForm
              key={formState.initial?._id || 'new-' + formState.category}
              category={formState.category}
              initial={formState.initial}
              onCancel={() => setFormState(null)}
              onSaved={async (payload) => {
                await handleSaved(formState.apiCategory, formState.initial, payload)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProviderDashboardPage

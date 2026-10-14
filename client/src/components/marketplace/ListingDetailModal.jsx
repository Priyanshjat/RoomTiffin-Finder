import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { openLoginModal } from '../../redux/features/ui/uiSlice.js'
import {
  useContactProvider,
  useCreateBooking,
  useCreateRentalRequest
} from '../../hooks/useListings.js'
import { useWallet } from '../../hooks/useReferral.js'
import { toast } from 'sonner'
import {
  X,
  Star,
  MapPin,
  ShieldCheck,
  Lock,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  Loader2,
  Wallet,
  Cpu,
  Fuel,
  Users,
  Gauge,
  Utensils,
  Soup,
  Home,
  Check
} from 'lucide-react'

const actionLabels = {
  rooms: { button: 'Schedule Free Room Tour', title: 'Schedule a Free Room Tour', helper: 'Visit the room or PG in person with the verified host.' },
  tiffin: { button: 'Order Sample Meal Trial', title: 'Order Sample Tiffin Trial', helper: 'Taste the homestyle cooking before committing to a monthly plan.' },
  vehicles: { button: 'Request Vehicle Booking', title: 'Request Vehicle Booking', helper: 'Reserve this vehicle with zero advance cancellation fees.' },
  laptops: { button: 'Request Laptop Rental', title: 'Request Laptop Dispatch', helper: 'Get this device delivered to your doorstep with refundable security deposit.' }
}

const ListingDetailModal = ({ listing, onClose }) => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestDate, setRequestDate] = useState('')
  const [requestSlot, setRequestSlot] = useState('Morning (10:00 AM - 12:00 PM)')
  const [requestNotes, setRequestNotes] = useState('')
  const [applyWalletCredit, setApplyWalletCredit] = useState(false)

  const isGuest = !user
  const { data: wallet } = useWallet(!isGuest)

  const contactMutation = useContactProvider()
  const bookingMutation = useCreateBooking()
  const rentalMutation = useCreateRentalRequest()

  if (!listing) return null

  const availableCredit = wallet?.balance ?? (user?.walletBalance || 0)
  const maxDeductible = Math.min(availableCredit, 100) // apply up to ₹100 credit on trial/tour or booking

  const images = listing.images && listing.images.length > 0 ? listing.images : [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'
  ]

  const actionConfig = actionLabels[listing.category] || {
    button: 'Submit Request',
    title: 'Submit Rental Request',
    helper: 'Contact the owner to initiate this rental.'
  }

  const handleActionClick = () => {
    if (isGuest) {
      dispatch(openLoginModal(`Sign in to ${actionConfig.button.toLowerCase()}.`))
    } else {
      setShowRequestForm(true)
    }
  }

  const handleSubmitRequest = async (e) => {
    e.preventDefault()

    const creditToUse = applyWalletCredit ? maxDeductible : 0

    try {
      if (listing.category === 'rooms' || listing.category === 'tiffin') {
        await bookingMutation.mutateAsync({
          listingId: listing._id || listing.id,
          category: listing.category,
          date: requestDate || new Date().toISOString().split('T')[0],
          slot: requestSlot,
          notes: requestNotes,
          applyCredit: creditToUse
        })
        toast.success(`Success! Your request has been sent to ${listing.provider?.name}.${creditToUse > 0 ? ` ₹${creditToUse} wallet discount applied!` : ''}`)
      } else {
        await rentalMutation.mutateAsync({
          listingId: listing._id || listing.id,
          category: listing.category,
          duration: requestSlot,
          startDate: requestDate || new Date().toISOString().split('T')[0],
          deliveryOption: 'Doorstep Delivery',
          applyCredit: creditToUse
        })
        toast.success(`Success! Rental placed. Provider will reach out via WhatsApp.${creditToUse > 0 ? ` ₹${creditToUse} wallet discount applied!` : ''}`)
      }
      setShowRequestForm(false)
    } catch (err) {
      toast.error('Failed to submit request. Please try again.')
    }
  }

  const handleDirectWhatsApp = () => {
    if (isGuest) {
      dispatch(openLoginModal('Sign in to view provider WhatsApp number.'))
      return
    }
    const cleanPhone = (listing.provider?.whatsapp || '+919845011024').replace(/[^0-9]/g, '')
    const text = encodeURIComponent(`Hi ${listing.provider?.name}, I am interested in your listing "${listing.title}" on RoomTiffin Finder. Is it currently available?`)
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-espresso/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      data-testid="listing-detail-modal-overlay"
    >
      <div
        className="bg-white w-full max-w-3xl rounded-3xl border border-sandstone-border shadow-2xl overflow-hidden relative my-auto max-h-[92vh] flex flex-col"
        data-testid="listing-detail-modal"
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          data-testid="detail-modal-close-btn"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-sandstone-light/95 hover:bg-white text-espresso border border-sandstone-border shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-6">
          
          {/* Photo Gallery & Thumbnail Strip */}
          <div className="space-y-3" data-testid="detail-gallery">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-sandstone-dark border border-sandstone-border">
              <img
                src={images[activePhotoIdx]}
                alt={listing.title}
                data-testid="detail-main-photo"
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              <div className="absolute top-3 left-3 bg-espresso/90 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                {listing.category?.toUpperCase()}
              </div>

              <div className="absolute bottom-3 left-3 bg-espresso/90 backdrop-blur-xs text-white px-3.5 py-1.5 rounded-xl font-serif font-bold text-base shadow-md">
                {listing.pricing?.formatted || `₹${listing.pricing?.amount}`}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1" data-testid="detail-thumbnails">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    data-testid={`thumbnail-btn-${idx}`}
                    className={`h-16 w-24 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      activePhotoIdx === idx ? 'border-terracotta shadow-xs' : 'border-sandstone-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Host Header */}
          <div className="space-y-2 border-b border-sandstone-border pb-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso" data-testid="detail-title">
                  {listing.title}
                </h2>
                <div className="flex items-center space-x-2 text-xs text-espresso-muted mt-1">
                  <span>Host: <strong className="text-espresso font-semibold">{listing.provider?.name}</strong></span>
                  {listing.provider?.verified && (
                    <span className="text-emerald font-bold flex items-center space-x-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified & Screened</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-1 text-sm font-bold text-espresso bg-sandstone px-3 py-1.5 rounded-xl border border-sandstone-border shrink-0 self-start">
                <Star className="w-4 h-4 text-mustard fill-mustard" />
                <span>{listing.rating || 4.8}</span>
                <span className="text-espresso-muted text-xs font-normal">({listing.reviewCount || 34} reviews)</span>
              </div>
            </div>
          </div>

          {/* Location & Guest Privacy Lock Card */}
          <div className="p-4 rounded-2xl bg-sandstone border border-sandstone-border space-y-2.5" data-testid="detail-location-section">
            <div className="text-xs font-bold uppercase tracking-wider text-espresso-muted">
              Location & Vicinity
            </div>

            <div className="flex items-start space-x-2 text-xs text-espresso">
              <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-espresso">{listing.approxLocation || listing.neighborhood}</div>
                {listing.distance && <div className="text-emerald font-medium text-[11px]">{listing.distance}</div>}
              </div>
            </div>

            {/* Privacy Lock Banner */}
            {isGuest ? (
              <div
                className="mt-2 p-3 bg-terracotta-light border border-terracotta/30 rounded-xl flex items-center justify-between gap-3 text-xs"
                data-testid="detail-guest-lock-banner"
              >
                <div className="flex items-center space-x-2 text-espresso">
                  <Lock className="w-4 h-4 text-terracotta shrink-0" />
                  <span>Exact building address and direct contact are protected for privacy.</span>
                </div>
                <button
                  onClick={() => dispatch(openLoginModal('Sign in to reveal exact address and direct contact.'))}
                  data-testid="detail-unlock-modal-btn"
                  className="px-3 py-1.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-lg text-xs font-bold shrink-0 transition"
                >
                  Sign In to Unlock
                </button>
              </div>
            ) : (
              <div
                className="mt-2 p-3 bg-emerald-light border border-emerald/30 rounded-xl space-y-1 text-xs"
                data-testid="detail-exact-address-unlocked"
              >
                <div className="flex items-center space-x-1.5 text-emerald font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Exact Doorstep Address (Unlocked)</span>
                </div>
                <div className="text-espresso font-medium pl-5">
                  {listing.exactLocation || `${listing.title}, HSR Layout Sector 2, Bengaluru - 560102`}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-bold text-espresso">About this Listing</h4>
            <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed" data-testid="detail-description">
              {listing.description}
            </p>
          </div>

          {/* CATEGORY SPECIFIC PANELS */}

          {/* 1. ROOMS SPECIFIC PANEL */}
          {listing.category === 'rooms' && (
            <div className="space-y-3 p-4 rounded-2xl bg-sandstone-light border border-sandstone-border" data-testid="room-specific-panel">
              <h4 className="font-serif text-base font-bold text-espresso flex items-center space-x-1.5">
                <Home className="w-4 h-4 text-terracotta" />
                <span>Room Accommodations & Security</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-sandstone-border">
                  <div className="text-espresso-muted text-[10px] uppercase font-bold">Room Type</div>
                  <div className="font-bold text-espresso">{listing.roomType || 'Single Room'}</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-sandstone-border">
                  <div className="text-espresso-muted text-[10px] uppercase font-bold">Furnishing</div>
                  <div className="font-bold text-espresso">{listing.furnishing || 'Fully Furnished'}</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-sandstone-border">
                  <div className="text-espresso-muted text-[10px] uppercase font-bold">Security Deposit</div>
                  <div className="font-bold text-terracotta">₹{listing.deposit || 8500} (100% Refundable)</div>
                </div>
              </div>
            </div>
          )}

          {/* 2. TIFFIN SPECIFIC PANEL: WEEKLY ROTATION */}
          {listing.category === 'tiffin' && (
            <div className="space-y-3 p-4 rounded-2xl bg-mustard-light/40 border border-mustard/30" data-testid="tiffin-specific-panel">
              <h4 className="font-serif text-base font-bold text-espresso flex items-center space-x-1.5">
                <Soup className="w-4 h-4 text-mustard" />
                <span>Weekly Mon-Sun Thali Menu Rotation</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(listing.weeklySchedule || [
                  'Mon: Dal Tadka + Bhindi Fry',
                  'Tue: Rajma Masala + Jeera Aloo',
                  'Wed: Paneer Butter Masala',
                  'Thu: Kadhi Pakoda + Khichdi',
                  'Fri: Chana Masala + Pulao',
                  'Sat: Mixed Veg Curry',
                  'Sun: Special Dal Baati Feast'
                ]).map((menuItem, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-xl border border-mustard/20 flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-mustard text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-espresso">{menuItem}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. VEHICLES SPECIFIC PANEL */}
          {listing.category === 'vehicles' && (
            <div className="space-y-3 p-4 rounded-2xl bg-emerald-light/40 border border-emerald/30" data-testid="vehicle-specific-panel">
              <h4 className="font-serif text-base font-bold text-espresso flex items-center space-x-1.5">
                <Gauge className="w-4 h-4 text-emerald" />
                <span>Vehicle Specification Rail & Deposit Rules</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-emerald/20 text-center">
                  <div className="text-[10px] text-espresso-muted font-bold uppercase">Transmission</div>
                  <div className="font-bold text-espresso capitalize">{listing.transmission || 'Automatic'}</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-emerald/20 text-center">
                  <div className="text-[10px] text-espresso-muted font-bold uppercase">Fuel Type</div>
                  <div className="font-bold text-espresso">{listing.fuel || 'Petrol'}</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-emerald/20 text-center">
                  <div className="text-[10px] text-espresso-muted font-bold uppercase">Daily Allowance</div>
                  <div className="font-bold text-emerald">120 km/day</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-emerald/20 text-center">
                  <div className="text-[10px] text-espresso-muted font-bold uppercase">Security Deposit</div>
                  <div className="font-bold text-espresso">₹{listing.deposit || 1000}</div>
                </div>
              </div>
            </div>
          )}

          {/* 4. LAPTOPS SPECIFIC PANEL */}
          {listing.category === 'laptops' && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-100 border border-slate-300" data-testid="laptop-specific-panel">
              <h4 className="font-serif text-base font-bold text-espresso flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-slate-700" />
                <span>Workstation Hardware Diagnostics & Benchmark</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Processor</div>
                  <div className="font-bold text-slate-900 truncate">{listing.processor || 'Core i7 / Apple Silicon'}</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">RAM & Storage</div>
                  <div className="font-bold text-slate-900">{listing.ram || '16 GB'} • {listing.storage || '512 GB SSD'}</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Operating System</div>
                  <div className="font-bold text-slate-900">{listing.os || 'Windows 11 / Ubuntu'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Features / Amenities Badges */}
          {listing.features && (
            <div className="space-y-2">
              <h4 className="font-serif text-lg font-bold text-espresso">Included Amenities & Highlights</h4>
              <div className="flex flex-wrap gap-2" data-testid="detail-features-list">
                {listing.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-sandstone border border-sandstone-border rounded-xl text-xs font-semibold text-espresso flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Request Form with Wallet Credit Application */}
          {showRequestForm && (
            <div className="p-5 rounded-2xl bg-terracotta-light border border-terracotta/30 space-y-4 animate-in fade-in" data-testid="detail-request-form">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-base text-espresso flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-terracotta" />
                  <span>{actionConfig.title}</span>
                </h4>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-espresso-muted hover:text-espresso p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-espresso-muted">{actionConfig.helper}</p>

              <form onSubmit={handleSubmitRequest} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-espresso mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                      required
                      data-testid="request-date-input"
                      className="w-full p-2 text-xs bg-white border border-sandstone-border rounded-xl text-espresso"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-espresso mb-1">Preferred Slot / Duration</label>
                    <select
                      value={requestSlot}
                      onChange={(e) => setRequestSlot(e.target.value)}
                      data-testid="request-slot-select"
                      className="w-full p-2 text-xs bg-white border border-sandstone-border rounded-xl text-espresso"
                    >
                      <option value="Morning (10:00 AM - 12:00 PM)">Morning (10:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (1:00 PM - 3:00 PM)">Afternoon (1:00 PM - 3:00 PM)</option>
                      <option value="Evening (5:00 PM - 7:00 PM)">Evening (5:00 PM - 7:00 PM)</option>
                      <option value="1 Week">1 Week Rental</option>
                      <option value="1 Month">1 Month Subscription</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-espresso mb-1">Notes / Special Instructions</label>
                  <textarea
                    rows={2}
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    placeholder="e.g. Please bring registration agreement, pure veg confirmation..."
                    data-testid="request-notes-input"
                    className="w-full p-2 text-xs bg-white border border-sandstone-border rounded-xl text-espresso"
                  />
                </div>

                {/* Apply Wallet Credit Checkbox */}
                {availableCredit > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-sandstone-border flex items-center justify-between" data-testid="wallet-discount-box">
                    <div className="flex items-center space-x-2 text-xs">
                      <Wallet className="w-4 h-4 text-emerald" />
                      <div>
                        <span className="font-bold text-espresso">Wallet Balance Available: ₹{availableCredit}</span>
                        <div className="text-[11px] text-espresso-muted">Apply ₹{maxDeductible} credit discount on this booking</div>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyWalletCredit}
                        onChange={(e) => setApplyWalletCredit(e.target.checked)}
                        data-testid="apply-wallet-credit-checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-sandstone-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald"></div>
                    </label>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="px-4 py-2 bg-sandstone border border-sandstone-border text-espresso text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-testid="confirm-request-submit-btn"
                    className="px-5 py-2 bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm & Send Request</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-4 sm:p-5 bg-sandstone border-t border-sandstone-border flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0" data-testid="detail-modal-footer">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-espresso-muted font-bold">Standard Pricing</div>
            <div className="font-serif font-bold text-xl text-espresso">
              {listing.pricing?.formatted || `₹${listing.pricing?.amount}`}
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* WhatsApp */}
            <button
              onClick={handleDirectWhatsApp}
              data-testid="detail-whatsapp-btn"
              className="flex-1 sm:flex-none py-2.5 px-4 bg-[#25D366] hover:bg-[#20BD5C] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp {isGuest ? '(Sign in)' : ''}</span>
            </button>

            {/* Main Action */}
            <button
              onClick={handleActionClick}
              data-testid="detail-primary-action-btn"
              className="flex-1 sm:flex-none py-2.5 px-5 bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
            >
              <span>{actionConfig.button}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingDetailModal

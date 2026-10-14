import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useListing, useContactProvider, useCreateBooking, useCreateRentalRequest } from '../../hooks/useListings.js'
import { useWallet } from '../../hooks/useReferral.js'
import { openLoginModal } from '../../redux/features/ui/uiSlice.js'
import { toast } from 'sonner'
import {
  Star,
  MapPin,
  ShieldCheck,
  Lock,
  ArrowLeft,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Send,
  Loader2,
  Wallet,
  Home,
  Soup,
  Gauge,
  Cpu,
  Share2,
  Sparkles
} from 'lucide-react'
import ScheduleTourModal from '../../components/rooms/ScheduleTourModal.jsx'
import OrderTrialModal from '../../components/tiffins/OrderTrialModal.jsx'
import BookVehicleModal from '../../components/vehicles/BookVehicleModal.jsx'

const actionLabels = {
  rooms: { button: 'Schedule Free Room Tour', title: 'Schedule a Free Room Tour', helper: 'Visit the room or PG in person with the verified host.' },
  tiffin: { button: 'Order Sample Meal Trial', title: 'Order Sample Tiffin Trial', helper: 'Taste the homestyle cooking before committing to a monthly plan.' },
  vehicles: { button: 'Request Vehicle Booking', title: 'Request Vehicle Booking', helper: 'Reserve this vehicle with zero advance cancellation fees.' },
  laptops: { button: 'Request Laptop Rental', title: 'Request Laptop Dispatch', helper: 'Get this device delivered to your doorstep with refundable security deposit.' }
}

const ListingDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const isGuest = !user

  const { data: listing, isLoading, isError } = useListing(id)
  const { data: wallet } = useWallet(!isGuest)

  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestDate, setRequestDate] = useState('')
  const [requestSlot, setRequestSlot] = useState('Morning (10:00 AM - 12:00 PM)')
  const [requestNotes, setRequestNotes] = useState('')
  const [applyWalletCredit, setApplyWalletCredit] = useState(false)

  const bookingMutation = useCreateBooking()
  const rentalMutation = useCreateRentalRequest()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sandstone flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
        <p className="text-xs font-semibold text-espresso-muted">Loading listing details...</p>
      </div>
    )
  }

  if (isError || !listing) {
    return (
      <div className="min-h-screen bg-sandstone py-20 px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-espresso">Listing Not Found</h2>
        <p className="text-xs text-espresso-muted mt-2">The requested listing may have expired or moved.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-terracotta text-white rounded-xl text-xs font-bold"
        >
          Return to Marketplace
        </button>
      </div>
    )
  }

  const availableCredit = wallet?.balance ?? (user?.walletBalance || 0)
  const maxDeductible = Math.min(availableCredit, 100)
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
    <div className="min-h-screen bg-sandstone py-8 px-4 sm:px-6 lg:px-8" data-testid="listing-detail-page">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1.5 text-xs font-bold text-espresso-muted hover:text-espresso transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to listings</span>
          </button>

          <span className="text-[10px] uppercase font-bold px-3 py-1 bg-white rounded-full border border-sandstone-border text-terracotta">
            {listing.category}
          </span>
        </div>

        {/* Main Presentation Card */}
        <div className="bg-white rounded-3xl border border-sandstone-border p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Photos */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-sandstone-dark border border-sandstone-border">
              <img
                src={images[activePhotoIdx]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-espresso/90 text-white px-4 py-2 rounded-xl font-serif font-bold text-lg shadow-md">
                {listing.pricing?.formatted || `₹${listing.pricing?.amount}`}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
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

          {/* Title & Host info */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-sandstone-border pb-5">
            <div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-espresso">
                {listing.title}
              </h1>
              <div className="flex items-center space-x-2 text-xs text-espresso-muted mt-1.5">
                <span>By <strong className="text-espresso font-semibold">{listing.provider?.name}</strong></span>
                {listing.provider?.verified && (
                  <span className="text-emerald font-bold flex items-center space-x-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Provider</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-sm font-bold text-espresso bg-sandstone px-3.5 py-1.5 rounded-xl border border-sandstone-border self-start">
              <Star className="w-4 h-4 text-mustard fill-mustard" />
              <span>{listing.rating || 4.8}</span>
              <span className="text-espresso-muted text-xs font-normal">({listing.reviewCount || 34} reviews)</span>
            </div>
          </div>

          {/* Location & Guest Lock */}
          <div className="p-4 rounded-2xl bg-sandstone border border-sandstone-border space-y-2">
            <div className="flex items-start space-x-2 text-xs text-espresso">
              <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">{listing.approxLocation || listing.neighborhood}</div>
                {listing.distance && <div className="text-emerald font-medium text-[11px]">{listing.distance}</div>}
              </div>
            </div>

            {isGuest ? (
              <div className="mt-2 p-3 bg-terracotta-light border border-terracotta/30 rounded-xl flex items-center justify-between text-xs">
                <span>Exact building address and direct host contact protected.</span>
                <button
                  onClick={() => dispatch(openLoginModal('Sign in to reveal exact address and direct contact.'))}
                  className="px-3 py-1.5 bg-terracotta text-white rounded-lg text-xs font-bold"
                >
                  Sign In to Unlock
                </button>
              </div>
            ) : (
              <div className="mt-2 p-3 bg-emerald-light border border-emerald/30 rounded-xl text-xs space-y-1">
                <div className="font-bold text-emerald flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Exact Address Unlocked</span>
                </div>
                <div className="text-espresso font-medium pl-4">{listing.exactLocation}</div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-espresso">Overview</h3>
            <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Features Pills */}
          {listing.features && listing.features.length > 0 && (
            <div className="space-y-2 border-t border-sandstone-border pt-4">
              <h3 className="font-serif text-lg font-bold text-espresso">Key Amenities & Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-espresso">
                {listing.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2 p-2 rounded-xl bg-sandstone/50 border border-sandstone-border/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Specifications / Specs Table */}
          {listing.specs && Object.keys(listing.specs).length > 0 && (
            <div className="space-y-3 border-t border-sandstone-border pt-4">
              <h3 className="font-serif text-lg font-bold text-espresso">Specifications & Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(listing.specs).map(([key, value], idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-sandstone/40 border border-sandstone-border/60 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-espresso-muted uppercase tracking-wider">{key}</span>
                    <span className="text-xs font-semibold text-espresso mt-0.5">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Room-specific: Deposit & Move-in Cost Breakdown */}
          {listing.category === 'rooms' && (
            <div className="p-5 rounded-2xl bg-sandstone/60 border border-sandstone-border space-y-3">
              <h3 className="font-serif font-bold text-base text-espresso flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-terracotta" />
                <span>Move-in Cost & Deposit Breakdown</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-sandstone-border">
                  <span className="text-[11px] text-espresso-muted">Monthly Rent</span>
                  <p className="font-serif font-bold text-base text-espresso mt-0.5">
                    ₹{(listing.pricing?.amount || listing.rent || 0).toLocaleString('en-IN')}/mo
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-sandstone-border">
                  <span className="text-[11px] text-espresso-muted">Security Deposit</span>
                  <p className="font-serif font-bold text-base text-espresso mt-0.5">
                    ₹{(listing.pricing?.deposit || listing.deposit || 0).toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-emerald font-semibold">100% Refundable</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-sandstone-border">
                  <span className="text-[11px] text-espresso-muted">Brokerage Charged</span>
                  <p className="font-serif font-bold text-base text-emerald mt-0.5">₹0 (Zero Fee)</p>
                  <span className="text-[10px] text-espresso-muted">Direct Host Booking</span>
                </div>
              </div>
            </div>
          )}

          {/* Tiffin-specific: Weekly Menu Schedule Rotation */}
          {listing.category === 'tiffin' && listing.weeklySchedule && listing.weeklySchedule.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#FEF7E6] border border-[#D99B26]/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-espresso flex items-center space-x-2">
                  <Soup className="w-4 h-4 text-emerald" />
                  <span>Weekly Meal Rotation (Mon–Sun)</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald/15 text-emerald">
                  Desi Cow Ghee Phulkas
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                {listing.weeklySchedule.map((menuItem, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#D99B26]/20 flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald mt-1.5 shrink-0" />
                    <span className="font-medium text-espresso">{menuItem}</span>
                  </div>
                ))}
              </div>
              <div className="pt-1 text-[11px] text-espresso-muted flex items-center justify-between">
                <span>Free doorstep delivery: Lunch (12:30 PM) & Dinner (8:00 PM)</span>
                <span className="text-emerald font-semibold">Pause via WhatsApp anytime</span>
              </div>
            </div>
          )}

          {/* Sathi Bundle Teaser Box */}
          <div className="p-4 rounded-2xl bg-midnight text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="inline-flex items-center space-x-1.5 text-xs text-saffron font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bundle with Sathi</span>
              </div>
              <p className="text-xs text-sandstone-light/80">
                Pair this {listing.category === 'rooms' ? 'room with a hot tiffin dabba & Activa ride' : 'listing with other Indore essentials'} to save up to 10%!
              </p>
            </div>
            <Link
              to="/ai"
              className="px-4 py-2 rounded-xl bg-saffron hover:bg-saffron-light text-midnight font-bold text-xs shrink-0 transition"
            >
              Build Sathi Bundle
            </Link>
          </div>

          {/* Bottom Action Strip */}
          <div className="p-5 bg-sandstone rounded-2xl border border-sandstone-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-espresso-muted uppercase">Monthly Rate</div>
              <div className="font-serif font-bold text-2xl text-espresso">
                {listing.pricing?.formatted || `₹${listing.pricing?.amount}`}
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={handleDirectWhatsApp}
                className="flex-1 sm:flex-none py-3 px-5 bg-[#25D366] hover:bg-[#20BD5C] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleActionClick}
                className="flex-1 sm:flex-none py-3 px-6 bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
              >
                <span>{actionConfig.button}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Tour Modal for Rooms */}
        {listing.category === 'rooms' && showRequestForm && (
          <ScheduleTourModal
            room={listing}
            onClose={() => setShowRequestForm(false)}
          />
        )}

        {/* Order Trial Modal for Tiffins */}
        {listing.category === 'tiffin' && showRequestForm && (
          <OrderTrialModal
            tiffin={listing}
            onClose={() => setShowRequestForm(false)}
          />
        )}

        {/* Book Vehicle Modal for Vehicles */}
        {listing.category === 'vehicles' && showRequestForm && (
          <BookVehicleModal
            vehicle={listing}
            onClose={() => setShowRequestForm(false)}
          />
        )}

      </div>
    </div>
  )
}

export default ListingDetailPage

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { openLoginModal } from '../../../redux/features/ui/uiSlice.js'
import {
  Star,
  MapPin,
  ShieldCheck,
  Lock,
  Wifi,
  Wind,
  Bath,
  Home,
  Zap,
  Calendar,
  CheckCircle2,
  Eye,
  Phone,
  DoorOpen
} from 'lucide-react'

const RoomCard = ({ listing, onSelect }) => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const isGuest = !user

  const handleContactClick = (e) => {
    e.stopPropagation()
    if (isGuest) {
      dispatch(openLoginModal(`Sign in to contact ${listing.provider?.name || 'the host'} directly.`))
    } else {
      onSelect(listing)
    }
  }

  const mainImage = listing.images && listing.images[0]
    ? listing.images[0]
    : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'

  return (
    <article
      onClick={() => onSelect(listing)}
      data-testid={`listing-card-${listing._id || listing.id}`}
      className="bg-white rounded-3xl border border-sandstone-border overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex flex-col cursor-pointer group border-t-4 border-t-terracotta"
    >
      {/* Photo Container */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-sandstone-dark" data-testid="listing-photo-container">
        <img
          src={mainImage}
          alt={listing.title}
          data-testid="listing-photo"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Room Type & Verified Pill */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span
            data-testid="listing-category-badge"
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs bg-terracotta text-white"
          >
            {listing.occupancy || 'Room & PG'}
          </span>
          {listing.provider?.verified && (
            <span
              data-testid="listing-verified-badge"
              className="text-[10px] font-bold bg-white/95 text-emerald backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center space-x-0.5 shadow-xs border border-emerald/20"
            >
              <ShieldCheck className="w-3 h-3 text-emerald" />
              <span>Verified Host</span>
            </span>
          )}
        </div>

        {/* Monthly Rent Badge */}
        <div className="absolute bottom-3 left-3 bg-espresso/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl shadow-md">
          <div className="text-[10px] uppercase font-bold text-sandstone-dark tracking-wider">Monthly Rent</div>
          <div className="font-serif font-bold text-base tracking-tight text-white" data-testid="listing-price">
            {listing.pricing?.formatted || `₹${listing.pricing?.amount || listing.rent}/mo`}
          </div>
        </div>

        {/* Furnishing status */}
        {listing.furnishing && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-espresso px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center space-x-1 border border-sandstone-border shadow-xs">
            <DoorOpen className="w-3 h-3 text-terracotta" />
            <span>{listing.furnishing}</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2.5">
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3
              data-testid="listing-title"
              className="font-serif font-bold text-lg text-espresso line-clamp-1 group-hover:text-terracotta transition-colors"
            >
              {listing.title}
            </h3>

            <div
              className="flex items-center space-x-1 text-xs font-bold text-espresso shrink-0 bg-sandstone px-2 py-0.5 rounded-md border border-sandstone-border"
              data-testid="listing-rating"
            >
              <Star className="w-3.5 h-3.5 text-mustard fill-mustard" />
              <span>{listing.rating || 4.8}</span>
              <span className="text-espresso-light text-[10px] font-normal">({listing.reviewCount || 34})</span>
            </div>
          </div>

          {/* Host info & location */}
          <div className="flex items-center justify-between text-xs text-espresso-muted">
            <span data-testid="listing-provider-name">
              Host: <strong className="text-espresso font-semibold">{listing.provider?.name || 'Local Host'}</strong>
            </span>
            <span className="text-[11px] text-terracotta font-medium">
              Deposit: ₹{listing.pricing?.deposit || listing.deposit || 'Refundable'}
            </span>
          </div>

          <div className="flex items-center space-x-1 text-xs text-espresso-muted" data-testid="listing-location">
            <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
            <span className="line-clamp-1">{listing.approxLocation || listing.neighborhood}</span>
          </div>

          {/* Room Specific Amenity Icons Row */}
          <div className="pt-1.5 pb-1 flex items-center gap-2 text-xs border-y border-sandstone-border/70" data-testid="room-amenities-row">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-medium ${listing.wifi ? 'bg-terracotta-light text-terracotta' : 'bg-sandstone text-espresso-light'}`}>
              <Wifi className="w-3.5 h-3.5" />
              <span>WiFi</span>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-medium ${listing.ac ? 'bg-terracotta-light text-terracotta' : 'bg-sandstone text-espresso-light'}`}>
              <Wind className="w-3.5 h-3.5" />
              <span>AC</span>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-medium ${listing.attachedBathroom ? 'bg-terracotta-light text-terracotta' : 'bg-sandstone text-espresso-light'}`}>
              <Bath className="w-3.5 h-3.5" />
              <span>Bath</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-sandstone text-espresso-muted">
              <Zap className="w-3.5 h-3.5" />
              <span>Backup</span>
            </div>
          </div>

          {/* General Features */}
          <div className="flex flex-wrap gap-1" data-testid="listing-features">
            {listing.features?.slice(0, 3).map((feat, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-sandstone text-espresso-muted border border-sandstone-border"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Lock State & Actions Footer */}
        <div className="pt-2 border-t border-sandstone-border space-y-2">
          {isGuest ? (
            <div
              className="flex items-center justify-between text-[11px] text-espresso-muted bg-sandstone p-2 rounded-xl border border-sandstone-border"
              data-testid="guest-lock-indicator"
            >
              <div className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-terracotta" />
                <span>Exact room address protected</span>
              </div>
              <span className="text-terracotta font-bold text-[10px] uppercase">Sign in to unlock</span>
            </div>
          ) : (
            <div
              className="flex items-center justify-between text-[11px] text-emerald bg-emerald-light p-2 rounded-xl border border-emerald/20"
              data-testid="auth-unlocked-indicator"
            >
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{listing.exactLocation || 'Exact address unlocked'}</span>
              </div>
              <span className="text-[10px] font-bold uppercase">Unlocked</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSelect(listing)}
              data-testid={`see-details-btn-${listing._id || listing.id}`}
              className="py-2 px-3 rounded-xl border border-sandstone-border bg-white hover:bg-sandstone text-espresso text-xs font-bold transition flex items-center justify-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Room Details</span>
            </button>

            {isGuest ? (
              <button
                type="button"
                onClick={handleContactClick}
                data-testid={`guest-cta-btn-${listing._id || listing.id}`}
                className="py-2 px-3 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold transition shadow-xs flex items-center justify-center space-x-1"
              >
                <Lock className="w-3 h-3" />
                <span>Schedule Tour</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleContactClick}
                data-testid={`auth-cta-btn-${listing._id || listing.id}`}
                className="py-2 px-3 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold transition shadow-xs flex items-center justify-center space-x-1"
              >
                <Calendar className="w-3 h-3" />
                <span>Schedule Tour</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default RoomCard

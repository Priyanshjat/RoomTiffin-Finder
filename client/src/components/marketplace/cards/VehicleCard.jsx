import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { openLoginModal } from '../../../redux/features/ui/uiSlice.js'
import {
  Star,
  MapPin,
  ShieldCheck,
  Lock,
  Fuel,
  Gauge,
  Users,
  Shield,
  Eye,
  Calendar,
  CheckCircle2,
  Bike,
  Car,
  Key
} from 'lucide-react'

const VehicleCard = ({ listing, onSelect }) => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const isGuest = !user

  // Toggle duration: 'day' | 'week' | 'month'
  const [durationMode, setDurationMode] = useState('day')

  const handleContactClick = (e) => {
    e.stopPropagation()
    if (isGuest) {
      dispatch(openLoginModal(`Sign in to reserve ${listing.title} or contact the fleet owner.`))
    } else {
      onSelect(listing)
    }
  }

  // Calculate pricing based on durationMode
  const dailyPrice = listing.pricing?.amount || listing.rent || 350
  const weeklyPrice = listing.pricing?.weekly || Math.round(dailyPrice * 5.5)
  const monthlyPrice = listing.pricing?.monthly || Math.round(dailyPrice * 20)

  const currentDisplayPrice = durationMode === 'day'
    ? `₹${dailyPrice}/day`
    : durationMode === 'week'
    ? `₹${weeklyPrice}/wk`
    : `₹${monthlyPrice}/mo`

  const isCar = listing.vehicleType?.toLowerCase() === 'car'
  const mainImage = listing.images && listing.images[0]
    ? listing.images[0]
    : isCar
    ? 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'

  return (
    <article
      onClick={() => onSelect(listing)}
      data-testid={`listing-card-${listing._id || listing.id}`}
      className="bg-white rounded-3xl border border-sandstone-border overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex flex-col cursor-pointer group border-t-4 border-t-emerald"
    >
      {/* Photo Container with Vehicle Badges */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-sandstone-dark" data-testid="listing-photo-container">
        <img
          src={mainImage}
          alt={listing.title}
          data-testid="listing-photo"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Vehicle Category & Verification */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span
            data-testid="listing-category-badge"
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs bg-emerald text-white flex items-center space-x-1"
          >
            {isCar ? <Car className="w-3 h-3" /> : <Bike className="w-3 h-3" />}
            <span>{listing.make || (isCar ? 'Self-Drive Car' : 'Rental Scooter')}</span>
          </span>

          {listing.provider?.verified && (
            <span
              data-testid="listing-verified-badge"
              className="text-[10px] font-bold bg-white/95 text-emerald backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center space-x-0.5 shadow-xs border border-emerald/20"
            >
              <ShieldCheck className="w-3 h-3 text-emerald" />
              <span>Verified Fleet</span>
            </span>
          )}
        </div>

        {/* Live Dynamic Price Overlay */}
        <div className="absolute bottom-3 left-3 bg-espresso/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl shadow-md">
          <div className="font-serif font-bold text-base text-emerald-light" data-testid="listing-price">
            {currentDisplayPrice}
          </div>
        </div>

        {/* Deposit Tag */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-espresso px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center space-x-1 border border-sandstone-border shadow-xs">
          <Shield className="w-3 h-3 text-emerald" />
          <span>₹{listing.pricing?.deposit || listing.deposit || '1,000'} Dep</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2.5">
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3
              data-testid="listing-title"
              className="font-serif font-bold text-lg text-espresso line-clamp-1 group-hover:text-emerald transition-colors"
            >
              {listing.title}
            </h3>

            <div
              className="flex items-center space-x-1 text-xs font-bold text-espresso shrink-0 bg-sandstone px-2 py-0.5 rounded-md border border-sandstone-border"
              data-testid="listing-rating"
            >
              <Star className="w-3.5 h-3.5 text-mustard fill-mustard" />
              <span>{listing.rating || 4.9}</span>
              <span className="text-espresso-light text-[10px] font-normal">({listing.reviewCount || 88})</span>
            </div>
          </div>

          {/* Dynamic Rate Duration Switcher (Day / Week / Month) */}
          <div className="p-1 rounded-xl bg-sandstone border border-sandstone-border flex text-[11px] font-bold" data-testid="vehicle-duration-toggle">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setDurationMode('day')
              }}
              data-testid="rate-toggle-day"
              className={`flex-1 py-1 rounded-lg transition ${
                durationMode === 'day'
                  ? 'bg-emerald text-white shadow-xs'
                  : 'text-espresso-muted hover:text-espresso'
              }`}
            >
              Daily
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setDurationMode('week')
              }}
              data-testid="rate-toggle-week"
              className={`flex-1 py-1 rounded-lg transition ${
                durationMode === 'week'
                  ? 'bg-emerald text-white shadow-xs'
                  : 'text-espresso-muted hover:text-espresso'
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setDurationMode('month')
              }}
              data-testid="rate-toggle-month"
              className={`flex-1 py-1 rounded-lg transition ${
                durationMode === 'month'
                  ? 'bg-emerald text-white shadow-xs'
                  : 'text-espresso-muted hover:text-espresso'
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Spec Rail Row */}
          <div className="grid grid-cols-4 gap-1.5 py-1.5 border-y border-sandstone-border/70 text-center" data-testid="vehicle-spec-rail">
            <div className="bg-sandstone-light p-1.5 rounded-xl border border-sandstone-border/50">
              <div className="text-[10px] text-espresso-muted uppercase font-bold">Gear</div>
              <div className="text-xs font-bold text-espresso capitalize truncate">{listing.transmission || 'Auto'}</div>
            </div>
            <div className="bg-sandstone-light p-1.5 rounded-xl border border-sandstone-border/50">
              <div className="text-[10px] text-espresso-muted uppercase font-bold">Fuel</div>
              <div className="text-xs font-bold text-espresso truncate">{listing.fuel || 'Petrol'}</div>
            </div>
            <div className="bg-sandstone-light p-1.5 rounded-xl border border-sandstone-border/50">
              <div className="text-[10px] text-espresso-muted uppercase font-bold">Seats</div>
              <div className="text-xs font-bold text-espresso truncate">{listing.seating || '2 P'}</div>
            </div>
            <div className="bg-sandstone-light p-1.5 rounded-xl border border-sandstone-border/50">
              <div className="text-[10px] text-espresso-muted uppercase font-bold">Limit</div>
              <div className="text-xs font-bold text-emerald truncate">120 km/d</div>
            </div>
          </div>

          {/* Location & Fleet Host */}
          <div className="flex items-center justify-between text-xs text-espresso-muted pt-0.5">
            <div className="flex items-center space-x-1" data-testid="listing-location">
              <MapPin className="w-3.5 h-3.5 text-emerald shrink-0" />
              <span className="truncate max-w-[170px]">{listing.approxLocation || listing.neighborhood}</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald bg-emerald-light px-2 py-0.5 rounded-full">
              Free Helmet
            </span>
          </div>
        </div>

        {/* Lock State & Actions */}
        <div className="pt-2 border-t border-sandstone-border space-y-2">
          {isGuest ? (
            <div
              className="flex items-center justify-between text-[11px] text-espresso-muted bg-sandstone p-2 rounded-xl border border-sandstone-border"
              data-testid="guest-lock-indicator"
            >
              <div className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald" />
                <span>Garage pickup spot locked</span>
              </div>
              <span className="text-emerald font-bold text-[10px] uppercase">Sign in</span>
            </div>
          ) : (
            <div
              className="flex items-center justify-between text-[11px] text-emerald bg-emerald-light p-2 rounded-xl border border-emerald/20"
              data-testid="auth-unlocked-indicator"
            >
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{listing.exactLocation || 'Pickup location unlocked'}</span>
              </div>
              <span className="text-[10px] font-bold uppercase">Ready</span>
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
              <span>Specs</span>
            </button>

            {isGuest ? (
              <button
                type="button"
                onClick={handleContactClick}
                data-testid={`guest-cta-btn-${listing._id || listing.id}`}
                className="py-2 px-3 rounded-xl bg-emerald hover:bg-emerald-dark text-white text-xs font-bold transition shadow-xs flex items-center justify-center space-x-1"
              >
                <Lock className="w-3 h-3" />
                <span>Book Ride</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleContactClick}
                data-testid={`auth-cta-btn-${listing._id || listing.id}`}
                className="py-2 px-3 rounded-xl bg-emerald hover:bg-emerald-dark text-white text-xs font-bold transition shadow-xs flex items-center justify-center space-x-1"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Book Vehicle</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default VehicleCard

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { openLoginModal } from '../../../redux/features/ui/uiSlice.js'
import {
  Star,
  MapPin,
  ShieldCheck,
  Lock,
  Utensils,
  Clock,
  Sparkles,
  Eye,
  Calendar,
  CheckCircle2,
  Soup,
  Truck
} from 'lucide-react'

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const TiffinCard = ({ listing, onSelect }) => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const isGuest = !user
  const [activeDayIdx, setActiveDayIdx] = useState(0)

  const handleContactClick = (e) => {
    e.stopPropagation()
    if (isGuest) {
      dispatch(openLoginModal(`Sign in to order trial dabba or contact ${listing.provider?.name || 'the kitchen'}.`))
    } else {
      onSelect(listing)
    }
  }

  const isVeg = listing.foodType?.toLowerCase().includes('veg')
  const isJain = listing.foodType?.toLowerCase().includes('jain')
  const schedule = listing.weeklySchedule || [
    'Mon: Dal Tadka + Bhindi Fry',
    'Tue: Rajma Masala + Jeera Aloo',
    'Wed: Paneer Butter Masala',
    'Thu: Kadhi Pakoda + Khichdi',
    'Fri: Chana Masala + Pulao',
    'Sat: Mixed Veg Curry',
    'Sun: Special Dal Baati Feast'
  ]

  const mainImage = listing.images && listing.images[0]
    ? listing.images[0]
    : 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'

  return (
    <article
      onClick={() => onSelect(listing)}
      data-testid={`listing-card-${listing._id || listing.id}`}
      className="bg-white rounded-3xl border border-sandstone-border overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex flex-col cursor-pointer group border-t-4 border-t-mustard"
    >
      {/* Photo Container with Diet & Cuisine Badges */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-sandstone-dark" data-testid="listing-photo-container">
        <img
          src={mainImage}
          alt={listing.title}
          data-testid="listing-photo"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Veg / Diet Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span
            data-testid="listing-category-badge"
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs bg-mustard text-espresso flex items-center space-x-1"
          >
            <span className={`w-2 h-2 rounded-full ${isJain ? 'bg-amber-600' : isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
            <span>{isJain ? 'Jain Kitchen' : isVeg ? 'Pure Veg' : 'Homestyle Meals'}</span>
          </span>

          {listing.provider?.verified && (
            <span
              data-testid="listing-verified-badge"
              className="text-[10px] font-bold bg-white/95 text-emerald backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center space-x-0.5 shadow-xs border border-emerald/20"
            >
              <ShieldCheck className="w-3 h-3 text-emerald" />
              <span>FSSAI Verified</span>
            </span>
          )}
        </div>

        {/* Pricing Overlay: Per Meal + Monthly */}
        <div className="absolute bottom-3 left-3 bg-espresso/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl shadow-md">
          <div className="flex items-baseline space-x-1.5">
            <span className="font-serif font-bold text-base text-mustard" data-testid="listing-price">
              ₹{listing.pricing?.perMeal || 80}/meal
            </span>
            <span className="text-[10px] text-sandstone-light">
              (₹{listing.pricing?.amount || listing.rent}/mo)
            </span>
          </div>
        </div>

        {/* Delivery Radius Pill */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-espresso px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center space-x-1 border border-sandstone-border shadow-xs">
          <Truck className="w-3 h-3 text-mustard" />
          <span>Doorstep Delivery</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2.5">
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3
              data-testid="listing-title"
              className="font-serif font-bold text-lg text-espresso line-clamp-1 group-hover:text-mustard-dark transition-colors"
            >
              {listing.title}
            </h3>

            <div
              className="flex items-center space-x-1 text-xs font-bold text-espresso shrink-0 bg-sandstone px-2 py-0.5 rounded-md border border-sandstone-border"
              data-testid="listing-rating"
            >
              <Star className="w-3.5 h-3.5 text-mustard fill-mustard" />
              <span>{listing.rating || 4.9}</span>
              <span className="text-espresso-light text-[10px] font-normal">({listing.reviewCount || 65})</span>
            </div>
          </div>

          {/* Kitchen Master / Chef */}
          <div className="flex items-center justify-between text-xs text-espresso-muted">
            <span data-testid="listing-provider-name">
              Home Chef: <strong className="text-espresso font-semibold">{listing.provider?.name || 'Local Kitchen'}</strong>
            </span>
            <span className="text-[11px] text-emerald font-semibold flex items-center space-x-0.5">
              <span>Trial Available</span>
            </span>
          </div>

          <div className="flex items-center space-x-1 text-xs text-espresso-muted" data-testid="listing-location">
            <MapPin className="w-3.5 h-3.5 text-mustard shrink-0" />
            <span className="line-clamp-1">{listing.approxLocation || listing.neighborhood}</span>
          </div>

          {/* Mon-Sun Meal Schedule Strip */}
          <div className="p-2.5 rounded-xl bg-mustard-light/50 border border-mustard/20 space-y-1.5" data-testid="tiffin-schedule-strip">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-muted flex items-center space-x-1">
                <Soup className="w-3 h-3 text-mustard" />
                <span>Weekly Menu Rotation</span>
              </span>
              <span className="text-[10px] text-espresso-light">Click day to preview</span>
            </div>

            {/* 7 Days Dots */}
            <div className="flex items-center justify-between gap-1 pt-0.5">
              {days.map((day, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveDayIdx(idx)
                  }}
                  data-testid={`menu-day-btn-${idx}`}
                  className={`w-7 h-6 rounded-md text-[10px] font-bold transition flex items-center justify-center ${
                    activeDayIdx === idx
                      ? 'bg-mustard text-white shadow-xs'
                      : 'bg-white text-espresso-muted hover:bg-mustard-light border border-sandstone-border'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Preview of selected day */}
            <div className="text-[11px] font-medium text-espresso bg-white px-2.5 py-1 rounded-lg border border-mustard/20 truncate" data-testid="selected-day-menu">
              {schedule[activeDayIdx] || schedule[0]}
            </div>
          </div>

          {/* Timing details */}
          <div className="flex items-center space-x-2 text-[11px] text-espresso-muted pt-0.5">
            <Clock className="w-3.5 h-3.5 text-mustard shrink-0" />
            <span className="truncate">{listing.deliveryHours || 'Lunch 12:30 PM • Dinner 8:00 PM'}</span>
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
                <Lock className="w-3.5 h-3.5 text-mustard" />
                <span>Kitchen address locked</span>
              </div>
              <span className="text-mustard-dark font-bold text-[10px] uppercase">Sign in to unlock</span>
            </div>
          ) : (
            <div
              className="flex items-center justify-between text-[11px] text-emerald bg-emerald-light p-2 rounded-xl border border-emerald/20"
              data-testid="auth-unlocked-indicator"
            >
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{listing.exactLocation || 'Kitchen contact unlocked'}</span>
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
              <span>Full Menu</span>
            </button>

            {isGuest ? (
              <button
                type="button"
                onClick={handleContactClick}
                data-testid={`guest-cta-btn-${listing._id || listing.id}`}
                className="py-2 px-3 rounded-xl bg-mustard hover:bg-mustard-dark text-white text-xs font-bold transition shadow-xs flex items-center justify-center space-x-1"
              >
                <Lock className="w-3 h-3" />
                <span>Book Trial</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleContactClick}
                data-testid={`auth-cta-btn-${listing._id || listing.id}`}
                className="py-2 px-3 rounded-xl bg-mustard hover:bg-mustard-dark text-white text-xs font-bold transition shadow-xs flex items-center justify-center space-x-1"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Book Trial Meal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default TiffinCard

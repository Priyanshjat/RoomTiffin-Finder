import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { openLoginModal } from '../../../redux/features/ui/uiSlice.js'
import {
  Star,
  MapPin,
  ShieldCheck,
  Lock,
  Cpu,
  HardDrive,
  Eye,
  CheckCircle2,
  Laptop,
  Activity,
  Zap,
  Terminal,
  Layers
} from 'lucide-react'

const LaptopCard = ({ listing, onSelect }) => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const isGuest = !user

  const handleContactClick = (e) => {
    e.stopPropagation()
    if (isGuest) {
      dispatch(openLoginModal(`Sign in to request ${listing.title} dispatch or contact the tech hub.`))
    } else {
      onSelect(listing)
    }
  }

  const isMac = listing.brand?.toLowerCase() === 'apple' || listing.title?.toLowerCase().includes('macbook')
  const mainImage = listing.images && listing.images[0]
    ? listing.images[0]
    : isMac
    ? 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'

  const cpu = listing.processor || (isMac ? 'Apple M2 Silicon' : 'Intel Core i7-1260P')
  const ram = listing.ram || '16 GB RAM'
  const storage = listing.storage || '512 GB SSD'

  return (
    <article
      onClick={() => onSelect(listing)}
      data-testid={`listing-card-${listing._id || listing.id}`}
      className="bg-white rounded-3xl border border-sandstone-border overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex flex-col cursor-pointer group border-t-4 border-t-slate-700"
    >
      {/* Photo Container with Tech Badges */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-sandstone-dark" data-testid="listing-photo-container">
        <img
          src={mainImage}
          alt={listing.title}
          data-testid="listing-photo"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Brand & Type Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span
            data-testid="listing-category-badge"
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs bg-slate-800 text-white flex items-center space-x-1"
          >
            <Laptop className="w-3 h-3" />
            <span>{listing.brand || 'Workstation'}</span>
          </span>

          {listing.provider?.verified && (
            <span
              data-testid="listing-verified-badge"
              className="text-[10px] font-bold bg-white/95 text-emerald backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center space-x-0.5 shadow-xs border border-emerald/20"
            >
              <ShieldCheck className="w-3 h-3 text-emerald" />
              <span>Diagnostic Pass</span>
            </span>
          )}
        </div>

        {/* Pricing Overlay: Weekly / Monthly */}
        <div className="absolute bottom-3 left-3 bg-espresso/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl shadow-md">
          <div className="flex items-baseline space-x-1.5">
            <span className="font-serif font-bold text-base text-sky-300" data-testid="listing-price">
              ₹{listing.pricing?.amount || listing.rent}/wk
            </span>
            <span className="text-[10px] text-sandstone-light">
              (₹{listing.pricing?.monthly || 2800}/mo)
            </span>
          </div>
        </div>

        {/* Condition Rating Pill */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-espresso px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center space-x-1 border border-sandstone-border shadow-xs">
          <Activity className="w-3 h-3 text-emerald" />
          <span>{listing.condition ? listing.condition.split(' ')[0] : 'Grade A+'}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2.5">
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3
              data-testid="listing-title"
              className="font-serif font-bold text-lg text-espresso line-clamp-1 group-hover:text-slate-800 transition-colors"
            >
              {listing.title}
            </h3>

            <div
              className="flex items-center space-x-1 text-xs font-bold text-espresso shrink-0 bg-sandstone px-2 py-0.5 rounded-md border border-sandstone-border"
              data-testid="listing-rating"
            >
              <Star className="w-3.5 h-3.5 text-mustard fill-mustard" />
              <span>{listing.rating || 4.9}</span>
              <span className="text-espresso-light text-[10px] font-normal">({listing.reviewCount || 72})</span>
            </div>
          </div>

          {/* Tech Hub & Deposit */}
          <div className="flex items-center justify-between text-xs text-espresso-muted">
            <span data-testid="listing-provider-name">
              Hub: <strong className="text-espresso font-semibold">{listing.provider?.name || 'Tech Hub'}</strong>
            </span>
            <span className="text-[11px] text-slate-700 font-medium">
              Deposit: ₹{listing.pricing?.deposit || listing.deposit || '3,000'} Ref.
            </span>
          </div>

          {/* Spec-Sheet Hardware Chips */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5" data-testid="laptop-specs-sheet">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-slate-700" />
              <span>Hardware Configuration</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-800 rounded-md text-[11px] font-bold truncate max-w-[170px]">
                {cpu.length > 22 ? cpu.slice(0, 22) + '...' : cpu}
              </span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-800 rounded-md text-[11px] font-bold">
                {ram}
              </span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-800 rounded-md text-[11px] font-bold">
                {storage}
              </span>
            </div>
          </div>

          {/* Use Case Suitability Tags */}
          <div className="flex items-center space-x-1.5 pt-0.5" data-testid="laptop-use-cases">
            <span className="text-[10px] font-bold text-espresso-muted uppercase">Best for:</span>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 bg-emerald-light text-emerald text-[10px] font-bold rounded-md">
                Coding 98%
              </span>
              <span className="px-2 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-bold rounded-md">
                Work 99%
              </span>
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-md">
                Design 85%
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-1 text-xs text-espresso-muted" data-testid="listing-location">
            <MapPin className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <span className="line-clamp-1">{listing.approxLocation || listing.neighborhood}</span>
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
                <Lock className="w-3.5 h-3.5 text-slate-700" />
                <span>Dispatch center location locked</span>
              </div>
              <span className="text-slate-800 font-bold text-[10px] uppercase">Sign in</span>
            </div>
          ) : (
            <div
              className="flex items-center justify-between text-[11px] text-emerald bg-emerald-light p-2 rounded-xl border border-emerald/20"
              data-testid="auth-unlocked-indicator"
            >
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{listing.exactLocation || 'Dispatch warehouse unlocked'}</span>
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
              <span>Full Specs</span>
            </button>

            {isGuest ? (
              <button
                type="button"
                onClick={handleContactClick}
                data-testid={`guest-cta-btn-${listing._id || listing.id}`}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-black text-white text-xs font-bold transition shadow-xs flex items-center justify-center space-x-1"
              >
                <Lock className="w-3 h-3" />
                <span>Rent Laptop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleContactClick}
                data-testid={`auth-cta-btn-${listing._id || listing.id}`}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-black text-white text-xs font-bold transition shadow-xs flex items-center justify-center space-x-1"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Request Dispatch</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default LaptopCard

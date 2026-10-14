import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useListings } from '../../hooks/useListings.js'
import { openLoginModal } from '../../redux/features/ui/uiSlice.js'
import VehicleCard from '../../components/marketplace/cards/VehicleCard.jsx'
import BookVehicleModal from '../../components/vehicles/BookVehicleModal.jsx'
import {
  Bike,
  Car,
  Compass,
  MapPin,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Sparkles,
  Zap,
  Gauge,
  Fuel,
  Key,
  Shield,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  CalendarCheck,
  Info
} from 'lucide-react'

// Indore Commuter Routes
const INDORE_ROUTES = [
  {
    title: 'AB Road & Coaching Run',
    route: 'Bhawarkuan ↔ Palasia ↔ Vijay Nagar',
    idealVehicle: 'Honda Activa 6G',
    time: '18 mins via iBus side-lanes',
    badge: 'Student Favorite'
  },
  {
    title: 'Super Corridor Tech Hub',
    route: 'Airport ↔ TCS / Infosys ↔ Gandhi Nagar',
    idealVehicle: 'Hyundai i20 / EV Scooter',
    time: '12 mins unobstructed highway',
    badge: 'IT Professionals'
  },
  {
    title: 'Malwa Heritage Circuit',
    route: 'Indore ↔ Ujjain Mahakal / Mandu / Maheshwar',
    idealVehicle: 'Royal Enfield 350 / Tata Nexon',
    time: '60–90 mins expressway',
    badge: 'Weekend Getaway'
  }
]

const VEHICLE_TYPES = [
  { id: 'all', label: 'All Wheels', icon: Compass },
  { id: 'scooter', label: 'Scooters & Activa', icon: Bike },
  { id: 'bike', label: 'Cruisers & Bikes', icon: Bike },
  { id: 'car', label: 'Cars & SUVs', icon: Car },
]

const INDORE_NEIGHBORHOODS = [
  'All Indore',
  'Bhawarkuan',
  'Vijay Nagar',
  'Palasia',
  'Scheme 78',
  'Rau'
]

const VehiclesPage = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const isGuest = !user

  // Filters State
  const [selectedType, setSelectedType] = useState('all')
  const [selectedArea, setSelectedArea] = useState('All Indore')
  const [searchQuery, setSearchQuery] = useState('')
  const [transmissionFilter, setTransmissionFilter] = useState('all') // 'all' | 'Automatic' | 'Manual'
  const [maxPrice, setMaxPrice] = useState(2500)
  const [activeVehicleForBooking, setActiveVehicleForBooking] = useState(null)

  // Fetch all vehicle listings
  const { data: listingsData = [], isLoading, isError } = useListings({ category: 'vehicles' })

  // Filter listings
  const filteredVehicles = useMemo(() => {
    let result = listingsData.filter((item) => item.category === 'vehicles')

    // Filter by vehicle type
    if (selectedType !== 'all') {
      result = result.filter((item) => {
        const vType = (item.vehicleType || '').toLowerCase()
        if (selectedType === 'scooter') return vType.includes('scooter') || item.title?.toLowerCase().includes('activa') || item.title?.toLowerCase().includes('jupiter')
        if (selectedType === 'bike') return vType.includes('bike') || item.title?.toLowerCase().includes('bullet') || item.title?.toLowerCase().includes('classic') || item.title?.toLowerCase().includes('enfield')
        if (selectedType === 'car') return vType.includes('car') || vType.includes('suv') || item.title?.toLowerCase().includes('i20') || item.title?.toLowerCase().includes('nexon')
        return true
      })
    }

    // Filter by area
    if (selectedArea !== 'All Indore') {
      result = result.filter(
        (item) =>
          (item.neighborhood && item.neighborhood.toLowerCase().includes(selectedArea.toLowerCase())) ||
          (item.approxLocation && item.approxLocation.toLowerCase().includes(selectedArea.toLowerCase())) ||
          (item.exactLocation && item.exactLocation.toLowerCase().includes(selectedArea.toLowerCase()))
      )
    }

    // Filter by transmission
    if (transmissionFilter !== 'all') {
      result = result.filter(
        (item) => item.transmission && item.transmission.toLowerCase().includes(transmissionFilter.toLowerCase())
      )
    }

    // Filter by price
    result = result.filter((item) => {
      const price = item.pricing?.amount || item.rent || 300
      return price <= maxPrice
    })

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.neighborhood?.toLowerCase().includes(q) ||
          item.vehicleType?.toLowerCase().includes(q)
      )
    }

    return result
  }, [listingsData, selectedType, selectedArea, transmissionFilter, maxPrice, searchQuery])

  const handleSelectVehicle = (vehicle) => {
    if (isGuest) {
      dispatch(openLoginModal(`Sign in to reserve ${vehicle.title} or view exact garage location.`))
    } else {
      setActiveVehicleForBooking(vehicle)
    }
  }

  return (
    <div className="min-h-screen bg-sandstone">
      {/* ============================================================== */}
      {/* 1. GARAGE HERO: Deep Emerald & Asphalt Slate Theme */}
      {/* ============================================================== */}
      <section className="relative bg-gradient-to-b from-[#064E3B] via-[#0F172A] to-[#0A0F1D] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Speed lines backdrop decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          <div className="absolute top-2/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold backdrop-blur-xs">
                <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Indore Wheels &bull; Zero Deposit Hassles &bull; Verified Hosts</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Own the Road. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                  Rent by Day, Week, or Month.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                Quick Activa 6G for AB Road coachings, iconic Classic 350 for highway rides to Mandu & Omkareshwar, and self-drive cars for airport or Ujjain trips. All sanitized, serviced, and equipped with helmets.
              </p>

              {/* Live Spec Highlights Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="text-[10px] text-emerald-400 uppercase font-bold">Starting At</div>
                  <div className="text-lg font-bold font-serif text-white">₹280/day</div>
                  <div className="text-[10px] text-slate-400">Activa 6G BS6</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="text-[10px] text-emerald-400 uppercase font-bold">Safety First</div>
                  <div className="text-lg font-bold font-serif text-white">Free Helmets</div>
                  <div className="text-[10px] text-slate-400">Sanitized ISI mark</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="text-[10px] text-emerald-400 uppercase font-bold">Doorstep Pickup</div>
                  <div className="text-lg font-bold font-serif text-white">6 Indore Hubs</div>
                  <div className="text-[10px] text-slate-400">Bhawarkuan &amp; PU-4</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="text-[10px] text-emerald-400 uppercase font-bold">Zero Hidden Cost</div>
                  <div className="text-lg font-bold font-serif text-white">100% Refundable</div>
                  <div className="text-[10px] text-slate-400">Instant deposit return</div>
                </div>
              </div>
            </div>

            {/* Quick Hero Search & Quick Action Box */}
            <div className="w-full md:w-80 bg-slate-900/90 border border-emerald-500/30 p-5 rounded-3xl shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <span>Instant Fleet Finder</span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search Activa, Classic 350, i20..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Preferred Locality</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  {INDORE_NEIGHBORHOODS.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/20 flex items-start space-x-2 text-xs text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>All vehicles verified with original RC &amp; commercial insurance.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. INDORE COMMUTER HIGHLIGHTS (Curated local routes) */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INDORE_ROUTES.map((route, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-sandstone-border shadow-md hover:shadow-lg transition-shadow space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald bg-emerald-50 px-2 py-0.5 rounded-full">
                    {route.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-espresso-muted flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-emerald" />
                    <span>{route.time}</span>
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-espresso">
                  {route.title}
                </h3>
                <p className="text-xs text-espresso-muted">
                  {route.route}
                </p>
              </div>

              <div className="pt-2 border-t border-sandstone-border/70 flex items-center justify-between text-xs">
                <span className="text-espresso-muted">Recommended:</span>
                <span className="font-bold text-emerald flex items-center space-x-1">
                  <Bike className="w-3.5 h-3.5" />
                  <span>{route.idealVehicle}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. CATEGORY SWITCHER & FILTERS BAR */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-sandstone-border shadow-xs space-y-4">
          {/* Top Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {VEHICLE_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center space-x-2 ${
                    selectedType === type.id
                      ? 'bg-emerald text-white shadow-sm'
                      : 'bg-sandstone hover:bg-sandstone-dark text-espresso-muted hover:text-espresso'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{type.label}</span>
                </button>
              )
            })}
          </div>

          {/* Filters Sub-row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-sandstone-border">
            {/* Locality Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-espresso-muted flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-emerald" />
                <span>Indore Locality</span>
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-2 bg-sandstone border border-sandstone-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald/40"
              >
                {INDORE_NEIGHBORHOODS.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            {/* Transmission Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-espresso-muted flex items-center space-x-1">
                <Gauge className="w-3 h-3 text-emerald" />
                <span>Transmission</span>
              </label>
              <select
                value={transmissionFilter}
                onChange={(e) => setTransmissionFilter(e.target.value)}
                className="w-full px-3 py-2 bg-sandstone border border-sandstone-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald/40"
              >
                <option value="all">All Transmissions</option>
                <option value="Automatic">Automatic (Scooters &amp; AT Cars)</option>
                <option value="Manual">Manual (Cruisers &amp; Bikes)</option>
              </select>
            </div>

            {/* Price Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-espresso-muted">
                <span>Max Daily Budget</span>
                <span className="text-emerald font-bold">₹{maxPrice}/day</span>
              </div>
              <input
                type="range"
                min="200"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. VEHICLE LISTINGS GRID */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="font-serif font-bold text-2xl text-espresso flex items-center space-x-2">
              <span>Available Fleet in Indore</span>
              <span className="text-xs bg-emerald text-white px-2 py-0.5 rounded-full font-sans font-bold">
                {filteredVehicles.length}
              </span>
            </h2>
            <p className="text-xs text-espresso-muted">
              Pick up at Vijay Nagar, Bhawarkuan, Palasia, or get doorstep delivery across Indore.
            </p>
          </div>

          {isGuest && (
            <div className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-espresso-muted bg-white px-3 py-1.5 rounded-xl border border-sandstone-border">
              <ShieldCheck className="w-4 h-4 text-emerald" />
              <span>Sign in to unlock exact garage addresses &amp; direct host phone</span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-espresso-muted">Loading Indore vehicle fleet...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="py-16 text-center bg-white rounded-3xl border border-sandstone-border p-8">
            <h3 className="font-serif font-bold text-lg text-espresso">Unable to load fleet</h3>
            <p className="text-xs text-espresso-muted mt-1">Please check your network connection and try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredVehicles.length === 0 && (
          <div className="py-16 text-center bg-white rounded-3xl border border-sandstone-border p-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald rounded-full flex items-center justify-center mx-auto">
              <Bike className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-espresso">No vehicles matching your filters</h3>
            <p className="text-xs text-espresso-muted max-w-md mx-auto">
              Try adjusting your max price slider, selecting "All Indore", or clearing your vehicle type filter.
            </p>
            <button
              onClick={() => {
                setSelectedType('all')
                setSelectedArea('All Indore')
                setTransmissionFilter('all')
                setMaxPrice(2500)
                setSearchQuery('')
              }}
              className="px-4 py-2 bg-emerald text-white rounded-xl text-xs font-bold hover:bg-emerald-dark transition"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Grid Display */}
        {!isLoading && !isError && filteredVehicles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id || vehicle.id}
                listing={vehicle}
                onSelect={handleSelectVehicle}
              />
            ))}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 5. INDORE RENTAL FAQ & POLICIES BANNER */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Indore Wheels Promise
            </span>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
              Transparent, Zero Brokerage, Zero Surprises.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Everything you need to know about renting two-wheelers and cars in Indore:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Documents Needed</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Valid original Driving License &amp; Aadhaar Card. Digilocker copies are accepted at key handover.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
                <Shield className="w-4 h-4" />
                <span>Security Deposit Refund</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ₹1,000 for Scooters, ₹2,500 for Bikes, ₹4,000 for Cars. Refunded via UPI within 30 minutes of return.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
                <Fuel className="w-4 h-4" />
                <span>Fuel Policy</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vehicles delivered with adequate fuel to reach the nearest pump. Simply return with the same fuel level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. BOOKING MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {activeVehicleForBooking && (
          <BookVehicleModal
            vehicle={activeVehicleForBooking}
            onClose={() => setActiveVehicleForBooking(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default VehiclesPage

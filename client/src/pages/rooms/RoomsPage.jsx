import React, { useState, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useListings } from '../../hooks/useListings.js'
import { openLoginModal } from '../../redux/features/ui/uiSlice.js'
import PageTransition from '../../components/common/PageTransition.jsx'
import ScheduleTourModal from '../../components/rooms/ScheduleTourModal.jsx'
import {
  Home,
  MapPin,
  Star,
  ShieldCheck,
  Wifi,
  Wind,
  Bath,
  UtensilsCrossed,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
  RotateCcw,
  Sparkles,
  GraduationCap,
  Calendar,
  Building,
  Eye,
  Filter,
  X
} from 'lucide-react'

// College proximity quick pills
const COLLEGE_CHIPS = [
  { label: 'All Indore', area: 'all' },
  { label: 'Near DAVV (~350m)', area: 'Bhawarkuan' },
  { label: 'Vijay Nagar & Scheme 54', area: 'Vijay Nagar' },
  { label: 'Palasia (Chappan)', area: 'Palasia' },
  { label: 'Near IPS & Medi-Caps', area: 'Rau' }
]

const RoomsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  // Fetch all room listings
  const { data: listingsData = [], isLoading, isError } = useListings({ category: 'rooms' })

  // Filters State (initialized from URL params when Sathi hands off a parsed search)
  const [searchParams] = useSearchParams()
  const sathiBudget = parseInt(searchParams.get('budget'), 10) || 0
  const sathiRoomType = (searchParams.get('roomType') || '').toLowerCase()
  const sathiArea = searchParams.get('area') || ''

  const [selectedArea, setSelectedArea] = useState(sathiArea || 'all')
  const [maxBudget, setMaxBudget] = useState(
    sathiBudget > 0 ? Math.min(18000, Math.max(4000, sathiBudget)) : 15000
  )
  const [occupancyFilter, setOccupancyFilter] = useState(
    ['single', 'shared', '1rk'].includes(sathiRoomType) ? sathiRoomType : 'all'
  ) // 'all' | 'single' | 'shared' | '1rk'
  const [furnishingFilter, setFurnishingFilter] = useState('all') // 'all' | 'furnished' | 'semi'
  const [requireWifi, setRequireWifi] = useState(searchParams.get('wifi') === '1')
  const [requireAc, setRequireAc] = useState(searchParams.get('ac') === '1')
  const [requireBath, setRequireBath] = useState(false)
  const [requireFood, setRequireFood] = useState(false)
  const [sortBy, setSortBy] = useState('recommended') // 'recommended' | 'price-asc' | 'price-desc' | 'rating'
  const [viewMode, setViewMode] = useState('horizontal') // 'horizontal' | 'grid' | 'cluster'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Modal State
  const [tourModalRoom, setTourModalRoom] = useState(null)

  // Filter & Sort Logic
  const filteredRooms = useMemo(() => {
    let result = listingsData.filter((item) => item.category === 'rooms')

    // Area
    if (selectedArea !== 'all') {
      const a = selectedArea.toLowerCase()
      result = result.filter(
        (item) =>
          (item.neighborhood && item.neighborhood.toLowerCase().includes(a)) ||
          (item.approxLocation && item.approxLocation.toLowerCase().includes(a))
      )
    }

    // Budget
    result = result.filter((item) => (item.pricing?.amount || item.rent || 0) <= maxBudget)

    // Occupancy
    if (occupancyFilter !== 'all') {
      result = result.filter((item) => item.roomType === occupancyFilter)
    }

    // Furnishing
    if (furnishingFilter === 'furnished') {
      result = result.filter((item) => item.furnishing && item.furnishing.toLowerCase().includes('fully'))
    } else if (furnishingFilter === 'semi') {
      result = result.filter((item) => item.furnishing && item.furnishing.toLowerCase().includes('semi'))
    }

    // Amenities
    if (requireWifi) result = result.filter((item) => item.wifi)
    if (requireAc) result = result.filter((item) => item.ac)
    if (requireBath) result = result.filter((item) => item.attachedBathroom)
    if (requireFood) result = result.filter((item) => item.foodAvailability && !item.foodAvailability.toLowerCase().includes('self'))

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.pricing?.amount || a.rent) - (b.pricing?.amount || b.rent))
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.pricing?.amount || b.rent) - (a.pricing?.amount || a.rent))
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return result
  }, [
    listingsData,
    selectedArea,
    maxBudget,
    occupancyFilter,
    furnishingFilter,
    requireWifi,
    requireAc,
    requireBath,
    requireFood,
    sortBy
  ])

  // Area Clusters
  const areaClusters = useMemo(() => {
    const clusters = {}
    filteredRooms.forEach((room) => {
      const area = room.neighborhood || 'Indore Central'
      if (!clusters[area]) clusters[area] = []
      clusters[area].push(room)
    })
    return clusters
  }, [filteredRooms])

  const resetFilters = () => {
    setSelectedArea('all')
    setMaxBudget(15000)
    setOccupancyFilter('all')
    setFurnishingFilter('all')
    setRequireWifi(false)
    setRequireAc(false)
    setRequireBath(false)
    setRequireFood(false)
    setSortBy('recommended')
  }

  const handleOpenTourModal = (room) => {
    if (!user) {
      dispatch(openLoginModal('Sign in to schedule a free in-person or video room tour.'))
      return
    }
    setTourModalRoom(room)
  }

  return (
    <PageTransition variant="roomsSlide">
      <div className="min-h-screen bg-sandstone text-espresso">
        {/* =========================================================
            SPLIT HERO (Terracotta Architectural Theme)
        ========================================================= */}
        <section className="bg-gradient-to-br from-[#2B1E16] via-[#3D281D] to-[#1F1610] text-sandstone-light pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 relative overflow-hidden">
          {/* Ambient Warm Terracotta Glow */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-terracotta/15 rounded-full blur-[130px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* Left Column: Headline & Indore Context */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-terracotta-light">
                <Home className="w-3.5 h-3.5 text-terracotta" />
                <span>Indore Rooms, PGs & Coliving • Zero Brokerage</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Find your room in Indore. <br />
                <span className="italic font-normal text-sandstone-light/80">Study, rest, thrive.</span>
              </h1>

              <p className="text-sm sm:text-base text-sandstone-light/75 leading-relaxed max-w-xl">
                Verified student PGs and professional coliving across Bhawarkuan, Vijay Nagar Scheme 54, Palasia, and Rau. High-speed study WiFi, attached bathrooms, and zero broker commissions.
              </p>

              {/* College Proximity Filter Chips */}
              <div className="pt-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-sandstone-light/50 block mb-2">
                  Campus & Hub Proximity:
                </span>
                <div className="flex flex-wrap gap-2">
                  {COLLEGE_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedArea(chip.area)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                        selectedArea === chip.area
                          ? 'bg-terracotta text-white border-terracotta shadow-xs'
                          : 'bg-white/5 hover:bg-white/10 text-sandstone-light/80 border-white/10'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Budget Card */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-terracotta/20 border border-terracotta/30 flex items-center justify-center text-terracotta-light font-bold">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-bold text-sm">Quick Room Matcher</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald/20 text-emerald-light border border-emerald/30">
                  {filteredRooms.length} available
                </span>
              </div>

              {/* Budget slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-sandstone-light/70 font-medium">Monthly Rent Limit</span>
                  <span className="font-serif font-bold text-base text-terracotta-light">₹{maxBudget.toLocaleString('en-IN')}/mo</span>
                </div>
                <input
                  type="range"
                  min={4000}
                  max={18000}
                  step={500}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-terracotta cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-sandstone-light/50">
                  <span>₹4,000</span>
                  <span>₹10,000</span>
                  <span>₹18,000</span>
                </div>
              </div>

              {/* Occupancy pill toggles */}
              <div className="space-y-1.5">
                <span className="text-xs text-sandstone-light/70 font-medium block">Room Type</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'single', label: 'Single' },
                    { id: 'shared', label: 'Shared' },
                    { id: '1rk', label: '1RK' }
                  ].map((occ) => (
                    <button
                      key={occ.id}
                      onClick={() => setOccupancyFilter(occ.id)}
                      className={`py-1.5 rounded-xl text-xs font-bold transition border ${
                        occupancyFilter === occ.id
                          ? 'bg-terracotta text-white border-terracotta'
                          : 'bg-white/5 hover:bg-white/10 text-sandstone-light/80 border-white/10'
                      }`}
                    >
                      {occ.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-sandstone-light/60">
                  Includes 100% refundable deposit protection & 0 broker fee
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CONTROLS STRIP (View Mode, Sorting, Mobile Filter Button)
        ========================================================= */}
        <section className="bg-white border-b border-sandstone-border sticky top-16 z-20 py-3 px-4 sm:px-6 lg:px-8 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left: Results count & Mobile filter toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3 py-1.5 rounded-xl bg-sandstone border border-sandstone-border text-xs font-bold text-espresso flex items-center space-x-1.5"
              >
                <Filter className="w-3.5 h-3.5 text-terracotta" />
                <span>Filters ({[selectedArea !== 'all', requireWifi, requireAc, requireBath, requireFood].filter(Boolean).length})</span>
              </button>

              <span className="text-xs font-semibold text-espresso">
                Showing <strong className="text-terracotta">{filteredRooms.length}</strong> rooms in Indore
              </span>
            </div>

            {/* Right: Sort & View switcher */}
            <div className="flex items-center space-x-3">
              {/* Sort Selector */}
              <div className="hidden sm:flex items-center space-x-1.5 text-xs text-espresso-light">
                <span className="font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-sandstone border border-sandstone-border rounded-xl px-2.5 py-1 text-xs font-semibold text-espresso focus:outline-hidden focus:border-terracotta"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* View Switcher */}
              <div className="flex items-center bg-sandstone p-1 rounded-xl border border-sandstone-border text-xs">
                <button
                  onClick={() => setViewMode('horizontal')}
                  title="Horizontal Photo View"
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'horizontal' ? 'bg-white shadow-xs text-terracotta font-bold' : 'text-espresso-light'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'grid' ? 'bg-white shadow-xs text-terracotta font-bold' : 'text-espresso-light'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('cluster')}
                  title="Neighborhood Clusters"
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'cluster' ? 'bg-white shadow-xs text-terracotta font-bold' : 'text-espresso-light'
                  }`}
                >
                  <Building className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            MAIN CONTENT: STICKY FILTER RAIL + LISTINGS
        ========================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {(sathiBudget > 0 || sathiArea || sathiRoomType || searchParams.get('wifi') === '1' || searchParams.get('ac') === '1') && (
            <div className="mb-6 p-3.5 rounded-2xl bg-midnight text-white border border-white/10 flex items-center space-x-2 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-saffron" />
              <span className="font-semibold">Sathi applied your search filters below — fine-tune or reset anytime.</span>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Desktop Sticky Filter Rail */}
            <aside className="hidden lg:block lg:col-span-3 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-sandstone-border shadow-xs sticky top-36 space-y-6">
                <div className="flex items-center justify-between border-b border-sandstone-border pb-3">
                  <h3 className="font-serif font-bold text-sm text-espresso flex items-center space-x-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-terracotta" />
                    <span>Filter Rooms</span>
                  </h3>
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-semibold text-espresso-light hover:text-terracotta flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Neighborhood Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-espresso-light">
                    Indore Area
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full bg-sandstone/40 border border-sandstone-border rounded-xl px-3 py-2 text-xs font-semibold text-espresso focus:outline-hidden focus:border-terracotta"
                  >
                    <option value="all">All Localities</option>
                    <option value="Bhawarkuan">Bhawarkuan (DAVV & MPPSC)</option>
                    <option value="Vijay Nagar">Vijay Nagar (Scheme 54/78)</option>
                    <option value="Palasia">Palasia (Chappan Dukan)</option>
                    <option value="Rau">Rau (IPS & Medi-Caps)</option>
                    <option value="Geeta Bhawan">Geeta Bhawan</option>
                  </select>
                </div>

                {/* Amenities Checkboxes */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-espresso-light">
                    Required Amenities
                  </label>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireWifi}
                        onChange={(e) => setRequireWifi(e.target.checked)}
                        className="rounded-sm text-terracotta focus:ring-terracotta"
                      />
                      <span className="flex items-center space-x-1.5 font-medium text-espresso">
                        <Wifi className="w-3.5 h-3.5 text-terracotta" />
                        <span>High-Speed Study WiFi</span>
                      </span>
                    </label>

                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireAc}
                        onChange={(e) => setRequireAc(e.target.checked)}
                        className="rounded-sm text-terracotta focus:ring-terracotta"
                      />
                      <span className="flex items-center space-x-1.5 font-medium text-espresso">
                        <Wind className="w-3.5 h-3.5 text-teal" />
                        <span>Air Conditioning (AC)</span>
                      </span>
                    </label>

                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireBath}
                        onChange={(e) => setRequireBath(e.target.checked)}
                        className="rounded-sm text-terracotta focus:ring-terracotta"
                      />
                      <span className="flex items-center space-x-1.5 font-medium text-espresso">
                        <Bath className="w-3.5 h-3.5 text-blue-500" />
                        <span>Attached Bathroom</span>
                      </span>
                    </label>

                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireFood}
                        onChange={(e) => setRequireFood(e.target.checked)}
                        className="rounded-sm text-terracotta focus:ring-terracotta"
                      />
                      <span className="flex items-center space-x-1.5 font-medium text-espresso">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-emerald" />
                        <span>Food / Meals Included</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Sathi Callout in rail */}
                <div className="pt-2 border-t border-sandstone-border">
                  <div className="p-3.5 rounded-2xl bg-midnight text-white space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-saffron flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Need room + food?</span>
                    </span>
                    <p className="text-xs text-sandstone-light/80 leading-relaxed">
                      Tell Sathi your budget in one sentence — it matches you with rooms and doorstep tiffin nearby.
                    </p>
                    <Link
                      to="/ai"
                      className="inline-flex items-center space-x-1 text-xs font-bold text-saffron hover:underline pt-1"
                    >
                      <span>Ask Sathi AI</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Listings Grid / Horizontal Cards */}
            <main className="lg:col-span-9 space-y-6">
              {isLoading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-espresso-light">Searching verified rooms in Indore...</p>
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-sandstone-border space-y-4">
                  <Compass className="w-10 h-10 text-terracotta mx-auto" />
                  <h3 className="font-serif font-bold text-lg text-espresso">No rooms match your active filters</h3>
                  <p className="text-xs text-espresso-light max-w-sm mx-auto leading-relaxed">
                    Try expanding your budget limit or reset locality filters to view all available student and coliving suites.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-terracotta text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : viewMode === 'cluster' ? (
                /* Area-Cluster View */
                <div className="space-y-8">
                  {Object.entries(areaClusters).map(([areaName, rooms]) => (
                    <div key={areaName} className="space-y-4">
                      <div className="flex items-center space-x-2 border-b border-sandstone-border pb-2">
                        <MapPin className="w-4 h-4 text-terracotta" />
                        <h3 className="font-serif font-bold text-lg text-espresso">{areaName}</h3>
                        <span className="text-xs text-espresso-light">({rooms.length} rooms)</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rooms.map((room) => renderRoomCard(room, 'compact'))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : viewMode === 'grid' ? (
                /* Standard Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRooms.map((room) => renderRoomCard(room, 'grid'))}
                </div>
              ) : (
                /* Wide Horizontal Photo-Forward Cards (Default) */
                <div className="space-y-5">
                  {filteredRooms.map((room) => renderRoomCard(room, 'horizontal'))}
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Schedule Tour Modal */}
        {tourModalRoom && (
          <ScheduleTourModal
            room={tourModalRoom}
            onClose={() => setTourModalRoom(null)}
          />
        )}

        {/* Mobile Filter Sheet */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6"
              >
                <div className="flex items-center justify-between border-b border-sandstone-border pb-3">
                  <h3 className="font-serif font-bold text-base text-espresso">Filters</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-espresso-light">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Area Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-espresso-light uppercase">Indore Locality</label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full bg-sandstone border border-sandstone-border rounded-xl p-2.5 text-xs font-semibold"
                  >
                    <option value="all">All Localities</option>
                    <option value="Bhawarkuan">Bhawarkuan (DAVV)</option>
                    <option value="Vijay Nagar">Vijay Nagar</option>
                    <option value="Palasia">Palasia</option>
                    <option value="Rau">Rau</option>
                  </select>
                </div>

                {/* Budget Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-espresso-light">Max Rent</span>
                    <span className="font-bold text-terracotta">₹{maxBudget.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={4000}
                    max={18000}
                    step={500}
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full accent-terracotta"
                  />
                </div>

                {/* Amenities */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-espresso-light uppercase">Amenities</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={requireWifi}
                        onChange={(e) => setRequireWifi(e.target.checked)}
                        className="rounded-sm text-terracotta"
                      />
                      <span>WiFi</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={requireAc}
                        onChange={(e) => setRequireAc(e.target.checked)}
                        className="rounded-sm text-terracotta"
                      />
                      <span>Air Conditioning</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={requireBath}
                        onChange={(e) => setRequireBath(e.target.checked)}
                        className="rounded-sm text-terracotta"
                      />
                      <span>Attached Bath</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={requireFood}
                        onChange={(e) => setRequireFood(e.target.checked)}
                        className="rounded-sm text-terracotta"
                      />
                      <span>Food Included</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-sandstone-border flex gap-2">
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-2.5 rounded-xl border border-sandstone-border text-xs font-bold"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-terracotta text-white text-xs font-bold"
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )

  // Card Rendering Helper
  function renderRoomCard(room, layoutType = 'horizontal') {
    const isHorizontal = layoutType === 'horizontal'
    const isGuest = !user
    const images = room.images && room.images.length > 0 ? room.images : [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
    ]

    return (
      <div
        key={room._id || room.id}
        className={`bg-white rounded-3xl border border-sandstone-border hover:border-terracotta/60 transition duration-300 shadow-xs hover:shadow-md overflow-hidden ${
          isHorizontal ? 'flex flex-col md:flex-row' : 'flex flex-col'
        }`}
      >
        {/* Photo Section */}
        <div className={`relative ${isHorizontal ? 'md:w-80 h-56 md:h-auto' : 'h-52'} overflow-hidden bg-sandstone-dark shrink-0`}>
          <img
            src={images[0]}
            alt={room.title}
            className="w-full h-full object-cover transition duration-500 hover:scale-105"
          />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-midnight/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
              {room.occupancy || (room.roomType === 'single' ? 'Single Room' : 'Shared Suite')}
            </span>
          </div>

          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-0.5 rounded-md bg-emerald/90 text-white text-[10px] font-bold">
              {room.availability || 'Available Now'}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-serif font-bold text-lg text-espresso hover:text-terracotta transition">
                  <Link to={`/rooms/${room._id || room.id}`}>
                    {room.title}
                  </Link>
                </h3>
                <div className="flex items-center space-x-1.5 text-xs text-espresso-light mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" />
                  <span>{room.approxLocation || room.neighborhood}</span>
                  {room.distance && (
                    <>
                      <span>•</span>
                      <span className="text-emerald font-semibold">{room.distance}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 text-xs font-bold text-espresso bg-sandstone px-2.5 py-1 rounded-xl shrink-0">
                <Star className="w-3.5 h-3.5 text-mustard fill-mustard" />
                <span>{room.rating || 4.8}</span>
              </div>
            </div>

            <p className="text-xs text-espresso-light leading-relaxed line-clamp-2">
              {room.description}
            </p>

            {/* Amenity Icons Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-espresso-light">
              {room.wifi && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sandstone/60 border border-sandstone-border">
                  <Wifi className="w-3 h-3 text-terracotta" />
                  <span>200 Mbps WiFi</span>
                </span>
              )}
              {room.ac && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sandstone/60 border border-sandstone-border">
                  <Wind className="w-3 h-3 text-teal" />
                  <span>Inverter AC</span>
                </span>
              )}
              {room.attachedBathroom && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sandstone/60 border border-sandstone-border">
                  <Bath className="w-3 h-3 text-blue-500" />
                  <span>Attached Bath</span>
                </span>
              )}
              {room.foodAvailability && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sandstone/60 border border-sandstone-border">
                  <UtensilsCrossed className="w-3 h-3 text-emerald" />
                  <span>Food Included</span>
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Actions */}
          <div className="pt-3 border-t border-sandstone-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-serif font-bold text-xl text-espresso">
                {room.pricing?.formatted || `₹${room.pricing?.amount}/month`}
              </div>
              <span className="text-[11px] text-espresso-light">
                Deposit: ₹{(room.pricing?.deposit || room.deposit || 0).toLocaleString('en-IN')} (Refundable)
              </span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Link
                to={`/rooms/${room._id || room.id}`}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-sandstone hover:bg-sandstone-dark text-espresso font-bold text-xs transition text-center"
              >
                View Details
              </Link>
              <button
                type="button"
                onClick={() => handleOpenTourModal(room)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white font-bold text-xs shadow-xs transition flex items-center justify-center space-x-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Tour</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RoomsPage

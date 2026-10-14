import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import listingService from '../../services/listingService.js'
import { openLoginModal } from '../../redux/features/ui/uiSlice.js'
import PageTransition from '../../components/common/PageTransition.jsx'
import ListingDetailModal from '../../components/marketplace/ListingDetailModal.jsx'
import {
  Sparkles,
  Send,
  Home,
  UtensilsCrossed,
  Bike,
  Laptop,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Shield,
  Gift,
  Lock,
  Compass,
  MapPin,
  Clock,
  Zap,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react'

const COLLEGES = [
  { id: 'davv', name: 'DAVV Takshashila Campus', area: 'Bhawarkuan' },
  { id: 'sgsits', name: 'SGSITS Indore', area: 'Palasia' },
  { id: 'ips', name: 'IPS Academy', area: 'Rau' },
  { id: 'medicaps', name: 'Medi-Caps University', area: 'Rau' },
  { id: 'iit-indore', name: 'IIT Indore (Simrol)', area: 'Simrol' },
  { id: 'pimr', name: 'Prestige Institute (PIMR)', area: 'Vijay Nagar' }
]

const CATEGORY_TOGGLES = [
  { id: 'rooms', label: 'Room / PG', icon: Home, color: 'text-saffron' },
  { id: 'tiffin', label: 'Tiffin Plan', icon: UtensilsCrossed, color: 'text-emerald' },
  { id: 'vehicles', label: 'Rental Ride', icon: Bike, color: 'text-teal' },
  { id: 'laptops', label: 'Work Laptop', icon: Laptop, color: 'text-blue-500' }
]

const AiSearchPage = () => {
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const initialQuery = searchParams.get('q') || ''
  const initialCollege = searchParams.get('college') || 'davv'
  const initialArea = searchParams.get('area') || ''

  // Planner Form State
  const [queryInput, setQueryInput] = useState(initialQuery)
  const [selectedCollege, setSelectedCollege] = useState(initialCollege)
  const [selectedArea, setSelectedArea] = useState(initialArea)
  const [selectedNeeds, setSelectedNeeds] = useState(['rooms', 'tiffin', 'vehicles'])
  const [monthlyBudget, setMonthlyBudget] = useState(15000)
  const [foodPreference, setFoodPreference] = useState('pure-veg') // 'pure-veg' | 'jain' | 'any'
  const [roomPreference, setRoomPreference] = useState('single') // 'single' | 'shared'
  const [selectedListing, setSelectedListing] = useState(null)
  const [clarificationNotice, setClarificationNotice] = useState(null)

  // Sathi Recommend Mutation
  const bundleMutation = useMutation({
    mutationFn: (payload) => listingService.recommendBundle(payload),
    onSuccess: (data) => {
      setClarificationNotice(null)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Could not calibrate Sathi bundle.')
    }
  })

  // Parse Natural Language Query Mutation
  const parseMutation = useMutation({
    mutationFn: (text) => listingService.parseAiQuery(text),
    onSuccess: (res) => {
      if (res.flaggedForConfirmation || res.status === 'unclear') {
        setClarificationNotice(res.explanation || 'Please clarify your requirement category.')
      } else {
        setClarificationNotice(null)
        // Auto update filters if detected
        if (res.neighborhood) {
          const matchArea = res.neighborhood.toLowerCase()
          if (matchArea.includes('bhawarkua')) setSelectedCollege('davv')
          else if (matchArea.includes('vijay nagar')) setSelectedCollege('pimr')
          else if (matchArea.includes('palasia')) setSelectedCollege('sgsits')
          else if (matchArea.includes('rau')) setSelectedCollege('ips')
        }
        if (res.budget) {
          setMonthlyBudget(res.budget)
        }
        if (res.category) {
          setSelectedNeeds([res.category])
        }

        // Trigger recommendation
        triggerBundleRecommendation()
      }
    }
  })

  // Trigger Bundle Recommendation helper
  const triggerBundleRecommendation = () => {
    bundleMutation.mutate({
      collegeId: selectedCollege,
      areaSlug: selectedArea || undefined,
      budget: monthlyBudget,
      needs: selectedNeeds,
      preferences: {
        foodType: foodPreference,
        roomType: roomPreference
      }
    })
  }

  // Initial load
  useEffect(() => {
    if (initialQuery) {
      parseMutation.mutate(initialQuery)
    } else {
      triggerBundleRecommendation()
    }
  }, [initialQuery])

  // Toggle category in needs
  const toggleNeed = (catId) => {
    setSelectedNeeds((prev) => {
      if (prev.includes(catId)) {
        if (prev.length === 1) {
          toast.info('Select at least one category for your bundle.')
          return prev
        }
        return prev.filter((c) => c !== catId)
      } else {
        return [...prev, catId]
      }
    })
  }

  // Handle Query Submit
  const handleQuerySubmit = (e) => {
    e.preventDefault()
    if (!queryInput.trim()) return
    parseMutation.mutate(queryInput.trim())
  }

  // Handle Bundle Direct Request
  const handleRequestBundle = () => {
    if (!user) {
      dispatch(openLoginModal())
      toast.info('Sign in to unlock direct provider contact and instant booking.')
      return
    }

    toast.success('Sathi Bundle Request submitted! Dedicated coordinator will reach out on WhatsApp.')
  }

  const bundleData = bundleMutation.data

  return (
    <PageTransition variant="aiGlow">
      <div className="min-h-screen bg-sandstone text-espresso">
        {/* Top Dark Header */}
        <div className="bg-midnight text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-saffron/15 border border-saffron/30 text-xs text-saffron font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sathi Conversational Engine • Indore, MP</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Tell Sathi what you need in Indore.
            </h1>
            <p className="text-sm text-sandstone-light/80 max-w-2xl leading-relaxed">
              Describe your campus, budget, or lifestyle in natural words. Sathi builds a synchronized bundle where your room, food delivery, and commute are within walking or iBus distance.
            </p>

            {/* Natural Query Input */}
            <form onSubmit={handleQuerySubmit} className="pt-2">
              <div className="relative max-w-3xl flex items-center bg-midnight-light border border-white/20 focus-within:border-saffron rounded-2xl shadow-lg p-1.5 transition">
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="e.g. single room with WiFi near Bhawarkuan + pure veg tiffin under 10000"
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={parseMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-saffron hover:bg-saffron-light text-midnight font-bold text-xs shadow-md transition flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask Sathi</span>
                </button>
              </div>
            </form>

            {/* Ambiguity clarification prompt */}
            {clarificationNotice && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl p-4 rounded-2xl bg-mustard/15 border border-mustard/30 text-sandstone-light text-xs flex items-start space-x-3"
              >
                <HelpCircle className="w-5 h-5 text-mustard flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-mustard">Sathi needs a little more clarity:</p>
                  <p>{clarificationNotice}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => {
                        setSelectedNeeds(['rooms'])
                        setClarificationNotice(null)
                        triggerBundleRecommendation()
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
                    >
                      I need a Room/PG
                    </button>
                    <button
                      onClick={() => {
                        setSelectedNeeds(['tiffin'])
                        setClarificationNotice(null)
                        triggerBundleRecommendation()
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
                    >
                      I need Tiffin Food
                    </button>
                    <button
                      onClick={() => {
                        setSelectedNeeds(['vehicles'])
                        setClarificationNotice(null)
                        triggerBundleRecommendation()
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
                    >
                      I need a Bike/Scooter
                    </button>
                    <button
                      onClick={() => {
                        setSelectedNeeds(['laptops'])
                        setClarificationNotice(null)
                        triggerBundleRecommendation()
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
                    >
                      I need a Laptop
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-sandstone-border shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-sandstone-border pb-3">
                  <h2 className="font-serif font-bold text-base text-espresso flex items-center space-x-2">
                    <SlidersHorizontal className="w-4 h-4 text-saffron" />
                    <span>Bundle Controls</span>
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedCollege('davv')
                      setSelectedNeeds(['rooms', 'tiffin', 'vehicles'])
                      setMonthlyBudget(15000)
                      triggerBundleRecommendation()
                    }}
                    className="text-[11px] font-semibold text-espresso-light hover:text-saffron flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* College Proximity */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-espresso-light">
                    Campus Landmark
                  </label>
                  <select
                    value={selectedCollege}
                    onChange={(e) => {
                      setSelectedCollege(e.target.value)
                      triggerBundleRecommendation()
                    }}
                    className="w-full bg-sandstone/40 border border-sandstone-border rounded-xl px-3 py-2 text-xs font-semibold text-espresso focus:outline-hidden focus:border-saffron"
                  >
                    {COLLEGES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.area})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categories needed */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-espresso-light">
                    Categories to Bundle
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORY_TOGGLES.map((cat) => {
                      const Icon = cat.icon
                      const isSelected = selectedNeeds.includes(cat.id)
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            toggleNeed(cat.id)
                            triggerBundleRecommendation()
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition ${
                            isSelected
                              ? 'bg-midnight text-white border-midnight shadow-xs'
                              : 'bg-sandstone/30 text-espresso-light border-sandstone-border hover:border-saffron'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-saffron' : cat.color}`} />
                          <span className="truncate">{cat.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Monthly Budget Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-espresso-light">Monthly Budget</span>
                    <span className="font-serif font-bold text-sm text-saffron-dark">₹{monthlyBudget.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={30000}
                    step={1000}
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    onMouseUp={triggerBundleRecommendation}
                    onTouchEnd={triggerBundleRecommendation}
                    className="w-full accent-saffron"
                  />
                  <div className="flex justify-between text-[10px] text-espresso-light">
                    <span>₹5,000</span>
                    <span>₹15,000</span>
                    <span>₹30,000</span>
                  </div>
                </div>

                {/* Dietary preference */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-espresso-light">
                    Diet Preference
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'pure-veg', label: 'Pure Veg' },
                      { id: 'jain', label: 'Pure Jain' },
                      { id: 'any', label: 'Regular' }
                    ].map((diet) => (
                      <button
                        key={diet.id}
                        type="button"
                        onClick={() => {
                          setFoodPreference(diet.id)
                          triggerBundleRecommendation()
                        }}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition border ${
                          foodPreference === diet.id
                            ? 'bg-emerald text-white border-emerald'
                            : 'bg-sandstone/30 text-espresso-light border-sandstone-border'
                        }`}
                      >
                        {diet.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={triggerBundleRecommendation}
                  className="w-full py-2.5 rounded-xl bg-midnight hover:bg-midnight-light text-white font-bold text-xs shadow-xs transition flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-saffron" />
                  <span>Recalibrate Bundle</span>
                </button>
              </div>

              {/* Sathi Trust Guarantee Badge */}
              <div className="bg-sandstone-light p-4 rounded-2xl border border-sandstone-border space-y-2 text-xs text-espresso-light">
                <div className="flex items-center space-x-2 text-espresso font-bold">
                  <Shield className="w-4 h-4 text-emerald" />
                  <span>Indore Zero-Brokerage Guarantee</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  All bundled providers are direct owners with verified premises. No commission fees or unauthorized middleman surcharges.
                </p>
              </div>
            </div>

            {/* Right Bundle Recommendation Display */}
            <div className="lg:col-span-8 space-y-6">
              {bundleMutation.isPending ? (
                <div className="p-16 text-center bg-white rounded-3xl border border-sandstone-border space-y-3">
                  <Sparkles className="w-8 h-8 text-saffron mx-auto animate-spin-slow" />
                  <p className="font-serif font-bold text-base text-espresso">Sathi is calibrating your bundle...</p>
                  <p className="text-xs text-espresso-light">
                    Matching room proximity, hot dabba delivery routes, and vehicle pickup hubs in Indore.
                  </p>
                </div>
              ) : bundleData ? (
                <div className="space-y-6">
                  {/* Bundle Header Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sandstone-border shadow-md space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-sandstone-border pb-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark">
                          Recommended Sathi Bundle
                        </span>
                        <h2 className="font-serif text-2xl font-bold text-espresso mt-0.5">
                          {bundleData.bundleTitle}
                        </h2>
                        <div className="flex items-center space-x-2 text-xs text-espresso-light mt-1">
                          <MapPin className="w-3.5 h-3.5 text-saffron" />
                          <span>{bundleData.area?.name || 'Indore'}</span>
                          <span>•</span>
                          <span className="text-teal font-medium">BRTS Corridor Synced</span>
                        </div>
                      </div>

                      {/* Pricing Summary */}
                      <div className="text-left sm:text-right">
                        <div className="text-xs text-espresso-light line-through">
                          Separate: ₹{bundleData.pricing?.originalTotal?.toLocaleString('en-IN')}/mo
                        </div>
                        <div className="font-serif font-bold text-2xl text-espresso">
                          Bundle: ₹{bundleData.pricing?.bundleTotal?.toLocaleString('en-IN')}/mo
                        </div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald/10 text-emerald text-xs font-bold mt-1">
                          Save ₹{bundleData.pricing?.savings?.toLocaleString('en-IN')}/mo
                        </span>
                      </div>
                    </div>

                    {/* Sathi Reasoning */}
                    <div className="bg-sandstone/60 p-4 rounded-2xl border border-sandstone-border text-xs text-espresso space-y-1">
                      <span className="font-bold text-espresso-light uppercase tracking-wider text-[10px]">
                        Why Sathi chose this combo:
                      </span>
                      <p className="leading-relaxed">{bundleData.whyThisMatches}</p>
                    </div>

                    {/* Highlights bullet strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {bundleData.highlights?.map((h, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs text-espresso-light">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald flex-shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Component Listing Cards */}
                  <div className="space-y-4">
                    <h3 className="font-serif font-bold text-lg text-espresso">
                      Included Components ({bundleData.items?.length || 0})
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      {bundleData.items?.map((item, idx) => {
                        const listing = item.listing
                        return (
                          <div
                            key={idx}
                            className="bg-white rounded-3xl p-5 border border-sandstone-border shadow-xs hover:border-saffron/60 transition flex flex-col sm:flex-row gap-5"
                          >
                            {/* Image */}
                            <div className="w-full sm:w-44 h-36 rounded-2xl overflow-hidden bg-sandstone flex-shrink-0 relative">
                              <img
                                src={listing.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-midnight/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                                {listing.category}
                              </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between space-y-2">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-serif font-bold text-base text-espresso">
                                      {listing.title}
                                    </h4>
                                    <p className="text-xs text-espresso-light">
                                      {listing.approxLocation || listing.distance}
                                    </p>
                                  </div>
                                  <span className="font-serif font-bold text-sm text-espresso whitespace-nowrap">
                                    ₹{item.monthlyPrice?.toLocaleString('en-IN')}/mo
                                  </span>
                                </div>

                                <p className="text-xs text-espresso-light leading-relaxed mt-2 line-clamp-2">
                                  {listing.description}
                                </p>
                              </div>

                              {/* Sathi note & view button */}
                              <div className="pt-2 border-t border-sandstone-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <span className="text-[11px] text-teal font-medium flex items-center space-x-1">
                                  <CheckCircle2 className="w-3 h-3 text-teal" />
                                  <span>{item.reason}</span>
                                </span>

                                <button
                                  type="button"
                                  onClick={() => setSelectedListing(listing)}
                                  className="text-xs font-bold text-saffron hover:underline"
                                >
                                  View details &rarr;
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Booking Action Card */}
                  <div className="bg-midnight text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-saffron uppercase tracking-wider">
                        Next Step
                      </span>
                      <h4 className="font-serif font-bold text-xl text-white">
                        Ready to lock this bundle?
                      </h4>
                      <p className="text-xs text-sandstone-light/70 max-w-md">
                        Our verified coordinator schedules your room visit, free dabba trial, and doorstep ride drop with zero brokerage.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={handleRequestBundle}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-saffron hover:bg-saffron-light text-midnight font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Request Complete Bundle</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-16 text-center bg-white rounded-3xl border border-sandstone-border space-y-3">
                  <AlertCircle className="w-8 h-8 text-espresso-light mx-auto" />
                  <p className="font-serif font-bold text-base text-espresso">No active bundle generated</p>
                  <p className="text-xs text-espresso-light">
                    Adjust your campus or budget slider on the left to recalibrate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Listing Detail Modal */}
        {selectedListing && (
          <ListingDetailModal
            listing={selectedListing}
            onClose={() => setSelectedListing(null)}
          />
        )}
      </div>
    </PageTransition>
  )
}

export default AiSearchPage

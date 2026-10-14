import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { useListings } from '../../hooks/useListings.js'
import { openLoginModal } from '../../redux/features/ui/uiSlice.js'
import PageTransition from '../../components/common/PageTransition.jsx'
import OrderTrialModal from '../../components/tiffins/OrderTrialModal.jsx'
import {
  UtensilsCrossed,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  Heart,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  Soup,
  Coffee,
  Check,
  Send,
  ArrowRight
} from 'lucide-react'

// Days of the week for rotation
const DAYS_OF_WEEK = [
  { id: 0, label: 'Sun', full: 'Sunday (Special Feast)' },
  { id: 1, label: 'Mon', full: 'Monday' },
  { id: 2, label: 'Tue', full: 'Tuesday' },
  { id: 3, label: 'Wed', full: 'Wednesday' },
  { id: 4, label: 'Thu', full: 'Thursday' },
  { id: 5, label: 'Fri', full: 'Friday' },
  { id: 6, label: 'Sat', full: 'Saturday' }
]

// Sample day menus for the live ticker
const DAILY_MENU_SAMPLES = {
  0: { title: "Authentic Indori Dal Baati Churma", items: "Tava Dal + Baati with desi cow ghee + Churma ladoo + Chhaachh (Buttermilk)" },
  1: { title: "Dal Tadka & Sev Tamatar", items: "Arhar Dal Fry + Indori Sev Tamatar Sabzi + 4 Desi Ghee Phulkas + Jeera Rice + Salad" },
  2: { title: "Rajma Masala & Jeera Aloo", items: "Slow-cooked Rajma + Dry Jeera Aloo + 4 Phulkas + Steamed Basmati Rice + Curd" },
  3: { title: "Malwi Paneer Bhurji Special", items: "Fresh Paneer Bhurji + Yellow Dal + 4 Soft Phulkas + Veg Pulao + Papad" },
  4: { title: "Kadhi Pakoda & Moong Khichdi", items: "Traditional Malwi Besan Kadhi + Moong Dal Khichdi + 4 Phulkas + Roasted Papad" },
  5: { title: "Chana Masala & Aloo Gobi", items: "Amritsari Chana + Seasonal Aloo Gobi + 4 Ghee Phulkas + Steamed Rice + Raita" },
  6: { title: "Panchmel Dal & Mix Veg Curry", items: "Five-Lentil Panchmel Dal + Seasonal Mix Veg + 4 Phulkas + Boondi Raita" }
}

const TiffinsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const { data: listingsData = [], isLoading } = useListings({ category: 'tiffin' })

  // Active filters
  const [selectedDiet, setSelectedDiet] = useState('all') // 'all' | 'pure vegetarian' | 'jain' | 'north indian'
  const [selectedTiming, setSelectedTiming] = useState('all') // 'all' | 'lunch' | 'dinner' | 'both'
  const [selectedLocality, setSelectedLocality] = useState('all')
  const [activeDayIdx, setActiveDayIdx] = useState(() => new Date().getDay())

  // Meal Plan Builder Sidebar State
  const [planMeals, setPlanMeals] = useState('both') // 'both' | 'lunch' | 'dinner'
  const [planDays, setPlanDays] = useState(6) // 6 | 7
  const [planDiet, setPlanDiet] = useState('pure-veg') // 'pure-veg' | 'jain' | 'high-protein'

  // Modal State
  const [trialModalTiffin, setTrialModalTiffin] = useState(null)

  // Filtered Tiffins
  const filteredTiffins = useMemo(() => {
    let result = listingsData.filter((item) => item.category === 'tiffin')

    // Diet filter
    if (selectedDiet !== 'all') {
      result = result.filter(
        (item) => item.foodType && item.foodType.toLowerCase().includes(selectedDiet.toLowerCase())
      )
    }

    // Locality filter
    if (selectedLocality !== 'all') {
      const loc = selectedLocality.toLowerCase()
      result = result.filter(
        (item) =>
          (item.neighborhood && item.neighborhood.toLowerCase().includes(loc)) ||
          (item.approxLocation && item.approxLocation.toLowerCase().includes(loc))
      )
    }

    return result
  }, [listingsData, selectedDiet, selectedLocality])

  // Calculated price for plan builder
  const estimatedPlanPrice = useMemo(() => {
    let basePerMeal = planDiet === 'high-protein' ? 85 : planDiet === 'jain' ? 75 : 70
    let mealsPerDay = planMeals === 'both' ? 2 : 1
    let totalMealsPerMonth = mealsPerDay * planDays * 4.2
    return Math.round(totalMealsPerMonth * basePerMeal)
  }, [planMeals, planDays, planDiet])

  const handleOpenTrialModal = (tiffin) => {
    if (!user) {
      dispatch(openLoginModal('Sign in to order a sample trial meal box.'))
      return
    }
    setTrialModalTiffin(tiffin)
  }

  return (
    <PageTransition variant="tiffinRotate">
      <div className="min-h-screen bg-sandstone text-espresso">
        {/* =========================================================
            SPLIT HERO (Saffron Mustard & Deep Malwa Green Theme)
        ========================================================= */}
        <section className="bg-gradient-to-br from-[#1E563E] via-[#2E7D5B] to-[#14422F] text-sandstone-light pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 relative overflow-hidden">
          {/* Ambient Saffron Warm Glow */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-saffron/20 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* Left Column: Headline & Indore Culinary Context */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-saffron-light">
                <UtensilsCrossed className="w-3.5 h-3.5 text-saffron" />
                <span>Indore Tiffin & Dabba Services • 100% Ghar Ka Khana</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Homestyle meals delivered. <br />
                <span className="italic font-normal text-saffron-light">Taste Indore in every bite.</span>
              </h1>

              <p className="text-sm sm:text-base text-sandstone-light/80 leading-relaxed max-w-xl">
                Fresh, hygienic lunch and dinner dabbas prepared by trusted home chefs in Bhawarkuan, Vijay Nagar, Palasia, and Rau. Phulkas cooked in desi cow ghee, authentic Sev Tamatar, and the legendary Sunday Dal Baati Churma feast.
              </p>

              {/* Diet Quick Filters */}
              <div className="pt-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-sandstone-light/60 block mb-2">
                  Dietary Preference:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Kitchens' },
                    { id: 'pure vegetarian', label: '100% Pure Veg' },
                    { id: 'jain', label: 'Strictly Jain (No Root Veg)' },
                    { id: 'north indian', label: 'High-Protein / Gym' }
                  ].map((diet) => (
                    <button
                      key={diet.id}
                      onClick={() => setSelectedDiet(diet.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                        selectedDiet === diet.id
                          ? 'bg-saffron text-midnight font-bold border-saffron shadow-xs'
                          : 'bg-white/10 hover:bg-white/15 text-sandstone-light/90 border-white/10'
                      }`}
                    >
                      {diet.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: "Build My Meal Plan" Live Estimator Card */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-saffron/20 border border-saffron/30 flex items-center justify-center text-saffron-light font-bold">
                    <Soup className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-bold text-sm">Build Your Monthly Plan</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-saffron/20 text-saffron-light border border-saffron/30">
                  From ₹65/meal
                </span>
              </div>

              {/* Meals per day selection */}
              <div className="space-y-1.5">
                <span className="text-xs text-sandstone-light/70 font-medium block">Daily Meal Plan</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'both', label: 'Lunch & Dinner' },
                    { id: 'lunch', label: 'Lunch Only' },
                    { id: 'dinner', label: 'Dinner Only' }
                  ].map((meal) => (
                    <button
                      key={meal.id}
                      onClick={() => setPlanMeals(meal.id)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        planMeals === meal.id
                          ? 'bg-saffron text-midnight border-saffron'
                          : 'bg-white/5 hover:bg-white/10 text-sandstone-light/80 border-white/10'
                      }`}
                    >
                      {meal.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Days per week */}
              <div className="space-y-1.5">
                <span className="text-xs text-sandstone-light/70 font-medium block">Weekly Frequency</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPlanDays(6)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      planDays === 6
                        ? 'bg-saffron text-midnight border-saffron'
                        : 'bg-white/5 hover:bg-white/10 text-sandstone-light/80 border-white/10'
                    }`}
                  >
                    6 Days (Mon–Sat)
                  </button>
                  <button
                    onClick={() => setPlanDays(7)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      planDays === 7
                        ? 'bg-saffron text-midnight border-saffron'
                        : 'bg-white/5 hover:bg-white/10 text-sandstone-light/80 border-white/10'
                    }`}
                  >
                    7 Days (Incl. Sun Feast)
                  </button>
                </div>
              </div>

              {/* Estimated Monthly Price */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-sandstone-light/60 uppercase tracking-wider block">
                    Estimated Monthly Rate:
                  </span>
                  <span className="font-serif font-bold text-2xl text-saffron">
                    ₹{estimatedPlanPrice.toLocaleString('en-IN')}/mo
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const firstTiffin = filteredTiffins[0] || listingsData.find(l => l.category === 'tiffin')
                    if (firstTiffin) handleOpenTrialModal(firstTiffin)
                  }}
                  className="px-4 py-2.5 rounded-xl bg-saffron hover:bg-saffron-light text-midnight font-bold text-xs shadow-md transition flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Order Sample Box</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            TODAY'S MENU ROTATION TICKER
        ========================================================= */}
        <section className="bg-white border-b border-sandstone-border py-6 px-4 sm:px-6 lg:px-8 shadow-2xs">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald">
                  Live Kitchen Rotation
                </span>
                <h3 className="font-serif font-bold text-lg text-espresso">
                  What's Cooking in Indore Kitchens Today?
                </h3>
              </div>

              {/* Day selector tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => setActiveDayIdx(day.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      activeDayIdx === day.id
                        ? 'bg-emerald text-white border-emerald shadow-xs'
                        : 'bg-sandstone text-espresso-light border-sandstone-border hover:border-emerald'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Day Menu Card */}
            <div className="p-4 rounded-2xl bg-[#FEF7E6] border border-[#D99B26]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-saffron/20 text-saffron-dark flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-bold text-sm text-espresso">
                      {DAYS_OF_WEEK.find(d => d.id === activeDayIdx)?.full}:
                    </span>
                    <span className="font-bold text-emerald text-xs">
                      {DAILY_MENU_SAMPLES[activeDayIdx]?.title}
                    </span>
                  </div>
                  <p className="text-xs text-espresso-light mt-0.5 leading-relaxed">
                    {DAILY_MENU_SAMPLES[activeDayIdx]?.items}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-espresso-light bg-white px-3 py-1 rounded-full border border-sandstone-border shrink-0">
                12:30 PM & 8:00 PM Delivery
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================
            MAIN CONTENT: TIFFIN LISTINGS GRID
        ========================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sandstone-border pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-espresso">
                Verified Indore Tiffin Services
              </h2>
              <p className="text-xs text-espresso-light mt-0.5">
                Cooked with minimal oil, desi ghee phulkas, and fresh ingredients. Pause your plan anytime with 2 hours notice.
              </p>
            </div>

            {/* Locality pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
              {[
                { id: 'all', label: 'All Indore' },
                { id: 'Bhawarkuan', label: 'Bhawarkuan (DAVV)' },
                { id: 'Vijay Nagar', label: 'Vijay Nagar (Scheme 54)' },
                { id: 'Palasia', label: 'Palasia' },
                { id: 'Rau', label: 'Rau (IPS/Medi-Caps)' }
              ].map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocality(loc.id)}
                  className={`px-3 py-1.5 rounded-xl border transition ${
                    selectedLocality === loc.id
                      ? 'bg-midnight text-white border-midnight shadow-xs'
                      : 'bg-white text-espresso-light border-sandstone-border hover:border-emerald'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-emerald border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-semibold text-espresso-light">Loading verified Indore kitchens...</p>
            </div>
          ) : filteredTiffins.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-sandstone-border space-y-4">
              <UtensilsCrossed className="w-10 h-10 text-emerald mx-auto" />
              <h3 className="font-serif font-bold text-lg text-espresso">No tiffin providers match this filter</h3>
              <p className="text-xs text-espresso-light max-w-sm mx-auto">
                Try selecting "All Kitchens" or check neighboring Indore areas.
              </p>
              <button
                onClick={() => {
                  setSelectedDiet('all')
                  setSelectedLocality('all')
                }}
                className="px-4 py-2 bg-emerald text-white rounded-xl text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredTiffins.map((tiffin) => {
                const images = tiffin.images && tiffin.images.length > 0 ? tiffin.images : [
                  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
                ]
                return (
                  <div
                    key={tiffin._id || tiffin.id}
                    className="bg-white rounded-3xl border border-sandstone-border hover:border-emerald/60 transition duration-300 shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between"
                  >
                    {/* Top image & badges */}
                    <div>
                      <div className="relative h-60 w-full overflow-hidden bg-sandstone-dark">
                        <img
                          src={images[0]}
                          alt={tiffin.title}
                          className="w-full h-full object-cover transition duration-500 hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald text-white text-[10px] font-bold uppercase tracking-wider">
                            {tiffin.foodType || 'Pure Veg'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-midnight/80 backdrop-blur-md text-white text-[10px] font-bold">
                            {tiffin.cuisine || 'Malwi Ghar Ka Khana'}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 bg-midnight/90 backdrop-blur-md text-white px-3 py-1 rounded-xl font-serif font-bold text-sm">
                          {tiffin.pricing?.formatted || `₹${tiffin.pricing?.amount}/month`}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-serif font-bold text-xl text-espresso hover:text-emerald transition">
                              <Link to={`/tiffin/${tiffin._id || tiffin.id}`}>
                                {tiffin.title}
                              </Link>
                            </h3>
                            <div className="flex items-center space-x-1.5 text-xs text-espresso-light mt-0.5">
                              <span>By <strong className="text-espresso font-semibold">{tiffin.provider?.name}</strong></span>
                              <span>•</span>
                              <MapPin className="w-3.5 h-3.5 text-emerald" />
                              <span>{tiffin.neighborhood}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 text-xs font-bold text-espresso bg-sandstone px-2.5 py-1 rounded-xl shrink-0">
                            <Star className="w-3.5 h-3.5 text-mustard fill-mustard" />
                            <span>{tiffin.rating || 4.9}</span>
                          </div>
                        </div>

                        <p className="text-xs text-espresso-light leading-relaxed line-clamp-2">
                          {tiffin.description}
                        </p>

                        {/* Delivery Radius & Timing Strip */}
                        <div className="p-3 rounded-2xl bg-sandstone/50 border border-sandstone-border/60 text-xs text-espresso space-y-1">
                          <div className="flex items-center space-x-1.5 font-medium text-emerald">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{tiffin.deliveryHours || 'Lunch: 12:15 PM | Dinner: 7:45 PM'}</span>
                          </div>
                          <div className="text-[11px] text-espresso-light pl-5">
                            {tiffin.distance || tiffin.deliveryRadius || 'Free doorstep delivery in 3.5 km radius'}
                          </div>
                        </div>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                          {tiffin.features?.slice(0, 4).map((feat, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sandstone/60 border border-sandstone-border text-espresso-light"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald" />
                              <span>{feat}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-6 pt-3 border-t border-sandstone-border/60 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-espresso-light block">Sample Trial:</span>
                        <span className="font-serif font-bold text-base text-espresso">
                          ₹{tiffin.pricing?.perMeal || 70}/meal
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/tiffin/${tiffin._id || tiffin.id}`}
                          className="px-4 py-2.5 rounded-xl bg-sandstone hover:bg-sandstone-dark text-espresso font-bold text-xs transition"
                        >
                          View Menu
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenTrialModal(tiffin)}
                          className="px-4 py-2.5 rounded-xl bg-emerald hover:bg-emerald-dark text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5"
                        >
                          <UtensilsCrossed className="w-3.5 h-3.5" />
                          <span>Order Trial (₹{tiffin.pricing?.perMeal || 70})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Sathi Cross-Sell Banner */}
          <div className="p-6 rounded-3xl bg-midnight text-white border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1">
              <span className="text-xs font-bold text-saffron uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Synchronized Student Bundle</span>
              </span>
              <h3 className="font-serif font-bold text-xl text-white">
                Pair your Tiffin with Room & Activa Scooter
              </h3>
              <p className="text-xs text-sandstone-light/75 max-w-lg leading-relaxed">
                Tell Sathi your college campus. Sathi synchronizes your room location and meal delivery timing so hot lunch reaches your study desk right on schedule.
              </p>
            </div>

            <Link
              to="/ai"
              className="px-6 py-3 rounded-2xl bg-saffron hover:bg-saffron-light text-midnight font-bold text-xs shadow-md shrink-0 transition flex items-center space-x-1.5"
            >
              <span>Build Sathi Bundle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Order Trial Modal */}
        {trialModalTiffin && (
          <OrderTrialModal
            tiffin={trialModalTiffin}
            onClose={() => setTrialModalTiffin(null)}
          />
        )}
      </div>
    </PageTransition>
  )
}

export default TiffinsPage

import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  setSearchQuery,
  setAiParsedData,
  setActiveCategory
} from '../../redux/features/ui/uiSlice.js'
import { useAiParse } from '../../hooks/useListings.js'
import {
  Sparkles,
  Search,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Gift,
  Clock,
  Compass,
  CheckCircle2,
  Users,
  MapPin
} from 'lucide-react'

const sampleQueries = [
  { label: 'Single room in Bhawarkuan', query: 'single room with WiFi in Bhawarkuan under 8000' },
  { label: 'Pure veg tiffin Vijay Nagar', query: 'pure veg tiffin under 3500 in Vijay Nagar' },
  { label: 'Room near college', query: 'room or PG near DAVV under 9000 with wifi' },
  { label: 'Test Unclear Intent', query: 'something affordable for work' }
]

const HeroSection = () => {
  const [inputVal, setInputVal] = useState('')
  const dispatch = useDispatch()
  const aiParseMutation = useAiParse()

  // Time-aware greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const handleSearchSubmit = async (queryText) => {
    const q = queryText || inputVal
    if (!q.trim()) return

    dispatch(setSearchQuery(q))

    try {
      const parsed = await aiParseMutation.mutateAsync(q)
      dispatch(setAiParsedData(parsed))

      if (parsed.status === 'confirmed' && parsed.category) {
        dispatch(setActiveCategory(parsed.category))
      }
    } catch (err) {
      console.error('AI parse fallback:', err)
    }
  }

  const handleSampleClick = (query) => {
    setInputVal(query)
    handleSearchSubmit(query)
  }

  return (
    <section className="pt-6 pb-8 px-4 sm:px-6 lg:px-8" data-testid="hero-section">
      <div className="max-w-7xl mx-auto">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Main Large Bento Block: Greeting, Value Proposition, AI Search (8 cols on lg) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-sandstone-border p-6 sm:p-8 sm:py-10 shadow-sm flex flex-col justify-between relative overflow-hidden">
            {/* Background subtle decorative watermark */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-terracotta/5 to-transparent rounded-full pointer-events-none -mr-16 -mt-16" />

            <div className="relative z-10 space-y-4">
              {/* Top Greeting & Live Locality Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sandstone-light border border-sandstone-border text-xs font-semibold text-espresso-muted">
                  <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
                  <span data-testid="hero-greeting">{greeting}, Bengaluru!</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-terracotta-light text-terracotta text-xs font-bold">
                  <MapPin className="w-3 h-3" />
                  <span>HSR • Koramangala • Indiranagar • BTM</span>
                </span>
              </div>

              {/* Display Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso tracking-tight leading-[1.18]" data-testid="hero-title">
                Find Your Next Stay, Meal, Ride or Workstation.{' '}
                <span className="text-terracotta italic font-normal block sm:inline">
                  Verified & Hassle-Free.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-espresso-muted max-w-2xl leading-relaxed">
                The trusted marketplace for relocating students, interns, and professionals. No broker fees, 100% refundable security deposits, and doorstep dispatch.
              </p>

              {/* Natural Language AI Search Bar */}
              <div className="pt-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSearchSubmit()
                  }}
                  className="relative flex items-center bg-sandstone-light rounded-2xl border-2 border-sandstone-border p-1.5 sm:p-2 focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/20 transition shadow-inner"
                  data-testid="ai-search-form"
                >
                  <div className="pl-3 pr-2 text-terracotta flex items-center">
                    <Sparkles className="w-5 h-5 text-terracotta" />
                  </div>

                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Ask naturally: 'single room in Bhawarkuan under 8000' or 'pure veg tiffin near Vijay Nagar'..."
                    data-testid="ai-search-input"
                    className="w-full py-2 px-1 text-xs sm:text-sm text-espresso placeholder-espresso-light/70 focus:outline-none bg-transparent font-medium"
                  />

                  <button
                    type="submit"
                    disabled={aiParseMutation.isPending}
                    data-testid="ai-search-submit-btn"
                    className="bg-terracotta hover:bg-terracotta-hover text-white px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 shrink-0 shadow-sm transition disabled:opacity-50"
                  >
                    {aiParseMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="hidden sm:inline">Matching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">Search</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Sample Query Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 text-left" data-testid="search-examples">
                  <span className="text-[11px] font-bold text-espresso-muted">Try:</span>
                  {sampleQueries.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSampleClick(item.query)}
                      data-testid={`search-example-btn-${idx}`}
                      className="text-[11px] font-medium bg-sandstone hover:bg-sandstone-dark text-espresso-muted hover:text-espresso px-2.5 py-1 rounded-full border border-sandstone-border transition flex items-center space-x-1"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-espresso-light" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Bento Column: Live Stats & Refer & Earn Teaser (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Bento Block 1: Refer & Earn Highlight Card */}
            <Link
              to="/refer"
              className="bg-gradient-to-br from-terracotta to-[#a84420] text-white p-5 sm:p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
              data-testid="hero-refer-bento"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none -mr-8 -mt-8" />

              <div className="space-y-2 relative z-10">
                <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-sandstone-light">
                  <Gift className="w-3 h-3 text-mustard" />
                  <span>Refer & Earn Program</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
                  Give ₹100, Earn ₹200 Wallet Credit.
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Invite friends to RoomTiffin. They get ₹100 welcome bonus, and you earn ₹200 on their first stay or rental!
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-white relative z-10">
                <span>View Rewards & Code</span>
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Bento Block 2: Live Marketplace Trust Metrics */}
            <div className="bg-white rounded-3xl border border-sandstone-border p-5 space-y-3.5 shadow-sm flex-1 flex flex-col justify-center" data-testid="hero-stats-bento">
              <div className="text-[11px] uppercase font-bold tracking-wider text-espresso-muted flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
                <span>Verified Marketplace Standards</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-sandstone-light border border-sandstone-border">
                  <div className="font-serif text-xl font-bold text-espresso">450+</div>
                  <div className="text-[11px] text-espresso-muted">Verified Rooms & PGs</div>
                </div>
                <div className="p-3 rounded-2xl bg-sandstone-light border border-sandstone-border">
                  <div className="font-serif text-xl font-bold text-mustard-dark">1,200+</div>
                  <div className="text-[11px] text-espresso-muted">Dabbas Delivered Daily</div>
                </div>
                <div className="p-3 rounded-2xl bg-sandstone-light border border-sandstone-border">
                  <div className="font-serif text-xl font-bold text-emerald">100%</div>
                  <div className="text-[11px] text-espresso-muted">Refundable Deposits</div>
                </div>
                <div className="p-3 rounded-2xl bg-sandstone-light border border-sandstone-border">
                  <div className="font-serif text-xl font-bold text-slate-800">2-Hour</div>
                  <div className="text-[11px] text-espresso-muted">Verified Hosts</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection

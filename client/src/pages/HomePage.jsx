import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import PageTransition from '../components/common/PageTransition.jsx'
import {
  Sparkles,
  ArrowRight,
  Search,
  MapPin,
  CheckCircle2,
  Home,
  UtensilsCrossed,
  Bike,
  Laptop,
  Shield,
  Gift,
  Clock,
  Zap,
  Star,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Compass
} from 'lucide-react'

// Indore prompt cycling list
const INDORE_PROMPTS = [
  "single room with WiFi near Vijay Nagar under 8000",
  "pure veg tiffin near Bhawarkuan for coaching",
  "automatic scooty for a week near Palasia",
  "laptop for coding near IIT Indore under 300 a day",
  "first year at DAVV: need room + tiffin + scooty bundle under 15000"
]

// Click-to-try quick pills
const QUICK_PILLS = [
  { label: "DAVV Fresher bundle", query: "first year at DAVV: need room + tiffin + scooty bundle under 15000" },
  { label: "Bhawarkuan UPSC aspirant", query: "single room near Bhawarkuan with pure veg tiffin under 10000" },
  { label: "Vijay Nagar techie", query: "coliving room in Vijay Nagar with ThinkPad laptop" },
  { label: "Pure Veg tiffin trial", query: "pure veg tiffin near Palasia with home trial" },
  { label: "Weekend Mandu bike ride", query: "Royal Enfield bike for weekend near Palasia" }
]

// College Starter Pack Presets
const COLLEGE_PRESETS = [
  {
    id: "davv",
    name: "DAVV Takshashila",
    area: "Bhawarkuan / Khandwa Rd",
    dist: "350m from gate",
    room: { name: "Serene Nest Student PG", price: "₹7,500/mo", note: "350m from Takshashila campus, fiber WiFi & study desk" },
    tiffin: { name: "Annapurna Ghar Se Tiffin", price: "₹2,600/mo", note: "Malwi home food, Indori Poha & Sunday Dal Baati" },
    ride: { name: "Honda Activa 6G", price: "₹4,800/mo", note: "Instant KYC, 2 ISI helmets, covers Khandwa Rd corridor" },
    total: "₹14,900",
    combo: "₹13,500/mo",
    save: "₹1,400"
  },
  {
    id: "sgsits",
    name: "SGSITS Indore",
    area: "Vallabh Nagar / Palasia",
    dist: "800m from campus",
    room: { name: "Greenwood Executive Residency", price: "₹12,500/mo", note: "Saket Club road, quiet studio with AC & power backup" },
    tiffin: { name: "Marwar Kitchen High-Protein", price: "₹3,200/mo", note: "High protein paneer & dal delivered to hostel gate" },
    ride: { name: "Lenovo ThinkPad X1 Carbon", price: "₹5,400/mo", note: "i7 16GB dev ultrabook for coding assignments" },
    total: "₹21,100",
    combo: "₹18,999/mo",
    save: "₹2,101"
  },
  {
    id: "ips",
    name: "IPS Academy",
    area: "Rau / AB Road",
    dist: "500m from Knowledge Village",
    room: { name: "Lakeview Scholar PG", price: "₹5,500/mo", note: "Silicon City, 2-sharing student room with 3 meals" },
    tiffin: { name: "In-house PG Meals", price: "Included", note: "Wholesome breakfast, lunch and dinner included in rent" },
    ride: { name: "Honda Activa 6G", price: "₹4,800/mo", note: "Perfect for Rajendra Nagar & bypass transit" },
    total: "₹10,300",
    combo: "₹9,500/mo",
    save: "₹800"
  },
  {
    id: "medicaps",
    name: "Medi-Caps University",
    area: "Rau / Pigdamber",
    dist: "600m from main block",
    room: { name: "Lakeview Scholar PG", price: "₹5,500/mo", note: "Quiet academic setting near Pigdamber bypass" },
    tiffin: { name: "Swad Mandir Pure Jain / Veg", price: "₹2,900/mo", note: "Sattvic dabba delivered fresh daily" },
    ride: { name: "Dell Inspiron 14", price: "₹3,600/mo", note: "Preloaded with MS Office & Python coursework tools" },
    total: "₹12,000",
    combo: "₹10,800/mo",
    save: "₹1,200"
  },
  {
    id: "iit-indore",
    name: "IIT Indore",
    area: "Simrol / Khandwa Road",
    dist: "Campus transport synced",
    room: { name: "Urban Haven Coliving", price: "₹9,500/mo", note: "Weekend tech base in Vijay Nagar with gym & lounge" },
    tiffin: { name: "Marwar Kitchen Co.", price: "₹3,200/mo", note: "Doorstep high protein lunch & dinner dabba" },
    ride: { name: "Royal Enfield Classic 350", price: "₹12,500/mo", note: "Stealth matte black cruiser for Khandwa Rd commute" },
    total: "₹25,200",
    combo: "₹22,999/mo",
    save: "₹2,201"
  },
  {
    id: "pimr",
    name: "Prestige (PIMR)",
    area: "Vijay Nagar / Scheme 54",
    dist: "300m from C21 Mall",
    room: { name: "Urban Haven Coliving", price: "₹9,500/mo", note: "Designer shared suite behind Malhar Mega Mall" },
    tiffin: { name: "Swad Mandir Kitchen", price: "₹2,900/mo", note: "Traditional brass cookware Gujarati thali" },
    ride: { name: "Honda Activa 6G", price: "₹4,800/mo", note: "Instant pickup on Scheme 54 main road" },
    total: "₹17,200",
    combo: "₹15,499/mo",
    save: "₹1,701"
  }
]

// Indore Area Highlights
const INDORE_AREAS = [
  { name: "Vijay Nagar", slug: "vijay-nagar", avg: "₹8,500 - ₹16,000", vibe: "Scheme 54, IT parks, malls & upscale coliving" },
  { name: "Bhawarkuan", slug: "bhawarkuan", avg: "₹4,500 - ₹8,000", vibe: "Coaching capital, DAVV campus & budget PGs" },
  { name: "Palasia", slug: "palasia", avg: "₹9,000 - ₹18,000", vibe: "56 Dukan, leafy avenues & executive studios" },
  { name: "Rau & Silicon City", slug: "rau", avg: "₹4,000 - ₹7,500", vibe: "IPS Academy, Medi-Caps & university dorms" },
  { name: "Geeta Bhawan", slug: "geeta-bhawan", avg: "₹6,000 - ₹11,000", vibe: "Central hospitals, peaceful colonies & BRTS" },
  { name: "Scheme 78 & 54", slug: "scheme-78", avg: "₹7,500 - ₹14,000", vibe: "Techie builder floors & Bombay Hospital" }
]

const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  // Natural Language Prompt State
  const [promptText, setPromptText] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState('davv')

  // Live Token Extraction from promptText
  const parsedTokens = useMemo(() => {
    if (!promptText.trim()) return null
    const q = promptText.toLowerCase()
    const tokens = []

    // Category
    if (q.includes('room') || q.includes('pg') || q.includes('flat') || q.includes('coliving')) {
      tokens.push({ type: 'category', label: 'Room & PG', icon: Home, color: 'bg-saffron/15 text-saffron-light border-saffron/30' })
    }
    if (q.includes('tiffin') || q.includes('dabba') || q.includes('food') || q.includes('meal') || q.includes('veg')) {
      tokens.push({ type: 'category', label: 'Tiffin Plan', icon: UtensilsCrossed, color: 'bg-emerald/15 text-emerald-light border-emerald/30' })
    }
    if (q.includes('scooty') || q.includes('activa') || q.includes('bike') || q.includes('vehicle') || q.includes('car')) {
      tokens.push({ type: 'category', label: 'Vehicle Ride', icon: Bike, color: 'bg-teal/15 text-teal-light border-teal/30' })
    }
    if (q.includes('laptop') || q.includes('macbook') || q.includes('thinkpad') || q.includes('coding') || q.includes('pc')) {
      tokens.push({ type: 'category', label: 'Study Laptop', icon: Laptop, color: 'bg-blue-400/15 text-blue-300 border-blue-400/30' })
    }

    // Locality
    if (q.includes('vijay nagar') || q.includes('scheme 54') || q.includes('scheme 78')) {
      tokens.push({ type: 'area', label: 'Vijay Nagar', icon: MapPin, color: 'bg-white/10 text-white border-white/20' })
    } else if (q.includes('bhawarkuan') || q.includes('bhanwarkuan') || q.includes('davv')) {
      tokens.push({ type: 'area', label: 'Bhawarkuan / DAVV', icon: MapPin, color: 'bg-white/10 text-white border-white/20' })
    } else if (q.includes('palasia') || q.includes('chappan') || q.includes('56 dukan')) {
      tokens.push({ type: 'area', label: 'Palasia (Chappan)', icon: MapPin, color: 'bg-white/10 text-white border-white/20' })
    } else if (q.includes('rau') || q.includes('ips') || q.includes('medicaps')) {
      tokens.push({ type: 'area', label: 'Rau (Colleges)', icon: MapPin, color: 'bg-white/10 text-white border-white/20' })
    } else if (q.includes('iit')) {
      tokens.push({ type: 'area', label: 'IIT Indore (Simrol)', icon: MapPin, color: 'bg-white/10 text-white border-white/20' })
    }

    // Budget
    const matchBudget = q.match(/(?:under|below|budget|within|\b)\s*(\d{3,6})/i)
    if (matchBudget) {
      tokens.push({ type: 'budget', label: `Budget: ₹${matchBudget[1]}`, icon: Zap, color: 'bg-amber-400/15 text-amber-300 border-amber-400/30' })
    }

    const isHighConfidence = tokens.length >= 2
    return {
      tokens,
      confidence: isHighConfidence ? 'High confidence' : 'Clarification needed',
      isHighConfidence
    }
  }, [promptText])

  // Typewriter effect for prompt placeholder
  useEffect(() => {
    const current = INDORE_PROMPTS[placeholderIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedPlaceholder(current.substring(0, displayedPlaceholder.length + 1))
        if (displayedPlaceholder.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 2400)
        }
      } else {
        setDisplayedPlaceholder(current.substring(0, displayedPlaceholder.length - 1))
        if (displayedPlaceholder.length === 0) {
          setIsDeleting(false)
          setPlaceholderIndex((prev) => (prev + 1) % INDORE_PROMPTS.length)
        }
      }
    }, isDeleting ? 30 : 60)

    return () => clearTimeout(timeout)
  }, [displayedPlaceholder, isDeleting, placeholderIndex])

  // Submit natural language query
  const handleSubmitPrompt = (e) => {
    e?.preventDefault()
    const query = promptText.trim() || INDORE_PROMPTS[placeholderIndex]
    navigate(`/ai?q=${encodeURIComponent(query)}`)
  }

  const activeCollegePreset = useMemo(() => {
    return COLLEGE_PRESETS.find(c => c.id === selectedCollege) || COLLEGE_PRESETS[0]
  }, [selectedCollege])

  return (
    <PageTransition variant="aiGlow">
      <div className="min-h-screen bg-sandstone text-espresso selection:bg-saffron selection:text-midnight">
        {/* ==============================================================
            SECTION 1: AI HERO (Midnight Ink + Saffron Glow)
        ============================================================== */}
        <section className="relative bg-midnight text-white pt-14 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Subtle radial ambient glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-saffron/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-[500px] h-[350px] bg-teal/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Pill chip */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-sandstone-light shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
              <span className="text-saffron-light font-semibold">Indore's AI Moving Companion</span>
              <span className="text-white/40">•</span>
              <span className="text-sandstone-light/80">Rooms · Tiffin · Rides · Laptops</span>
            </motion.div>

            {/* Serif Headline with word-by-word reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]"
            >
              Just tell <span className="text-saffron drop-shadow-sm">Sathi</span>. <br />
              <span className="italic font-normal text-sandstone-light">Indore does the rest.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-sandstone-light/80 max-w-2xl mx-auto font-normal leading-relaxed"
            >
              One prompt to discover your student PG near DAVV, pure veg dabba, Activa scooter, and coding workstation—with zero brokerage and verified local hosts.
            </motion.p>

            {/* Natural-Language Prompt Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-3xl mx-auto text-left"
            >
              <form
                onSubmit={handleSubmitPrompt}
                className="relative bg-midnight-light/90 backdrop-blur-xl border-2 border-white/15 focus-within:border-saffron rounded-3xl p-3 sm:p-4 shadow-2xl transition duration-300 sathi-glow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-saffron/15 border border-saffron/30 flex items-center justify-center text-saffron flex-shrink-0 mt-1">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>

                  <div className="flex-1">
                    <label htmlFor="sathi-main-prompt" className="sr-only">Ask Sathi in plain words</label>
                    <textarea
                      id="sathi-main-prompt"
                      rows={2}
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder={displayedPlaceholder || "Tell Sathi what you need in Indore..."}
                      className="w-full bg-transparent text-white placeholder-white/40 text-sm sm:text-base resize-none focus:outline-hidden leading-relaxed font-sans"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmitPrompt()
                        }
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="self-end px-5 py-3 rounded-2xl bg-saffron hover:bg-saffron-light text-midnight font-bold text-sm shadow-md transition flex items-center space-x-1.5 flex-shrink-0 group"
                  >
                    <span>Ask Sathi</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </button>
                </div>

                {/* Animated token breakdown below input */}
                <AnimatePresence>
                  {parsedTokens && parsedTokens.tokens.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 mt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-white/50 font-medium">Sathi detected:</span>
                        {parsedTokens.tokens.map((token, idx) => {
                          const Icon = token.icon
                          return (
                            <span
                              key={idx}
                              className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${token.color}`}
                            >
                              <Icon className="w-3 h-3" />
                              <span>{token.label}</span>
                            </span>
                          )
                        })}
                      </div>

                      <div className="flex items-center space-x-1 text-xs">
                        {parsedTokens.isHighConfidence ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-light text-[11px] font-medium bg-emerald/10 px-2 py-0.5 rounded-full border border-emerald/20">
                            <CheckCircle2 className="w-3 h-3 text-emerald" />
                            <span>High confidence</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-mustard text-[11px] font-medium bg-mustard/10 px-2 py-0.5 rounded-full border border-mustard/20">
                            <Compass className="w-3 h-3 text-mustard" />
                            <span>Clarification needed</span>
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Click-to-try pills */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-white/40 text-[11px] mr-1">Popular in Indore:</span>
                {QUICK_PILLS.map((pill, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPromptText(pill.query)
                    }}
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-sandstone-light/80 hover:text-white border border-white/10 transition text-[11px]"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 2: LIVE AI DEMO STRIP ("Watch Sathi Plan in 3s")
        ============================================================== */}
        <section className="bg-sandstone-light border-y border-sandstone-border py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-teal">Interactive Sathi Preview</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso mt-0.5">
                  Watch Sathi plan a student move in 3 seconds
                </h2>
              </div>
              <Link
                to="/ai"
                className="inline-flex items-center space-x-1 text-xs font-bold text-saffron-dark hover:underline"
              >
                <span>Try interactive planner</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Replay Simulation Card */}
            <div className="bg-white rounded-3xl border border-sandstone-border shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Prompt Query Column */}
              <div className="lg:col-span-5 bg-midnight text-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs text-saffron">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>User prompt analyzed</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 font-sans text-sm text-sandstone-light italic">
                    "Moving to DAVV Khandwa Road, budget under ₹15,000. Need single room + pure veg tiffin + Activa for daily commute."
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sandstone-light/60">
                      Sathi Spatial Logic:
                    </span>
                    <div className="space-y-2 text-xs text-sandstone-light/80">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald" />
                        <span>Room 350m from Takshashila gate (walking)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald" />
                        <span>Tiffin delivery kitchen in same Bhawarkuan lane</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald" />
                        <span>Activa 6G pickup hub adjacent to BRTS corridor</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-sandstone-light/60">
                  <span>Match score: 98%</span>
                  <span className="text-teal-light font-semibold">Zero brokerage verified</span>
                </div>
              </div>

              {/* Matched Bundle Result Column */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif font-bold text-lg text-espresso">
                      DAVV Khandwa Rd Starter Combo
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald/10 text-emerald font-bold text-xs">
                      Save ₹1,400/mo
                    </span>
                  </div>

                  {/* 3 Matched Component Cards */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-sandstone/60 border border-sandstone-border">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center font-bold">
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-espresso">Serene Nest Student PG</p>
                          <p className="text-[11px] text-espresso-light">Single room with study desk & WiFi</p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-espresso">₹7,500/mo</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-sandstone/60 border border-sandstone-border">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald/15 text-emerald flex items-center justify-center font-bold">
                          <UtensilsCrossed className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-espresso">Annapurna Ghar Se Tiffin</p>
                          <p className="text-[11px] text-espresso-light">Pure Veg lunch & dinner + Sunday feast</p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-espresso">₹2,600/mo</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-sandstone/60 border border-sandstone-border">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-teal/15 text-teal flex items-center justify-center font-bold">
                          <Bike className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-espresso">Honda Activa 6G Scooter</p>
                          <p className="text-[11px] text-espresso-light">Monthly student plan with 2 helmets</p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-espresso">₹4,800/mo</span>
                    </div>
                  </div>
                </div>

                {/* Total and CTA */}
                <div className="pt-4 border-t border-sandstone-border flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-espresso-light line-through mr-2">Total: ₹14,900</span>
                    <span className="font-serif font-bold text-xl text-espresso">Combo: ₹13,500/mo</span>
                  </div>

                  <Link
                    to="/ai"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-midnight hover:bg-midnight-light text-white font-bold text-xs shadow-xs transition flex items-center justify-center space-x-1.5"
                  >
                    <span>Customize This Bundle</span>
                    <ArrowRight className="w-3.5 h-3.5 text-saffron" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 3: "ONE SENTENCE, FOUR NEEDS"
        ============================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta">Synchronized Relocation</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
              One sentence. Four essential needs.
            </h2>
            <p className="text-sm text-espresso-light leading-relaxed">
              No more searching 4 different classified websites or dealing with shady brokers across the city.
            </p>
          </div>

          {/* Sticky simulation card showcase */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sandstone-border shadow-lg space-y-8">
            <div className="text-center max-w-2xl mx-auto bg-sandstone/60 p-4 rounded-2xl border border-sandstone-border">
              <span className="text-xs text-espresso-light uppercase tracking-wider font-semibold">The Input Sentence:</span>
              <p className="font-serif text-lg sm:text-xl font-bold text-espresso mt-1">
                "I'm moving to Indore for my job at TCS Super Corridor under ₹20,000."
              </p>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="p-4 rounded-2xl bg-sandstone/40 border border-sandstone-border hover:border-saffron transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-saffron/15 text-saffron flex items-center justify-center font-bold text-xs">
                    <Home className="w-4 h-4" />
                  </span>
                  <span className="text-[11px] font-bold text-emerald">Verified</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-espresso">Urban Haven Studio</h4>
                  <p className="text-xs text-espresso-light">Vijay Nagar Scheme 54</p>
                </div>
                <div className="text-xs text-espresso-light leading-relaxed border-t border-sandstone-border/60 pt-2">
                  Direct shuttle connectivity to TCS Super Corridor via AB Road.
                </div>
                <div className="font-serif font-bold text-sm text-espresso">₹9,500/mo</div>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-2xl bg-sandstone/40 border border-sandstone-border hover:border-saffron transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-emerald/15 text-emerald flex items-center justify-center font-bold text-xs">
                    <UtensilsCrossed className="w-4 h-4" />
                  </span>
                  <span className="text-[11px] font-bold text-emerald">Pure Jain / Veg</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-espresso">Swad Mandir Kitchen</h4>
                  <p className="text-xs text-espresso-light">Scheme 54 PU-3</p>
                </div>
                <div className="text-xs text-espresso-light leading-relaxed border-t border-sandstone-border/60 pt-2">
                  Warm brass cookware tiffin delivered to room doorstep at 12:30 PM.
                </div>
                <div className="font-serif font-bold text-sm text-espresso">₹2,900/mo</div>
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-2xl bg-sandstone/40 border border-sandstone-border hover:border-saffron transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-teal/15 text-teal flex items-center justify-center font-bold text-xs">
                    <Bike className="w-4 h-4" />
                  </span>
                  <span className="text-[11px] font-bold text-teal">Daily Commute</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-espresso">Honda Activa 6G</h4>
                  <p className="text-xs text-espresso-light">Vijay Nagar Hub</p>
                </div>
                <div className="text-xs text-espresso-light leading-relaxed border-t border-sandstone-border/60 pt-2">
                  55 kmpl fuel efficiency with helmet & mobile charger included.
                </div>
                <div className="font-serif font-bold text-sm text-espresso">₹4,800/mo</div>
              </div>

              {/* Card 4 */}
              <div className="p-4 rounded-2xl bg-sandstone/40 border border-sandstone-border hover:border-saffron transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 flex items-center justify-center font-bold text-xs">
                    <Laptop className="w-4 h-4" />
                  </span>
                  <span className="text-[11px] font-bold text-blue-600">Dev Ready</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-espresso">ThinkPad X1 Carbon</h4>
                  <p className="text-xs text-espresso-light">Scheme 78 Labs</p>
                </div>
                <div className="text-xs text-espresso-light leading-relaxed border-t border-sandstone-border/60 pt-2">
                  Intel i7, 16GB RAM, pre-configured with VS Code & Docker.
                </div>
                <div className="font-serif font-bold text-sm text-espresso">₹5,400/mo</div>
              </div>
            </div>

            {/* Price Total & CTA */}
            <div className="p-6 rounded-2xl bg-midnight text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-sandstone-light/60">Individual Separate Sum: ₹22,600/mo</span>
                <div className="flex items-baseline space-x-3">
                  <span className="font-serif font-bold text-2xl text-saffron">Sathi Combo: ₹20,500/mo</span>
                  <span className="text-xs text-emerald-light font-bold bg-emerald/20 px-2 py-0.5 rounded-full">Save ₹2,100</span>
                </div>
              </div>

              <Link
                to="/ai"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-saffron hover:bg-saffron-light text-midnight font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
              >
                <span>Build Your Bundle</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 4: STUDENT STARTER PACK (COLLEGE TABS)
        ============================================================== */}
        <section className="bg-sandstone-light py-20 px-4 sm:px-6 lg:px-8 border-y border-sandstone-border">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-saffron-dark">Campus Starter Packs</span>
              <h2 className="font-serif text-3xl font-bold text-espresso">
                Indore College Starter Packs
              </h2>
              <p className="text-sm text-espresso-light">
                Tailored accommodation, meal plans and transit options synchronized for your university campus.
              </p>
            </div>

            {/* College switcher tabs */}
            <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2 no-scrollbar">
              {COLLEGE_PRESETS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollege(col.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
                    selectedCollege === col.id
                      ? 'bg-midnight text-white border-midnight shadow-xs'
                      : 'bg-white text-espresso-light border-sandstone-border hover:border-saffron'
                  }`}
                >
                  {col.name}
                </button>
              ))}
            </div>

            {/* Active College Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sandstone-border shadow-md max-w-5xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-sandstone-border pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-espresso">
                    {activeCollegePreset.name} Pack
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-espresso-light mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-saffron" />
                    <span>{activeCollegePreset.area}</span>
                    <span>•</span>
                    <span className="text-emerald font-semibold">{activeCollegePreset.dist}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-espresso-light line-through mr-2">{activeCollegePreset.total}</span>
                  <span className="font-serif font-bold text-xl text-espresso">{activeCollegePreset.combo}</span>
                  <p className="text-[11px] text-emerald font-semibold">Save {activeCollegePreset.save}/month with Sathi</p>
                </div>
              </div>

              {/* 3 Pack Items */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-sandstone/50 border border-sandstone-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-espresso">
                    <span className="flex items-center space-x-1.5">
                      <Home className="w-3.5 h-3.5 text-saffron" />
                      <span>Stay</span>
                    </span>
                    <span className="text-saffron-dark">{activeCollegePreset.room.price}</span>
                  </div>
                  <h4 className="font-bold text-xs text-espresso">{activeCollegePreset.room.name}</h4>
                  <p className="text-[11px] text-espresso-light leading-relaxed">{activeCollegePreset.room.note}</p>
                </div>

                <div className="p-4 rounded-2xl bg-sandstone/50 border border-sandstone-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-espresso">
                    <span className="flex items-center space-x-1.5">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-emerald" />
                      <span>Food</span>
                    </span>
                    <span className="text-emerald font-semibold">{activeCollegePreset.tiffin.price}</span>
                  </div>
                  <h4 className="font-bold text-xs text-espresso">{activeCollegePreset.tiffin.name}</h4>
                  <p className="text-[11px] text-espresso-light leading-relaxed">{activeCollegePreset.tiffin.note}</p>
                </div>

                <div className="p-4 rounded-2xl bg-sandstone/50 border border-sandstone-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-espresso">
                    <span className="flex items-center space-x-1.5">
                      <Bike className="w-3.5 h-3.5 text-teal" />
                      <span>Commute / Tech</span>
                    </span>
                    <span className="text-teal font-semibold">{activeCollegePreset.ride.price}</span>
                  </div>
                  <h4 className="font-bold text-xs text-espresso">{activeCollegePreset.ride.name}</h4>
                  <p className="text-[11px] text-espresso-light leading-relaxed">{activeCollegePreset.ride.note}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to={`/ai?college=${activeCollegePreset.id}`}
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-midnight hover:bg-midnight-light text-white font-bold text-xs transition"
                >
                  <span>Request This Campus Pack</span>
                  <ArrowRight className="w-3.5 h-3.5 text-saffron" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 5: HOW SATHI WORKS (Understand, Match, Explain)
        ============================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">Spatial Intelligence</span>
            <h2 className="font-serif text-3xl font-bold text-espresso">
              How Sathi Works
            </h2>
            <p className="text-sm text-espresso-light">
              Not a dumb filter. A contextual engine built for the unique geometry of Indore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sandstone-border shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-saffron/15 text-saffron flex items-center justify-center font-serif font-bold text-xl">
                1
              </div>
              <h3 className="font-serif text-lg font-bold text-espresso">
                Understand
              </h3>
              <p className="text-xs text-espresso-light leading-relaxed">
                Parses mixed natural-language requirements across categories without asking you to fill four disconnected search forms. It flags vague intents before making assumptions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sandstone-border shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal/15 text-teal flex items-center justify-center font-serif font-bold text-xl">
                2
              </div>
              <h3 className="font-serif text-lg font-bold text-espresso">
                Match & Sync
              </h3>
              <p className="text-xs text-espresso-light leading-relaxed">
                Synchronizes locations along Indore's BRTS corridor and college routes so your room, food delivery lane, and vehicle pick-up point are geographically coherent.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sandstone-border shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald/15 text-emerald flex items-center justify-center font-serif font-bold text-xl">
                3
              </div>
              <h3 className="font-serif text-lg font-bold text-espresso">
                Explain & Protect
              </h3>
              <p className="text-xs text-espresso-light leading-relaxed">
                Never just a blind list. Sathi explains exactly WHY each item was picked ("Serene Nest is 400m from DAVV gate, Annapurna delivers to this lane by 12:30 PM").
              </p>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 6: INDORE AREA MAP STRIP
        ============================================================== */}
        <section className="bg-midnight text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-saffron">Indore Localities</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">
                  Explore by Neighborhood
                </h2>
                <p className="text-xs text-sandstone-light/70 mt-1">
                  Each hub has its own rental character, student vibes, and street food.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {INDORE_AREAS.map((area, idx) => (
                <Link
                  key={idx}
                  to={`/areas/${area.slug}`}
                  className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-saffron/40 transition group space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-white group-hover:text-saffron transition">
                      {area.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-saffron group-hover:translate-x-0.5 transition" />
                  </div>
                  <p className="text-xs text-sandstone-light/70 leading-relaxed">
                    {area.vibe}
                  </p>
                  <div className="text-[11px] font-semibold text-saffron pt-1 border-t border-white/5">
                    Avg Rent: {area.avg}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 7: INDORE FLAVOUR MARQUEE BAND
        ============================================================== */}
        <div className="bg-saffron text-midnight py-3 overflow-hidden select-none border-y border-saffron-dark font-sans text-xs font-bold tracking-wide">
          <div className="flex whitespace-nowrap animate-marquee">
            {[
              "Poha-Jalebi at 6 AM",
              "Sarafa Night Food Market",
              "Chappan Dukan flavours",
              "Cleanest City in India 7x in a row",
              "BRTS iBus connected",
              "MPPSC & UPSC student capital",
              "Zero brokerage on direct bookings",
              "Poha-Jalebi at 6 AM",
              "Sarafa Night Food Market",
              "Chappan Dukan flavours",
              "Cleanest City in India 7x in a row",
              "BRTS iBus connected",
              "MPPSC & UPSC student capital",
              "Zero brokerage on direct bookings"
            ].map((text, i) => (
              <span key={i} className="mx-6 flex items-center space-x-3">
                <span>{text}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-midnight/40" />
              </span>
            ))}
          </div>
        </div>

        {/* ==============================================================
            SECTION 8: TRUST & SAFETY + REFER TEASER
        ============================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Trust steps */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-teal">Peace of Mind</span>
              <h2 className="font-serif text-3xl font-bold text-espresso">
                Verified Indore community. Zero hidden brokerage.
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald/15 text-emerald flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-espresso">Aadhaar-Verified Hosts</h4>
                    <p className="text-xs text-espresso-light leading-relaxed">
                      Every PG owner, dabba kitchen, and vehicle owner is verified with government ID and physical location confirmation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-espresso">Video Tours & Meal Trials</h4>
                    <p className="text-xs text-espresso-light leading-relaxed">
                      Book a free room tour or sample a ₹70 trial meal box before committing to a monthly subscription.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-teal/15 text-teal flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-espresso">Protected Contact & Privacy</h4>
                    <p className="text-xs text-espresso-light leading-relaxed">
                      Exact addresses and direct phone numbers remain securely locked until you sign in. No spam, ever.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Refer Teaser Card (No guest data leakage) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-midnight to-midnight-light text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-mustard/20 text-mustard flex items-center justify-center font-bold">
                <Gift className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-saffron">Refer & Earn Program</span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Moving with friends to Indore?
                </h3>
                <p className="text-xs text-sandstone-light/80 leading-relaxed">
                  Invite your batchmates to RoomTiffin Finder. You earn ₹200 credits and they get ₹100 welcome bonus on their first booking.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs text-sandstone-light/60">
                  <span>Welcome Bonus: </span>
                  <span className="text-saffron font-bold">₹100</span>
                </div>
                <Link
                  to="/refer"
                  className="px-4 py-2 rounded-xl bg-saffron hover:bg-saffron-light text-midnight font-bold text-xs transition"
                >
                  View Rewards
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 9: REAL STATS STRIP
        ============================================================== */}
        <section className="bg-white border-y border-sandstone-border py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="font-serif text-3xl font-bold text-espresso">100%</p>
              <p className="text-xs text-espresso-light">Indore Verified Listings</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-3xl font-bold text-saffron">4</p>
              <p className="text-xs text-espresso-light">Synced Categories</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-3xl font-bold text-teal">₹0</p>
              <p className="text-xs text-espresso-light">Brokerage Charged</p>
            </div>
            <div className="space-y-1">
              <p className="font-serif text-3xl font-bold text-emerald">&lt;15m</p>
              <p className="text-xs text-espresso-light">Avg Provider Response</p>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 10: QUICK EXPLORE CATEGORIES
        ============================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-espresso-light">Browse By Type</span>
              <h2 className="font-serif text-3xl font-bold text-espresso">
                Explore Dedicated Categories
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/rooms"
              className="p-6 rounded-3xl bg-white border border-sandstone-border hover:border-saffron hover:shadow-md transition group space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-saffron/15 text-saffron flex items-center justify-center font-bold">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-espresso group-hover:text-saffron transition">Rooms & PGs</h3>
                <p className="text-xs text-espresso-light mt-1">Single rooms, shared suites & coliving in Bhawarkuan, Vijay Nagar</p>
              </div>
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-saffron">
                <span>View Rooms</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </span>
            </Link>

            <Link
              to="/tiffin"
              className="p-6 rounded-3xl bg-white border border-sandstone-border hover:border-emerald hover:shadow-md transition group space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald/15 text-emerald flex items-center justify-center font-bold">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-espresso group-hover:text-emerald transition">Tiffin & Dabba</h3>
                <p className="text-xs text-espresso-light mt-1">Homestyle Malwi food, Pure Jain meals, Dal Baati Churma</p>
              </div>
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald">
                <span>View Tiffins</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </span>
            </Link>

            <Link
              to="/vehicles"
              className="p-6 rounded-3xl bg-white border border-sandstone-border hover:border-teal hover:shadow-md transition group space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal/15 text-teal flex items-center justify-center font-bold">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-espresso group-hover:text-teal transition">Rental Vehicles</h3>
                <p className="text-xs text-espresso-light mt-1">Honda Activa scooters, Classic 350 cruisers & self-drive cars</p>
              </div>
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-teal">
                <span>View Rides</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </span>
            </Link>

            <Link
              to="/laptops"
              className="p-6 rounded-3xl bg-white border border-sandstone-border hover:border-blue-500 hover:shadow-md transition group space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 flex items-center justify-center font-bold">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-espresso group-hover:text-blue-600 transition">Work Laptops</h3>
                <p className="text-xs text-espresso-light mt-1">ThinkPads for coding, MacBooks for design, ROG gaming rigs</p>
              </div>
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600">
                <span>View Laptops</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default HomePage

import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import listingService from '../../services/listingService.js'
import PageTransition from '../../components/common/PageTransition.jsx'
import {
  Sparkles,
  Send,
  Home,
  UtensilsCrossed,
  AlertCircle,
  HelpCircle,
  Shield
} from 'lucide-react'

const AiSearchPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialQuery = searchParams.get('q') || ''

  // Natural query state
  const [queryInput, setQueryInput] = useState(initialQuery)
  const [clarificationNotice, setClarificationNotice] = useState(null)

  // Parse Natural Language Query Mutation
  const parseMutation = useMutation({
    mutationFn: (text) => listingService.parseAiQuery(text),
    onSuccess: (res) => {
      // Unclear intent -> ask the user to clarify
      if (res.flaggedForConfirmation || res.status === 'unclear' || !res.category) {
        setClarificationNotice(res.explanation || 'Please clarify whether you need a Room/PG or Tiffin food.')
        return
      }

      // Clear intent -> hand the parsed filters over to the matching listings page
      setClarificationNotice(null)
      const f = res.relevantFilters || {}
      const params = new URLSearchParams()
      if (f.maxBudget) params.set('budget', String(f.maxBudget))
      if (f.neighborhood) params.set('area', String(f.neighborhood))
      if (f.roomType) params.set('roomType', String(f.roomType))
      if (f.wifi) params.set('wifi', '1')
      if (f.ac) params.set('ac', '1')
      if (f.foodType) params.set('diet', String(f.foodType))
      if (f.mealTiming) params.set('timing', String(f.mealTiming))
      const qs = params.toString()
      navigate(res.category === 'tiffin' ? `/tiffin${qs ? `?${qs}` : ''}` : `/rooms${qs ? `?${qs}` : ''}`)
    },
    onError: () => {
      toast.error('Sathi could not understand that request. Please try again.')
    }
  })

  // Initial load: auto-parse when arriving with ?q=
  useEffect(() => {
    if (initialQuery) {
      parseMutation.mutate(initialQuery)
    }
  }, [initialQuery])

  // Handle Query Submit
  const handleQuerySubmit = (e) => {
    e.preventDefault()
    if (!queryInput.trim()) return
    parseMutation.mutate(queryInput.trim())
  }

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
              Describe your budget, area, or lifestyle in natural words — English, Hindi, ya Hinglish sab chalega. Sathi reads it in seconds and takes you straight to the matching rooms or tiffin services.
            </p>

            {/* Natural Query Input */}
            <form onSubmit={handleQuerySubmit} className="pt-2">
              <div className="relative max-w-3xl flex items-center bg-midnight-light border border-white/20 focus-within:border-saffron rounded-2xl shadow-lg p-1.5 transition">
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder='English, Hindi ya Hinglish — e.g. "1bhk under 8000 near Palasia" ya "भावरकुआ में शुद्ध शाकाहारी टिफिन"'
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={parseMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-saffron hover:bg-saffron-light text-midnight font-bold text-xs shadow-md transition flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{parseMutation.isPending ? 'Thinking…' : 'Ask Sathi'}</span>
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
                        setClarificationNotice(null)
                        navigate('/rooms')
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
                    >
                      I need a Room/PG
                    </button>
                    <button
                      onClick={() => {
                        setClarificationNotice(null)
                        navigate('/tiffin')
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
                    >
                      I need Tiffin Food
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          {parseMutation.isPending ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-sandstone-border space-y-3">
              <Sparkles className="w-8 h-8 text-saffron mx-auto animate-spin-slow" />
              <p className="font-serif font-bold text-base text-espresso">Sathi is reading your request…</p>
              <p className="text-xs text-espresso-light">
                Matching your words to Indore localities, budgets, and meal plans. You'll be taken straight to the matching listings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white border border-sandstone-border space-y-2">
                <Home className="w-6 h-6 text-saffron" />
                <p className="font-serif font-bold text-base text-espresso">Need a Room or PG?</p>
                <p className="text-xs text-espresso-light">
                  Just say it — "sasta single room near Vijay Nagar under 8000" — and Sathi opens the filtered rooms page.
                </p>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-sandstone-border space-y-2">
                <UtensilsCrossed className="w-6 h-6 text-emerald" />
                <p className="font-serif font-bold text-base text-espresso">Hungry for homemade food?</p>
                <p className="text-xs text-espresso-light">
                  Say "जैन टिफिन पलासिया के पास" and Sathi opens the matching tiffin services for you.
                </p>
              </div>
            </div>
          )}

          {/* Sathi Trust Guarantee Badge */}
          <div className="bg-sandstone-light p-4 rounded-2xl border border-sandstone-border space-y-2 text-xs text-espresso-light">
            <div className="flex items-center space-x-2 text-espresso font-bold">
              <Shield className="w-4 h-4 text-emerald" />
              <span>Indore Zero-Brokerage Guarantee</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Every listed provider is a direct owner with a verified premises. No commission fees or unauthorized middleman surcharges.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default AiSearchPage
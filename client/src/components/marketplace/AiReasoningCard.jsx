import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearAiParsedData, setActiveCategory } from '../../redux/features/ui/uiSlice.js'
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  MapPin,
  Tag,
  Home,
  UtensilsCrossed
} from 'lucide-react'

const AiReasoningCard = () => {
  const { aiParsedData } = useSelector((state) => state.ui)
  const dispatch = useDispatch()

  if (!aiParsedData) return null

  const { status, confidence, summary, explanation, category, neighborhood, budget, relevantFilters, flaggedForConfirmation } = aiParsedData
  const isUnclear = status === 'unclear' || flaggedForConfirmation

  return (
    <div
      className={`rounded-3xl border p-5 sm:p-6 mb-8 transition-all animate-in fade-in duration-300 shadow-sm ${
        isUnclear
          ? 'bg-mustard-light/50 border-mustard/40'
          : 'bg-sandstone-light border-terracotta/30'
      }`}
      data-testid="ai-reasoning-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left Side: Status & Explanation */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 rounded-lg bg-terracotta text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-serif font-bold text-sm text-espresso">
              AI Query Intent Analysis
            </span>

            {/* Confidence Chip */}
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                confidence === 'high'
                  ? 'bg-emerald-light text-emerald-dark border border-emerald/20'
                  : confidence === 'medium'
                  ? 'bg-mustard-light text-mustard-dark border border-mustard/30'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
              data-testid="ai-confidence-badge"
            >
              {confidence} confidence
            </span>

            {/* Unclear / Flagged Warning */}
            {isUnclear && (
              <span
                className="text-[10px] font-bold text-mustard-dark bg-mustard-light px-2.5 py-0.5 rounded-full border border-mustard/40 flex items-center space-x-1"
                data-testid="ai-flagged-badge"
              >
                <AlertTriangle className="w-3 h-3 text-mustard" />
                <span>Flagged for confirmation</span>
              </span>
            )}
          </div>

          <div className="font-semibold text-xs sm:text-sm text-espresso leading-snug" data-testid="ai-summary">
            {summary}
          </div>

          <p className="text-xs text-espresso-muted leading-relaxed max-w-2xl" data-testid="ai-explanation">
            {explanation}
          </p>

          {/* Quick Category Correction if Unclear */}
          {isUnclear && (
            <div className="pt-2 space-y-1.5" data-testid="ai-unclear-options">
              <div className="text-[11px] font-bold text-espresso uppercase tracking-wider">
                Please pick which category you meant:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'rooms', label: 'Rooms & PGs', icon: Home },
                  { id: 'tiffin', label: 'Tiffin & Food', icon: UtensilsCrossed }
                ].map((c) => {
                  const Icon = c.icon
                  return (
                    <button
                      key={c.id}
                      onClick={() => dispatch(setActiveCategory(c.id))}
                      className="px-3 py-1.5 bg-white border border-sandstone-border rounded-xl text-xs font-bold text-espresso hover:border-terracotta hover:text-terracotta transition flex items-center space-x-1.5"
                    >
                      <Icon className="w-3.5 h-3.5 text-terracotta" />
                      <span>{c.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Parsed Chips */}
          {!isUnclear && (
            <div className="flex flex-wrap gap-1.5 pt-1" data-testid="ai-parsed-chips">
              {category && (
                <span className="text-[11px] font-bold bg-white border border-sandstone-border px-2.5 py-1 rounded-lg text-espresso flex items-center space-x-1">
                  <span className="text-terracotta">Category:</span>
                  <span className="capitalize">{category}</span>
                </span>
              )}
              {neighborhood && (
                <span className="text-[11px] font-bold bg-white border border-sandstone-border px-2.5 py-1 rounded-lg text-espresso flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-terracotta" />
                  <span>{neighborhood}</span>
                </span>
              )}
              {budget && (
                <span className="text-[11px] font-bold bg-white border border-sandstone-border px-2.5 py-1 rounded-lg text-espresso flex items-center space-x-1">
                  <Tag className="w-3 h-3 text-emerald" />
                  <span>Max ₹{budget}</span>
                </span>
              )}
              {relevantFilters && Object.entries(relevantFilters).map(([k, v]) => {
                if (k === 'neighborhood' || k === 'maxBudget') return null
                return (
                  <span key={k} className="text-[11px] font-semibold bg-sandstone border border-sandstone-border px-2.5 py-1 rounded-lg text-espresso-muted">
                    {k}: <strong className="text-espresso">{String(v)}</strong>
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Side: Clear Filter Button */}
        <div className="shrink-0">
          <button
            onClick={() => dispatch(clearAiParsedData())}
            data-testid="ai-clear-btn"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-sandstone-border bg-white hover:bg-sandstone text-xs font-semibold text-espresso-muted hover:text-espresso transition shadow-2xs"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filter</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AiReasoningCard

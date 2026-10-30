import React, { useState } from 'react'
import {
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Database,
  Lock,
  KeyRound
} from 'lucide-react'

const MockDataIndicator = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6"
      data-testid="mock-data-indicator"
    >
      <div className="bg-sandstone-light rounded-2xl border border-sandstone-border p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-xl bg-mustard-light text-mustard-dark flex items-center justify-center shrink-0 border border-mustard/30">
              <Database className="w-4 h-4" />
            </span>
            <div>
              <div className="text-xs font-bold text-espresso flex items-center space-x-1.5">
                <span>Active MVP Evaluation Mode (Populated Mock Data)</span>
                <span className="text-[10px] font-bold uppercase bg-mustard-light text-mustard-dark px-2 py-0.5 rounded-full border border-mustard/30">
                  Zero Setup Required
                </span>
              </div>
              <p className="text-[11px] text-espresso-muted">
                Demo Auth (<code className="font-mono font-bold text-terracotta">demo@roomtiffin.in</code>), AI Safety Parser, and all 4 categories are active with curated listings.
              </p>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            data-testid="toggle-mock-details-btn"
            className="text-xs font-bold text-espresso-muted hover:text-espresso flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-sandstone hover:bg-sandstone-dark border border-sandstone-border transition self-start sm:self-auto"
          >
            <span>{expanded ? 'Hide Mock Architecture' : 'View Mock Architecture'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-3 border-t border-sandstone-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-espresso-muted animate-in fade-in">
            <div className="p-3 bg-sandstone rounded-xl border border-sandstone-border space-y-1">
              <div className="font-bold text-espresso flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald" />
                <span>Mocked Listings</span>
              </div>
              <p className="text-[11px]">
                Rooms and Tiffin dabbas are pre-populated on load.
              </p>
            </div>

            <div className="p-3 bg-sandstone rounded-xl border border-sandstone-border space-y-1">
              <div className="font-bold text-espresso flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5 text-terracotta" />
                <span>Mocked Gemini AI</span>
              </div>
              <p className="text-[11px]">
                Strict JSON query parser enforcing ambiguity flags without needing live API tokens.
              </p>
            </div>

            <div className="p-3 bg-sandstone rounded-xl border border-sandstone-border space-y-1">
              <div className="font-bold text-espresso flex items-center space-x-1">
                <KeyRound className="w-3.5 h-3.5 text-mustard-dark" />
                <span>Mocked Demo Auth</span>
              </div>
              <p className="text-[11px]">
                1-click sign-in with <code className="font-mono">demo@roomtiffin.in</code> / <code className="font-mono">demo123</code>.
              </p>
            </div>

            <div className="p-3 bg-sandstone rounded-xl border border-sandstone-border space-y-1">
              <div className="font-bold text-espresso flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-emerald" />
                <span>Mocked Actions</span>
              </div>
              <p className="text-[11px]">
                Tour requests, meal trials, rental orders, and WhatsApp direct links show instant success toasts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MockDataIndicator

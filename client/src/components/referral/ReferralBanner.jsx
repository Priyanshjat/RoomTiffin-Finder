import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { openLoginModal } from '../../redux/features/ui/uiSlice.js'
import { Gift, X, Check, ArrowRight } from 'lucide-react'

const ReferralBanner = () => {
  const [searchParams] = useSearchParams()
  const [refCode, setRefCode] = useState(null)
  const [dismissed, setDismissed] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    const code = searchParams.get('ref')
    if (code) {
      sessionStorage.setItem('referralCode', code.toUpperCase())
      setRefCode(code.toUpperCase())
    } else {
      const stored = sessionStorage.getItem('referralCode')
      if (stored) setRefCode(stored)
    }
  }, [searchParams])

  // If already logged in or dismissed or no code, don't show
  if (!refCode || dismissed || user) return null

  return (
    <div
      data-testid="referral-landing-banner"
      className="bg-gradient-to-r from-terracotta via-amber-600 to-terracotta text-white py-2.5 px-4 shadow-md sticky top-0 z-40 animate-in slide-in-from-top duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center space-x-2 truncate">
          <span className="p-1 rounded-full bg-white/20 shrink-0">
            <Gift className="w-4 h-4 text-mustard" />
          </span>
          <span className="font-medium truncate">
            Special Invite from code <strong className="font-bold underline uppercase">{refCode}</strong>! Sign up now to receive <strong className="font-bold text-amber-200">₹100 instant wallet credit</strong>.
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => dispatch(openLoginModal('Sign up to claim your ₹100 referral welcome credit!'))}
            data-testid="claim-referral-credit-btn"
            className="px-3.5 py-1 bg-white text-terracotta hover:bg-sandstone rounded-full font-bold text-xs shadow-xs transition flex items-center space-x-1"
          >
            <span>Claim ₹100</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            data-testid="dismiss-referral-banner-btn"
            className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReferralBanner

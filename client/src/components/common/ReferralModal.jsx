import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closeReferralModal, openLoginModal } from '../../redux/features/ui/uiSlice.js'
import { toast } from 'sonner'
import {
  X,
  Gift,
  Copy,
  Check,
  Share2,
  Wallet,
  Users,
  ShieldCheck,
  ArrowRight
} from 'lucide-react'

const ReferralModal = () => {
  const { isReferralModalOpen } = useSelector((state) => state.ui)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [copied, setCopied] = useState(false)

  if (!isReferralModalOpen) return null

  const referralCode = user?.referralCode || 'INDORE50'
  const walletBalance = user?.walletBalance || 150

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    toast.info(`Referral code ${referralCode} copied to clipboard!`)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hey! Find verified student rooms and home tiffins in Indore (Bhawarkua, Vijay Nagar, Palasia) on RoomTiffin Finder. Use my invite code "${referralCode}" to get ₹50 welcome wallet credits on sign up! Check it out: ${window.location.origin}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-xs animate-in fade-in duration-200"
      data-testid="referral-modal-overlay"
    >
      <div
        className="bg-sandstone-light w-full max-w-md rounded-3xl border border-sandstone-border shadow-2xl overflow-hidden relative"
        data-testid="referral-modal"
      >
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeReferralModal())}
          data-testid="referral-modal-close-btn"
          className="absolute top-4 right-4 p-2 rounded-full text-espresso-muted hover:text-espresso hover:bg-sandstone-dark transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Banner */}
        <div className="p-6 bg-gradient-to-br from-mustard-light via-sandstone to-terracotta-light border-b border-sandstone-border">
          <div className="w-12 h-12 rounded-2xl bg-mustard text-white flex items-center justify-center shadow-md mb-3">
            <Gift className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-espresso" data-testid="referral-modal-title">
            Refer & Earn Wallet Cash
          </h2>
          <p className="text-xs text-espresso-muted mt-1 leading-relaxed">
            Invite classmates, roommates, and colleagues to RoomTiffin Finder. They get ₹50 welcome bonus, and you earn wallet credits redeemable on every booking.
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Active Wallet Balance */}
          <div className="flex items-center justify-between p-3.5 bg-sandstone rounded-2xl border border-sandstone-border">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-light text-emerald flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-espresso-muted tracking-wider">Your Wallet Balance</span>
                <div className="font-serif font-bold text-lg text-espresso" data-testid="referral-wallet-balance">
                  ₹{walletBalance} <span className="text-xs font-sans font-normal text-espresso-muted">Credits</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald bg-emerald-light px-2.5 py-1 rounded-full">
              Redeemable
            </span>
          </div>

          {/* Referral Code Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-espresso">
              Your Personal Referral Code
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-3 bg-white border border-sandstone-border rounded-xl font-mono font-bold text-sm text-espresso tracking-widest text-center" data-testid="referral-code-display">
                {referralCode}
              </div>
              <button
                onClick={handleCopy}
                data-testid="referral-copy-btn"
                className="p-3 bg-sandstone-dark hover:bg-sandstone-border text-espresso rounded-xl transition flex items-center justify-center"
                title="Copy Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* WhatsApp Share Button */}
          <button
            onClick={handleWhatsAppShare}
            data-testid="referral-whatsapp-btn"
            className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20BD5C] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Invite on WhatsApp</span>
          </button>

          {/* How It Works Steps */}
          <div className="space-y-2.5 pt-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-espresso-muted">
              How the program works
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-sandstone rounded-xl border border-sandstone-border">
                <div className="w-5 h-5 rounded-full bg-sandstone-dark text-espresso text-[11px] font-bold flex items-center justify-center mx-auto mb-1">
                  1
                </div>
                <div className="text-[10px] font-semibold text-espresso">Share Code</div>
                <div className="text-[9px] text-espresso-muted">With friend</div>
              </div>
              <div className="p-2.5 bg-sandstone rounded-xl border border-sandstone-border">
                <div className="w-5 h-5 rounded-full bg-sandstone-dark text-espresso text-[11px] font-bold flex items-center justify-center mx-auto mb-1">
                  2
                </div>
                <div className="text-[10px] font-semibold text-espresso">They Get ₹50</div>
                <div className="text-[9px] text-espresso-muted">Instant credit</div>
              </div>
              <div className="p-2.5 bg-sandstone rounded-xl border border-sandstone-border">
                <div className="w-5 h-5 rounded-full bg-sandstone-dark text-espresso text-[11px] font-bold flex items-center justify-center mx-auto mb-1">
                  3
                </div>
                <div className="text-[10px] font-semibold text-espresso">You Earn ₹100</div>
                <div className="text-[9px] text-espresso-muted">On their booking</div>
              </div>
            </div>
          </div>

          {!user && (
            <div className="p-3 bg-terracotta-light border border-terracotta/20 rounded-xl text-center space-y-1">
              <p className="text-xs text-terracotta font-medium">
                Sign in to track your personal referral payouts.
              </p>
              <button
                onClick={() => {
                  dispatch(closeReferralModal())
                  dispatch(openLoginModal('Sign in to claim your referral code.'))
                }}
                className="text-xs font-bold text-espresso underline"
              >
                Sign In Now &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReferralModal

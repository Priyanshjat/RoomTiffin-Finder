import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { openLoginModal } from '../../redux/features/ui/uiSlice.js'
import {
  useReferralStats,
  useReferralHistory,
  useApplyReferral,
  useWallet
} from '../../hooks/useReferral.js'
import { toast } from 'sonner'
import {
  Gift,
  Copy,
  Check,
  Share2,
  MessageCircle,
  Smartphone,
  Wallet,
  Award,
  Users,
  Lock,
  ArrowRight,
  Sparkles,
  QrCode,
  ShieldCheck,
  Clock,
  CheckCircle2,
  HelpCircle,
  ExternalLink
} from 'lucide-react'

const ReferralPage = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const isGuest = !user

  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [manualCode, setManualCode] = useState('')

  // Queries (enabled if user is logged in)
  const { data: stats, isLoading: statsLoading } = useReferralStats(!isGuest)
  const { data: history = [], isLoading: historyLoading } = useReferralHistory(!isGuest)
  const { data: walletData } = useWallet(!isGuest)
  const applyMutation = useApplyReferral()

  // Calculated referral link
  const referralCode = stats?.referralCode || user?.referralCode || 'RT-AARAV24'
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?ref=${referralCode}`
    : `https://roomtiffin.in/?ref=${referralCode}`

  // Copy helpers
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopiedCode(true)
    toast.success(`Referral code ${referralCode} copied to clipboard!`)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopiedLink(true)
    toast.success('Shareable invite link copied to clipboard!')
    setTimeout(() => setCopiedLink(false), 2000)
  }

  // Social Share actions
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hey! Find verified rooms, PGs, and homestyle tiffin meal plans in Indore on RoomTiffin Finder. Use my code ${referralCode} to get ₹100 instant wallet credit: ${shareUrl}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const handleSmsShare = () => {
    const text = encodeURIComponent(
      `Get ₹100 wallet credit on RoomTiffin Finder with my referral code ${referralCode}: ${shareUrl}`
    )
    window.open(`sms:?body=${text}`, '_self')
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RoomTiffin Finder - Refer & Earn',
          text: `Join RoomTiffin Finder with code ${referralCode} and get ₹100 wallet bonus!`,
          url: shareUrl
        })
      } catch (err) {
        // Ignored if cancelled
      }
    } else {
      handleCopyLink()
    }
  }

  // Apply friend's code
  const handleApplyManualCode = async (e) => {
    e.preventDefault()
    if (!manualCode.trim()) return
    try {
      const res = await applyMutation.mutateAsync(manualCode.trim())
      toast.success(res?.message || 'Referral code applied successfully!')
      setManualCode('')
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to apply code.')
    }
  }

  // Milestones info
  const totalReferred = stats?.totalReferred || (history.length || 0)
  const bronzeTarget = 3
  const silverTarget = 10
  const goldTarget = 25

  return (
    <div className="min-h-screen bg-sandstone py-8 px-4 sm:px-6 lg:px-8" data-testid="referral-page">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-terracotta-light text-terracotta text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-mustard" />
            <span>Community Rewards Program</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso tracking-tight" data-testid="referral-page-title">
            Refer Friends & Earn Wallet Credits
          </h1>
          <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed">
            Give ₹100 welcome credit to your friends when they join. Earn ₹200 in your wallet whenever they book a room tour or meal trial.
          </p>
        </div>

        {/* Guest Lock Banner if not logged in */}
        {isGuest && (
          <div
            className="p-6 sm:p-8 rounded-3xl bg-white border border-sandstone-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
            data-testid="referral-guest-banner"
          >
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center space-x-1 text-terracotta font-bold text-xs uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>Account Required</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-espresso">
                Sign in to unlock your personal referral link and wallet
              </h2>
              <p className="text-xs text-espresso-muted max-w-xl">
                Every verified member receives a custom referral code, live tracking dashboard, and direct wallet deductions at checkout.
              </p>
            </div>

            <button
              onClick={() => dispatch(openLoginModal('Sign in to view your referral code and wallet credits.'))}
              data-testid="referral-login-btn"
              className="px-6 py-3 bg-terracotta hover:bg-terracotta-hover text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition shrink-0 flex items-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to Get Code</span>
            </button>
          </div>
        )}

        {/* Top Bento Row: Invite Card + Live Wallet Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Referral Invite Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-sandstone-border p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider">Your Personal Code</span>
                <h3 className="font-serif text-2xl font-bold text-espresso">Share & Invite</h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-terracotta-light text-terracotta flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
            </div>

            {/* Code Box */}
            <div className="p-4 rounded-2xl bg-sandstone-light border border-sandstone-border space-y-3">
              <div className="text-xs text-espresso-muted font-medium flex items-center justify-between">
                <span>Unique Referral Code</span>
                <span className="text-emerald font-semibold text-[11px]">Valid Forever</span>
              </div>

              <div className="flex items-center justify-between bg-white rounded-xl border border-sandstone-border p-3 gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-espresso tracking-widest" data-testid="user-referral-code">
                  {referralCode}
                </span>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  data-testid="copy-referral-code-btn"
                  className="px-4 py-2 bg-sandstone hover:bg-sandstone-dark text-espresso rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shrink-0"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald" />
                      <span className="text-emerald">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Link Box */}
              <div className="flex items-center justify-between bg-white rounded-xl border border-sandstone-border p-2.5 gap-2">
                <span className="text-xs text-espresso-muted font-mono truncate max-w-[280px]" data-testid="user-referral-link">
                  {shareUrl}
                </span>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  data-testid="copy-referral-link-btn"
                  className="px-3 py-1.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shrink-0"
                >
                  {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Link</span>
                </button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-espresso-muted">
                Quick Share With Friends:
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  data-testid="share-whatsapp-btn"
                  className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5C] text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleSmsShare}
                  data-testid="share-sms-btn"
                  className="py-2.5 px-3 rounded-xl bg-sandstone hover:bg-sandstone-dark text-espresso text-xs font-bold border border-sandstone-border transition flex items-center justify-center space-x-1.5"
                >
                  <Smartphone className="w-4 h-4 text-terracotta" />
                  <span>SMS</span>
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  data-testid="share-more-btn"
                  className="py-2.5 px-3 rounded-xl bg-espresso hover:bg-black text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>More</span>
                </button>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="p-4 rounded-2xl bg-sandstone border border-sandstone-border flex items-center gap-4" data-testid="referral-qr-container">
              <div className="w-20 h-20 bg-white rounded-xl p-1.5 border border-sandstone-border shadow-2xs shrink-0 flex items-center justify-center">
                {/* Clean SVG QR Representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-espresso" fill="currentColor">
                  <path d="M10 10h30v30h-30zM15 15v20h20v-20zM60 10h30v30h-30zM65 15v20h20v-20zM10 60h30v30h-30zM15 65v20h20v-20zM22 22h6v6h-6zM72 22h6v6h-6zM22 72h6v6h-6zM60 60h10v10h-10zM80 60h10v10h-10zM60 80h10v10h-10zM75 70h10v10h-10zM70 85h20v5h-20zM45 15h10v10h-10zM45 35h10v10h-10zM45 55h10v10h-10zM45 75h10v10h-10z" />
                </svg>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-espresso">Scan & Share at College / Coworking</div>
                <p className="text-[11px] text-espresso-muted leading-relaxed">
                  Show this QR code to classmates or roommates to let them scan and claim their ₹100 credit on their phones.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Wallet Card & Apply Code (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Wallet Overview Card */}
            <div className="bg-gradient-to-br from-espresso via-[#3d2e22] to-espresso text-white rounded-3xl p-6 sm:p-7 space-y-5 shadow-md relative overflow-hidden" data-testid="wallet-card">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-sandstone-light/70 tracking-wider">RoomTiffin Balance</span>
                  <h3 className="font-serif text-xl font-bold">Your Wallet</h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-mustard">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>

              {/* Balances */}
              <div className="grid grid-cols-2 gap-3 pt-1 relative z-10">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <div className="text-[10px] text-sandstone-light/70 uppercase font-semibold">Available Credit</div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-300" data-testid="wallet-available-amount">
                    ₹{walletData?.balance ?? stats?.walletBalance ?? (isGuest ? 0 : 300)}
                  </div>
                  <div className="text-[10px] text-emerald-200 mt-0.5">Ready to apply</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <div className="text-[10px] text-sandstone-light/70 uppercase font-semibold">Pending Rewards</div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-mustard" data-testid="wallet-pending-amount">
                    ₹{walletData?.pendingBalance ?? stats?.pendingRewards ?? (isGuest ? 0 : 200)}
                  </div>
                  <div className="text-[10px] text-mustard/80 mt-0.5">Awaiting 1st booking</div>
                </div>
              </div>

              {/* Lifetime Earned Metric */}
              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-sandstone-light/80 relative z-10">
                <span>Lifetime Referral Earnings:</span>
                <strong className="text-white font-serif font-bold text-sm">
                  ₹{walletData?.lifetimeEarned ?? (isGuest ? 0 : 500)}
                </strong>
              </div>
            </div>

            {/* Apply a Friend's Referral Code Card */}
            <div className="bg-white rounded-3xl border border-sandstone-border p-6 space-y-4 shadow-sm" data-testid="apply-code-card">
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-espresso flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-mustard" />
                  <span>Have a Friend's Referral Code?</span>
                </h4>
                <p className="text-xs text-espresso-muted">
                  Enter their invite code below to unlock your ₹100 welcome credit.
                </p>
              </div>

              <form onSubmit={handleApplyManualCode} className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="e.g. RT-AARAV24"
                  data-testid="input-manual-referral-code"
                  className="flex-1 px-3.5 py-2.5 text-xs bg-sandstone-light border border-sandstone-border rounded-xl text-espresso font-mono uppercase focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                />
                <button
                  type="submit"
                  disabled={applyMutation.isPending || isGuest}
                  data-testid="apply-referral-code-btn"
                  className="px-4 py-2.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  Apply
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* Milestone Badges & Progress */}
        <div className="bg-white rounded-3xl border border-sandstone-border p-6 sm:p-8 space-y-6 shadow-sm" data-testid="milestones-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sandstone-border pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-mustard-dark tracking-wider">Tier Progression</span>
              <h3 className="font-serif text-2xl font-bold text-espresso">Referral Milestone Badges</h3>
            </div>
            <div className="text-xs text-espresso-muted">
              Total Friends Referred: <strong className="text-espresso font-bold text-sm">{totalReferred}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bronze Tier */}
            <div className={`p-5 rounded-2xl border transition ${totalReferred >= bronzeTarget ? 'bg-amber-50/50 border-amber-300' : 'bg-sandstone border-sandstone-border'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Bronze Scout</span>
                <Award className="w-5 h-5 text-amber-700" />
              </div>
              <div className="font-serif font-bold text-lg text-espresso">3 Successful Referrals</div>
              <p className="text-[11px] text-espresso-muted mt-1">Unlock priority response from hosts and landlords.</p>
              <div className="mt-4 pt-2 border-t border-sandstone-border/60 flex items-center justify-between text-xs">
                <span className="text-espresso-muted">Progress:</span>
                <span className="font-bold text-espresso">{Math.min(totalReferred, bronzeTarget)} / {bronzeTarget}</span>
              </div>
            </div>

            {/* Silver Tier */}
            <div className={`p-5 rounded-2xl border transition ${totalReferred >= silverTarget ? 'bg-slate-50 border-slate-300' : 'bg-sandstone border-sandstone-border'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Silver Champion</span>
                <Award className="w-5 h-5 text-slate-500" />
              </div>
              <div className="font-serif font-bold text-lg text-espresso">10 Successful Referrals</div>
              <p className="text-[11px] text-espresso-muted mt-1">Earn ₹500 Milestone Bonus cash + Silver profile badge.</p>
              <div className="mt-4 pt-2 border-t border-sandstone-border/60 flex items-center justify-between text-xs">
                <span className="text-espresso-muted">Progress:</span>
                <span className="font-bold text-espresso">{Math.min(totalReferred, silverTarget)} / {silverTarget}</span>
              </div>
            </div>

            {/* Gold Tier */}
            <div className={`p-5 rounded-2xl border transition ${totalReferred >= goldTarget ? 'bg-yellow-50 border-yellow-300' : 'bg-sandstone border-sandstone-border'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-800">Gold Ambassador</span>
                <Award className="w-5 h-5 text-mustard" />
              </div>
              <div className="font-serif font-bold text-lg text-espresso">25 Successful Referrals</div>
              <p className="text-[11px] text-espresso-muted mt-1">Earn ₹1,500 Bonus + VIP zero-deposit verification across all listings.</p>
              <div className="mt-4 pt-2 border-t border-sandstone-border/60 flex items-center justify-between text-xs">
                <span className="text-espresso-muted">Progress:</span>
                <span className="font-bold text-espresso">{Math.min(totalReferred, goldTarget)} / {goldTarget}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Invited Friends Tracker */}
        <div className="bg-white rounded-3xl border border-sandstone-border p-6 sm:p-8 space-y-4 shadow-sm" data-testid="referral-tracker-section">
          <div className="flex items-center justify-between border-b border-sandstone-border pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-terracotta tracking-wider">Live Activity</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-espresso">Invited Friends & Progress Tracker</h3>
            </div>
            <span className="text-xs text-espresso-muted font-medium">
              4-Step Reward Life Cycle
            </span>
          </div>

          {/* Activity Table or Empty State */}
          {history.length === 0 ? (
            <div className="py-12 text-center space-y-3" data-testid="referral-history-empty">
              <Users className="w-8 h-8 text-mustard mx-auto" />
              <h4 className="font-serif font-bold text-base text-espresso">No Referral Invites Yet</h4>
              <p className="text-xs text-espresso-muted max-w-sm mx-auto">
                Share your invite code with roommates or friends to track their signup and reward statuses here.
              </p>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 bg-terracotta text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Invite Link Now</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto pt-2" data-testid="referral-history-table">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-sandstone-border text-espresso-muted uppercase text-[10px] font-bold">
                    <th className="pb-3 font-bold">Invited Friend</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold">Bonus Credited</th>
                    <th className="pb-3 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-border">
                  {history.map((item, idx) => (
                    <tr key={idx} className="hover:bg-sandstone-light/50 transition">
                      <td className="py-3.5 font-medium text-espresso flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-sandstone-dark text-espresso flex items-center justify-center text-[10px] font-bold">
                          {item.maskedEmail ? item.maskedEmail[0].toUpperCase() : 'U'}
                        </span>
                        <span>{item.maskedEmail || item.name || 'Friend'}</span>
                      </td>

                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'COMPLETED'
                            ? 'bg-emerald-light text-emerald'
                            : item.status === 'JOINED'
                            ? 'bg-mustard-light text-mustard-dark'
                            : 'bg-sandstone text-espresso-muted'
                        }`}>
                          {item.status === 'COMPLETED' ? 'Completed 1st Request (+₹200)' : item.status === 'JOINED' ? 'Joined (₹100 given)' : item.status}
                        </span>
                      </td>

                      <td className="py-3.5 font-bold font-serif text-espresso">
                        {item.rewardCredited ? `+₹${item.rewardCredited}` : 'Pending 1st Request'}
                      </td>

                      <td className="py-3.5 text-espresso-muted">
                        {item.date ? new Date(item.date).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ReferralPage

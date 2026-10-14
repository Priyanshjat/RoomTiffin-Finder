import React from 'react'
import { Link } from 'react-router-dom'
import { Gift, Share2, Wallet, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

const steps = [
  {
    step: '1',
    title: 'Share Your Invite Code',
    desc: 'Send your personal referral link or code via WhatsApp, SMS, or QR code to roommates, classmates, or colleagues.',
    icon: Share2,
    badge: 'Instant Link'
  },
  {
    step: '2',
    title: 'Friend Gets ₹100 Bonus',
    desc: 'When your friend creates their account using your invite, ₹100 is automatically credited to their wallet balance.',
    icon: Gift,
    badge: '₹100 for Friend'
  },
  {
    step: '3',
    title: 'You Earn ₹200 Reward',
    desc: 'Once your friend completes their first room tour booking or vehicle/laptop rental, you receive ₹200 in your wallet.',
    icon: Wallet,
    badge: '₹200 for You'
  }
]

const ReferralTeaser = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-y border-sandstone-border" data-testid="referral-teaser-section">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-terracotta-light text-terracotta text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Refer & Earn Community Rewards</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-espresso" data-testid="referral-teaser-title">
            Help Friends Settle in. Earn Wallet Credit.
          </h2>
          <p className="text-xs sm:text-sm text-espresso-muted leading-relaxed">
            Invite classmates and colleagues relocating to Bengaluru. Turn referrals into discounts on your monthly room rent, meal subscriptions, or rides.
          </p>
        </div>

        {/* 3 Step Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {steps.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-sandstone border border-sandstone-border space-y-4 relative flex flex-col justify-between"
                data-testid={`referral-step-card-${idx}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-terracotta text-white font-serif font-bold text-lg flex items-center justify-center shadow-xs">
                      {item.step}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-terracotta border border-sandstone-border">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-espresso">
                    {item.title}
                  </h3>

                  <p className="text-xs text-espresso-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center space-x-1.5 text-xs text-emerald font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% automated credit</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Teaser CTA Bar */}
        <div className="bg-sandstone-light rounded-3xl border border-sandstone-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif font-bold text-base text-espresso">
              Ready to start earning wallet rewards?
            </h4>
            <p className="text-xs text-espresso-muted">
              Get your unique invite link, view your live wallet ledger, and track milestone rewards.
            </p>
          </div>

          <Link
            to="/refer"
            data-testid="referral-teaser-cta-btn"
            className="px-6 py-3 bg-terracotta hover:bg-terracotta-hover text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition flex items-center space-x-2 shrink-0"
          >
            <span>Visit Refer & Earn Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default ReferralTeaser

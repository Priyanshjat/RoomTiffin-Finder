import React from 'react'
import {
  ShieldCheck,
  Lock,
  UtensilsCrossed,
  RotateCcw
} from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Hosts & Kitchens',
    desc: 'Every room host and tiffin kitchen is physically cross-verified with valid ID proof before listing.'
  },
  {
    icon: Lock,
    title: 'Guest Privacy by Default',
    desc: 'Exact residential addresses, direct phone numbers, and WhatsApp contacts are hidden from casual browsing until signed in.'
  },
  {
    icon: UtensilsCrossed,
    title: 'Taste First, Subscribe Later',
    desc: 'Sample meal trials starting at ₹80 allow students and professionals to verify hygiene and taste before committing to monthly dabbas.'
  },
  {
    icon: RotateCcw,
    title: 'Guaranteed Deposit Refunds',
    desc: 'Security deposits on rooms and tiffin plans are securely held and refunded promptly when the trial or subscription ends.'
  }
]

const TrustSafetySection = () => {
  return (
    <section className="py-14 border-t border-sandstone-border" data-testid="trust-safety-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-sandstone rounded-full text-xs font-bold text-espresso border border-sandstone-border">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
            <span>Community Trust Standard</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
            Built with Privacy & Peace of Mind
          </h2>
          <p className="text-xs sm:text-sm text-espresso-muted">
            We built RoomTiffin Finder because finding a reliable room or home meal in Indore shouldn't involve scams or guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-sandstone border border-sandstone-border space-y-3"
                data-testid={`trust-card-${idx}`}
              >
                <div className="w-10 h-10 rounded-xl bg-terracotta-light text-terracotta flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-espresso">
                  {item.title}
                </h3>
                <p className="text-xs text-espresso-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TrustSafetySection

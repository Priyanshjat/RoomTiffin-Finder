import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  BadgeCheck,
  Gift,
  MapPin,
  Star
} from 'lucide-react'

/**
 * AuthShowcase — cinematic dark side panel for the Login & Register pages.
 * Stock imagery: six Indore room + tiffin photos (cropped from the client's
 * collage) delivered from /assets — no external image services.
 */

const ALL_PHOTOS = [
  { src: '/assets/auth-g1.jpg?v=2', alt: 'A bright furnished bedroom with a study desk in Indore' },
  { src: '/assets/auth-g2.jpg?v=2', alt: 'Two friends chatting over chai on a home sofa' },
  { src: '/assets/auth-g3.jpg?v=2', alt: 'A airy living and dining room with houseplants' },
  { src: '/assets/auth-g4.jpg?v=2', alt: 'Host handing over room keys at the door' },
  { src: '/assets/auth-g5.jpg?v=2', alt: 'Homestyle tiffin bhojan with steel carrier, rice and sabzi' },
  { src: '/assets/auth-g6.jpg?v=2', alt: 'Evening chai on the windowsill of a cosy rented room' }
]

const AuthShowcase = ({ tagline, title1, title2, flankLeft, flankRight }) => {
  // Rotating spotlight — each photo gets its moment with a soft crossfade
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ALL_PHOTOS.length), 3200)
    return () => clearInterval(t)
  }, [])

  const leftFlank = flankLeft || ALL_PHOTOS[0]
  const rightFlank = flankRight || ALL_PHOTOS[2]

  return (
    <div className="relative h-full w-full bg-midnight text-white overflow-hidden flex flex-col justify-between">
      {/* Ambient glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-saffron/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-teal/15 blur-[110px] pointer-events-none" />

      {/* Concentric ring decoration (like a tied thali / tiffin carrier rings) */}
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[420px] h-[420px] rounded-full border border-white/10" />
        <div className="absolute inset-[-52px] rounded-full border border-white/[0.07]" />
        <div className="absolute inset-[36px] rounded-full border border-white/[0.06]" />
      </div>

      {/* Top tagline */}
      <div className="relative pt-9 px-10 text-center">
        <p className="text-[12.5px] text-white/65 font-medium tracking-wide">
          {tagline}
        </p>
      </div>

      {/* Headline + photo gallery */}
      <div className="relative px-10 -mt-4">
        <h2 className="font-serif font-bold text-white text-[40px] leading-[1.08] tracking-tight text-center">
          {title1}
          <br />
          {title2}
        </h2>

        {/* Polaroid-style photo collage */}
        <div className="relative h-[310px] mt-3">
          {/* Left tilted photo — peeks fully out to the left of the spotlight */}
          <div className="absolute left-1/2 -translate-x-[112%] top-16 w-[136px] -rotate-[8deg] rounded-2xl overflow-hidden border-4 border-[#0e1620] shadow-2xl shadow-black/50 bg-midnight-card">
            <img
              src={leftFlank.src}
              alt={leftFlank.alt}
              className="w-full h-[188px] object-cover"
              loading="eager"
            />
          </div>

          {/* Right tilted photo — peeks fully out to the right of the spotlight */}
          <div className="absolute left-1/2 translate-x-[66%] top-2 w-[132px] rotate-[8deg] rounded-2xl overflow-hidden border-4 border-[#0e1620] shadow-2xl shadow-black/55 bg-midnight-card">
            <img
              src={rightFlank.src}
              alt={rightFlank.alt}
              className="w-full h-[186px] object-cover"
              loading="eager"
            />
          </div>

          {/* Center spotlight — cycles through every photo */}
          <div className="absolute left-1/2 -translate-x-1/2 top-12 z-10 w-[196px] h-[252px] rounded-2xl overflow-hidden border-[3px] border-[#18222e] shadow-2xl shadow-black/60 bg-midnight-card">
            {ALL_PHOTOS.map((p, i) => (
              <img
                key={p.src}
                src={p.src}
                alt={p.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  i === idx ? 'opacity-100' : 'opacity-0'
                }`}
                loading="eager"
              />
            ))}
            {/* Progress dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {ALL_PHOTOS.map((p, i) => (
                <button
                  key={p.src}
                  onClick={() => setIdx(i)}
                  aria-label={`Show photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? 'w-3.5 bg-saffron' : 'w-1.5 bg-white/35 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Floating price chip */}
          <div className="absolute left-1/2 translate-x-[30%] bottom-4 z-20 px-3.5 py-2 rounded-full bg-white text-espresso shadow-xl flex items-center space-x-1.5 text-[11px] font-bold">
            <Star className="w-3.5 h-3.5 text-mustard fill-mustard" />
            <span>From ₹2,600/mo</span>
          </div>
        </div>
      </div>

      {/* Bottom trust strip */}
      <div className="relative pb-9 px-8">
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[10.5px] font-semibold text-white/80">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald" />
            <span>Zero Brokerage</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[10.5px] font-semibold text-white/80">
            <Gift className="w-3.5 h-3.5 text-saffron" />
            <span>+₹100 Referral Bonus</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[10.5px] font-semibold text-white/80">
            <MapPin className="w-3.5 h-3.5 text-terracotta" />
            <span>12 Indore Areas</span>
          </span>
        </div>
      </div>
    </div>
  )
}

/* Shared brand mark used on both auth pages — click to go home without signing in */
export const AuthBrandLink = () => (
  <Link
    to="/"
    aria-label="RoomTiffin Finder — back to home"
    data-testid="auth-brand-home-link"
    title="Back to home"
    className="flex items-center space-x-2.5 group rounded-xl hover:opacity-85 transition cursor-pointer"
  >
    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-terracotta text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
      <Sparkles className="w-5 h-5 text-white" />
    </span>
    <div>
      <div className="font-serif font-bold text-2xl tracking-tight leading-none flex items-center">
        <span>RoomTiffin</span>
        <span className="text-saffron">.</span>
      </div>
      <div className="text-[10px] uppercase font-bold tracking-wider text-saffron mt-0.5">
        Sathi AI
      </div>
    </div>
  </Link>
)

export default AuthShowcase

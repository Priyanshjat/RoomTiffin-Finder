import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { openReferralModal } from '../../redux/features/ui/uiSlice.js'
import {
  Home,
  UtensilsCrossed,
  Bike,
  Laptop,
  Gift,
  ShieldCheck,
  Heart,
  Sparkles,
  MapPin,
  ArrowRight
} from 'lucide-react'

const Footer = () => {
  const dispatch = useDispatch()

  return (
    <footer className="bg-midnight text-sandstone-light mt-auto border-t border-white/10" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="w-9 h-9 rounded-xl bg-saffron text-midnight flex items-center justify-center font-bold">
                <Home className="w-5 h-5" />
              </span>
              <span className="font-serif font-bold text-2xl text-white">
                RoomTiffin<span className="text-saffron">.</span>
              </span>
            </Link>
            <p className="text-xs text-sandstone-light/70 leading-relaxed">
              Indore's trusted AI marketplace for student PGs, homestyle dabbas, rental scooters, and study laptops. 100% verified hosts, zero brokerage.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-saffron font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sathi AI Engine • Indore Hub</span>
            </div>
          </div>

          {/* Categories Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Explore Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-sandstone-light/70">
              <li>
                <Link to="/rooms" className="hover:text-saffron transition flex items-center space-x-1.5">
                  <Home className="w-3.5 h-3.5 text-saffron" />
                  <span>Rooms, PGs & Coliving</span>
                </Link>
              </li>
              <li>
                <Link to="/tiffin" className="hover:text-saffron transition flex items-center space-x-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-emerald" />
                  <span>Tiffin, Dabba & Meal Plans</span>
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="hover:text-saffron transition flex items-center space-x-1.5">
                  <Bike className="w-3.5 h-3.5 text-teal" />
                  <span>Rental Scooters & Bikes</span>
                </Link>
              </li>
              <li>
                <Link to="/laptops" className="hover:text-saffron transition flex items-center space-x-1.5">
                  <Laptop className="w-3.5 h-3.5 text-blue-400" />
                  <span>Work & Study Laptops</span>
                </Link>
              </li>
              <li>
                <Link to="/ai" className="hover:text-saffron transition flex items-center space-x-1.5 text-saffron-light font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-saffron" />
                  <span>Sathi Bundle Planner</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Indore Neighborhood Hubs */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Indore Localities
            </h4>
            <ul className="space-y-2 text-xs text-sandstone-light/70">
              <li>
                <Link to="/areas/bhawarkuan" className="hover:text-saffron transition flex items-center space-x-1.5">
                  <MapPin className="w-3 h-3 text-saffron" />
                  <span>Bhawarkuan (Coaching Hub & DAVV)</span>
                </Link>
              </li>
              <li>
                <Link to="/areas/vijay-nagar" className="hover:text-saffron transition flex items-center space-x-1.5">
                  <MapPin className="w-3 h-3 text-saffron" />
                  <span>Vijay Nagar (Scheme 54 & C21 Mall)</span>
                </Link>
              </li>
              <li>
                <Link to="/areas/palasia" className="hover:text-saffron transition flex items-center space-x-1.5">
                  <MapPin className="w-3 h-3 text-saffron" />
                  <span>Palasia (Chappan Dukan & Saket)</span>
                </Link>
              </li>
              <li>
                <Link to="/areas/rau" className="hover:text-saffron transition flex items-center space-x-1.5">
                  <MapPin className="w-3 h-3 text-saffron" />
                  <span>Rau & Silicon City (IPS & Medi-Caps)</span>
                </Link>
              </li>
              <li>
                <Link to="/areas/scheme-78" className="hover:text-saffron transition flex items-center space-x-1.5">
                  <MapPin className="w-3 h-3 text-saffron" />
                  <span>Scheme 78 (Tech Enclave & Hospital)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Refer & Program */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Refer & Earn
            </h4>
            <p className="text-xs text-sandstone-light/70 leading-relaxed">
              Earn ₹200 credits when your friends book rooms, meals, or rides in Indore. They get ₹100 welcome reward.
            </p>
            <div className="pt-1">
              <Link
                to="/refer"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-saffron hover:bg-saffron-light text-midnight font-bold text-xs rounded-xl shadow-xs transition"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Open Referral Program</span>
              </Link>
            </div>
            <div className="pt-2 text-[10px] text-sandstone-light/50">
              Verified local community network • Indore, Madhya Pradesh
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-sandstone-light/50 gap-3">
          <p>© {new Date().getFullYear()} RoomTiffin Finder. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-saffron fill-saffron" />
            <span>for Indore's student & professional communities</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

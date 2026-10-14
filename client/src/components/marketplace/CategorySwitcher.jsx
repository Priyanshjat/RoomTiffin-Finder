import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, useReducedMotion } from 'framer-motion'
import { setActiveCategory } from '../../redux/features/ui/uiSlice.js'
import {
  Home,
  UtensilsCrossed,
  Bike,
  Laptop,
  Sparkles
} from 'lucide-react'

const categories = [
  {
    id: 'rooms',
    label: 'Rooms & PGs',
    subtitle: 'Single, shared & coliving',
    icon: Home,
    badge: 'Verified Homes',
    accent: 'terracotta'
  },
  {
    id: 'tiffin',
    label: 'Tiffin & Dabba',
    subtitle: 'Homestyle veg & non-veg',
    icon: UtensilsCrossed,
    badge: 'Clean Kitchens',
    accent: 'mustard'
  },
  {
    id: 'vehicles',
    label: 'Vehicles',
    subtitle: 'Scooters, bikes & cars',
    icon: Bike,
    badge: 'Self-Drive',
    accent: 'emerald'
  },
  {
    id: 'laptops',
    label: 'Laptops',
    subtitle: 'MacBooks, ThinkPads & rigs',
    icon: Laptop,
    badge: 'Work & Study',
    accent: 'slate'
  }
]

const CategorySwitcher = () => {
  const { activeCategory } = useSelector((state) => state.ui)
  const dispatch = useDispatch()
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="w-full" data-testid="category-switcher">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 relative">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.id

          return (
            <button
              key={cat.id}
              onClick={() => dispatch(setActiveCategory(cat.id))}
              data-testid={`category-tab-${cat.id}`}
              className={`relative p-4 sm:p-5 rounded-2xl text-left border transition-colors duration-200 overflow-hidden group select-none ${
                isActive
                  ? 'border-transparent shadow-md'
                  : 'bg-white border-sandstone-border hover:border-sandstone-border/80 hover:bg-sandstone/30 shadow-2xs'
              }`}
            >
              {/* Animated Segmented Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className={`absolute inset-0 z-0 rounded-2xl ${
                    cat.id === 'rooms'
                      ? 'bg-gradient-to-br from-terracotta/10 via-white to-terracotta-light border-2 border-terracotta'
                      : cat.id === 'tiffin'
                      ? 'bg-gradient-to-br from-mustard/15 via-white to-mustard-light border-2 border-mustard'
                      : cat.id === 'vehicles'
                      ? 'bg-gradient-to-br from-emerald/10 via-white to-emerald-light border-2 border-emerald'
                      : 'bg-gradient-to-br from-slate-200/50 via-white to-slate-100 border-2 border-slate-700'
                  }`}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 350, damping: 30 }
                  }
                />
              )}

              {/* Card Content inside */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? cat.id === 'rooms'
                          ? 'bg-terracotta text-white shadow-sm'
                          : cat.id === 'tiffin'
                          ? 'bg-mustard text-white shadow-sm'
                          : cat.id === 'vehicles'
                          ? 'bg-emerald text-white shadow-sm'
                          : 'bg-slate-800 text-white shadow-sm'
                        : 'bg-sandstone-dark text-espresso-muted group-hover:text-espresso'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isActive
                        ? cat.id === 'rooms'
                          ? 'bg-terracotta-light text-terracotta'
                          : cat.id === 'tiffin'
                          ? 'bg-mustard-light text-mustard-dark'
                          : cat.id === 'vehicles'
                          ? 'bg-emerald-light text-emerald'
                          : 'bg-slate-100 text-slate-800'
                        : 'bg-sandstone-dark text-espresso-light'
                    }`}
                  >
                    {cat.badge}
                  </span>
                </div>

                <div className="font-serif font-bold text-base sm:text-lg text-espresso leading-snug">
                  {cat.label}
                </div>
                <div className="text-xs text-espresso-muted mt-0.5 truncate">
                  {cat.subtitle}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategorySwitcher

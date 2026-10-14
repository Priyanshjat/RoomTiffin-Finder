import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, Home, Sparkles, MapPin, ArrowRight } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-midnight text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center space-y-6"
      >
        <div className="w-20 h-20 mx-auto rounded-3xl bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron sathi-glow">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-saffron">
            404 • Lost in Indore?
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Even Sathi couldn't find this lane.
          </h1>
          <p className="text-sm text-sandstone-light/70 max-w-md mx-auto leading-relaxed">
            Maybe this address moved near Chappan Dukan or Bhawarkuan. Let Sathi guide you back to verified rooms, hot tiffins, or reliable rides.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-saffron hover:bg-saffron-light text-midnight font-bold text-sm shadow-md transition"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/ai"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 transition"
          >
            <Sparkles className="w-4 h-4 text-teal-light" />
            <span>Ask Sathi to Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="pt-6 border-t border-white/10">
          <p className="text-xs text-sandstone-light/50 mb-3">Popular Indore Areas</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {['Vijay Nagar', 'Bhawarkuan', 'Palasia', 'Rau', 'Scheme 78'].map((area) => (
              <Link
                key={area}
                to={`/areas/${area.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-sandstone-light/80 border border-white/10 transition flex items-center space-x-1"
              >
                <MapPin className="w-3 h-3 text-saffron" />
                <span>{area}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage

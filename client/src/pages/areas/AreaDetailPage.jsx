import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import listingService from '../../services/listingService.js'
import ListingCard from '../../components/marketplace/ListingCard.jsx'
import ListingDetailModal from '../../components/marketplace/ListingDetailModal.jsx'
import PageTransition from '../../components/common/PageTransition.jsx'
import {
  MapPin,
  Sparkles,
  Home,
  UtensilsCrossed,
  Bike,
  Laptop,
  GraduationCap,
  Bus,
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react'

const AreaDetailPage = () => {
  const { slug } = useParams()
  const [activeTab, setActiveTab] = useState('all')
  const [selectedListing, setSelectedListing] = useState(null)

  const {
    data: areaData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['area', slug],
    queryFn: () => listingService.fetchAreaBySlug(slug),
    staleTime: 5 * 60 * 1000
  })

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-sandstone">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-saffron" />
          <p className="text-sm text-espresso-light">Exploring Indore neighbourhoods...</p>
        </div>
      </div>
    )
  }

  if (isError || !areaData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-sandstone">
        <div className="max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-terracotta mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-espresso">Area Not Found</h2>
          <p className="text-sm text-espresso-light">
            We couldn't find listings for "{slug}". Try exploring our most popular student & tech hubs in Indore.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {['vijay-nagar', 'bhawarkuan', 'palasia', 'rau', 'geeta-bhawan', 'scheme-78'].map((s) => (
              <Link
                key={s}
                to={`/areas/${s}`}
                className="px-3 py-1.5 rounded-full bg-white text-espresso text-xs font-medium border border-sandstone-border hover:border-saffron transition"
              >
                {s.replace('-', ' ').toUpperCase()}
              </Link>
            ))}
          </div>
          <div className="pt-4">
            <Link to="/" className="text-sm font-semibold text-teal hover:underline">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const listings = areaData.listings || []
  const filteredListings = activeTab === 'all'
    ? listings
    : listings.filter(l => l.category === activeTab)

  return (
    <PageTransition variant="fade">
      <div className="min-h-screen bg-sandstone">
        {/* Area Hero */}
        <section className="relative bg-midnight text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src={areaData.heroImage}
              alt={areaData.name}
              className="w-full h-full object-cover filter blur-xs"
            />
          </div>
          <div className="relative max-w-7xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-saffron">
              <MapPin className="w-3.5 h-3.5" />
              <span>{areaData.city || 'Indore'}, Madhya Pradesh</span>
            </div>

            <div className="max-w-3xl space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
                {areaData.name}
              </h1>
              <p className="text-lg text-sandstone-light/90 font-medium">
                {areaData.tagline}
              </p>
              <p className="text-sm text-sandstone-light/70 leading-relaxed max-w-2xl">
                {areaData.description}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <span className="text-[11px] uppercase tracking-wider text-sandstone-light/60">Average Rent</span>
                <p className="font-serif text-base font-bold text-saffron mt-0.5">{areaData.averageRent}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <span className="text-[11px] uppercase tracking-wider text-sandstone-light/60">Verified Listings</span>
                <p className="font-serif text-base font-bold text-white mt-0.5">{listings.length} available</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <span className="text-[11px] uppercase tracking-wider text-sandstone-light/60">Top Colleges</span>
                <p className="text-xs font-semibold text-white mt-0.5 truncate">{areaData.topColleges?.join(', ') || 'Indore Hub'}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <span className="text-[11px] uppercase tracking-wider text-sandstone-light/60">Transit</span>
                <p className="text-xs font-semibold text-teal-light mt-0.5 truncate">iBus BRTS Connected</p>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights & Context */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Highlights */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-sandstone-border shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-espresso flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald" />
                <span>Why live in {areaData.name}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {areaData.highlights?.map((h, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-espresso-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-1.5 flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sathi Callout */}
            <div className="bg-gradient-to-br from-midnight to-midnight-light text-white rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-saffron/20 border border-saffron/30 flex items-center justify-center text-saffron">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-white">
                  Bundle your move to {areaData.name}
                </h3>
                <p className="text-xs text-sandstone-light/70 leading-relaxed">
                  Tell Sathi your budget. Get a synced Room + Tiffin + Ride starter pack in this area with zero brokerage.
                </p>
              </div>
              <Link
                to={`/ai?area=${areaData.slug}`}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-saffron hover:bg-saffron-light text-midnight font-bold text-xs transition"
              >
                <span>Ask Sathi to Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Listings Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sandstone-border pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-espresso">
                Listings in {areaData.name}
              </h2>
              <p className="text-xs text-espresso-light">
                Verified rooms, home tiffins, rides and laptops available in this neighborhood
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex items-center space-x-1.5 bg-white p-1 rounded-2xl border border-sandstone-border">
              {[
                { id: 'all', label: 'All' },
                { id: 'rooms', label: 'Rooms' },
                { id: 'tiffin', label: 'Tiffins' },
                { id: 'vehicles', label: 'Vehicles' },
                { id: 'laptops', label: 'Laptops' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-midnight text-white shadow-xs'
                      : 'text-espresso-light hover:text-espresso'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredListings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-sandstone-border space-y-3">
              <p className="text-sm font-semibold text-espresso">No {activeTab} listings currently in {areaData.name}.</p>
              <p className="text-xs text-espresso-light max-w-sm mx-auto">
                Ask Sathi to notify you when new listings drop or check neighboring areas like Bhawarkuan or Vijay Nagar.
              </p>
              <Link
                to="/ai"
                className="inline-flex items-center space-x-1 text-xs font-bold text-saffron hover:underline"
              >
                <span>Ask Sathi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(listing => (
                <ListingCard
                  key={listing._id || listing.id}
                  listing={listing}
                  onSelect={setSelectedListing}
                />
              ))}
            </div>
          )}
        </section>

        {/* Listing Detail Modal */}
        {selectedListing && (
          <ListingDetailModal
            listing={selectedListing}
            onClose={() => setSelectedListing(null)}
          />
        )}
      </div>
    </PageTransition>
  )
}

export default AreaDetailPage

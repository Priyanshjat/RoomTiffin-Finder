import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useFavorites, useRemoveFavorite } from '../../hooks/useReferral.js'
import { openLoginModal } from '../../redux/features/ui/uiSlice.js'
import ListingCard from '../../components/marketplace/ListingCard.jsx'
import ListingDetailModal from '../../components/marketplace/ListingDetailModal.jsx'
import { Heart, Lock, ArrowRight, Layers, Trash2 } from 'lucide-react'

const SavedPage = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const isGuest = !user
  const [selectedListing, setSelectedListing] = useState(null)

  const { data: favorites = [], isLoading } = useFavorites(!isGuest)
  const removeFavMutation = useRemoveFavorite()

  if (isGuest) {
    return (
      <div className="min-h-screen bg-sandstone py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center" data-testid="saved-page-guest">
        <div className="bg-white rounded-3xl border border-sandstone-border p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-light text-terracotta mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-espresso">Save Your Favorite Discoveries</h2>
          <p className="text-xs text-espresso-muted leading-relaxed">
            Sign in to bookmark rooms and meal plans across Indore to access them anytime.
          </p>
          <button
            onClick={() => dispatch(openLoginModal('Sign in to view and manage your saved listings.'))}
            data-testid="saved-login-btn"
            className="w-full py-2.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Sign In to View Saved
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sandstone py-8 px-4 sm:px-6 lg:px-8" data-testid="saved-page">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sandstone-border pb-4">
          <div>
            <div className="flex items-center space-x-1.5 text-terracotta text-xs font-bold uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4 fill-terracotta" />
              <span>Personal Bookmarks</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
              Saved Listings ({favorites.length})
            </h1>
            <p className="text-xs text-espresso-muted mt-0.5">
              Compare your short-listed stays, dabbas, rides, and workstations.
            </p>
          </div>

          <Link
            to="/"
            className="px-4 py-2 bg-sandstone hover:bg-sandstone-dark text-espresso rounded-xl text-xs font-bold border border-sandstone-border transition flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <span>Explore More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-20 text-center text-xs text-espresso-muted">
            Loading saved items...
          </div>
        ) : favorites.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-sandstone-border p-8 max-w-md mx-auto space-y-3" data-testid="no-saved-listings">
            <Heart className="w-10 h-10 text-sandstone-border mx-auto stroke-1" />
            <h3 className="font-serif font-bold text-lg text-espresso">No Saved Listings Yet</h3>
            <p className="text-xs text-espresso-muted">
              Browse rooms and meal plans and click "Save" to build your short list.
            </p>
            <Link
              to="/"
              className="inline-flex px-5 py-2.5 bg-terracotta text-white rounded-xl text-xs font-bold hover:bg-terracotta-hover transition"
            >
              Discover Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="saved-listings-grid">
            {favorites.map((item) => (
              <div key={item._id || item.id} className="relative group">
                <ListingCard
                  listing={item}
                  onSelect={(sel) => setSelectedListing(sel)}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFavMutation.mutate(item._id || item.id)
                  }}
                  title="Remove from saved"
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-red-50 text-espresso hover:text-red-600 shadow-md transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  )
}

export default SavedPage

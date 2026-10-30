import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { openLoginModal } from '../../redux/features/ui/uiSlice.js'
import { useMyRequests } from '../../hooks/useListings.js'
import {
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  ClipboardList,
  Sparkles,
  MapPin,
  Loader2
} from 'lucide-react'

const RequestsPage = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const isGuest = !user

  // Real requests from the API (room tour & meal trial bookings)
  const { data: bookings, isLoading } = useMyRequests(!isGuest)

  const requests = React.useMemo(() => {
    return (bookings || []).map((b) => ({
      id: b.id,
      type: b.type,
      title: b.title,
      date: b.slot ? `${b.date} • ${b.slot}` : b.date,
      location: b.location,
      host: b.hostPhone ? `${b.host} (${b.hostPhone})` : b.host,
      hostPhone: b.hostPhone,
      status: b.status,
      discountApplied: b.discountApplied
    }))
  }, [bookings])

  if (isGuest) {
    return (
      <div className="min-h-screen bg-sandstone py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center" data-testid="requests-page-guest">
        <div className="bg-white rounded-3xl border border-sandstone-border p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-light text-terracotta mx-auto flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-espresso">Manage Your Tour & Trial Requests</h2>
          <p className="text-xs text-espresso-muted leading-relaxed">
            Sign in to track your room visits and meal trial dispatches.
          </p>
          <button
            onClick={() => dispatch(openLoginModal('Sign in to track your active tour & trial requests.'))}
            data-testid="requests-login-btn"
            className="w-full py-2.5 bg-terracotta hover:bg-terracotta-hover text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Sign In to View Requests
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sandstone py-8 px-4 sm:px-6 lg:px-8" data-testid="requests-page">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sandstone-border pb-4">
          <div>
            <div className="flex items-center space-x-1.5 text-terracotta text-xs font-bold uppercase tracking-wider mb-1">
              <ClipboardList className="w-4 h-4" />
              <span>Activity Hub</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
              Room Tours & Meal Trials
            </h1>
            <p className="text-xs text-espresso-muted mt-0.5">
              Live updates on scheduled property visits, meal trial dispatches, and provider confirmations.
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

        {/* Requests List */}
        <div className="space-y-4" data-testid="requests-list">
          {isLoading ? (
            <div className="py-20 text-center flex items-center justify-center text-espresso-muted">
              <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
            </div>
          ) : requests.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-sandstone-border p-8 max-w-md mx-auto space-y-3">
              <ClipboardList className="w-10 h-10 text-sandstone-border mx-auto" />
              <h3 className="font-serif font-bold text-lg text-espresso">No Requests Yet</h3>
              <p className="text-xs text-espresso-muted">
                Schedule a room tour or book a meal trial and your live request history will appear here.
              </p>
            </div>
          ) : (requests).map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl border border-sandstone-border p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              data-testid={`request-item-${req.id}`}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sandstone-dark text-espresso">
                    {req.type}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-light text-emerald flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{req.status}</span>
                  </span>
                  {req.discountApplied > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      ₹{req.discountApplied} Wallet Credit Applied
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-lg text-espresso">
                  {req.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-espresso-muted">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-terracotta" />
                    <span>{req.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald" />
                    <span>{req.location}</span>
                  </span>
                </div>

                <div className="text-xs text-espresso-muted">
                  Direct Contact: <strong className="text-espresso font-semibold">{req.host}</strong>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const phoneDigits = (req.hostPhone || '').replace(/\D/g, '').slice(-10)
                    if (phoneDigits) {
                      window.open(`https://wa.me/91${phoneDigits}`, '_blank')
                    }
                  }}
                  className="px-4 py-2 bg-emerald hover:bg-emerald-dark text-white rounded-xl text-xs font-bold transition shadow-xs text-center"
                >
                  Message on WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default RequestsPage

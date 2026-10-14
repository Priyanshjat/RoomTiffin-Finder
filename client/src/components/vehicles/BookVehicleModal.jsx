import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useCreateRentalRequest } from '../../hooks/useListings.js'
import {
  Bike,
  Car,
  Calendar,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  ShieldCheck,
  Send,
  Loader2,
  Sparkles,
  Fuel,
  Gauge,
  Key,
  Shield
} from 'lucide-react'

const INDORE_PICKUP_HUBS = [
  { id: 'bhawarkuan', name: 'Bhawarkuan BRTS Hub', area: 'Near DAVV / Coaching Zone' },
  { id: 'vijaynagar', name: 'Vijay Nagar Hub (PU-4)', area: 'Opposite C21 Mall' },
  { id: 'palasia', name: 'Palasia Square Hub', area: 'Near 56 Dukan / AB Road' },
  { id: 'airport', name: 'Indore Airport (IDR)', area: 'Terminal 1 Parking' },
  { id: 'railway', name: 'Indore Junction Railway Station', area: 'Platform 1 Main Exit' },
  { id: 'doorstep', name: 'Doorstep Delivery (Indore)', area: 'Delivery to your hostel/home' },
]

const DURATION_PRESETS = [
  { id: '1day', label: '1 Day', days: 1, discountPct: 0 },
  { id: '3days', label: '3 Days (Weekend)', days: 3, discountPct: 5 },
  { id: '7days', label: '1 Week (7 Days)', days: 7, discountPct: 15 },
  { id: '30days', label: '1 Month (30 Days)', days: 30, discountPct: 25 },
]

const BookVehicleModal = ({ vehicle, onClose }) => {
  const [selectedDuration, setSelectedDuration] = useState(DURATION_PRESETS[0])
  const [pickupHub, setPickupHub] = useState(INDORE_PICKUP_HUBS[0].id)
  const [pickupDate, setPickupDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [pickupTime, setPickupTime] = useState('10:00 AM')
  const [needsSecondHelmet, setNeedsSecondHelmet] = useState(false)
  const [dlAgreed, setDlAgreed] = useState(true)
  const [specialInstructions, setSpecialInstructions] = useState('')

  const rentalMutation = useCreateRentalRequest()

  const isCar = vehicle.vehicleType?.toLowerCase() === 'car'
  const dailyRate = vehicle.pricing?.perDay || vehicle.pricing?.amount || vehicle.rent || 350
  const depositAmount = vehicle.pricing?.deposit || vehicle.deposit || (isCar ? 4000 : 1000)

  // Calculations
  const grossRent = Math.round(dailyRate * selectedDuration.days * (1 - selectedDuration.discountPct / 100))
  const deliveryFee = pickupHub === 'doorstep' ? 100 : 0
  const secondHelmetFee = (!isCar && needsSecondHelmet) ? 50 : 0
  const totalRentPayable = grossRent + deliveryFee + secondHelmetFee

  const selectedHubObj = INDORE_PICKUP_HUBS.find(h => h.id === pickupHub) || INDORE_PICKUP_HUBS[0]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!dlAgreed) {
      toast.warning('Please acknowledge that you possess a valid Driving License.')
      return
    }

    try {
      await rentalMutation.mutateAsync({
        listingId: vehicle._id || vehicle.id,
        category: 'vehicles',
        duration: `${selectedDuration.label} (${selectedDuration.days} days)`,
        startDate: `${pickupDate} at ${pickupTime}`,
        pickupHub: `${selectedHubObj.name} - ${selectedHubObj.area}`,
        notes: `Delivery/Hub: ${selectedHubObj.name}. Helmet2: ${needsSecondHelmet ? 'Yes' : 'No'}. Notes: ${specialInstructions.trim()}`
      })

      toast.success(
        `Booking reserved for ${vehicle.title}! Pickup scheduled on ${pickupDate} (${pickupTime}) at ${selectedHubObj.name}. The fleet host will contact you.`
      )
      onClose()
    } catch (err) {
      toast.error('Could not complete booking request. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl border border-sandstone-border shadow-2xl max-w-lg w-full overflow-hidden text-espresso my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-1">
              {isCar ? <Car className="w-3 h-3" /> : <Bike className="w-3 h-3" />}
              <span>Indore Wheels &bull; Instant Reservation</span>
            </span>
            <h3 className="font-serif font-bold text-xl text-white">
              {vehicle.title}
            </h3>
            <div className="flex items-center space-x-3 text-xs text-sandstone-light/80">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{vehicle.approxLocation || vehicle.neighborhood}</span>
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-[11px] font-semibold text-emerald-200">
                {vehicle.transmission || 'Auto'} &bull; {vehicle.fuelType || 'Petrol'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-sandstone-light/60 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Duration Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-espresso-muted flex items-center justify-between">
              <span>Rental Duration</span>
              <span className="text-[11px] font-semibold text-emerald">
                {selectedDuration.discountPct > 0 ? `Save ${selectedDuration.discountPct}%` : 'Standard Daily'}
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedDuration(preset)}
                  className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    selectedDuration.id === preset.id
                      ? 'bg-emerald text-white border-emerald shadow-xs'
                      : 'bg-sandstone/60 border-sandstone-border text-espresso hover:border-emerald/40'
                  }`}
                >
                  <span className="text-xs font-bold">{preset.label}</span>
                  <span className={`text-[10px] ${selectedDuration.id === preset.id ? 'text-emerald-100' : 'text-espresso-muted'}`}>
                    ₹{Math.round(dailyRate * preset.days * (1 - preset.discountPct / 100))}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Pickup Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-espresso-muted flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-emerald" />
                <span>Pickup Date</span>
              </label>
              <input
                type="date"
                required
                value={pickupDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-sandstone border border-sandstone-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-espresso-muted flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-emerald" />
                <span>Pickup Time</span>
              </label>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-sandstone border border-sandstone-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald/40"
              >
                <option value="08:00 AM">08:00 AM (Early Bird)</option>
                <option value="10:00 AM">10:00 AM (Standard)</option>
                <option value="12:00 PM">12:00 PM (Noon)</option>
                <option value="03:00 PM">03:00 PM (Afternoon)</option>
                <option value="06:00 PM">06:00 PM (Evening)</option>
                <option value="08:00 PM">08:00 PM (Late Night)</option>
              </select>
            </div>
          </div>

          {/* Indore Pickup Hub Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-espresso-muted flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-emerald" />
              <span>Select Indore Handover Hub</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INDORE_PICKUP_HUBS.map((hub) => (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => setPickupHub(hub.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col ${
                    pickupHub === hub.id
                      ? 'bg-emerald-50 border-emerald text-emerald-900 shadow-xs'
                      : 'bg-sandstone/40 border-sandstone-border text-espresso hover:border-sandstone-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{hub.name}</span>
                    {pickupHub === hub.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald" />}
                  </div>
                  <span className="text-[10px] text-espresso-muted mt-0.5">{hub.area}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add-on for Bikes & Scooters: Second Helmet */}
          {!isCar && (
            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-espresso">Add Second Pillion Helmet (+₹50)</span>
                <p className="text-[10px] text-espresso-muted">
                  1 sanitized ISI helmet is always free with every booking.
                </p>
              </div>
              <input
                type="checkbox"
                checked={needsSecondHelmet}
                onChange={(e) => setNeedsSecondHelmet(e.target.checked)}
                className="w-4 h-4 rounded text-emerald focus:ring-emerald cursor-pointer"
              />
            </div>
          )}

          {/* DL and ID Verification Check */}
          <div className="p-3 bg-sandstone rounded-2xl border border-sandstone-border flex items-start space-x-2.5">
            <input
              type="checkbox"
              id="dlCheck"
              required
              checked={dlAgreed}
              onChange={(e) => setDlAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald focus:ring-emerald cursor-pointer"
            />
            <label htmlFor="dlCheck" className="text-[11px] text-espresso-muted leading-relaxed cursor-pointer">
              <span className="font-bold text-espresso">Driving License & Government ID Commitment:</span> I confirm that I hold an original valid Driving License and will present it with Aadhaar during vehicle key handover.
            </label>
          </div>

          {/* Special Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-espresso-muted">
              Special Requests or Landmark Note (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Need mobile holder, arriving via train from Bhopal..."
              className="w-full px-3 py-2 bg-sandstone border border-sandstone-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald/40"
            />
          </div>

          {/* Pricing Breakdown Card */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Clear Transparent Fare &bull; Zero Brokerage
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Rental ({selectedDuration.days} days @ ₹{dailyRate}/day)</span>
              <span>₹{grossRent}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Doorstep Delivery Handling</span>
                <span>+₹{deliveryFee}</span>
              </div>
            )}
            {secondHelmetFee > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Extra Pillion ISI Helmet</span>
                <span>+₹{secondHelmetFee}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-emerald-300 pt-1 border-t border-slate-800">
              <span className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Refundable Security Deposit (Pay at handover)</span>
              </span>
              <span>₹{depositAmount}</span>
            </div>
            <div className="flex items-center justify-between font-serif font-bold text-base text-white pt-2 border-t border-slate-700">
              <span>Total Rental Advance</span>
              <span className="text-emerald-400 font-sans">₹{totalRentPayable}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-sandstone-border text-xs font-bold text-espresso hover:bg-sandstone transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rentalMutation.isPending || !dlAgreed}
              className="flex-2 py-3 px-4 rounded-xl bg-emerald hover:bg-emerald-dark disabled:opacity-50 text-white text-xs font-bold transition shadow-md flex items-center justify-center space-x-1.5"
            >
              {rentalMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Reserving Ride...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Confirm Reservation (₹{totalRentPayable})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default BookVehicleModal

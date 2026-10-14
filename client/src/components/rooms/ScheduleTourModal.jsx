import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useCreateBooking } from '../../hooks/useListings.js'
import {
  Calendar,
  Clock,
  Video,
  UserCheck,
  MapPin,
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
  Loader2
} from 'lucide-react'

const TIME_SLOTS = [
  'Morning (10:00 AM - 12:00 PM)',
  'Afternoon (2:00 PM - 4:00 PM)',
  'Evening (5:00 PM - 7:00 PM)'
]

const ScheduleTourModal = ({ room, onClose }) => {
  const [tourType, setTourType] = useState('in-person') // 'in-person' | 'video'
  const [tourDate, setTourDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [tourSlot, setTourSlot] = useState(TIME_SLOTS[0])
  const [notes, setNotes] = useState('')

  const bookingMutation = useCreateBooking()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await bookingMutation.mutateAsync({
        listingId: room._id || room.id,
        category: 'rooms',
        date: tourDate,
        slot: `${tourSlot} • Format: ${tourType === 'in-person' ? 'In-Person Visit' : 'WhatsApp Video Tour'}`,
        notes: notes.trim()
      })

      toast.success(
        `Room tour scheduled for ${tourDate}! Host ${room.provider?.name || ''} has been notified on WhatsApp.`
      )
      onClose()
    } catch (err) {
      toast.error('Could not schedule tour. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl border border-sandstone-border shadow-2xl max-w-lg w-full overflow-hidden text-espresso"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2B1E16] to-[#3D281D] text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-light">
              Free Room Tour
            </span>
            <h3 className="font-serif font-bold text-xl text-white">
              Schedule Visit: {room.title}
            </h3>
            <div className="flex items-center space-x-1.5 text-xs text-sandstone-light/75">
              <MapPin className="w-3.5 h-3.5 text-terracotta" />
              <span>{room.approxLocation || room.neighborhood}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-sandstone-light/60 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Tour Format Toggle */}
          <div className="space-y-2">
            <label className="font-bold text-espresso uppercase tracking-wider">
              Tour Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTourType('in-person')}
                className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition ${
                  tourType === 'in-person'
                    ? 'bg-terracotta/10 border-terracotta text-terracotta font-bold'
                    : 'bg-sandstone/30 border-sandstone-border text-espresso-light hover:border-terracotta/40'
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs">In-Person Visit</div>
                  <div className="text-[10px] text-espresso-light font-normal">Walk-in with the host</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTourType('video')}
                className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition ${
                  tourType === 'video'
                    ? 'bg-terracotta/10 border-terracotta text-terracotta font-bold'
                    : 'bg-sandstone/30 border-sandstone-border text-espresso-light hover:border-terracotta/40'
                }`}
              >
                <Video className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs">WhatsApp Video Call</div>
                  <div className="text-[10px] text-espresso-light font-normal">Live room walkthrough</div>
                </div>
              </button>
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="font-bold text-espresso uppercase tracking-wider flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-terracotta" />
              <span>Preferred Date</span>
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={tourDate}
              onChange={(e) => setTourDate(e.target.value)}
              className="w-full bg-sandstone/50 border border-sandstone-border rounded-xl p-2.5 text-xs font-semibold focus:outline-hidden focus:border-terracotta"
            />
          </div>

          {/* Time Slot */}
          <div className="space-y-2">
            <label className="font-bold text-espresso uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-terracotta" />
              <span>Time Slot</span>
            </label>
            <div className="space-y-1.5">
              {TIME_SLOTS.map((slot) => (
                <label
                  key={slot}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                    tourSlot === slot
                      ? 'bg-sandstone border-terracotta font-bold text-espresso'
                      : 'border-sandstone-border text-espresso-light hover:bg-sandstone/40'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="tourSlot"
                      value={slot}
                      checked={tourSlot === slot}
                      onChange={() => setTourSlot(slot)}
                      className="text-terracotta focus:ring-terracotta"
                    />
                    <span>{slot}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Optional notes */}
          <div className="space-y-2">
            <label className="font-bold text-espresso uppercase tracking-wider">
              Notes for Host (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Visiting with parent, need to check study desk & geyser"
              className="w-full bg-sandstone/40 border border-sandstone-border rounded-xl p-2.5 text-xs focus:outline-hidden focus:border-terracotta resize-none"
            />
          </div>

          {/* Zero Fee Guarantee */}
          <div className="p-3 bg-emerald/10 border border-emerald/20 rounded-xl text-[11px] text-emerald font-semibold flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>100% Free room tour. Zero broker fees or advance charges.</span>
          </div>

          {/* Submit Action */}
          <div className="flex items-center space-x-3 pt-2 border-t border-sandstone-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-sandstone-border text-espresso font-bold hover:bg-sandstone transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={bookingMutation.isPending}
              className="flex-1 py-3 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white font-bold shadow-md transition flex items-center justify-center space-x-2"
            >
              {bookingMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirm Tour</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default ScheduleTourModal

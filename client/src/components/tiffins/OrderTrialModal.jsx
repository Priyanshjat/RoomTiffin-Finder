import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useCreateBooking } from '../../hooks/useListings.js'
import {
  UtensilsCrossed,
  Clock,
  Calendar,
  MapPin,
  X,
  CheckCircle2,
  ShieldCheck,
  Send,
  Loader2,
  Sparkles
} from 'lucide-react'

const OrderTrialModal = ({ tiffin, onClose }) => {
  const [mealTiming, setMealTiming] = useState('Lunch (12:30 PM)')
  const [trialDate, setTrialDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [instructions, setInstructions] = useState('')

  const bookingMutation = useCreateBooking()

  const trialCost = tiffin.pricing?.perMeal || 70

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await bookingMutation.mutateAsync({
        listingId: tiffin._id || tiffin.id,
        category: 'tiffin',
        date: trialDate,
        slot: `Sample Trial Dabba • ${mealTiming}`,
        notes: instructions.trim()
      })

      toast.success(
        `Trial meal order placed for ${trialDate} (${mealTiming})! ${tiffin.provider?.name} will confirm your delivery slot on WhatsApp.`
      )
      onClose()
    } catch (err) {
      toast.error('Could not order trial meal. Please try again.')
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
        <div className="bg-gradient-to-r from-[#2E7D5B] to-[#1E563E] text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-light">
              Single-Meal Sample Box
            </span>
            <h3 className="font-serif font-bold text-xl text-white">
              Order Trial Dabba: {tiffin.title}
            </h3>
            <div className="flex items-center space-x-1.5 text-xs text-sandstone-light/80">
              <MapPin className="w-3.5 h-3.5 text-saffron" />
              <span>{tiffin.approxLocation || tiffin.neighborhood}</span>
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
          {/* Trial Pricing Card */}
          <div className="p-4 rounded-2xl bg-[#FEF7E6] border border-[#D99B26]/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-saffron/20 text-saffron-dark flex items-center justify-center font-bold">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-base text-espresso">
                  ₹{trialCost} Trial Meal Box
                </span>
                <p className="text-[11px] text-espresso-light">
                  4 Phulkas + 2 Sabzis + Dal Fry + Steamed Rice + Salad
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald/15 text-emerald font-bold text-[11px]">
              Doorstep Drop
            </span>
          </div>

          {/* Meal Timing Selector */}
          <div className="space-y-2">
            <label className="font-bold text-espresso uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald" />
              <span>Meal Timing</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'Lunch (12:30 PM)', label: 'Lunch', sub: '12:15 PM - 1:30 PM' },
                { id: 'Dinner (8:00 PM)', label: 'Dinner', sub: '7:30 PM - 9:00 PM' }
              ].map((time) => (
                <button
                  key={time.id}
                  type="button"
                  onClick={() => setMealTiming(time.id)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    mealTiming === time.id
                      ? 'bg-emerald/10 border-emerald text-emerald-dark font-bold'
                      : 'bg-sandstone/30 border-sandstone-border text-espresso-light hover:border-emerald/40'
                  }`}
                >
                  <div className="text-xs">{time.label}</div>
                  <div className="text-[10px] text-espresso-light font-normal">{time.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Date */}
          <div className="space-y-2">
            <label className="font-bold text-espresso uppercase tracking-wider flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald" />
              <span>Delivery Date</span>
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={trialDate}
              onChange={(e) => setTrialDate(e.target.value)}
              className="w-full bg-sandstone/50 border border-sandstone-border rounded-xl p-2.5 text-xs font-semibold focus:outline-hidden focus:border-emerald"
            />
          </div>

          {/* Food Notes */}
          <div className="space-y-2">
            <label className="font-bold text-espresso uppercase tracking-wider">
              Dietary Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less oil, extra salad, pure Jain (no potato)"
              className="w-full bg-sandstone/40 border border-sandstone-border rounded-xl p-2.5 text-xs focus:outline-hidden focus:border-emerald resize-none"
            />
          </div>

          {/* FSSAI & Hygiene Guarantee */}
          <div className="p-3 bg-emerald/10 border border-emerald/20 rounded-xl text-[11px] text-emerald font-semibold flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Clean brass/steel kitchen. No artificial food colors or excessive soda.</span>
          </div>

          {/* Action Buttons */}
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
              className="flex-1 py-3 rounded-xl bg-emerald hover:bg-emerald-dark text-white font-bold shadow-md transition flex items-center justify-center space-x-2"
            >
              {bookingMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Order Trial Box (₹{trialCost})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default OrderTrialModal

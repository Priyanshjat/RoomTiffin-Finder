import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { demoLogin } from '../../redux/features/auth/authSlice.js'
import { toast } from 'sonner'
import { Wrench, User, Shield, X, ChevronUp, ChevronDown } from 'lucide-react'

const DevToolbar = () => {
  // Only render if explicitly enabled in environment
  const isDevMode = import.meta.env.VITE_DEV_DEMO_MODE === 'true'
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()

  if (!isDevMode) return null

  const handleQuickLogin = async (role) => {
    try {
      if (role === 'admin') {
        await dispatch(demoLogin({ email: 'admin@roomtiffin.in', password: 'admin123', role: 'admin' })).unwrap()
        toast.info('Dev: Signed in as Seeded Admin.')
      } else {
        await dispatch(demoLogin({ email: 'demo@roomtiffin.in', password: 'demo123', role: 'user' })).unwrap()
        toast.info('Dev: Signed in as Seeded User (Aarav Patel).')
      }
    } catch (err) {
      toast.error('Dev auth failed: ' + (err || 'Unknown error'))
    }
  }

  return (
    <aside
      aria-label="Developer Toolbar"
      className="fixed bottom-4 left-4 z-50 font-sans"
      data-testid="dev-toolbar"
    >
      {isOpen ? (
        <div className="bg-espresso text-sandstone rounded-2xl p-4 shadow-2xl border border-sandstone-border/30 w-72 space-y-3 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-mustard">
              <Wrench className="w-4 h-4" />
              <span>Dev Toolbar</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] text-white/70">
            Isolated developer actions enabled by <code className="text-amber-300">VITE_DEV_DEMO_MODE=true</code>.
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('user')}
              data-testid="dev-quick-user-btn"
              className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>1-Click Seeded User (demo@roomtiffin.in)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              data-testid="dev-quick-admin-btn"
              className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Seeded Admin</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          data-testid="dev-toolbar-toggle-btn"
          className="bg-espresso/90 hover:bg-espresso text-white text-[11px] font-bold py-1.5 px-3 rounded-full border border-sandstone-border/40 shadow-lg flex items-center space-x-1.5 transition backdrop-blur-xs"
        >
          <Wrench className="w-3.5 h-3.5 text-mustard" />
          <span>DEV MODE</span>
          <ChevronUp className="w-3 h-3 text-white/60" />
        </button>
      )}
    </aside>
  )
}

export default DevToolbar

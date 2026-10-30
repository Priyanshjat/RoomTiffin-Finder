import React, { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Loader2 } from 'lucide-react'
import API from '../../services/api.js'
import { roleUpgrade } from '../../redux/features/auth/authSlice.js'

/**
 * ProviderRoute — protects /provider.
 * The local session may be STALE: the admin might have verified this user as a
 * PROVIDER after they signed in, so their cached userType still says USER.
 * In that case we ask the server once for the fresh role instead of bouncing
 * them to /apply-provider — that used to make their data "disappear".
 */
const ProviderRoute = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  // 'pending' -> still asking the server; 'ok' -> trusted role; 'skip' -> local role already fine
  const [state, setState] = useState(
    user && user.userType !== 'PROVIDER' && user.userType !== 'ADMIN' ? 'pending' : 'ok'
  )

  useEffect(() => {
    if (state !== 'pending') return
    let alive = true
    API.get('/auth/me')
      .then((res) => {
        if (!alive) return
        const me = res.data?.data || res.data
        if (me?.userType) {
          if (me.userType === 'PROVIDER' || me.userType === 'ADMIN') {
            dispatch(roleUpgrade({ userType: me.userType }))
            setState('ok')
          } else {
            dispatch(roleUpgrade({ userType: me.userType }))
            setState('deny')
          }
        } else {
          setState('deny')
        }
      })
      .catch(() => { if (alive) setState('deny') })
    return () => { alive = false }
  }, [state, dispatch])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (state === 'pending') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-espresso">
        <Loader2 className="w-7 h-7 text-saffron animate-spin" />
        <p className="text-xs font-semibold text-espresso-muted">Checking your provider status…</p>
      </div>
    )
  }

  if (state !== 'ok') {
    return <Navigate to="/apply-provider" replace />
  }

  return <Outlet />
}

export default ProviderRoute

import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProviderRoute = () => {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.userType !== 'PROVIDER' && user.userType !== 'ADMIN') {
    return <Navigate to="/apply-provider" replace />
  }

  return <Outlet />
}

export default ProviderRoute

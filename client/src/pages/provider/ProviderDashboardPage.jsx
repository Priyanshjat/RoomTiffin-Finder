import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Briefcase, Plus, CheckCircle, Home, UtensilsCrossed } from 'lucide-react'

const ProviderDashboardPage = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Briefcase className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Provider Hub</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage your listings and incoming tenant inquiries.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Verified Provider
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Room Listings</h2>
          <p className="text-xs text-gray-500">
            Add single rooms, shared PGs, or full apartments in Indore.
          </p>
          <div className="pt-2 text-xs text-blue-600 font-semibold">
            Full Room CRUD integration in Step 2!
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Tiffin Services</h2>
          <p className="text-xs text-gray-500">
            List your meal subscriptions, delivery areas, and menus.
          </p>
          <div className="pt-2 text-xs text-orange-600 font-semibold">
            Full Tiffin CRUD integration in Step 2!
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderDashboardPage

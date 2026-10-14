import React from 'react'
import { Link } from 'react-router-dom'
import { Laptop } from 'lucide-react'

const DevicesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Laptop className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Laptop & PC Rentals (Indore)</h1>
      <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
        Rent coding laptops, desktop rigs, and MacBooks for studies or remote work. Coming up in Step 3!
      </p>
      <div className="mt-6">
        <Link to="/" className="text-sm font-semibold text-purple-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  )
}

export default DevicesPage

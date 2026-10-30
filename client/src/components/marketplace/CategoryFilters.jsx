import React from 'react'
import {
  SlidersHorizontal,
  RotateCcw,
  MapPin
} from 'lucide-react'

const CategoryFilters = ({
  category,
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const neighborhoods = ['All Areas', 'HSR Layout', 'Koramangala', 'Indiranagar', 'BTM Layout', 'Whitefield']

  return (
    <div
      className="bg-sandstone-light p-4 sm:p-5 rounded-2xl border border-sandstone-border mb-8 space-y-4 shadow-2xs"
      data-testid="category-filters-container"
    >
      <div className="flex items-center justify-between border-b border-sandstone-border pb-3">
        <div className="flex items-center space-x-2 text-espresso font-serif font-bold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-terracotta" />
          <span>Filter & Refine {category.toUpperCase()}</span>
        </div>

        <button
          onClick={onResetFilters}
          data-testid="filter-reset-btn"
          className="flex items-center space-x-1 text-xs text-espresso-muted hover:text-terracotta font-medium transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Common Neighborhood Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-espresso mr-1 flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5 text-terracotta" />
          <span>Area:</span>
        </span>
        {neighborhoods.map((n) => {
          const val = n === 'All Areas' ? 'all' : n
          const isSelected = (filters.neighborhood || 'all') === val
          return (
            <button
              key={n}
              onClick={() => onFilterChange('neighborhood', val)}
              data-testid={`filter-neighborhood-${val}`}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
                isSelected
                  ? 'bg-terracotta text-white border-terracotta'
                  : 'bg-white text-espresso-muted border-sandstone-border hover:border-terracotta/40'
              }`}
            >
              {n}
            </button>
          )
        })}
      </div>

      {/* Category Specific Controls */}
      {category === 'rooms' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-espresso mb-1">Room Type</label>
            <select
              value={filters.roomType || 'all'}
              onChange={(e) => onFilterChange('roomType', e.target.value)}
              data-testid="filter-room-type"
              className="w-full text-xs p-2 rounded-xl bg-white border border-sandstone-border text-espresso focus:outline-none"
            >
              <option value="all">All Room Types</option>
              <option value="single">Single Private Room</option>
              <option value="shared">Twin Sharing PG</option>
              <option value="1rk">Studio / 1RK</option>
              <option value="1bhk">1BHK Apartment</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-espresso mb-1">Max Rent (₹/month)</label>
            <select
              value={filters.maxBudget || 'all'}
              onChange={(e) => onFilterChange('maxBudget', e.target.value === 'all' ? '' : e.target.value)}
              data-testid="filter-room-budget"
              className="w-full text-xs p-2 rounded-xl bg-white border border-sandstone-border text-espresso focus:outline-none"
            >
              <option value="all">Any Budget</option>
              <option value="7000">Under ₹7,000</option>
              <option value="10000">Under ₹10,000</option>
              <option value="15000">Under ₹15,000</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-espresso mb-1">Air Conditioning</label>
            <select
              value={filters.ac || 'all'}
              onChange={(e) => onFilterChange('ac', e.target.value)}
              data-testid="filter-room-ac"
              className="w-full text-xs p-2 rounded-xl bg-white border border-sandstone-border text-espresso focus:outline-none"
            >
              <option value="all">AC or Non-AC</option>
              <option value="yes">AC Required</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-espresso mb-1">Food Included</label>
            <select
              value={filters.food || 'all'}
              onChange={(e) => onFilterChange('food', e.target.value)}
              data-testid="filter-room-food"
              className="w-full text-xs p-2 rounded-xl bg-white border border-sandstone-border text-espresso focus:outline-none"
            >
              <option value="all">Any</option>
              <option value="included">Meals Provided</option>
            </select>
          </div>
        </div>
      )}

      {category === 'tiffin' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-espresso mb-1">Diet Preference</label>
            <select
              value={filters.foodType || 'all'}
              onChange={(e) => onFilterChange('foodType', e.target.value)}
              data-testid="filter-tiffin-foodtype"
              className="w-full text-xs p-2 rounded-xl bg-white border border-sandstone-border text-espresso focus:outline-none"
            >
              <option value="all">All Cuisines</option>
              <option value="pure veg">Pure Vegetarian</option>
              <option value="jain">Satvik / Jain Only</option>
              <option value="north indian">North Indian / Non-Veg</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-espresso mb-1">Monthly Plan Budget</label>
            <select
              value={filters.maxBudget || 'all'}
              onChange={(e) => onFilterChange('maxBudget', e.target.value === 'all' ? '' : e.target.value)}
              data-testid="filter-tiffin-budget"
              className="w-full text-xs p-2 rounded-xl bg-white border border-sandstone-border text-espresso focus:outline-none"
            >
              <option value="all">Any Price</option>
              <option value="3000">Under ₹3,000/mo</option>
              <option value="3500">Under ₹3,500/mo</option>
              <option value="4000">Under ₹4,000/mo</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-espresso mb-1">Meal Timing</label>
            <select
              value={filters.timing || 'all'}
              onChange={(e) => onFilterChange('timing', e.target.value)}
              data-testid="filter-tiffin-timing"
              className="w-full text-xs p-2 rounded-xl bg-white border border-sandstone-border text-espresso focus:outline-none"
            >
              <option value="all">Both Lunch & Dinner</option>
              <option value="lunch">Lunch Only</option>
              <option value="dinner">Dinner Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-espresso mb-1">Trial / Sample Meal</label>
            <select
              value={filters.trial || 'all'}
              onChange={(e) => onFilterChange('trial', e.target.value)}
              data-testid="filter-tiffin-trial"
              className="w-full text-xs p-2 rounded-xl bg-white border border-sandstone-border text-espresso focus:outline-none"
            >
              <option value="all">Available (from ₹80)</option>
              <option value="instant">Instant Trial Delivery</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryFilters

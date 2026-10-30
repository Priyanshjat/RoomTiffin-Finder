import React, { useState } from 'react'
import { toast } from 'sonner'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { uploadListingImages } from '../../services/providerService.js'

// Field definitions per listing category (matches server models)
const CATEGORY_CONFIG = {
  rooms: {
    label: 'Room / PG Listing',
    defaultValues: { title: '', description: '', roomType: 'single', rent: '', deposit: '', locality: '', address: '', preferredTenant: 'ANY', amenities: '', neighborhood: '', approxLocation: '', images: [] },
    fields: [
      { name: 'title', label: 'Listing Title', type: 'text', required: true, placeholder: 'e.g. Sharma PG & Rooms - Single Room' },
      { name: 'roomType', label: 'Room Type', type: 'select', options: [['single', 'Single'], ['shared', 'Shared'], ['1rk', '1 RK'], ['1bhk', '1 BHK'], ['flat', 'Flat']] },
      { name: 'rent', label: 'Monthly Rent (₹)', type: 'number', required: true, placeholder: '7500' },
      { name: 'deposit', label: 'Security Deposit (₹)', type: 'number', required: true, placeholder: '7500' },
      { name: 'locality', label: 'Locality / Neighborhood', type: 'text', required: true, placeholder: 'e.g. Bhawarkuan' },
      { name: 'preferredTenant', label: 'Preferred Tenant', type: 'select', options: [['ANY', 'Anyone'], ['STUDENT', 'Students'], ['WORKING_PROFESSIONAL', 'Working Professional'], ['BOYS', 'Boys'], ['GIRLS', 'Girls']] },
      { name: 'address', label: 'Full Address (visible to signed-in users)', type: 'text', required: true, placeholder: 'e.g. Flat 204, Near Holkar Science College, Indore' },
      { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Furnishing, facilities, food availability...' },
      { name: 'approxLocation', label: 'Landmark / Approx. Location', type: 'text', placeholder: 'e.g. ~350m from DAVV Takshashila Campus' },
      { name: 'amenities', label: 'Amenities (comma separated)', type: 'tags', placeholder: 'WiFi, AC, Attached Bathroom, Power Backup' }
    ]
  },
  tiffin: {
    label: 'Tiffin / Mess Listing',
    defaultValues: { name: '', description: '', cuisineType: 'North Indian', mealType: 'VEG', pricePerMeal: '', monthlyPrice: '', deliveryAreas: '', mealSchedule: [], menuHighlights: '', neighborhood: '', images: [] },
    fields: [
      { name: 'name', label: 'Tiffin Service Name', type: 'text', required: true, placeholder: 'e.g. Annapurna Ghar Se Tiffin' },
      { name: 'cuisineType', label: 'Cuisine Type', type: 'select', options: [['North Indian', 'North Indian'], ['MP Special', 'MP Special'], ['South Indian', 'South Indian'], ['Gujarati', 'Gujarati'], ['Jain', 'Jain'], ['Multi-Cuisine', 'Multi-Cuisine']] },
      { name: 'mealType', label: 'Meal Type', type: 'select', options: [['VEG', 'Veg'], ['PURE_VEG', 'Pure Veg'], ['NON_VEG', 'Non-Veg'], ['JAIN', 'Jain']] },
      { name: 'pricePerMeal', label: 'Price Per Meal (₹)', type: 'number', required: true, placeholder: '80' },
      { name: 'monthlyPrice', label: 'Monthly Price (₹)', type: 'number', required: true, placeholder: '2600' },
      { name: 'deliveryAreas', label: 'Delivery Areas (comma separated)', type: 'tags', required: true, placeholder: 'Bhawarkuan, Geeta Bhawan, Newpal' },
      { name: 'mealSchedule', label: 'Meals Included', type: 'checkboxGroup', options: [['Breakfast', 'Breakfast'], ['Lunch', 'Lunch'], ['Dinner', 'Dinner']] },
      { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Homestyle Malwi meals, hygienic kitchen...' },
      { name: 'menuHighlights', label: 'Menu Highlights (comma separated)', type: 'tags', placeholder: 'Daal Bafla, Poha, Sabudana Khichdi' }
    ]
  }
}

// Add / Edit listing form used across all categories
// `onSaved(payload, images)` performs the create/update API call from the parent
const ListingForm = ({ category, initial = null, onCancel, onSaved }) => {
  // The dashboard uses plural keys ('rooms', 'tiffins') while this map uses the
  // API category ('rooms', 'tiffin') — normalize so an unknown key never crashes.
  const effectiveCategory = CATEGORY_CONFIG[category]
    ? category
    : CATEGORY_CONFIG[String(category || '').replace(/s$/, '')]
      ? String(category).replace(/s$/, '')
      : null
  const config = effectiveCategory ? CATEGORY_CONFIG[effectiveCategory] : null
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState([])
  const [imageUrls, setImageUrls] = useState(initial?.images || [])
  const [form, setForm] = useState(() => {
    const base = { ...config.defaultValues }
    // Prefill from initial values (edit mode)
    if (initial) {
      Object.keys(base).forEach((key) => {
        if (key === 'images') return
        const value = initial[key]
        if (value !== undefined && value !== null) {
          base[key] = Array.isArray(value) && key !== 'mealSchedule' ? value.join(', ') : value
        }
      })
    }
    return base
  })
  const [errors, setErrors] = useState({})

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: null }))
  }

  const onImageSelect = (e) => {
    const selected = Array.from(e.target.files || [])
    if (imageUrls.length + selected.length > 8) {
      toast.warning('Maximum 8 images per listing')
      return
    }
    setFiles((prev) => [...prev, ...selected])
  }

  const removeNewFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingUrl = (url) => {
    setImageUrls((prev) => prev.filter((u) => u !== url))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    const missing = {}
    config.fields.forEach((f) => {
      if (f.required && !String(form[f.name] || '').trim()) {
        missing[f.name] = 'Required'
      }
    })
    setErrors(missing)
    if (Object.keys(missing).length > 0) {
      toast.warning('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Upload newly selected images first
      let uploadedUrls = []
      if (files.length > 0) {
        setUploading(true)
        uploadedUrls = await uploadListingImages(files)
        setUploading(false)
      }

      const payload = { ...form }
      payload.images = [...imageUrls, ...uploadedUrls]
      payload.city = 'Indore'
      if (effectiveCategory === 'rooms') payload.isAvailable = true

      await onSaved(payload, payload.images)

      toast.success(initial?._id ? 'Listing updated successfully!' : 'Listing published successfully!')
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to save listing')
    } finally {
      setLoading(false)
    }
  }

  if (!config) {
    return (
      <div className="text-center py-8 bg-red-50 border border-red-200 rounded-xl" data-testid="listing-form-unknown">
        <p className="text-sm text-red-600 font-semibold">Unknown listing category "{category}"</p>
        <button type="button" onClick={onCancel} className="mt-3 px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50">
          Close
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left" data-testid={`listing-form-${effectiveCategory}`}>
      {config.fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && '*'}
          </label>

          {field.type === 'text' || field.type === 'number' ? (
            <input
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={onChange}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors[field.name] ? 'border-red-400' : 'border-gray-300'
              }`}
            />
          ) : field.type === 'textarea' ? (
            <textarea
              name={field.name}
              rows={3}
              value={form[field.name]}
              onChange={onChange}
              placeholder={field.placeholder}
              className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors[field.name] ? 'border-red-400' : 'border-gray-300'
              }`}
            />
          ) : field.type === 'select' ? (
            <select
              name={field.name}
              value={form[field.name]}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {field.options.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          ) : field.type === 'tags' ? (
            <input
              type="text"
              name={field.name}
              value={form[field.name]}
              onChange={onChange}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : field.type === 'checkboxGroup' ? (
            <div className="flex flex-wrap gap-3 pt-1">
              {field.options.map(([value, label]) => {
                const list = form[field.name] || []
                const checked = list.includes(value)
                return (
                  <label key={value} className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = checked
                          ? list.filter((v) => v !== value)
                          : [...list, value]
                        setForm((prev) => ({ ...prev, [field.name]: next }))
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>{label}</span>
                  </label>
                )
              })}
            </div>
          ) : null}

          {errors[field.name] && (
            <p className="text-[11px] text-red-500 mt-1">This field is required</p>
          )}
        </div>
      ))}

      {/* Images Uploader */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Listing Images (max 8)</label>
        <div className="grid grid-cols-6 gap-2 mb-2">
          {imageUrls.map((url) => (
            <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img src={url} alt="listing" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeExistingUrl(url)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {files.map((file, idx) => (
            <div key={`${file.name}-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden border border-blue-300 ring-1 ring-blue-200">
              <img src={URL.createObjectURL(file)} alt="new" className="w-full h-full object-cover" />
              <span className="absolute top-0.5 left-0.5 text-[8px] font-bold bg-blue-600 text-white px-1 rounded">NEW</span>
              <button
                type="button"
                onClick={() => removeNewFile(idx)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-blue-500">
            <ImagePlus className="w-5 h-5" />
            <span className="text-[9px] mt-1">Add Photo</span>
            <input type="file" accept="image/*" multiple onChange={onImageSelect} className="hidden" />
          </label>
        </div>
        <p className="text-[11px] text-gray-400">Rooms & tiffin thalis — clear real photos build trust with renters.</p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {uploading ? 'Uploading Images...' : 'Saving...'}
            </>
          ) : (
            initial?._id ? 'Update Listing' : 'Publish Listing'
          )}
        </button>
      </div>
    </form>
  )
}

export default ListingForm

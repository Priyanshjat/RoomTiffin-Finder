import API from './api.js'

// Provider dashboard data
export const fetchMyProviderListings = async () => {
  const response = await API.get('/provider/my-listings')
  return response.data.data || response.data
}

// The business profile submitted with the provider application (pre-existing data)
export const fetchMyProviderProfile = async () => {
  const response = await API.get('/provider/profile')
  return response.data.data || response.data
}

export const updateProviderProfile = async (payload) => {
  const response = await API.put('/provider/profile', payload)
  return response.data.data || response.data
}

export const fetchProviderInquiries = async () => {
  const response = await API.get('/provider/inquiries')
  return response.data.data || response.data
}

// Upload listing images (multipart) -> returns array of image URLs
export const uploadListingImages = async (files) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('images', file))
  const response = await API.post('/uploads', formData)
  return response.data.data || response.data
}

// CRUD endpoints per listing category
const categoryEndpoints = {
  rooms: '/rooms',
  tiffin: '/tiffins'
}

export const createListing = async (category, payload) => {
  const response = await API.post(categoryEndpoints[category], payload)
  return response.data
}

export const updateListing = async (category, id, payload) => {
  const response = await API.put(`${categoryEndpoints[category]}/${id}`, payload)
  return response.data
}

export const deleteListing = async (category, id) => {
  const response = await API.delete(`${categoryEndpoints[category]}/${id}`)
  return response.data
}

const providerService = {
  fetchMyProviderListings,
  fetchMyProviderProfile,
  updateProviderProfile,
  fetchProviderInquiries,
  uploadListingImages,
  createListing,
  updateListing,
  deleteListing
}

export default providerService

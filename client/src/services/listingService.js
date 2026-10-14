import API from './api.js'

// Fetch listings with category, search, and filters
export const fetchListings = async (params = {}) => {
  const response = await API.get('/listings', { params })
  return response.data.data || response.data
}

// Fetch single listing details by ID
export const fetchListingById = async (id) => {
  const response = await API.get(`/listings/${id}`)
  return response.data.data || response.data
}

// AI natural language query parser
export const parseAiQuery = async (query) => {
  const response = await API.post('/ai/parse', { query })
  return response.data.data || response.data
}

// Send inquiry/message to listing owner/provider
export const sendContactInquiry = async (data) => {
  const response = await API.post('/contact', data)
  return response.data
}

// Create room tour / meal trial booking
export const requestBooking = async (data) => {
  const response = await API.post('/bookings', data)
  return response.data
}

// Create vehicle / laptop rental request
export const submitRentalRequest = async (data) => {
  const response = await API.post('/rental-requests', data)
  return response.data
}

// Fetch Indore Areas
export const fetchAreas = async () => {
  const response = await API.get('/areas')
  return response.data.data || response.data
}

// Fetch single area with listings by slug
export const fetchAreaBySlug = async (slug) => {
  const response = await API.get(`/areas/${slug}`)
  return response.data.data || response.data
}

// Fetch Indore Colleges
export const fetchColleges = async () => {
  const response = await API.get('/colleges')
  return response.data.data || response.data
}

// Sathi AI Bundle Recommender
export const recommendBundle = async (payload) => {
  const response = await API.post('/ai/recommend', payload)
  return response.data.data || response.data
}

const listingService = {
  fetchListings,
  fetchListingById,
  parseAiQuery,
  sendContactInquiry,
  requestBooking,
  submitRentalRequest,
  fetchAreas,
  fetchAreaBySlug,
  fetchColleges,
  recommendBundle
}

export default listingService

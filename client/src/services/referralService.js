import API from './api.js'

// Get authenticated user's referral code, stats, milestones
export const getReferralMe = async () => {
  const response = await API.get('/referrals/me')
  return response.data.data || response.data
}

// Get referral invites history
export const getReferralHistory = async () => {
  const response = await API.get('/referrals/history')
  return response.data.data || response.data
}

// Apply referral code to current user account
export const applyReferralCode = async (code) => {
  const response = await API.post('/referrals/apply', { code })
  return response.data.data || response.data
}

// Validate a referral code during signup
export const validateReferralCode = async (code) => {
  const response = await API.post('/referrals/validate', { code })
  return response.data.data || response.data
}

// Get wallet balance and ledger history
export const getWallet = async () => {
  const response = await API.get('/wallet')
  return response.data.data || response.data
}

// Get saved favorite listings
export const getFavorites = async () => {
  const response = await API.get('/favorites')
  return response.data.data || response.data
}

// Add listing to favorites
export const addFavorite = async (listingId) => {
  const response = await API.post('/favorites', { listingId })
  return response.data.data || response.data
}

// Remove listing from favorites
export const removeFavorite = async (listingId) => {
  const response = await API.delete(`/favorites/${listingId}`)
  return response.data.data || response.data
}

const referralService = {
  getReferralMe,
  getReferralHistory,
  applyReferralCode,
  validateReferralCode,
  getWallet,
  getFavorites,
  addFavorite,
  removeFavorite
}

export default referralService

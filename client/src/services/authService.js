import API from './api.js'

// Register User (Matches user specification)
const registerUser = async (formData) => {
  const response = await API.post('/auth/register', formData)
  const data = response.data.data || response.data
  const userWithToken = data.user ? { ...data.user, token: data.token } : data
  if (userWithToken && userWithToken.token) {
    localStorage.setItem('user', JSON.stringify(userWithToken))
  }
  return userWithToken
}

// Login User (Matches user specification)
const loginUser = async (formData) => {
  const response = await API.post('/auth/login', formData)
  const data = response.data.data || response.data
  const userWithToken = data.user ? { ...data.user, token: data.token } : data
  if (userWithToken && userWithToken.token) {
    localStorage.setItem('user', JSON.stringify(userWithToken))
  }
  return userWithToken
}

// Get My Profile (Matches user specification: GET /api/auth/me)
const getMyProfile = async (payload) => {
  const token = payload?.queryKey ? payload.queryKey[1] : (payload?.token || null)
  const options = token ? { headers: { authorization: `Bearer ${token}` } } : {}
  const response = await API.get('/auth/me', options)
  return response.data.data || response.data
}

// Update Profile (Matches user specification: PUT /api/auth/me)
const updateProfile = async (payload) => {
  const token = payload?.token || null
  const options = token ? { headers: { authorization: `Bearer ${token}` } } : {}
  const response = await API.put('/auth/me', payload, options)
  const data = response.data.data || response.data
  const currentUser = JSON.parse(localStorage.getItem('user')) || {}
  const updated = { ...currentUser, ...data }
  localStorage.setItem('user', JSON.stringify(updated))
  return updated
}

// Compatibility Aliases for Redux Slices
const register = registerUser
const login = loginUser
const getProfile = getMyProfile
const logout = () => {
  localStorage.removeItem('user')
}

const demoLogin = async (credentials) => {
  return loginUser(credentials)
}

const applyProvider = async (providerData) => {
  const response = await API.post('/provider/apply', providerData)
  return response.data.data || response.data
}

const getMyProviderProfile = async () => {
  const response = await API.get('/provider/profile')
  return response.data.data || response.data
}

const authService = {
  registerUser,
  loginUser,
  getMyProfile,
  updateProfile,
  register,
  login,
  getProfile,
  logout,
  demoLogin,
  applyProvider,
  getMyProviderProfile
}

export default authService

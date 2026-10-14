import { createSlice } from '@reduxjs/toolkit'

const savedLanguage = typeof window !== 'undefined' ? (localStorage.getItem('rt_lang') || 'en') : 'en'
const savedMotion = typeof window !== 'undefined' ? (localStorage.getItem('rt_reduce_motion') === 'true') : false

const initialState = {
  activeCategory: 'rooms', // 'rooms' | 'tiffin' | 'vehicles' | 'laptops'
  language: savedLanguage, // 'en' | 'hi'
  reduceMotion: savedMotion,
  isLoginModalOpen: false,
  loginModalMessage: '',
  isReferralModalOpen: false,
  searchQuery: '',
  aiParsedData: null,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload
    },
    toggleLanguage: (state) => {
      state.language = state.language === 'en' ? 'hi' : 'en'
      if (typeof window !== 'undefined') {
        localStorage.setItem('rt_lang', state.language)
      }
    },
    setLanguage: (state, action) => {
      state.language = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('rt_lang', state.language)
      }
    },
    toggleReduceMotion: (state) => {
      state.reduceMotion = !state.reduceMotion
      if (typeof window !== 'undefined') {
        localStorage.setItem('rt_reduce_motion', String(state.reduceMotion))
      }
    },
    setReduceMotion: (state, action) => {
      state.reduceMotion = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('rt_reduce_motion', String(state.reduceMotion))
      }
    },
    openLoginModal: (state, action) => {
      state.isLoginModalOpen = true
      state.loginModalMessage = action.payload || 'Sign in to unlock exact address and direct contact details.'
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false
      state.loginModalMessage = ''
    },
    openReferralModal: (state) => {
      state.isReferralModalOpen = true
    },
    closeReferralModal: (state) => {
      state.isReferralModalOpen = false
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setAiParsedData: (state, action) => {
      state.aiParsedData = action.payload
    },
    clearAiParsedData: (state) => {
      state.aiParsedData = null
      state.searchQuery = ''
    }
  }
})

export const {
  setActiveCategory,
  toggleLanguage,
  setLanguage,
  toggleReduceMotion,
  setReduceMotion,
  openLoginModal,
  closeLoginModal,
  openReferralModal,
  closeReferralModal,
  setSearchQuery,
  setAiParsedData,
  clearAiParsedData
} = uiSlice.actions

export default uiSlice.reducer

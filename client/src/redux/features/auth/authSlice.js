import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../../services/authService.js'

// Get user from localStorage
const storedUser = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: storedUser ? storedUser : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Register user
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Demo Login (Instant One-Click Login)
export const demoLogin = createAsyncThunk('auth/demoLogin', async (credentials, thunkAPI) => {
  try {
    return await authService.demoLogin(credentials)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout()
})

// Get Profile
export const getProfile = createAsyncThunk('auth/getProfile', async (_, thunkAPI) => {
  try {
    return await authService.getProfile()
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Update Profile
export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
  try {
    return await authService.updateProfile(userData)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

// Apply Provider
export const applyProvider = createAsyncThunk('auth/applyProvider', async (providerData, thunkAPI) => {
  try {
    return await authService.applyProvider(providerData)
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
    // Patch the signed-in user in place (e.g. admin verified them as PROVIDER
    // while their browser session still says USER) and keep localStorage in sync
    roleUpgrade: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        // Registration intentionally does NOT sign the user in:
        // they are routed to /login to sign in with their new credentials.
        state.user = null
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      // Demo Login
      .addCase(demoLogin.pending, (state) => {
        state.isLoading = true
      })
      .addCase(demoLogin.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(demoLogin.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
      // Get Profile
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload }
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = { ...state.user, ...action.payload }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Apply Provider
      .addCase(applyProvider.pending, (state) => {
        state.isLoading = true
      })
      .addCase(applyProvider.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(applyProvider.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset, roleUpgrade } = authSlice.actions
export default authSlice.reducer

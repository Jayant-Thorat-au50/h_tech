import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, extractErrorMessage } from '../utils/apiClient.js';

export const fetchCurrentAdmin = createAsyncThunk(
  'auth/fetchCurrentAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/auth/me');
      return data.user;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Not authenticated'));
    }
  }
);

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/auth/login', credentials);
      return data.user;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Login failed'));
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  'auth/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post('/auth/logout');
      return null;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Logout failed'));
    }
  }
);

export const updateAdminPassword = createAsyncThunk(
  'auth/updateAdminPassword',
  async (passwords, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put('/auth/password', passwords);
      return data.message;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Password update failed'));
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  initialized: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentAdmin.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

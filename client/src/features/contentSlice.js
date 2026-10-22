import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, extractErrorMessage } from '../utils/apiClient.js';

// --- PUBLIC THUNKS ---
export const fetchOffers = createAsyncThunk(
  'content/fetchOffers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/offers', { params });
      return data.offers;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to load offers'));
    }
  }
);

export const fetchCustomers = createAsyncThunk(
  'content/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/customers');
      return data.photos;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to load customer gallery'));
    }
  }
);

export const fetchCharity = createAsyncThunk(
  'content/fetchCharity',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/charity');
      return data.photos;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to load charity gallery'));
    }
  }
);

export const fetchBranches = createAsyncThunk(
  'content/fetchBranches',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/branches');
      return data.branches;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to load branches'));
    }
  }
);

export const fetchTechUpdates = createAsyncThunk(
  'content/fetchTechUpdates',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/tech-updates');
      return data.updates;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to load tech updates'));
    }
  }
);

export const fetchSettings = createAsyncThunk(
  'content/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/settings');
      return data.settings;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to load site settings'));
    }
  }
);

// --- ADMIN CRUD THUNKS ---
export const fetchAdminStats = createAsyncThunk(
  'content/fetchAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/admin/stats');
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const uploadImageThunk = createAsyncThunk(
  'content/uploadImageThunk',
  async ({ file, folder = 'htech_wholesale' }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);
      const { data } = await apiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data; // { url, publicId }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Image upload failed'));
    }
  }
);

// Offers Admin
export const fetchAdminOffers = createAsyncThunk(
  'content/fetchAdminOffers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/admin/offers');
      return data.offers;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const createAdminOffer = createAsyncThunk(
  'content/createAdminOffer',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/admin/offers', payload);
      return data.offer;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const updateAdminOffer = createAsyncThunk(
  'content/updateAdminOffer',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/offers/${id}`, payload);
      return data.offer;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const deleteAdminOffer = createAsyncThunk(
  'content/deleteAdminOffer',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/offers/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

// Customer Photos Admin
export const fetchAdminCustomers = createAsyncThunk(
  'content/fetchAdminCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/admin/customers');
      return data.photos;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const createAdminCustomer = createAsyncThunk(
  'content/createAdminCustomer',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/admin/customers', payload);
      return data.photo;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const updateAdminCustomer = createAsyncThunk(
  'content/updateAdminCustomer',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/customers/${id}`, payload);
      return data.photo;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const deleteAdminCustomer = createAsyncThunk(
  'content/deleteAdminCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/customers/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

// Charity Photos Admin
export const fetchAdminCharity = createAsyncThunk(
  'content/fetchAdminCharity',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/admin/charity');
      return data.photos;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const createAdminCharity = createAsyncThunk(
  'content/createAdminCharity',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/admin/charity', payload);
      return data.photo;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const updateAdminCharity = createAsyncThunk(
  'content/updateAdminCharity',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/charity/${id}`, payload);
      return data.photo;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const deleteAdminCharity = createAsyncThunk(
  'content/deleteAdminCharity',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/charity/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

// Branches Admin
export const createAdminBranch = createAsyncThunk(
  'content/createAdminBranch',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/admin/branches', payload);
      return data.branch;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const updateAdminBranch = createAsyncThunk(
  'content/updateAdminBranch',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/branches/${id}`, payload);
      return data.branch;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const deleteAdminBranch = createAsyncThunk(
  'content/deleteAdminBranch',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/branches/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

// Tech Updates Admin
export const fetchAdminTechUpdates = createAsyncThunk(
  'content/fetchAdminTechUpdates',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/admin/tech-updates');
      return data.updates;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const createAdminTechUpdate = createAsyncThunk(
  'content/createAdminTechUpdate',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/admin/tech-updates', payload);
      return data.update;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const updateAdminTechUpdate = createAsyncThunk(
  'content/updateAdminTechUpdate',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/tech-updates/${id}`, payload);
      return data.update;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const deleteAdminTechUpdate = createAsyncThunk(
  'content/deleteAdminTechUpdate',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/tech-updates/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

// Site Settings Admin
export const updateAdminSettings = createAsyncThunk(
  'content/updateAdminSettings',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put('/admin/settings', payload);
      return data.settings;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const initialState = {
  offers: [],
  adminOffers: [],
  customerPhotos: [],
  charityPhotos: [],
  branches: [],
  techUpdates: [],
  settings: null,
  adminStats: null,
  recentEnquiries: [],
  loading: false,
  uploading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers = action.payload || [];
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customerPhotos = action.payload || [];
      })
      .addCase(fetchCharity.fulfilled, (state, action) => {
        state.charityPhotos = action.payload || [];
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.branches = action.payload || [];
      })
      .addCase(fetchTechUpdates.fulfilled, (state, action) => {
        state.techUpdates = action.payload || [];
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.adminStats = action.payload.stats;
        state.recentEnquiries = action.payload.recentEnquiries || [];
      })
      // Upload state
      .addCase(uploadImageThunk.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadImageThunk.fulfilled, (state) => {
        state.uploading = false;
      })
      .addCase(uploadImageThunk.rejected, (state) => {
        state.uploading = false;
      })
      // Admin Offers
      .addCase(fetchAdminOffers.fulfilled, (state, action) => {
        state.adminOffers = action.payload || [];
      })
      .addCase(createAdminOffer.fulfilled, (state, action) => {
        state.adminOffers.unshift(action.payload);
      })
      .addCase(updateAdminOffer.fulfilled, (state, action) => {
        const idx = state.adminOffers.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.adminOffers[idx] = action.payload;
      })
      .addCase(deleteAdminOffer.fulfilled, (state, action) => {
        state.adminOffers = state.adminOffers.filter((o) => o._id !== action.payload);
      })
      // Admin Customers
      .addCase(fetchAdminCustomers.fulfilled, (state, action) => {
        state.customerPhotos = action.payload || [];
      })
      .addCase(createAdminCustomer.fulfilled, (state, action) => {
        state.customerPhotos.unshift(action.payload);
      })
      .addCase(updateAdminCustomer.fulfilled, (state, action) => {
        const idx = state.customerPhotos.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.customerPhotos[idx] = action.payload;
      })
      .addCase(deleteAdminCustomer.fulfilled, (state, action) => {
        state.customerPhotos = state.customerPhotos.filter((p) => p._id !== action.payload);
      })
      // Admin Charity
      .addCase(fetchAdminCharity.fulfilled, (state, action) => {
        state.charityPhotos = action.payload || [];
      })
      .addCase(createAdminCharity.fulfilled, (state, action) => {
        state.charityPhotos.unshift(action.payload);
      })
      .addCase(updateAdminCharity.fulfilled, (state, action) => {
        const idx = state.charityPhotos.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.charityPhotos[idx] = action.payload;
      })
      .addCase(deleteAdminCharity.fulfilled, (state, action) => {
        state.charityPhotos = state.charityPhotos.filter((p) => p._id !== action.payload);
      })
      // Admin Branches
      .addCase(createAdminBranch.fulfilled, (state, action) => {
        state.branches.push(action.payload);
      })
      .addCase(updateAdminBranch.fulfilled, (state, action) => {
        const idx = state.branches.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.branches[idx] = action.payload;
      })
      .addCase(deleteAdminBranch.fulfilled, (state, action) => {
        state.branches = state.branches.filter((b) => b._id !== action.payload);
      })
      // Admin Tech Updates
      .addCase(fetchAdminTechUpdates.fulfilled, (state, action) => {
        state.techUpdates = action.payload || [];
      })
      .addCase(createAdminTechUpdate.fulfilled, (state, action) => {
        state.techUpdates.unshift(action.payload);
      })
      .addCase(updateAdminTechUpdate.fulfilled, (state, action) => {
        const idx = state.techUpdates.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.techUpdates[idx] = action.payload;
      })
      .addCase(deleteAdminTechUpdate.fulfilled, (state, action) => {
        state.techUpdates = state.techUpdates.filter((u) => u._id !== action.payload);
      })
      // Admin Settings
      .addCase(updateAdminSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      });
  },
});

export default contentSlice.reducer;

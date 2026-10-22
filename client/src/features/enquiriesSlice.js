import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, extractErrorMessage } from '../utils/apiClient.js';

export const submitPublicEnquiry = createAsyncThunk(
  'enquiries/submitPublicEnquiry',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/enquiries', payload);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Could not submit enquiry'));
    }
  }
);

export const fetchAdminEnquiries = createAsyncThunk(
  'enquiries/fetchAdminEnquiries',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/admin/enquiries');
      return data.enquiries;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const updateAdminEnquiryStatus = createAsyncThunk(
  'enquiries/updateAdminEnquiryStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.patch(`/admin/enquiries/${id}/status`, { status });
      return data.enquiry;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const deleteAdminEnquiry = createAsyncThunk(
  'enquiries/deleteAdminEnquiry',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/enquiries/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const initialState = {
  items: [],
  submitting: false,
  submitSuccess: false,
  loading: false,
  error: null,
};

const enquiriesSlice = createSlice({
  name: 'enquiries',
  initialState,
  reducers: {
    resetEnquirySubmission(state) {
      state.submitting = false;
      state.submitSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPublicEnquiry.pending, (state) => {
        state.submitting = true;
        state.submitSuccess = false;
        state.error = null;
      })
      .addCase(submitPublicEnquiry.fulfilled, (state) => {
        state.submitting = false;
        state.submitSuccess = true;
      })
      .addCase(submitPublicEnquiry.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminEnquiries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchAdminEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAdminEnquiryStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteAdminEnquiry.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e._id !== action.payload);
      });
  },
});

export const { resetEnquirySubmission } = enquiriesSlice.actions;
export default enquiriesSlice.reducer;

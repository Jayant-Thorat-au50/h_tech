import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, extractErrorMessage } from '../utils/apiClient.js';

// --- PUBLIC THUNKS ---
export const fetchProducts = createAsyncThunk(
  'catalog/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/products', { params });
      if (Array.isArray(data?.products)) {
        return data;
      }
      return rejectWithValue('The product catalog returned an invalid response.');
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to load products'));
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'catalog/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/products', {
        params: { limit: 100 },
      });
      if (Array.isArray(data?.products)) return data.products;
      return rejectWithValue('The product catalog returned an invalid response.');
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to load featured products'));
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'catalog/fetchProductBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/products/${slug}`);
      return data.product;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Product not found'));
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'catalog/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/categories');
      return data.categories;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to load categories'));
    }
  }
);

export const fetchBrands = createAsyncThunk(
  'catalog/fetchBrands',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/brands', { params });
      return data.brands;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to load brands'));
    }
  }
);

// --- ADMIN CRUD THUNKS ---
export const fetchAdminProducts = createAsyncThunk(
  'catalog/fetchAdminProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get('/admin/products');
      return data.products;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const createAdminProduct = createAsyncThunk(
  'catalog/createAdminProduct',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/admin/products', payload);
      return data.product;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const updateAdminProduct = createAsyncThunk(
  'catalog/updateAdminProduct',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/products/${id}`, payload);
      return data.product;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const deleteAdminProduct = createAsyncThunk(
  'catalog/deleteAdminProduct',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/products/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const createAdminCategory = createAsyncThunk(
  'catalog/createAdminCategory',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/admin/categories', payload);
      return data.category;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const updateAdminCategory = createAsyncThunk(
  'catalog/updateAdminCategory',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/categories/${id}`, payload);
      return data.category;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const deleteAdminCategory = createAsyncThunk(
  'catalog/deleteAdminCategory',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/categories/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const createAdminBrand = createAsyncThunk(
  'catalog/createAdminBrand',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/admin/brands', payload);
      return data.brand;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const updateAdminBrand = createAsyncThunk(
  'catalog/updateAdminBrand',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/brands/${id}`, payload);
      return data.brand;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const deleteAdminBrand = createAsyncThunk(
  'catalog/deleteAdminBrand',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/brands/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const initialState = {
  products: [],
  featuredProducts: [],
  adminProducts: [],
  currentProduct: null,
  categories: [],
  brands: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  featuredLoading: false,
  featuredError: null,
  detailLoading: false,
  error: null,
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Public products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total ?? state.products.length;
        state.page = action.payload.page || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Featured products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredLoading = true;
        state.featuredError = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredProducts = action.payload || [];
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.featuredLoading = false;
        state.featuredError = action.payload || action.error.message;
      })
      // Single product detail
      .addCase(fetchProductBySlug.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      // Categories & Brands
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands = action.payload || [];
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      // Admin Products CRUD
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.adminProducts = action.payload || [];
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.adminProducts.unshift(action.payload);
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        const idx = state.adminProducts.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.adminProducts[idx] = action.payload;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.adminProducts = state.adminProducts.filter((p) => p._id !== action.payload);
      })
      // Admin Categories CRUD
      .addCase(createAdminCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateAdminCategory.fulfilled, (state, action) => {
        const idx = state.categories.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.categories[idx] = action.payload;
      })
      .addCase(deleteAdminCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload);
      })
      // Admin Brands CRUD
      .addCase(createAdminBrand.fulfilled, (state, action) => {
        state.brands.push(action.payload);
      })
      .addCase(updateAdminBrand.fulfilled, (state, action) => {
        const idx = state.brands.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.brands[idx] = action.payload;
      })
      .addCase(deleteAdminBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter((b) => b._id !== action.payload);
      });
  },
});

export const { clearCurrentProduct } = catalogSlice.actions;
export default catalogSlice.reducer;

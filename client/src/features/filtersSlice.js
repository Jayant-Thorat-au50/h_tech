import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  category: 'all',
  brand: 'all',
  search: '',
  sort: 'order',
  minPrice: '0',
  maxPrice: '',
  page: 1,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategoryFilter(state, action) {
      state.category = action.payload || 'all';
      state.page = 1;
    },
    setBrandFilter(state, action) {
      state.brand = action.payload || 'all';
      state.page = 1;
    },
    setSearchFilter(state, action) {
      state.search = action.payload ?? '';
      state.page = 1;
    },
    setSortFilter(state, action) {
      state.sort = action.payload || 'order';
      state.page = 1;
    },
    setPriceRange(state, action) {
      state.minPrice = action.payload?.minPrice ?? state.minPrice;
      state.maxPrice = action.payload?.maxPrice ?? state.maxPrice;
      state.page = 1;
    },
    setPageFilter(state, action) {
      state.page = Number(action.payload) || 1;
    },
    setFiltersFromUrl(state, action) {
      const { category, brand, search, sort, minPrice, maxPrice, page } = action.payload || {};
      if (category !== undefined) state.category = category || 'all';
      if (brand !== undefined) state.brand = brand || 'all';
      if (search !== undefined) state.search = search || '';
      if (sort !== undefined) state.sort = sort || 'order';
      if (minPrice !== undefined) state.minPrice = minPrice ?? '0';
      if (maxPrice !== undefined) state.maxPrice = maxPrice || '';
      if (page !== undefined) state.page = Number(page) || 1;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setCategoryFilter,
  setBrandFilter,
  setSearchFilter,
  setSortFilter,
  setPriceRange,
  setPageFilter,
  setFiltersFromUrl,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;

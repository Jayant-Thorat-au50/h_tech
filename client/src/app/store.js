import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js';
import uiReducer from '../features/uiSlice.js';
import filtersReducer from '../features/filtersSlice.js';
import catalogReducer from '../features/catalogSlice.js';
import contentReducer from '../features/contentSlice.js';
import enquiriesReducer from '../features/enquiriesSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    filters: filtersReducer,
    catalog: catalogReducer,
    content: contentReducer,
    enquiries: enquiriesReducer,
  },
});

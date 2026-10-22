import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mobileMenuOpen: false,
  lightbox: {
    isOpen: false,
    images: [], // [{ url, caption }]
    currentIndex: 0,
  },
  toasts: [], // [{ id, type: 'success' | 'error' | 'info', message }]
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMobileMenuOpen(state, action) {
      state.mobileMenuOpen = Boolean(action.payload);
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    openLightbox(state, action) {
      const { images = [], index = 0 } = action.payload || {};
      state.lightbox = {
        isOpen: true,
        images,
        currentIndex: index,
      };
    },
    closeLightbox(state) {
      state.lightbox.isOpen = false;
    },
    nextLightboxImage(state) {
      if (state.lightbox.images.length > 0) {
        state.lightbox.currentIndex =
          (state.lightbox.currentIndex + 1) % state.lightbox.images.length;
      }
    },
    prevLightboxImage(state) {
      if (state.lightbox.images.length > 0) {
        state.lightbox.currentIndex =
          (state.lightbox.currentIndex - 1 + state.lightbox.images.length) %
          state.lightbox.images.length;
      }
    },
    addToast(state, action) {
      const { type = 'success', message = '' } = action.payload || {};
      state.toasts.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        type,
        message,
      });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  setMobileMenuOpen,
  toggleMobileMenu,
  openLightbox,
  closeLightbox,
  nextLightboxImage,
  prevLightboxImage,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;

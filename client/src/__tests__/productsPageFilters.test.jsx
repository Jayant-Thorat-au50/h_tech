import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi, afterEach } from 'vitest';
import ProductsPage from '../pages/ProductsPage.jsx';
import catalogReducer from '../features/catalogSlice.js';
import filtersReducer from '../features/filtersSlice.js';

const { get } = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock('../utils/apiClient.js', () => ({
  apiClient: { get },
  extractErrorMessage: (_error, fallback) => fallback,
}));
vi.mock('../components/shared/SEO.jsx', () => ({ default: () => null }));

const createStore = () =>
  configureStore({
    reducer: {
      catalog: catalogReducer,
      filters: filtersReducer,
      content: (state = { settings: {} }) => state,
    },
  });

describe('ProductsPage filter search', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('waits for Search Products before requesting changed filters', async () => {
    get.mockImplementation((url) => {
      if (url === '/categories') {
        return Promise.resolve({
          data: {
            categories: [{ _id: 'laptops', name: 'Laptops', slug: 'laptops' }],
          },
        });
      }
      if (url === '/brands') return Promise.resolve({ data: { brands: [] } });
      return Promise.resolve({
        data: { products: [], total: 0, page: 1, totalPages: 1 },
      });
    });

    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <ProductsPage />
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(
        get.mock.calls.filter(([url]) => url === '/products'),
      ).toHaveLength(1);
    });

    fireEvent.click(screen.getByRole('button', { name: 'All Categories' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Laptops' }));
    fireEvent.change(screen.getByLabelText('Minimum price (₹)'), {
      target: { value: '1000' },
    });

    expect(get.mock.calls.filter(([url]) => url === '/products')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Search Products' }));

    await waitFor(() => {
      expect(get).toHaveBeenCalledWith(
        '/products',
        expect.objectContaining({
          params: expect.objectContaining({
            category: 'laptops',
            minPrice: '1000',
          }),
        }),
      );
    });
  });
});

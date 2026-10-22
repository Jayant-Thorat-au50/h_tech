import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, test, vi } from 'vitest';
import HomePage from '../pages/HomePage.jsx';
import catalogReducer, {
  fetchFeaturedProducts,
  fetchProducts,
} from '../features/catalogSlice.js';

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

const { getProducts } = vi.hoisted(() => ({ getProducts: vi.fn() }));

vi.mock('../utils/apiClient.js', () => ({
  apiClient: { get: getProducts },
  extractErrorMessage: (_error, fallback) => fallback,
}));
vi.mock('../components/shared/SEO.jsx', () => ({ default: () => null }));
vi.mock('../components/home/QuickTiles.jsx', () => ({ default: () => null }));
vi.mock('../components/home/OffersCarousel.jsx', () => ({ default: () => null }));
vi.mock('../components/home/DigitalWingsCards.jsx', () => ({ default: () => null }));
vi.mock('../components/shared/Counter.jsx', () => ({ default: () => null }));

const createStore = () =>
  configureStore({
    reducer: {
      catalog: catalogReducer,
      content: (state = { offers: [], customerPhotos: [], settings: {} }) => state,
    },
  });

function CurrentPath() {
  const location = useLocation();
  return <div data-testid="current-path">{location.pathname}</div>;
}

describe('HomePage product search', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  test('does not substitute local sample catalog data when the database API fails', async () => {
    getProducts.mockRejectedValue(new Error('Database unavailable'));
    const store = configureStore({ reducer: catalogReducer });

    await expect(store.dispatch(fetchProducts()).unwrap()).rejects.toBe(
      'Failed to load products',
    );
    await expect(store.dispatch(fetchFeaturedProducts()).unwrap()).rejects.toBe(
      'Failed to load featured products',
    );

    expect(store.getState().products).toEqual([]);
    expect(store.getState().featuredProducts).toEqual([]);
    expect(store.getState().categories).toEqual([]);
    expect(store.getState().brands).toEqual([]);
    expect(store.getState().featuredError).toBe('Failed to load featured products');
  });

  test('uses database category slugs to filter homepage products', async () => {
    const motherboard = {
      _id: 'sample-motherboard',
      slug: 'asus-tuf-gaming-b760m-wifi-motherboard',
      name: 'ASUS TUF Gaming B760M WiFi Motherboard (Sample)',
      brand: { name: 'ASUS' },
      category: { name: 'Motherboards', slug: 'motherboards' },
      shortDescription: 'Sample gaming motherboard.',
      images: [],
      specs: [],
    };
    getProducts.mockImplementation((url, { params } = {}) => {
      if (url === '/categories') {
        return Promise.resolve({
          data: {
            categories: [
              { _id: 'category-motherboards', name: 'Motherboards', slug: 'motherboards' },
            ],
          },
        });
      }
      if (url === '/categories/motherboards/products') {
        return Promise.resolve({
          data: { products: [motherboard], totalPages: 1 },
        });
      }
      if (url === '/products' && params?.limit === 100) {
        return Promise.resolve({
          data: { products: [motherboard], totalPages: 1 },
        });
      }
      return Promise.resolve({
        data: { products: [], brands: [], offers: [], photos: [] },
      });
    });

    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>,
    );

    expect(
      await screen.findByRole('heading', {
        name: 'ASUS TUF Gaming B760M WiFi Motherboard (Sample)',
      }),
    ).toBeInTheDocument();
    expect(
      getProducts.mock.calls.some(
        ([url, config]) => url === '/products' && config?.params?.limit === 100,
      ),
    ).toBe(true);

    fireEvent.click(await screen.findByRole('button', { name: 'Motherboards' }));
    expect(
      await screen.findByRole('heading', {
        name: 'ASUS TUF Gaming B760M WiFi Motherboard (Sample)',
      }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        getProducts.mock.calls.some(
          ([url, config]) =>
            url === '/categories/motherboards/products' &&
            config?.params?.limit === 100,
        ),
      ).toBe(true);
    });
  });

  test('debounces typing and displays products returned by the catalog API', async () => {
    vi.useFakeTimers();
    getProducts.mockImplementation((_, { params } = {}) => {
      if (params?.search) {
        return Promise.resolve({
          data: {
            products: [
              {
                _id: 'catalog-result',
                slug: 'catalog-result',
                name: 'Laptop from the full catalog',
                brand: { name: 'H-Tech' },
                category: { name: 'Laptops', slug: 'laptops' },
                shortDescription: 'A result returned by MongoDB.',
                images: [],
                specs: [],
              },
            ],
            totalPages: 1,
          },
        });
      }
      return Promise.resolve({
        data: { products: [], brands: [], offers: [], photos: [] },
      });
    });

    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:slug" element={<CurrentPath />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const searchInput = screen.getByRole('searchbox', { name: 'Search products' });
    fireEvent.change(searchInput, { target: { value: 'lap' } });
    fireEvent.change(searchInput, { target: { value: 'laptop' } });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(299);
    });
    expect(
      getProducts.mock.calls.some(([, config]) => config?.params?.search === 'laptop'),
    ).toBe(false);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(
      getProducts.mock.calls.some(([, config]) => config?.params?.search === 'laptop'),
    ).toBe(true);
    expect(screen.getByRole('heading', { name: 'Laptop from the full catalog' }))
      .toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: /Laptop from the full catalog/ }));
    expect(screen.getByTestId('current-path')).toHaveTextContent(
      '/products/catalog-result',
    );
  });

  test('popular search filters show all matching products in the suggestion list', async () => {
    const matchingProducts = Array.from({ length: 10 }, (_, index) => ({
      _id: `hp-laptop-${index}`,
      slug: `hp-laptop-${index}`,
      name: `HP Laptop ${index}`,
      brand: { name: 'HP' },
      category: { name: 'Laptops', slug: 'laptops' },
      shortDescription: 'Laptop returned by the catalog API.',
      images: [],
      specs: [],
    }));
    getProducts.mockImplementation((_, { params } = {}) =>
      Promise.resolve({
        data: {
          products: params?.search ? matchingProducts : [],
          totalPages: 1,
        },
      }),
    );

    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'HP Laptop' }));

    expect(screen.getByRole('searchbox', { name: 'Search products' })).toHaveValue(
      'HP Laptop',
    );
    expect(await screen.findAllByRole('option')).toHaveLength(10);
  });
});

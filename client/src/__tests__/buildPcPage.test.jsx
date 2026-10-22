import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import BuildPcPage from '../pages/BuildPcPage.jsx';

const { getProducts } = vi.hoisted(() => ({ getProducts: vi.fn() }));

vi.mock('../utils/apiClient.js', () => ({
  apiClient: { get: getProducts },
  extractErrorMessage: (_error, fallback) => fallback,
}));

vi.mock('../components/shared/SEO.jsx', () => ({ default: () => null }));

const renderBuilder = () => {
  const store = configureStore({
    reducer: {
      content: (state = { settings: { whatsappNumber: '919372049568' } }) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <BuildPcPage />
      </MemoryRouter>
    </Provider>
  );
};

describe('BuildPcPage', () => {
  beforeEach(() => {
    getProducts.mockResolvedValue({
      data: {
        products: [
          {
            _id: 'pc-part-1',
            name: 'Custom Desktop CPU',
            brand: { name: 'H-Tech' },
            category: { name: 'Desktops' },
            price: 25000,
            shortDescription: 'Desktop configuration',
          },
          {
            _id: 'pc-part-2',
            name: 'Monitor',
            price: 8000,
          },
        ],
        totalPages: 1,
      },
    });
  });

  test('adds products, updates quantity and subtotal, and prepares a WhatsApp quote', async () => {
    renderBuilder();

    const addButtons = await screen.findAllByRole('button', { name: 'Add', exact: true });
    fireEvent.click(addButtons[0]);

    const buildSummary = screen.getByRole('heading', { name: 'Your build' }).closest('aside');
    await waitFor(() => {
      expect(within(buildSummary).getByText('Custom Desktop CPU')).toBeInTheDocument();
      expect(within(buildSummary).getByText('1 × ₹25,000')).toBeInTheDocument();
    });
    expect((await screen.findAllByText('₹25,000')).length).toBeGreaterThan(0);
    expect(screen.getByText('Listed-price subtotal')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Increase Custom Desktop CPU quantity' }));

    await waitFor(() => {
      expect(screen.getAllByText('₹50,000').length).toBeGreaterThan(0);
      expect(within(buildSummary).getByText('2 × ₹25,000')).toBeInTheDocument();
    });

    const quoteLink = screen.getByRole('link', { name: 'Request quote on WhatsApp' });
    expect(quoteLink).toHaveAttribute('href', expect.stringContaining('wa.me/919372049568'));
    expect(decodeURIComponent(quoteLink.getAttribute('href'))).toContain('Custom Desktop CPU');
  });
});

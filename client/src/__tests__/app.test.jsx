import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import OffersCarousel from '../components/home/OffersCarousel.jsx';
import ProductCard from '../components/products/ProductCard.jsx';
import filtersReducer, {
  setCategoryFilter,
  setBrandFilter,
  setSearchFilter,
  setPriceRange,
  setFiltersFromUrl,
  resetFilters,
} from '../features/filtersSlice.js';

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

const sampleOffers = [
  {
    _id: '1',
    title: 'Solar & Smart LED Street-Light Solutions',
    badge: 'Green Energy Division',
    discountText: 'Direct Factory Wholesale Pricing',
    description: 'High-lumen IP66 waterproof All-in-One Solar Street Lights.',
    ctaLabel: 'Enquire Solar Dealer Rates',
    endDate: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    _id: '2',
    title: 'HP Laptop 250R G10 — Bulk Dealer Allocation',
    badge: 'Best Deal',
    discountText: 'Special Carton Slab Rates',
    description: 'Core 5 / Core i5 14th Gen, 8GB DDR4, 512GB NVMe SSD.',
    ctaLabel: 'Get Dealer Price on WhatsApp',
    endDate: new Date(Date.now() + 86400000).toISOString(),
  },
];

describe('H-Tech Frontend Tests (OffersCarousel + Product Filters Slice)', () => {
  test('ProductCard shows one product with pricing, specifications, and working wishlist toggle', () => {
    render(
      <MemoryRouter>
        <ProductCard
          product={{
            name: 'HP Laptop 250R G10',
            slug: 'hp-laptop-250r-g10',
            brand: { name: 'HP' },
            category: { name: 'Laptops' },
            price: 64999,
            specs: ['Intel Core 5', '8GB RAM'],
          }}
          imageUrl="/hp-laptop.jpg"
          whatsappHref="https://wa.me/919372049568"
          mobileNumber="+919371249568"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'HP Laptop 250R G10' })).toBeInTheDocument();
    expect(screen.getByText('₹64,999')).toBeInTheDocument();
    expect(screen.getByText('Intel Core 5')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Enquire on WhatsApp' })).toHaveAttribute(
      'href',
      'https://wa.me/919372049568'
    );

    const wishlistButton = screen.getByRole('button', { name: 'Add HP Laptop 250R G10 to wishlist' });
    fireEvent.click(wishlistButton);
    expect(
      screen.getByRole('button', { name: 'Remove HP Laptop 250R G10 from wishlist' })
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('OffersCarousel renders slides and advances on next button click', () => {
    render(
      <MemoryRouter>
        <OffersCarousel offers={sampleOffers} whatsappNumber="919372049568" />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Solar & Smart LED Street-Light Solutions')
    ).toBeInTheDocument();

    const nextBtn = screen.getByLabelText('Next offer slide');
    fireEvent.click(nextBtn);

    expect(
      screen.getByText('HP Laptop 250R G10 — Bulk Dealer Allocation')
    ).toBeInTheDocument();
  });

  test('OffersCarousel supports the compact hero presentation', () => {
    render(
      <MemoryRouter>
        <OffersCarousel
          offers={sampleOffers}
          whatsappNumber="919372049568"
          variant="hero"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Current Offer' })).toBeInTheDocument();
    expect(screen.getByText('Featured Wholesale Offer')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: sampleOffers[0].title })).toHaveClass(
      'text-white'
    );
  });

  test('Redux Toolkit filtersSlice updates category, brand, search and resets cleanly', () => {
    let state = filtersReducer(undefined, { type: '@@INIT' });
    expect(state.category).toBe('all');
    expect(state.minPrice).toBe('0');
    expect(state.maxPrice).toBe('');

    state = filtersReducer(state, setCategoryFilter('laptops'));
    expect(state.category).toBe('laptops');

    state = filtersReducer(state, setBrandFilter('hp'));
    expect(state.brand).toBe('hp');

    state = filtersReducer(state, setSearchFilter('250R G10'));
    expect(state.search).toBe('250R G10');

    state = filtersReducer(state, setPriceRange({ minPrice: '20000', maxPrice: '50000' }));
    expect(state.minPrice).toBe('20000');
    expect(state.maxPrice).toBe('50000');

    state = filtersReducer(state, resetFilters());
    expect(state).toEqual({
      category: 'all',
      brand: 'all',
      search: '',
      sort: 'order',
      minPrice: '0',
      maxPrice: '',
      page: 1,
    });

    state = filtersReducer(state, setFiltersFromUrl({ category: 'laptops' }));
    expect(state.minPrice).toBe('0');
  });
});

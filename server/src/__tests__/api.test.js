import request from 'supertest';
import app from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from '../seed/seed.js';
import { env } from '../config/env.js';
import { Product } from '../models/Product.js';
import { Brand } from '../models/Brand.js';
import { Category } from '../models/Category.js';
import { PushSubscription } from '../models/PushSubscription.js';

describe('H-Tech Wholesale Server API (Auth + Offers Date Filtering)', () => {
  beforeAll(async () => {
    await connectDB();
    await seedDatabase({ clearExisting: true });
  }, 60000);

  afterAll(async () => {
    await disconnectDB();
  }, 30000);

  test('CORS allows the configured frontend origin', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', env.CLIENT_URL.split(',')[0].trim());

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(
      env.CLIENT_URL.split(',')[0].trim()
    );
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  test('GET /api/offers returns only active offers whose startDate <= now <= endDate', async () => {
    const res = await request(app).get('/api/offers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.offers)).toBe(true);
    // 3 active offers seeded + 1 expired offer seeded
    expect(res.body.offers.length).toBe(3);

    const titles = res.body.offers.map((o) => o.title);
    expect(titles).toContain('Solar & Smart LED Street-Light Solutions');
    expect(titles).not.toContain('Monsoon Clearance Lot (Expired Test Offer)');
  });

  test('GET /api/products/:slug returns the seeded HP Laptop 250R G10', async () => {
    const res = await request(app).get('/api/products/hp-laptop-250r-g10');
    expect(res.status).toBe(200);
    expect(res.body.product.name).toBe('HP Laptop 250R G10');
    expect(res.body.product.price).toBeUndefined();
    expect(res.body.product.specs).toEqual(
      expect.arrayContaining(['Intel Core 5 / Core i5 14th Gen Processor'])
    );
  });

  test('GET /api/products filters the seeded PC components and gaming samples by category', async () => {
    const res = await request(app).get('/api/products?category=pc-components-gaming&limit=100');
    const categoryRes = await request(app).get(
      '/api/categories/pc-components-gaming/products?limit=100'
    );

    expect(res.status).toBe(200);
    expect(res.body.products.map(({ slug }) => slug)).toEqual(
      expect.arrayContaining([
        'asus-tuf-gaming-b760m-wifi-motherboard',
        'need-rgb-gaming-keyboard-mouse-combo',
        'need-stereo-gaming-headset-microphone',
      ])
    );
    expect(categoryRes.status).toBe(200);
    expect(categoryRes.body.products.map(({ slug }) => slug)).toEqual(
      expect.arrayContaining([
        'asus-tuf-gaming-b760m-wifi-motherboard',
        'need-rgb-gaming-keyboard-mouse-combo',
        'need-stereo-gaming-headset-microphone',
      ])
    );
  });

  test('GET /api/products searches all active products by product, brand, and category text', async () => {
    const brand = await Brand.create({
      name: 'CatalogSearchBrandOnly',
      slug: 'catalog-search-brand-only',
    });
    const category = await Category.create({
      name: 'CatalogSearchCategoryOnly',
      slug: 'catalog-search-category-only',
    });
    const product = await Product.create({
      name: 'Database Searchable Product',
      slug: 'database-searchable-product',
      brand: brand._id,
      category: category._id,
      shortDescription: 'A product for database search coverage.',
      isFeatured: false,
      isActive: true,
    });

    try {
      const nameSearch = await request(app).get('/api/products?search=Database%20Searchable');
      const brandSearch = await request(app).get('/api/products?search=CatalogSearchBrandOnly');
      const categorySearch = await request(app).get('/api/products?search=CatalogSearchCategoryOnly');
      const literalSearch = await request(app).get('/api/products?search=%5Bliteral');

      expect(nameSearch.status).toBe(200);
      expect(nameSearch.body.products.map(({ _id }) => _id)).toContain(product.id);
      expect(brandSearch.body.products.map(({ _id }) => _id)).toContain(product.id);
      expect(categorySearch.body.products.map(({ _id }) => _id)).toContain(product.id);
      expect(literalSearch.status).toBe(200);
      expect(literalSearch.body.products).toHaveLength(0);
    } finally {
      await Promise.all([
        Product.deleteOne({ _id: product._id }),
        Brand.deleteOne({ _id: brand._id }),
        Category.deleteOne({ _id: category._id }),
      ]);
    }
  });

  test('GET /api/products filters publicly priced products by minimum and maximum price', async () => {
    await Product.updateOne(
      { slug: 'hp-laptop-250r-g10' },
      { $set: { price: 54999 } }
    );

    const res = await request(app).get('/api/products?minPrice=50000&maxPrice=60000');
    expect(res.status).toBe(200);
    expect(res.body.products.map((product) => product.slug)).toContain('hp-laptop-250r-g10');
    expect(res.body.products.every((product) => product.price >= 50000 && product.price <= 60000))
      .toBe(true);

    const defaultMinimum = await request(app).get('/api/products?maxPrice=60000');
    expect(defaultMinimum.status).toBe(200);
    expect(defaultMinimum.body.products.map(({ slug }) => slug)).toContain('hp-laptop-250r-g10');
    expect(defaultMinimum.body.products.every((product) => product.price >= 0)).toBe(true);

    const unlimitedMaximum = await request(app).get(
      '/api/products?minPrice=0&maxPrice=unlimited'
    );
    expect(unlimitedMaximum.status).toBe(200);
    expect(unlimitedMaximum.body.products.map(({ slug }) => slug)).toContain('hp-laptop-250r-g10');

    const invalidRange = await request(app).get('/api/products?minPrice=60000&maxPrice=50000');
    expect(invalidRange.status).toBe(400);
    const blankPrice = await request(app).get('/api/products?minPrice=');
    expect(blankPrice.status).toBe(400);
  });

  test('public push subscription endpoint stores and removes browser subscriptions', async () => {
    const subscription = {
      endpoint: 'https://push.example.test/subscription/test-id',
      keys: { p256dh: 'test-public-key', auth: 'test-auth-key' },
    };

    const invalid = await request(app)
      .post('/api/notifications/subscriptions')
      .send({ endpoint: 'not-a-url', keys: subscription.keys });
    expect(invalid.status).toBe(400);

    const saved = await request(app)
      .post('/api/notifications/subscriptions')
      .send(subscription);
    expect(saved.status).toBe(201);
    expect(
      await PushSubscription.countDocuments({ endpoint: subscription.endpoint })
    ).toBe(1);

    const removed = await request(app)
      .delete('/api/notifications/subscriptions')
      .send({ endpoint: subscription.endpoint });
    expect(removed.status).toBe(200);
    expect(
      await PushSubscription.countDocuments({ endpoint: subscription.endpoint })
    ).toBe(0);
  });

  test('public push endpoint exposes the configured VAPID public key', async () => {
    const response = await request(app).get('/api/notifications/vapid-public-key');
    expect(response.status).toBe(200);
    expect(typeof response.body.publicKey).toBe('string');
    expect(response.body.publicKey.length).toBeGreaterThan(0);
  });

  test('POST /api/auth/login rejects invalid credentials and succeeds with valid admin credentials + sets httpOnly cookie', async () => {
    const badRes = await request(app).post('/api/auth/login').send({
      email: env.ADMIN_EMAIL,
      password: 'WrongPassword123',
    });
    expect(badRes.status).toBe(401);

    const okRes = await request(app).post('/api/auth/login').send({
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
    });
    expect(okRes.status).toBe(200);
    expect(okRes.body.user.email).toBe(env.ADMIN_EMAIL.toLowerCase());

    const cookies = okRes.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/htech_token=/);
    expect(cookies[0]).toMatch(/HttpOnly/i);

    // Verify protected GET /api/auth/me works with cookie
    const meRes = await request(app).get('/api/auth/me').set('Cookie', cookies);
    expect(meRes.status).toBe(200);
    expect(meRes.body.user.role).toBe('admin');
  });
});

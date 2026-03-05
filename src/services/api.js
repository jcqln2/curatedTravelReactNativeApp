/* StAuth10244: I Jacqueline, [YourID] certify that this material is my original work. */

// Fetches makeup data based on user input brand [cite: 22, 23]
export const fetchMakeup = async (brand) => {
  const res = await fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand.toLowerCase().trim()}`);
  return await res.json();
};

// Fetches city coordinates for the travel feature [cite: 11, 21]
export const fetchCityCoords = async (city) => {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
  return await res.json();
};

// Fashion tab: try DummyJSON first (CORS-friendly, real images), then Kolzsticks (GitHub Pages).
const DUMMYJSON_BASE = 'https://dummyjson.com/products';
const KOLZSTICKS_JSON = 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json';

// DummyJSON category slugs for our pills (ALL = fetch all products)
const DUMMYJSON_CATEGORIES = {
  '': null,
  "mens": 'mens-shirts',
  "womens": 'womens-dresses',
  "jewelery": 'womens-jewellery',
  "electronics": 'smartphones',
};

// Kolzsticks category names for fallback
const KOLZSTICKS_CATEGORIES = {
  '': null,
  "mens": 'Fashion & Apparel',
  "womens": 'Fashion & Apparel',
  "jewelery": 'Fashion & Apparel',
  "electronics": 'Electronics & Gadgets',
};

function normalizeDummyProduct(p) {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    image: (p.images && p.images[0]) || p.thumbnail || '',
  };
}

function normalizeKolzsticksProduct(p) {
  return {
    id: p.id,
    title: p.name,
    price: (p.priceCents || 0) / 100,
    image: p.image || '',
  };
}

export const fetchFashionItems = async (categorySlug) => {
  const slug = categorySlug || '';

  // 1) Try DummyJSON (works in Snack; returns real product images)
  try {
    const dummySlug = DUMMYJSON_CATEGORIES[slug] ?? slug;
    const url = dummySlug
      ? `${DUMMYJSON_BASE}/category/${encodeURIComponent(dummySlug)}?limit=20`
      : `${DUMMYJSON_BASE}?limit=24`;
    const res = await fetch(url);
    const data = await res.json();
    const list = data?.products;
    if (Array.isArray(list) && list.length > 0) {
      return list.map(normalizeDummyProduct);
    }
  } catch (_) {}

  // 2) Fallback: Kolzsticks (static JSON on GitHub Pages, CORS-friendly)
  try {
    const res = await fetch(KOLZSTICKS_JSON);
    const raw = await res.json();
    const list = Array.isArray(raw) ? raw : [];
    const category = KOLZSTICKS_CATEGORIES[slug];
    const filtered = category ? list.filter((p) => p.category === category) : list;
    const slice = (filtered.length > 0 ? filtered : list).slice(0, 24);
    return slice.map(normalizeKolzsticksProduct);
  } catch (_) {}

  return [];
};
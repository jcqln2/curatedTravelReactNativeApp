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

// Fashion tab: only shorts/pants (tops, shirts, dresses), accessories, shoes, jewellery – men & women.
const DUMMYJSON_BASE = 'https://dummyjson.com/products';
const KOLZSTICKS_JSON = 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json';

// Allowed DummyJSON categories (apparel, shoes, accessories, jewellery only – no electronics/beauty/etc.)
const FASHION_ONLY_SLUGS = [
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'womens-dresses',
  'womens-bags',
  'womens-jewellery',
  'womens-shoes',
  'womens-watches',
  'tops',
  'sunglasses',
];

// Climate-based category sets (when user has chosen a travel destination)
const WARM_SLUGS = ['tops', 'womens-dresses', 'sunglasses', 'mens-shoes', 'womens-shoes', 'womens-jewellery'];
const COLD_SLUGS = ['mens-shirts', 'mens-watches', 'womens-watches', 'womens-bags', 'womens-dresses', 'womens-shoes'];

// Pill slug -> one or more DummyJSON category slugs to fetch
const PILL_TO_DUMMY_SLUGS = {
  '': FASHION_ONLY_SLUGS,
  shoes: ['mens-shoes', 'womens-shoes'],
  accessories: ['mens-watches', 'womens-watches', 'womens-bags', 'sunglasses'],
  jewelery: ['womens-jewellery'],
  mens: ['mens-shirts', 'mens-shoes', 'mens-watches'],
  womens: ['womens-dresses', 'womens-shoes', 'womens-bags', 'womens-jewellery', 'womens-watches'],
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

async function fetchDummyCategory(categorySlug, limit = 30) {
  const url = `${DUMMYJSON_BASE}/category/${encodeURIComponent(categorySlug)}?limit=${limit}`;
  const res = await fetch(url);
  const data = await res.json();
  return Array.isArray(data?.products) ? data.products : [];
}

export const fetchFashionItems = async (categorySlug, skip = 0, climate = null) => {
  const slug = (categorySlug || '').toLowerCase().replace(/\s+/g, '');
  const pillSlug = slug === "men'sclothing" ? 'mens' : slug === "women'sclothing" ? 'womens' : slug;
  let dummySlugs = PILL_TO_DUMMY_SLUGS[pillSlug] ?? (pillSlug ? [pillSlug] : FASHION_ONLY_SLUGS);
  if (pillSlug === '' && climate === 'warm') dummySlugs = WARM_SLUGS;
  else if (pillSlug === '' && climate === 'cold') dummySlugs = COLD_SLUGS;

  // 1) DummyJSON: fetch only from allowed fashion categories
  try {
    let merged;
    if (dummySlugs.length === 1) {
      merged = await fetchDummyCategory(dummySlugs[0], 50);
    } else {
      const results = await Promise.all(dummySlugs.map((s) => fetchDummyCategory(s, 25)));
      merged = results.flat();
    }
    const slice = merged.slice(skip, skip + 24);
    if (slice.length > 0) return slice.map(normalizeDummyProduct);
  } catch (_) {}

  // 2) Fallback: Kolzsticks – Fashion & Apparel only (no electronics)
  try {
    const res = await fetch(KOLZSTICKS_JSON);
    const raw = await res.json();
    const list = Array.isArray(raw) ? raw : [];
    const pool = list.filter((p) => p.category === 'Fashion & Apparel');
    const source = pool.length > 0 ? pool : list;
    const slice = source.slice(skip, skip + 24);
    return slice.map(normalizeKolzsticksProduct);
  } catch (_) {}

  return [];
};
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

// Fetches products for the fashion tab (Fake Store API – real product images).
// Uses CORS proxy so requests work in Expo Snack / web preview.
const FASHION_BASE = 'https://fakestoreapi.com/products';
const CORS_PROXY = 'https://corsproxy.io/?';

export const fetchFashionItems = async (categorySlug) => {
  const path = categorySlug
    ? `${FASHION_BASE}/category/${encodeURIComponent(categorySlug)}`
    : FASHION_BASE;
  const url = CORS_PROXY + encodeURIComponent(path);
  const res = await fetch(url);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};
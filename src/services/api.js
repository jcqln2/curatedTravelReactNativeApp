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

// Fetches products for the fashion tab (Fake Store API – real product images)
export const fetchFashionItems = async (categorySlug) => {
  const base = 'https://fakestoreapi.com/products';
  const url = categorySlug
    ? `${base}/category/${encodeURIComponent(categorySlug)}`
    : base;
  const res = await fetch(url);
  return await res.json();
};
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

// Fetches products for the fashion tab [cite: 35]
export const fetchFashionItems = async (categoryId) => {
  let url = `https://api.escuelajs.co/api/v1/products?limit=20&offset=0`;
  if (categoryId) url += `&categoryId=${categoryId}`;
  const res = await fetch(url);
  return await res.json();
};
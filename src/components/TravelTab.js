/* StAuth10244: I Jacqueline, [YourID] certify that this material is my original work. */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { WEATHER_ICONS, WEATHER_DESC, GLAM_TIPS, CITY_IMAGES } from '../constants/data';
import { fetchCityCoords } from '../services/api';

const DEFAULT_CITY_IMG = "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600";

export default function TravelTab({ onDestinationChange }) {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [heroImg, setHeroImg] = useState(DEFAULT_CITY_IMG);

  const handleSearch = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setHeroImg(CITY_IMAGES[city.toLowerCase().trim()] || DEFAULT_CITY_IMG);

    try {
      const geoData = await fetchCityCoords(city);
      if (geoData.results) {
        const { latitude, longitude, name, country } = geoData.results[0];
        const wxRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const wxData = await wxRes.json();
        const weatherPayload = { ...wxData.current_weather, name, country };
        setWeather(weatherPayload);
        onDestinationChange?.(weatherPayload);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: heroImg }} style={styles.hero} />
      <TextInput 
        style={styles.input} 
        placeholder="Enter Destination..." 
        placeholderTextColor="#B8B8B2"
        value={city} 
        onChangeText={setCity}
        onSubmitEditing={handleSearch}
      />

      {loading && <ActivityIndicator color="#C5A059" style={{ marginTop: 20 }} />}

      {weather && (
        <View style={styles.weatherCard}>
          <Text style={styles.emoji}>{WEATHER_ICONS[weather.weathercode]}</Text>
          <Text style={styles.cityName}>{weather.name?.toUpperCase()}</Text>
          {/* Meaningful Status Description */}
          <Text style={styles.weatherStatus}>{WEATHER_DESC[weather.weathercode]}</Text>
          <Text style={styles.temp}>{Math.round(weather.temperature)}°C</Text>
          <View style={styles.tipContainer}>
            <Text style={styles.tipText}>“{GLAM_TIPS[weather.weathercode] || "Stay elegant."}”</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { width: '100%', height: 180, borderRadius: 2, marginBottom: 20 },
  input: { borderBottomWidth: 1, borderBottomColor: '#D1D1CB', paddingVertical: 12, fontSize: 16, color: '#2D2D2A', marginBottom: 25 },
  weatherCard: { backgroundColor: '#FFFFFF', padding: 25, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  emoji: { fontSize: 44, marginBottom: 10 },
  cityName: { fontSize: 10, letterSpacing: 3, color: '#C5A059', marginBottom: 5 },
  weatherStatus: { fontSize: 12, color: '#A6A6A2', letterSpacing: 1, marginBottom: 5, textTransform: 'uppercase' },
  temp: { fontSize: 32, fontWeight: '300', color: '#2D2D2A', fontFamily: 'serif' },
  tipContainer: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#F5F5F0', paddingTop: 15, width: '100%' },
  tipText: { textAlign: 'center', fontStyle: 'italic', color: '#7A7A76', fontSize: 13 }
});
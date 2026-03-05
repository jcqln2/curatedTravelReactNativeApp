/* StAuth10244: I Jacqueline, [YourID] certify that this material is my original work. 
   No other person's work has been used without due acknowledgement. 
   I have not made my work available to anyone else. */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { fetchMakeup } from '../services/api';

export default function GlamTab() {
  const [brand, setBrand] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Requirement: Actions that result in data being retrieved [cite: 20]
  const search = async () => {
    if (!brand.trim()) return;
    setLoading(true);
    try {
      const data = await fetchMakeup(brand);
      // Requirement: Displayed in a neatly formatted way [cite: 20]
      setProducts(data.slice(0, 10)); 
    } catch (error) {
      console.error("Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {/* Requirement: TextInput component [cite: 32] */}
      {/* Requirement: Parameter based on TextInput  */}
      <TextInput 
        style={styles.input} 
        placeholder="Search Brand (e.g. Dior, Chanel...)" 
        placeholderTextColor="#B8B8B2" 
        value={brand} 
        onChangeText={setBrand}
        onSubmitEditing={search} 
      />
      
      {loading ? (
        <ActivityIndicator color="#C5A059" style={{ marginTop: 20 }} />
      ) : (
        products.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* Requirement: At least one image [cite: 34] */}
            <Image 
              source={{ uri: item.image_link }} 
              style={styles.img} 
              defaultSource={{ uri: 'https://placehold.co/200x200/FFFFFF/C5A059?text=Beauty' }}
            />
            <View style={styles.info}>
              <Text style={styles.brandLabel}>{item.brand?.toUpperCase()}</Text>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text style={styles.priceText}>
                ${parseFloat(item.price || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#D1D1CB', 
    paddingVertical: 12, 
    fontSize: 16, 
    color: '#2D2D2A', 
    marginBottom: 25 
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 2, 
    padding: 15, 
    marginBottom: 20, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    elevation: 2 
  },
  img: { 
    width: '100%', 
    height: 200, 
    resizeMode: 'contain', 
    marginBottom: 15 
  },
  brandLabel: { 
    fontSize: 9, 
    color: '#C5A059', 
    letterSpacing: 2, 
    marginBottom: 5 
  },
  nameText: { 
    fontSize: 16, 
    color: '#2D2D2A', 
    fontWeight: '400', 
    fontFamily: 'serif' 
  },
  priceText: { 
    fontSize: 14, 
    color: '#7A7A76', 
    marginTop: 8 
  },
});
/* StAuth10244: I Jacqueline, [YourID] certify that this material is my original work. */
import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchFashionItems } from '../services/api';

const CATEGORIES = [
  {id: "", label: "ALL"}, 
  {id: "4", label: "SHOES"}, 
  {id: "1", label: "TOPS & BOTTOMS"}, 
  {id: "5", label: "ACCESSORIES & BAGS"}
];

export default function FashionTab() {
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadFashion(""); }, []);

  const loadFashion = async (id) => {
    setLoading(true);
    try {
      const data = await fetchFashionItems(id);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Style API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Visual Feedback for Empty States
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Collection currently unavailable.</Text>
      <Text style={styles.emptySubText}>Please select another category to view the edit.</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    let imageUrl = item.images && item.images.length > 0 ? item.images[0] : "";
    if (imageUrl.startsWith("[") || imageUrl.includes('"')) {
      imageUrl = imageUrl.replace(/[\[\]"]/g, "");
    }

    return (
      <View style={styles.itemCard}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.itemImg} 
          defaultSource={{ uri: 'https://placehold.co/400x400/F5F5F0/C5A059?text=Style' }}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>THE COLLECTIONS</Text>
      <View style={styles.pillContainer}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity 
            key={cat.id} 
            style={[styles.pill, selectedCat === cat.id && styles.activePill]}
            onPress={() => {setSelectedCat(cat.id); loadFashion(cat.id);}}>
            <Text style={[styles.pillText, selectedCat === cat.id && styles.activePillText]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.refreshBtn} onPress={() => loadFashion(selectedCat)}>
        <Text style={styles.refreshBtnText}>REFRESH THE EDIT</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator color="#C5A059" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={items}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { fontSize: 9, letterSpacing: 2, color: '#A6A6A2', marginBottom: 15 },
  pillContainer: { flexDirection: 'row', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  pill: { paddingVertical: 8, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: 'transparent' },
  activePill: { borderBottomColor: '#C5A059' },
  pillText: { fontSize: 10, color: '#A6A6A2', fontWeight: '500', letterSpacing: 1 },
  activePillText: { color: '#2D2D2A' },
  refreshBtn: { backgroundColor: '#2D2D2A', padding: 15, alignItems: 'center', marginBottom: 20, borderRadius: 2 },
  refreshBtnText: { color: '#FFFFFF', fontSize: 11, letterSpacing: 2, fontWeight: '600' },
  row: { justifyContent: 'space-between' },
  itemCard: { width: '48%', backgroundColor: '#FFFFFF', marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5, elevation: 1 },
  itemImg: { width: '100%', height: 160, resizeMode: 'cover' },
  itemInfo: { padding: 12 },
  itemName: { fontSize: 12, color: '#2D2D2A', fontFamily: 'serif' },
  itemPrice: { fontSize: 11, color: '#C5A059', marginTop: 4, fontWeight: '#600' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#2D2D2A', fontSize: 14, fontWeight: '500', textAlign: 'center' },
  emptySubText: { color: '#A6A6A2', fontSize: 12, marginTop: 5, textAlign: 'center' }
});
/* StAuth10244: I Jacqueline, [YourID] certify that this material is my original work. */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import GlamTab from './src/components/GlamTab';
import TravelTab from './src/components/TravelTab';
import FashionTab from './src/components/FashionTab';

export default function App() {
  const [tab, setTab] = useState("glam");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appFrame}>
        <View style={styles.header}>
          <Text style={styles.title}>The Curated Traveller</Text>
          <Text style={styles.subtitle}>Curating your aesthetic, wherever you land</Text>
        </View>

        <View style={styles.tabBar}>
          {[["glam", "Beauty"], ["travel", "Escape"], ["fashion", "Style"]].map(([id, label]) => (
            <TouchableOpacity 
              key={id} 
              style={[styles.tabBtn, tab === id && styles.activeTab]} 
              onPress={() => setTab(id)}
            >
              <Text style={[styles.tabBtnText, tab === id && styles.activeTabText]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scrollBody}>
          {tab === "glam" && <GlamTab />}
          {tab === "travel" && <TravelTab />}
          {tab === "fashion" && <FashionTab />}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F0' }, // Light Greige background
  appFrame: { flex: 1, paddingHorizontal: 15 },
  header: { paddingVertical: 30, alignItems: 'center' },
  title: { fontSize: 28, color: '#2D2D2A', fontWeight: '300', letterSpacing: 2, fontFamily: 'serif' },
  subtitle: { fontSize: 10, color: '#A6A6A2', letterSpacing: 3, marginTop: 8, textTransform: 'uppercase' },
  tabBar: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  tabBtn: { paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 5 },
  activeTab: { borderBottomWidth: 1, borderBottomColor: '#C5A059' }, // Champagne Gold
  tabBtnText: { color: '#A6A6A2', fontSize: 12, fontWeight: '400', letterSpacing: 1 },
  activeTabText: { color: '#2D2D2A' },
  scrollBody: { paddingBottom: 30 },
});
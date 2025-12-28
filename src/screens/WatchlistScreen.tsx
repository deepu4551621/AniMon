import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WatchlistScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Watchlist</Text>
      <Text>Your saved shows and movies will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, marginBottom: 8 },
});

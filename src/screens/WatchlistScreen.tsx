import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';

export default function WatchlistScreen() {
  return (
    <View style={styles.container}>
      <AppText weight="semibold" size={20} style={styles.title}>
        Watchlist
      </AppText>
      <AppText>Your saved shows and movies will appear here.</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, marginBottom: 8 },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <AppText weight="semibold" size={20} style={styles.title}>
        Profile
      </AppText>
      <AppText>User profile and settings.</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, marginBottom: 8 },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../../../components/AppText';

type Pair = { label: string; value?: any };
type Props = { items: Pair[] };

export default function InfoList({ items }: Props) {
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.container}>
      {items.map((p) => (
        <View key={p.label} style={styles.row}>
          <AppText size={13} style={styles.label}>{p.label}</AppText>
          <AppText size={13} style={styles.value}>{String(p.value ?? '—')}</AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12, width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: '#222' },
  label: { color: '#999' },
  value: { color: '#fff', maxWidth: '65%', textAlign: 'right' },
});

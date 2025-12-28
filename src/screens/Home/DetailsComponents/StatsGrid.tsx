import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../../../components/AppText';

type Props = { anime: any };

export default function StatsGrid({ anime }: Props) {
  if (!anime) return null;
  const stats = [
    { label: 'Score', value: anime.score ?? 'N/A' },
    { label: 'Scored by', value: anime.scored_by ?? 'N/A' },
    { label: 'Episodes', value: anime.episodes ?? 'N/A' },
    { label: 'Members', value: anime.members ?? 'N/A' },
  ];

  return (
    <View style={styles.container}>
      {stats.map((s) => (
        <View key={s.label} style={styles.cell}>
          <AppText size={13} style={styles.label}>{s.label}</AppText>
          <AppText weight="semibold" size={15} style={styles.value}>{String(s.value)}</AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  cell: { flex: 1, alignItems: 'center' },
  label: { color: '#999' },
  value: { color: '#fff', marginTop: 6 },
});

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import AppText from '../../../components/AppText';

type Props = { title?: string; items?: any[] };

export default function ChipsList({ title, items }: Props) {
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.container}>
      {title ? <AppText weight="semibold" size={16} style={styles.title}>{title}</AppText> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {items.map((it: any) => (
          <View key={it.mal_id ?? it.name ?? it} style={styles.chip}>
            <AppText size={13} style={styles.chipText}>{it.name ?? it}</AppText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  title: { color: '#fff', marginBottom: 8 },
  chips: { paddingHorizontal: 4 },
  chip: { backgroundColor: '#131313', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, marginRight: 8, borderWidth: 0.5, borderColor: '#222' },
  chipText: { color: '#ddd' },
});

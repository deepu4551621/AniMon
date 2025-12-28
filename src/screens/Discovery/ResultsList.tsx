import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import AnimeCardCompact from '../Home/AnimeCardCompact';

type Props = { data: any[]; onPress: (item: any) => void };

export default function ResultsList({ data = [], onPress }: Props) {
  return (
    <FlatList
      data={data}
      keyExtractor={(it: any) =>
        String(it.mal_id ?? it.url ?? JSON.stringify(it))
      }
      renderItem={({ item }) => (
        <AnimeCardCompact item={item} onPress={onPress} style={styles.card} />
      )}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={{ paddingBottom: 120 }}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  card: { width: '48%' },
});

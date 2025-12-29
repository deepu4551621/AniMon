import React from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator } from 'react-native';
import AnimeCardCompact from '../Home/AnimeCardCompact';
import AppText from '../../components/AppText';

type Props = {
  data: any[];
  onPress: (item: any) => void;
  onEndReached?: () => void;
  loading?: boolean;
  hasMore?: boolean;
};

export default function ResultsList({
  data = [],
  onPress,
  onEndReached,
  loading,
  hasMore,
}: Props) {
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
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (onEndReached && hasMore && !loading) onEndReached();
      }}
      ListFooterComponent={() => (
        <View style={styles.footer}>
          {loading && data && data.length > 0 ? (
            <ActivityIndicator color="#fff" />
          ) : !hasMore && data && data.length > 0 ? (
            <AppText style={styles.footerText}>No more results</AppText>
          ) : null}
        </View>
      )}
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
  footer: { paddingVertical: 12, alignItems: 'center' },
  footerText: { color: '#888' },
});

import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '../../components/AppText';
import AnimeCard from './AnimeCard';
import ShimmerCard from './ShimmerCard';

type Props = {
  title: string;
  data: any[];
  loading?: boolean;
  onPressItem?: (item: any) => void;
  onViewAll?: () => void;
};

export default function Section({ title, data, loading, onPressItem, onViewAll }: Props) {
  const hasData = Array.isArray(data) && data.length > 0;

  const renderItem = ({ item }: any) => <AnimeCard item={item} onPress={onPressItem} />;

  const showShimmer = !!loading && !hasData;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText weight="semibold" size={16} style={styles.title}>
          {title}
        </AppText>
        {onViewAll ? (
          <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
            <AppText size={13} style={styles.viewAllText}>View All</AppText>
          </TouchableOpacity>
        ) : null}
      </View>
      {!showShimmer && hasData ? (
        <FlatList
          horizontal
          data={data}
          keyExtractor={(item: any, index: number) => `${String(item?.mal_id ?? item?.url ?? 'item')}-${index}`}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        />
      ) : (
        <FlatList
          horizontal
          data={[0, 1, 2, 3, 4]}
          keyExtractor={(_, idx) => `shimmer-${idx}`}
          renderItem={() => <ShimmerCard />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 18 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, marginBottom: 8 },
  title: { color: '#fff' },
  viewAllButton: { paddingHorizontal: 6, paddingVertical: 4 },
  viewAllText: { color: '#9bdcff' },
});

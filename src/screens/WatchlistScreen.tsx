import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import AppText from '../components/AppText';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import CustomHeader from '../components/CustomHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AnimeCard from './Home/AnimeCardCompact';

export default function WatchlistScreen({ navigation }: any) {
  const items = useSelector((s: RootState) => s.watchlist?.items ?? []);

  const onPress = (item: any) =>
    navigation.navigate('HomeDetails', { id: item.mal_id });

  return (
    <SafeAreaWrapper style={styles.safe} backgroundColor="#000">
      <CustomHeader title="Watchlist" align="center" />
      {items.length === 0 ? (
        <View style={styles.empty}>
          <AppText weight="semibold" size={18} style={{ color: '#fff' }}>
            No saved shows
          </AppText>
          <AppText style={{ color: '#bbb', marginTop: 8 }}>
            Tap the heart on a show to save it here.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it: any) => String(it.mal_id)}
          renderItem={({ item }) => (
            <AnimeCard item={item} onPress={onPress} style={styles.card} />
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  card: { width: '48%' },
});

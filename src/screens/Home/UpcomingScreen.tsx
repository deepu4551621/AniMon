import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import CustomHeader from '../../components/CustomHeader';
import AppText from '../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getUpcomingAnime } from '../../store/slices/animeSlice';
import AnimeCard from './AnimeCardCompact';

export default function UpcomingScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { upcomingAnime, loading } = useSelector((s: RootState) => s.anime);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!upcomingAnime || upcomingAnime.length === 0) dispatch(getUpcomingAnime({ page: 1 }) as any);
  }, [dispatch]);

  const onPress = (item: any) => navigation.navigate('HomeDetails', { id: item.mal_id });

  const loadMore = () => {
    if (loading || loadingMore) return;
    setLoadingMore(true);
    const next = page + 1;
    dispatch(getUpcomingAnime({ page: next }) as any).finally(() => {
      setPage(next);
      setLoadingMore(false);
    });
  };

  return (
    <SafeAreaWrapper style={styles.safe} backgroundColor='#000'>
      <CustomHeader title="Upcoming" align="center" />
      <FlatList
        data={upcomingAnime}
        keyExtractor={(it: any) => String(it.mal_id)}
        renderItem={({ item }) => <AnimeCard item={item} onPress={onPress} style={styles.card} />}
        numColumns={2}
        columnWrapperStyle={styles.row}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => { setPage(1); dispatch(getUpcomingAnime({ page: 1 }) as any); }} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: 12 }} color="#fff" /> : null}
        ListEmptyComponent={<AppText style={{ color: '#fff', padding: 16 }}>No upcoming anime.</AppText>}
        contentContainerStyle={{ padding: 12 }}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  card: { width: '48%' },
});

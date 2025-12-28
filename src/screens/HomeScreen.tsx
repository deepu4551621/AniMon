import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  getPopularAnime,
  getUpcomingAnime,
  getAiringAnime,
  getTopAnime,
} from '../store/slices/animeSlice';
import { Section, HomeCarousel } from './Home';

export default function HomeScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { popularAnime, upcomingAnime, airingAnime, loading } = useSelector(
    (s: RootState) => s.anime,
  );

  const { topAnime } = useSelector((s: RootState) => s.anime);

  useEffect(() => {
    dispatch(getTopAnime({ page: 1 }) as any);
    dispatch(getPopularAnime({ page: 1 }) as any);
    dispatch(getUpcomingAnime({ page: 1 }) as any);
    dispatch(getAiringAnime({ page: 1 }) as any);
  }, [dispatch]);

  const onPressItem = (item: any) => {
    // navigate to details screen; HomeDetails will fetch details
    if (item?.mal_id) navigation.navigate('HomeDetails', { id: item.mal_id });
  };

  const onViewAll = (screenName: string) => () =>
    navigation.navigate(screenName);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 52 }}
      >
        <HomeCarousel data={topAnime} onPressItem={onPressItem} />
        <Section
          title="Popular"
          data={popularAnime}
          loading={loading}
          onPressItem={onPressItem}
          onViewAll={onViewAll('Popular')}
        />
        <Section
          title="Upcoming"
          data={upcomingAnime}
          loading={loading}
          onPressItem={onPressItem}
          onViewAll={onViewAll('Upcoming')}
        />
        <Section
          title="Airing"
          data={airingAnime}
          loading={loading}
          onPressItem={onPressItem}
          onViewAll={onViewAll('Airing')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  title: {
    fontSize: 20,
    marginBottom: 8,
    color: '#fff',
    paddingHorizontal: 12,
  },
  section: { marginTop: 18 },
  sectionTitle: { marginBottom: 8, paddingHorizontal: 12, color: '#fff' },
  card: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
  },
  poster: {
    width: 120,
    height: 170,
    borderRadius: 8,
    backgroundColor: '#222',
  },
  cardTitle: { marginTop: 6, textAlign: 'center', color: '#fff', width: 120 },
});

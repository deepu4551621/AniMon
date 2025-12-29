import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import AppText from '../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getAnime, getCharacters } from '../../store/slices/animeSlice';

import PosterHeader from './DetailsComponents/PosterHeader';
import Synopsis from './DetailsComponents/Synopsis';
import InfoList from './DetailsComponents/InfoList';
import ChipsList from './DetailsComponents/ChipsList';
import StatsGrid from './DetailsComponents/StatsGrid';
import CharactersList from './DetailsComponents/CharactersList';
import ShimmerCard from './ShimmerCard';
import CustomHeader from '../../components/CustomHeader';
import { SCREEN_WIDTH } from '../../utils';
import Trailer from './DetailsComponents/Trailer';

export default function HomeDetails({ route }: any) {
  const id = route?.params?.id;
  const dispatch = useDispatch();
  const { anime, characters, loading, error } = useSelector(
    (s: RootState) => s.anime,
  );

  useEffect(() => {
    if (id) {
      dispatch(getAnime(id) as any);
      dispatch(getCharacters(id) as any);
    }
  }, [id, dispatch]);
  console.log('details==:', anime);
  return (
    <SafeAreaWrapper style={styles.safe} backgroundColor="#000">
      <CustomHeader title={anime?.title ?? 'Details'} align="center" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {loading && !anime ? (
          <ShimmerCard cardWidth={SCREEN_WIDTH - 32} />
        ) : anime ? (
          <View>
            <PosterHeader anime={anime} />
            <StatsGrid anime={anime} />

            {anime.trailer ? <Trailer trailer={anime.trailer} /> : null}

            <InfoList
              items={[
                { label: 'Type', value: anime.type },
                { label: 'Source', value: anime.source },
                { label: 'Episodes', value: anime.episodes },
                { label: 'Duration', value: anime.duration },
                { label: 'Rating', value: anime.rating },
                { label: 'Aired', value: anime.aired?.string },
                { label: 'Broadcast', value: anime.broadcast?.string },
                {
                  label: 'Season',
                  value: anime.season
                    ? `${anime.season} ${anime.year ?? ''}`
                    : (anime.year ?? '—'),
                },
              ]}
            />

            <ChipsList title="Genres" items={anime.genres} />
            <ChipsList title="Themes" items={anime.themes} />
            <ChipsList title="Studios" items={anime.studios} />
            <ChipsList title="Producers" items={anime.producers} />

            <Synopsis text={anime.synopsis} />

            <CharactersList characters={characters} />
          </View>
        ) : (
          <AppText style={{ color: '#fff' }}>No details available.</AppText>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  container: { padding: 16 },
  section: { marginTop: 18 },
  sectionTitle: { marginBottom: 8, color: '#fff' },
  charName: { color: '#ddd', marginBottom: 6 },
});

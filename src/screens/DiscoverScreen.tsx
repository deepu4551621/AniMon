import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';

import discoveryReducer, {
  setQuery,
  setFiltersVisible,
  setYear,
  toggleGenre,
  setStudio,
  searchAnime,
  setMinRating,
  getGenres,
  clearFilters,
  setSearchMode,
  setPage,
  setGenreType,
  setGenreQueryFilter,
} from '../store/slices/discoverySlice';
import SearchScreen from './Discovery/SearchScreen';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import AppText from '../components/AppText';
import FilterModal from './Discovery/FilterModal';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

export default function DiscoverScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const discovery = useSelector((s: RootState) => s.discovery);
  const {
    searchResults,
    genresMeta,
    loading,
    hasNext,
    page,
    query,
    year,
    selectedGenres,
    studio,
    minRating,
    searchMode,
    genreType,
  } = discovery;

  const [debounced, setDebounced] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  // new: auto-search for basic mode when user types (debounced)
  useEffect(() => {
    if (!debounced || debounced.length < 2) return;

    const payload: any = {
      query: debounced,
      filters: {},
      page: 1,
      limit: 20,
    };
    // basic mode uses only query (no genre/filter unless you want)
    dispatch(searchAnime(payload) as any);
    dispatch(setPage(1) as any);
  }, [debounced, searchMode, dispatch]);

  useEffect(() => {
    // fetch available genres once
    dispatch(getGenres() as any);
  }, [dispatch]);

  const onApply = () => {
    const payload: any = {
      query: debounced || '',
      filters: {},
      page: 1,
      limit: 20,
    };
    if (year.trim()) payload.filters.year = year.trim();
    if (selectedGenres.length) {
      payload.filters.genreType = genreType || 'genres';
      payload.filters.genres = selectedGenres;
    }
    if (studio.trim()) payload.filters.studio = studio.trim();
    if (Number(minRating) > 0) payload.filters.score = Number(minRating);
    dispatch(searchAnime(payload) as any);
    dispatch(setPage(1) as any);
    // also set computed query string
    const q = `${payload.filters.genreType}=${(selectedGenres || []).join(',')}`;
    dispatch(setGenreQueryFilter(q) as any);
    setModalVisible(false);
  };

  const loadMore = () => {
    if (!hasNext) return;
    const next = page + 1;
    const payload: any = {
      query: debounced || '',
      filters: {},
      page: next,
      limit: 20,
    };
    if (year.trim()) payload.filters.year = year.trim();
    if (selectedGenres.length) {
      payload.filters.genreType = genreType || 'genres';
      payload.filters.genres = selectedGenres;
    }
    if (studio.trim()) payload.filters.studio = studio.trim();
    if (Number(minRating) > 0) payload.filters.score = Number(minRating);
    dispatch(searchAnime(payload) as any);
    dispatch(setPage(next) as any);
  };

  const onPress = useCallback(
    (item: any) => navigation.navigate('HomeDetails', { id: item.mal_id }),
    [navigation],
  );

  const openFilters = () => {
    setModalVisible(true);
    dispatch(setFiltersVisible(true) as any);
  };
  const closeFilters = () => {
    setModalVisible(false);
    dispatch(setFiltersVisible(false) as any);
  };
  const onToggleGenre = (id: number | string) =>
    dispatch(toggleGenre(String(id)) as any);

  return (
    <SafeAreaWrapper style={styles.safe} backgroundColor="#000">
      <View style={{ padding: 12, alignItems: 'center' }}>
        <AppText style={{ fontSize: 18, fontWeight: '600', color: '#fff' }}>
          Discover
        </AppText>
      </View>
      {/* hamburger in place of back arrow */}
      <TouchableOpacity onPress={openFilters} style={styles.hamburger}>
        <AppText style={{ color: '#fff', fontSize: 30 }}>≡</AppText>
      </TouchableOpacity>

      <View style={styles.container}>
        <SearchScreen
          query={query}
          setQuery={(v: string) => dispatch(setQuery(v) as any)}
          debounced={debounced}
          loading={loading}
          results={searchResults}
          onPress={onPress}
          filters={{
            year,
            genres: selectedGenres,
            studio,
            minRating: Number(minRating),
          }}
          onClearFilters={() => dispatch(clearFilters() as any)}
          searchMode={searchMode}
          onToggleSearchMode={m => dispatch(setSearchMode(m) as any)}
          genresMeta={genresMeta}
          onApply={onApply}
          onLoadMore={loadMore}
          hasMore={hasNext}
          page={page}
        />
      </View>

      <FilterModal
        visible={modalVisible}
        onClose={closeFilters}
        genresMeta={genresMeta}
        genreType={genreType}
        selectedGenres={selectedGenres}
        onToggleGenre={onToggleGenre}
        onApply={onApply}
        onReset={() => dispatch(clearFilters() as any)}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1 },
  hamburger: {
    position: 'absolute',
    left: 12,
    top: 0,
    zIndex: 20,
    paddingHorizontal: 12,
  },
});

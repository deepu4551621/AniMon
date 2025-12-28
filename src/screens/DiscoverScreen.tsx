import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { searchAnime } from '../store/slices/animeSlice';
import SearchScreen from './Discovery/SearchScreen';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import CustomHeader from '../components/CustomHeader';
import { StyleSheet } from 'react-native';

export default function DiscoverScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((s: RootState) => s.anime);
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (debounced.length >= 2) dispatch(searchAnime(debounced) as any);
  }, [debounced, dispatch]);

  const onPress = useCallback(
    (item: any) => navigation.navigate('HomeDetails', { id: item.mal_id }),
    [navigation],
  );

  return (
    <SafeAreaWrapper style={styles.safe} backgroundColor="#000">
      <CustomHeader title="Discover" align="center" />
      <SearchScreen
        query={query}
        setQuery={setQuery}
        debounced={debounced}
        loading={loading}
        results={searchResults}
        onPress={onPress}
      />
    </SafeAreaWrapper>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  container: { padding: 12, flex: 1 },
});

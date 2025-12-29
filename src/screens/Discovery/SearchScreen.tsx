import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import SearchBar from './SearchBar';
import ResultsList from './ResultsList';
import AppText from '../../components/AppText';

type Props = {
  query: string;
  setQuery: (v: string) => void;
  debounced: string;
  loading: boolean;
  results: any[];
  onPress: (item: any) => void;
  filters?: {
    year?: string;
    genres?: string[];
    studio?: string;
    minRating?: number;
  };
  onClearFilters?: () => void;
  onApply?: () => void;
  searchMode?: 'basic' | 'advanced';
  onToggleSearchMode?: (m: 'basic' | 'advanced') => void;
  genresMeta?: any[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  page?: number;
};

export default function SearchScreen({
  query,
  setQuery,
  debounced,
  loading,
  results,
  onPress,
  filters,
  onClearFilters,
  onApply,
  onLoadMore,
  hasMore,
  page,
}: Props) {
  const hasFilters =
    !!filters &&
    (filters.year ||
      (filters.genres && filters.genres.length) ||
      filters.studio ||
      (filters.minRating && filters.minRating > 0));

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search anime (min 2 chars)"
      />

      {/* active filter chips */}
      {hasFilters && (
        <View style={styles.filterBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', paddingRight: 8 }}
          >
            {filters?.year ? (
              <View style={styles.chip}>
                <AppText style={styles.chipText}>Year: {filters.year}</AppText>
              </View>
            ) : null}
            {filters?.studio ? (
              <View style={styles.chip}>
                <AppText style={styles.chipText}>
                  Studio: {filters.studio}
                </AppText>
              </View>
            ) : null}
            {filters?.minRating ? (
              <View style={styles.chip}>
                <AppText style={styles.chipText}>
                  Min Rating: {filters.minRating}
                </AppText>
              </View>
            ) : null}
            {filters?.genres?.map(g => (
              <View key={g} style={styles.chip}>
                <AppText style={styles.chipText}>{g}</AppText>
              </View>
            ))}
          </ScrollView>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={onClearFilters}
              style={{ padding: 6, marginRight: 8 }}
            >
              <AppText style={{ color: '#1e90ff' }}>Clear</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onApply}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: '#1e90ff',
                borderRadius: 6,
              }}
            >
              <AppText style={{ color: '#fff' }}>Apply</AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* results */}
      {debounced.length > 0 && debounced.length < 2 ? (
        <AppText style={{ color: '#fff', marginTop: 12 }}>
          Type at least 2 characters to search
        </AppText>
      ) : null}

      {loading && (!results || results.length === 0) ? (
        <ActivityIndicator style={{ marginTop: 18 }} color="#fff" />
      ) : (
        <ResultsList
          data={results}
          onPress={onPress}
          onEndReached={onLoadMore}
          loading={loading}
          hasMore={hasMore}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  container: { paddingHorizontal: 8, flex: 1 },
  modeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  modeLabel: { color: '#fff', marginRight: 8 },
  modePill: {
    backgroundColor: '#222',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
  },
  modePillActive: { backgroundColor: '#1e90ff' },
  modePillText: { color: '#fff' },
  modePillTextActive: { color: '#fff', fontWeight: '600' },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  chip: {
    backgroundColor: '#222',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  chipText: { color: '#fff' },
});

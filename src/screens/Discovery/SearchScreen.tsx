import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import CustomHeader from '../../components/CustomHeader';
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
};

export default function SearchScreen({
  query,
  setQuery,
  debounced,
  loading,
  results,
  onPress,
}: Props) {
  return (
    <View style={styles.container}>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search anime (min 2 chars)"
      />

      {debounced.length > 0 && debounced.length < 2 ? (
        <AppText style={{ color: '#fff', marginTop: 12 }}>
          Type at least 2 characters to search
        </AppText>
      ) : null}

      {loading && debounced.length >= 2 ? (
        <ActivityIndicator style={{ marginTop: 18 }} color="#fff" />
      ) : (
        <ResultsList data={results} onPress={onPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  container: { paddingHorizontal: 8, flex: 1 },
});

import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '../../components/AppText';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder = 'Search anime...' }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#888"
        style={styles.input}
        selectionColor="#9bdcff"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 ? (
        <TouchableOpacity onPress={() => onChange('')} style={styles.clear} accessibilityRole="button">
          <AppText size={14} style={styles.clearText}>✕</AppText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0d0d0d', padding: 8, borderRadius: 10 },
  input: { flex: 1, color: '#fff', padding: 8, fontSize: 16 },
  clear: { paddingHorizontal: 8 },
  clearText: { color: '#9bdcff' },
});

import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import AppText from '../../../components/AppText';
import SmartImage from '../../../components/SmartImage';

type Props = { characters?: any[] };

export default function CharactersList({ characters = [] }: Props) {
  if (!Array.isArray(characters) || characters.length === 0) return null;

  const renderItem = ({ item }: any) => {
    const char = item.character ?? item.person ?? item;
    const image = char?.images?.jpg?.image_url || char?.image_url;
    const name = char?.name ?? char?.title ?? item.name;
    const role = item.role ?? item.attributes ?? '—';
    const favorites = item.favorites ?? item.fav ?? null;
    const va = Array.isArray(item.voice_actors) && item.voice_actors.length > 0 ? item.voice_actors[0].person?.name ?? item.voice_actors[0].name : null;

    return (
      <View style={styles.card}>
        <SmartImage uri={image} style={styles.avatarLarge} />
        <View style={styles.metaCol}>
          <AppText weight="semibold" size={14} style={styles.name}>{name}</AppText>
          <AppText size={13} style={styles.sub}>{role}{favorites ? ` • ${favorites} favs` : ''}</AppText>
          {va ? <AppText size={12} style={styles.va}>VA: {va}</AppText> : null}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppText weight="semibold" size={16} style={styles.title}>Characters</AppText>
      <FlatList
        data={characters}
        keyExtractor={(it: any, idx: number) => String(it?.character?.mal_id ?? it?.person?.mal_id ?? it?.name ?? idx)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.column}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16, width: '100%' },
  title: { marginBottom: 8, color: '#fff' },
  column: { justifyContent: 'space-between', paddingHorizontal: 4 },
  card: { width: '48%', alignItems: 'flex-start', marginBottom: 12 },
  avatarLarge: { width: '100%', height: 160, borderRadius: 8, backgroundColor: '#111' },
  metaCol: { marginTop: 8, width: '100%' },
  name: { color: '#fff' },
  sub: { color: '#bbb', marginTop: 4 },
  va: { color: '#9bdcff', marginTop: 6 },
});

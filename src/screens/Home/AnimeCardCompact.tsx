import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native';
import AppText from '../../components/AppText';

type Props = {
  item: any;
  onPress?: (item: any) => void;
  style?: any;
};

export default function AnimeCardCompact({ item, onPress, style }: Props) {
  const image = item.images?.jpg?.image_url || item.image_url || item.url;
  const score = item.score ?? item.rank ?? null;
  const episodes = item.episodes ?? null;
  const infoText = item.aired?.string ?? item.status ?? item.broadcast?.string ?? (item.year ? String(item.year) : null);

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={() => onPress && onPress(item)} activeOpacity={0.8}>
      <Image source={{ uri: image }} style={styles.poster} />
      <View style={styles.info}>
        <AppText weight="semibold" size={13} style={styles.title} numberOfLines={2}>
          {item.title}
        </AppText>
        <View style={styles.metaRow}>
          {score ? <AppText size={12} style={styles.meta}>★ {String(score)}</AppText> : null}
          {episodes ? <AppText size={12} style={styles.meta}>{episodes} ep</AppText> : null}
        </View>
        {infoText ? <AppText size={12} style={styles.infoText}>Release: {infoText}</AppText> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: 'transparent',
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
    backgroundColor: '#111',
  },
  info: { marginTop: 8 },
  title: { color: '#fff' },
  metaRow: { flexDirection: 'row', marginTop: 6, justifyContent: 'flex-start' },
  meta: { color: '#ccc', marginRight: 10 },
    infoText: { color: '#aaa', marginTop: 4 },
});

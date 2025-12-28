import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AppText from '../../../components/AppText';
import SmartImage from '../../../components/SmartImage';

type Props = { anime: any };

export default function PosterHeader({ anime }: Props) {
  const image = anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url || anime?.image_url || anime?.url;

  return (
    <View style={styles.container}>
      <SmartImage uri={image} style={styles.poster} />
      <AppText weight="semibold" size={20} style={styles.title}>
        {anime?.title}
      </AppText>
      {anime?.title_english ? (
        <AppText size={13} style={styles.subtitle}>{anime.title_english}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  poster: { width: 220, height: 320, borderRadius: 8, backgroundColor: '#111' },
  title: { marginTop: 12, textAlign: 'center', color: '#fff' },
  subtitle: { color: '#ccc', marginTop: 4 },
});

import React from 'react';
import { TouchableOpacity, Image, StyleSheet, ViewStyle } from 'react-native';
import AppText from '../../components/AppText';

type Props = {
  item: any;
  onPress?: (item: any) => void;
  style?: ViewStyle;
};

export default function AnimeCard({ item, onPress, style }: Props) {
  const image = item.images?.jpg?.image_url || item.image_url || item.url;

  return (
    <TouchableOpacity style={[styles.card, style as any]} onPress={() => onPress && onPress(item)}>
      <Image source={{ uri: image }} style={styles.poster} />
      <AppText size={12} weight="medium" style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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

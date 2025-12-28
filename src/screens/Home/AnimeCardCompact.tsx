import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native';
import AppText from '../../components/AppText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleItem } from '../../store/slices/watchlistSlice';
import { showCToast } from '../../components/CToast';

type Props = {
  item: any;
  onPress?: (item: any) => void;
  style?: any;
};

export default function AnimeCardCompact({ item, onPress, style }: Props) {
  const dispatch = useDispatch();
  const isSaved = useSelector((s: RootState) =>
    s.watchlist?.items?.some((x: any) => x.mal_id === item?.mal_id),
  );
  const image = item.images?.jpg?.image_url || item.image_url || item.url;
  const score = item.score ?? item.rank ?? null;
  const episodes = item.episodes ?? null;
  const infoText =
    item.aired?.string ??
    item.status ??
    item.broadcast?.string ??
    (item.year ? String(item.year) : null);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.8}
    >
      <View>
        <Image source={{ uri: image }} style={styles.poster} />
        <TouchableOpacity
          style={styles.watchIcon}
          onPress={e => {
            e.stopPropagation && e.stopPropagation();
            const willBeSaved = !isSaved;
            dispatch(toggleItem(item));
            if (willBeSaved) {
              showCToast({
                type: 'success',
                text1: 'Added to Watchlist',
                text2: item.title,
              });
            } else {
              showCToast({
                type: 'info',
                text1: 'Removed from Watchlist',
                text2: item.title,
              });
            }
          }}
          accessibilityRole="button"
        >
          <Ionicons
            name={isSaved ? 'heart' : 'heart-outline'}
            size={18}
            color={isSaved ? '#ff6b81' : '#fff'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <AppText
          weight="semibold"
          size={13}
          style={styles.title}
          numberOfLines={2}
        >
          {item.title}
        </AppText>
        <View style={styles.metaRow}>
          {score ? (
            <AppText size={12} style={styles.meta}>
              ★ {String(score)}
            </AppText>
          ) : null}
          {episodes ? (
            <AppText size={12} style={styles.meta}>
              {episodes} ep
            </AppText>
          ) : null}
        </View>
        {infoText ? (
          <AppText size={12} style={styles.infoText}>
            Release: {infoText}
          </AppText>
        ) : null}
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
  watchIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 6,
    borderRadius: 16,
  },
  info: { marginTop: 8 },
  title: { color: '#fff' },
  metaRow: { flexDirection: 'row', marginTop: 6, justifyContent: 'flex-start' },
  meta: { color: '#ccc', marginRight: 10 },
  infoText: { color: '#aaa', marginTop: 4 },
});

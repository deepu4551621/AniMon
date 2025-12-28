import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import AppText from '../../components/AppText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleItem } from '../../store/slices/watchlistSlice';
import { showCToast } from '../../components/CToast';

type Props = {
  item: any;
  onPress?: (item: any) => void;
  style?: ViewStyle;
};

export default function AnimeCard({ item, onPress, style }: Props) {
  const dispatch = useDispatch();
  const isSaved = useSelector((s: RootState) =>
    s.watchlist?.items?.some((x: any) => x.mal_id === item?.mal_id),
  );
  const image = item.images?.jpg?.image_url || item.image_url || item.url;

  return (
    <TouchableOpacity
      style={[styles.card, style as any]}
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.posterWrap}>
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
      <AppText
        size={12}
        weight="medium"
        style={styles.cardTitle}
        numberOfLines={2}
      >
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
  posterWrap: { position: 'relative' },
  watchIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 6,
    borderRadius: 14,
  },
  cardTitle: { marginTop: 6, textAlign: 'center', color: '#fff', width: 120 },
});

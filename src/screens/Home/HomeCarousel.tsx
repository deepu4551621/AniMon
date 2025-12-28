import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import SmartImage from '../../components/SmartImage';
import AppText from '../../components/AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = Math.round(width);
const ITEM_HEIGHT = Math.round(width); // square so image fills width and height equally

type Props = {
  data: any[];
  onPressItem?: (item: any) => void;
};

export default function HomeCarousel({ data, onPressItem }: Props) {
  const paddingTop = useSafeAreaInsets().top;
  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const indexRef = useRef(0);

  // auto shuffle every 3 seconds
  useEffect(() => {
    const handle = setInterval(() => {
      if (!data || data.length === 0) return;
      const next = (indexRef.current + 1) % data.length;
      indexRef.current = next;
      setActiveIndex(next);
      try {
        listRef.current?.scrollToIndex({ index: next, animated: true });
      } catch (e) {
        // ignore
      }
    }, 6000);
    return () => clearInterval(handle);
  }, [data]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      const idx = viewableItems[0].index ?? 0;
      indexRef.current = idx;
      setActiveIndex(idx);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const renderItem = useCallback(
    ({ item }: any) => {
      const image =
        item.images?.jpg?.large_image_url ||
        item.images?.jpg?.image_url ||
        item.image_url ||
        item.url;
      return (
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.9}
          onPress={() => onPressItem && onPressItem(item)}
        >
          <SmartImage uri={image} size={ITEM_WIDTH} style={styles.smart} />
          {/* <View style={styles.overlay} /> */}
          <AppText
            weight="semibold"
            size={18}
            style={styles.title}
            numberOfLines={2}
          >
            {item.title}
          </AppText>
        </TouchableOpacity>
      );
    },
    [onPressItem],
  );

  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <View style={{ paddingTop: paddingTop > 0 ? paddingTop : 12 }}>
      <FlatList
        ref={listRef}
        data={data}
        horizontal
        pagingEnabled
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item: any, idx: number) =>
          String(item.mal_id ?? item.url ?? idx)
        }
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: { width: ITEM_WIDTH, alignItems: 'center', justifyContent: 'center' },
  smart: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12,
  },
  title: { color: '#fff', padding: 12 },
  indicatorContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 6,
  },
  dotActive: { backgroundColor: '#fff', transform: [{ scale: 1.2 }] },
});

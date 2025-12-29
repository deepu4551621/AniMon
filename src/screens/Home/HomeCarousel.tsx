import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import SmartImage from '../../components/SmartImage';
import AppText from '../../components/AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ShimmerCard from './ShimmerCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = Math.round(width);
const ITEM_HEIGHT = Math.round(width); // square so image fills width and height equally

type Props = {
  data: any[];
  onPressItem?: (item: any) => void;
  indicatorStyle?: 'modern' | 'classic';
};

export default function HomeCarousel({
  data,
  onPressItem,
  indicatorStyle = 'modern',
}: Props) {
  const paddingTop = useSafeAreaInsets().top;
  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const indexRef = useRef(0);
  // console.log('HomeCarousel render, data length:', data[0]);
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
      const rating = item.score || item.rating;
      const episodes = item.episodes || '?';
      const status = item.status || '';

      return (
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.9}
          onPress={() => onPressItem && onPressItem(item)}
        >
          <SmartImage uri={image} size={ITEM_WIDTH} style={styles.smart} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.infoGradient}
          >
            <View style={styles.infoContainer}>
              <AppText
                weight="semibold"
                size={16}
                style={styles.title}
                numberOfLines={2}
              >
                {item.title}
              </AppText>
              <View style={styles.metaRow}>
                {rating && (
                  <View style={styles.metaItem}>
                    <MaterialIcons name="star" size={14} color="#FFD700" />
                    <AppText size={12} style={styles.metaText}>
                      {rating.toFixed(1)}
                    </AppText>
                  </View>
                )}
                {episodes && (
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons
                      name="play-circle"
                      size={14}
                      color="#fff"
                    />
                    <AppText size={12} style={styles.metaText}>
                      {episodes} eps
                    </AppText>
                  </View>
                )}
                {status && (
                  <View style={styles.metaItem}>
                    <AppText size={11} style={styles.statusBadge}>
                      {status.toUpperCase()}
                    </AppText>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    },
    [onPressItem],
  );

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <View style={{ paddingTop: paddingTop > 0 ? paddingTop : 12 }}>
        <ShimmerCard cardWidth={ITEM_WIDTH} cardHeight={ITEM_WIDTH} />
      </View>
    );
  }

  return (
    <View>
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
      <View style={styles.indicatorContainer}>
        {indicatorStyle === 'modern' ? (
          <ModernIndicator activeIndex={activeIndex} total={data.length} />
        ) : (
          <ClassicIndicator activeIndex={activeIndex} total={data.length} />
        )}
      </View>
    </View>
  );
}

// Modern Indicator Component
function ModernIndicator({
  activeIndex,
  total,
}: {
  activeIndex: number;
  total: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(activeIndex, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeIndex]);

  return (
    <View style={styles.modernIndicatorContainer}>
      {Array.from({ length: total }).map((_, idx) => {
        const isActive = idx === activeIndex;
        return (
          <View
            key={idx}
            style={[styles.modernDot, isActive && styles.modernDotActive]}
          />
        );
      })}
    </View>
  );
}

// Classic Indicator Component
function ClassicIndicator({
  activeIndex,
  total,
}: {
  activeIndex: number;
  total: number;
}) {
  return (
    <View style={styles.classicIndicatorContainer}>
      <View style={styles.classicDotContainer}>
        {Array.from({ length: total }).map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.classicDot,
              idx === activeIndex && styles.classicDotActive,
            ]}
          />
        ))}
      </View>
      <AppText size={12} style={styles.pageCounter}>
        {activeIndex + 1} / {total}
      </AppText>
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
  infoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
  infoContainer: {
    paddingHorizontal: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaText: {
    color: '#fff',
  },
  statusBadge: {
    color: '#FFD700',
    fontWeight: '600',
  },
  indicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  modernIndicatorContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  modernDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  modernDotActive: {
    width: 24,
    backgroundColor: '#fff',
  },
  classicIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  classicDotContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  classicDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  classicDotActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    width: 8,
    height: 8,
  },
  pageCounter: {
    color: '#fff',
    fontWeight: '600',
  },
  placeholderContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#222',
    overflow: 'hidden',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
  },
  gradientWrapper: {
    position: 'absolute',
    left: -160,
    top: 0,
    bottom: 0,
    width: 160,
  },
  gradient: {
    flex: 1,
  },
});

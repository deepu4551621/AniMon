import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ShimmerCard({
  cardWidth = 120,
}: {
  cardWidth?: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.cubic) }),
      -1,
      false,
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [-160, width + 160]);
    return {
      transform: [{ translateX }],
      opacity: 1,
    };
  });

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <View
        style={[styles.poster, { width: cardWidth, height: cardWidth * 1.42 }]}
      />
      <View style={[styles.titlePlaceholder, { width: cardWidth * 0.83 }]} />
      <Animated.View
        style={[styles.gradientWrapper, shimmerStyle]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.14)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  poster: {
    width: 120,
    height: 170,
    borderRadius: 8,
    backgroundColor: '#222',
  },
  titlePlaceholder: {
    width: 100,
    height: 12,
    marginTop: 8,
    borderRadius: 4,
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

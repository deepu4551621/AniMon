import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const ICON_SIZE = 24;

export default function CustomBottomTab({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const current = useSharedValue(state.index);

  useEffect(() => {
    current.value = withTiming(state.index, { duration: 200 });
  }, [state.index]);

  const onLayout = (_e: LayoutChangeEvent) => {};

  return (
    <View
      onLayout={onLayout}
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const { options } = descriptors[route.key];

        // derive icon name from route
        let iconName = 'ellipse';
        if (route.name === 'Home') iconName = 'home-outline';
        else if (route.name === 'Discover') iconName = 'search-outline';
        else if (route.name === 'Watchlist') iconName = 'book-outline';
        else if (route.name === 'Profile') iconName = 'person-outline';

        const animatedStyle = useAnimatedStyle(() => {
          const scale = current.value === i ? withTiming(1.15) : withTiming(1);
          const translateY = current.value === i ? withTiming(-6) : withTiming(0);
          return {
            transform: [{ translateY }, { scale }],
          };
        });

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
         
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, { merge: true });
                }
            }}
            style={styles.tabButton}
          >
            <Animated.View style={animatedStyle}>
              <Ionicons name={iconName} size={ICON_SIZE} color={focused ? '#fff' : '#999'} />
            </Animated.View>
            <Text style={[styles.label, { color: focused ? '#fff' : '#999' }]}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#000',
    margin: 16,
    borderRadius: 28,
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    // backgroundColor:'green'
  },
  label: {
    fontSize: 11,
    // marginTop: 2,
  },
});
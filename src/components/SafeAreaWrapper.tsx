import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  backgroundColor?: string;
};

export default function SafeAreaWrapper({ children, style, backgroundColor = '#fff' }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.fill, { backgroundColor, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 0) }]}> 
    <StatusBar barStyle="light-content" />
      <View style={[styles.content, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
  },
});

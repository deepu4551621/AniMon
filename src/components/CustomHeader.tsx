import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppText from './AppText';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  title?: string;
  align?: 'left' | 'center' | 'right';
  showBack?: boolean;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
};

export default function CustomHeader({
  title,
  align = 'center',
  showBack = true,
  onBack,
  rightComponent,
  style,
  titleStyle,
}: Props) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) return onBack();
    // fallback to navigation goBack
    (navigation as any).goBack?.();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.side}>
        {showBack ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton} accessibilityRole="button">
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View
        style={[
          styles.center,
          align === 'left' && styles.alignLeft,
          align === 'right' && styles.alignRight,
        ]}
      >
        {title ? (
          <AppText weight="semibold" size={18} style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </AppText>
        ) : null}
      </View>

      <View style={styles.side}>{rightComponent ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  side: { width: 56, alignItems: 'center', justifyContent: 'center' },
  backButton: { padding: 8 },
  backText: { color: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  alignLeft: { alignItems: 'flex-start', paddingLeft: 4 },
  alignRight: { alignItems: 'flex-end', paddingRight: 4 },
  title: { color: '#fff' },
});

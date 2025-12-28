import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';

export type FontWeight = 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'black';

export interface AppTextProps extends RNTextProps {
  weight?: FontWeight;
  size?: number;
  color?: string;
}

const weightMap: Record<FontWeight, TextStyle> = {
  thin: { fontWeight: '100' as TextStyle['fontWeight'] },
  light: { fontWeight: '300' as TextStyle['fontWeight'] },
  regular: { fontWeight: '400' as TextStyle['fontWeight'] },
  medium: { fontWeight: '500' as TextStyle['fontWeight'] },
  semibold: { fontWeight: '600' as TextStyle['fontWeight'] },
  bold: { fontWeight: '700' as TextStyle['fontWeight'] },
  black: { fontWeight: '900' as TextStyle['fontWeight'] },
};

const AppText = React.forwardRef<RNText, AppTextProps>(
  ({ children, weight = 'regular', size = 14, color = '#000', style, ...rest }, ref) => {
    const textStyle: TextStyle = [styles.base, weightMap[weight], { fontSize: size, color }, style] as any;

    return (
      <RNText ref={ref} style={textStyle} allowFontScaling numberOfLines={(rest as any).numberOfLines} {...rest}>
        {children}
      </RNText>
    );
  }
);

AppText.displayName = 'AppText';

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default AppText;

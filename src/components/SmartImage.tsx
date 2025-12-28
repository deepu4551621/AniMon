import React, { useState, useEffect } from 'react';
import { View, Image, LayoutChangeEvent, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  uri: string;
  size?: number; // optional fixed size (square). If not provided, container width will determine size.
  style?: ViewStyle;
};

export default function SmartImage({ uri, size, style }: Props) {
  const [containerW, setContainerW] = useState<number | null>(size ?? null);
  const [imgDims, setImgDims] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    Image.getSize(
      uri,
      (w, h) => {
        if (!mounted) return;
        setImgDims({ w, h });
      },
      () => {
        if (!mounted) return;
        setImgDims(null);
      }
    );
    return () => {
      mounted = false;
    };
  }, [uri]);

  function onLayout(e: LayoutChangeEvent) {
    if (size) return;
    const w = e.nativeEvent.layout.width;
    setContainerW(w);
  }

  // compute scaled size so the image covers the square container
  let imgStyle: any = { position: 'absolute' };
  const cw = containerW ?? 0;
  if (imgDims && cw > 0) {
    const ch = cw; // square container
    const scale = Math.max(cw / imgDims.w, ch / imgDims.h);
    const iw = Math.round(imgDims.w * scale);
    const ih = Math.round(imgDims.h * scale);
    const left = Math.round((cw - iw) / 2);
    const top = Math.round((ch - ih) / 2);
    imgStyle = { width: iw, height: ih, left, top, position: 'absolute' };
  }

  return (
    <View
      onLayout={onLayout}
      style={[styles.container, { width: size ?? '100%', aspectRatio: 1 }, style]}
    >
      {imgDims && containerW ? (
        <Image source={{ uri }} style={imgStyle} />
      ) : (
        // fallback empty background while measuring / loading
        <View style={StyleSheet.absoluteFill} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#000',
  },
});

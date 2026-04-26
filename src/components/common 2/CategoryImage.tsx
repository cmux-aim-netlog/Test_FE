import React, { useMemo } from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';

const ICON_HEIGHT = 94;

/** 로컬 asset(require)은 비율 계산, 원격(uri)은 기본 비율 1 */
function MascotImage({ source }: { source: ImageSourcePropType }) {
  const aspectRatio = useMemo(() => {
    const isUri = typeof source === 'object' && source !== null && 'uri' in source;
    if (isUri) return 1;
    try {
      const resolved = Image.resolveAssetSource(source as number);
      if (resolved?.width && resolved?.height) return resolved.width / resolved.height;
    } catch {
      // ignore
    }
    return 1;
  }, [source]);

  return (
    <Image
      source={source}
      resizeMode="contain"
      style={[styles.mascotImage, { aspectRatio }]}
    />
  );
}

const styles = StyleSheet.create({
  mascotImage: {
    height: ICON_HEIGHT, 
  },
});

export default MascotImage;
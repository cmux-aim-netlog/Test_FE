import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';

type StudyBoardMetaItemProps = {
  icon: number;
  text: string | number;
  iconSize?: {
    width: number;
    height: number;
  };
  iconStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
};

function StudyBoardMetaItem({ icon, text, iconSize, iconStyle, textStyle }: StudyBoardMetaItemProps) {
  return (
    <View style={styles.metaItem}>
      <Image
        source={icon}
        style={[styles.metaIcon, iconSize && { width: iconSize.width, height: iconSize.height }, iconStyle]}
      />
      <Text style={[styles.metaText, textStyle]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaIcon: {
    width: 11,
    height: 12,
    tintColor: '#D9D9D9',
  },
  metaText: {
    fontSize: 13,
    color: '#B6B6B6',
    fontWeight: '500',
  },
});

export default StudyBoardMetaItem;

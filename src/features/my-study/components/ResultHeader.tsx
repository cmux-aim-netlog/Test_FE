import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

const mascotImage = require('../../../assets/character/ch_3.png');
const checkIcon = require('../../../assets/icon/check_icon_2.png');

type ResultHeaderProps = {
  imageUri?: string | null;
};

function ResultHeader({ imageUri }: ResultHeaderProps) {
  const source = imageUri ? { uri: imageUri } : mascotImage;
  return (
    <View style={styles.container}>
      <View style={styles.imageWrap}>
        <Image source={source} style={styles.mascot} resizeMode={imageUri ? 'cover' : 'contain'} />
        <View style={styles.checkWrap}>
          <Image source={checkIcon} style={styles.checkIcon} />
        </View>
      </View>
      <Text style={styles.title}>스터디 생성 완료!</Text>
      <Text style={styles.subtitle}>세부옵션은 언제든 수정할 수 있어요.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
  },
  imageWrap: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  mascot: {
    width: 110,
    height: 110,
    borderRadius: 18,
  },
  checkWrap: {
    position: 'absolute',
    right: -2,
    bottom: 4,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: 44,
    height: 44,

  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});

export default ResultHeader;

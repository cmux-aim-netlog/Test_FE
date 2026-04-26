import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

const backIcon = require('../../../assets/icon/left_arrow.png');

type PointsShopHeaderProps = {
  title: string;
  onBack?: () => void;
};

function PointsShopHeader({ title, onBack }: PointsShopHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Image source={backIcon} style={styles.backIcon} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    padding: 6,
    marginRight: 6,
  },
  backIcon: {
    width: 8,
    height: 16,
    tintColor: '#B8B8B8',
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

export default PointsShopHeader;

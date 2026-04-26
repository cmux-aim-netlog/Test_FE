import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type StudyDetailHeaderProps = {
  title: string;
  onClose: () => void;
};

const backIcon = require('../../../assets/icon/right_arrow.png');

function StudyDetailHeader({ title, onClose }: StudyDetailHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onClose} hitSlop={10} style={styles.backButton}>
        <Image source={backIcon} style={styles.backIcon} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    width: 10,
    height: 14,
    tintColor: '#9A9A9A',
    transform: [{ scaleX: -1 }],
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});

export default StudyDetailHeader;

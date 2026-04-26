import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type CreateStudyHeaderProps = {
  title: string;
  onClose: () => void;
};

const backIcon = require('../../../assets/icon/right_arrow.png');

function CreateStudyHeader({ title, onClose }: CreateStudyHeaderProps) {
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
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 8,
  },
  backIcon: {
    width: 8,
    height: 16,
    tintColor: '#B8B8B8',
    transform: [{ rotate: '180deg' }],
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});

export default CreateStudyHeader;

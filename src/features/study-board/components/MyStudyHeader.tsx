import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type MyStudyHeaderProps = {
  onClose: () => void;
};

const backIcon = require('../../../assets/icon/right_arrow.png');

function MyStudyHeader({ onClose }: MyStudyHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onClose} hitSlop={10} style={styles.backButton}>
        <Image source={backIcon} style={styles.backIcon} />
      </Pressable>
      <Text style={styles.title}>스터디 그룹</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
   
    paddingVertical: 30,
    
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
    marginLeft: 8,
    color: colors.textPrimary,
  },
});

export default MyStudyHeader;

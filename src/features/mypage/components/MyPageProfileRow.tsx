import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

const profileImage = require('../../../assets/icon/profile_1.png');

type MyPageProfileRowProps = {
  name: string;
};

function MyPageProfileRow({ name }: MyPageProfileRowProps) {
  return (
    <View style={styles.container}>
      <Image source={profileImage} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 14,
  },
  avatar: {
    width: 57,
    height: 57,
    borderRadius: 27,
    marginRight: 14,
  },
  name: {
    fontSize: 23,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

export default MyPageProfileRow;

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type NotificationHeaderProps = {
  onClose: () => void;
};

const settingIcon = require('../../../assets/icon/setting_icon.png');
const closeIcon = require('../../../assets/icon/x_icon.png');

function NotificationHeader({ onClose }: NotificationHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>알림센터</Text>
      <View style={styles.actions}>
        <Image source={settingIcon} style={styles.icon} />
        <Pressable onPress={onClose} hitSlop={10}>
          <Image source={closeIcon} style={styles.closeIcon} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: '#9A9A9A',
  },
  closeIcon: {
    width: 18,
    height: 18,
    tintColor: '#9A9A9A',
  },
});

export default NotificationHeader;

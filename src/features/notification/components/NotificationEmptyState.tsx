import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

const noAlarmIcon = require('../../../assets/icon/noalarm_icon.png');

type NotificationEmptyStateProps = {
  title: string;
  description?: string;
};

function NotificationEmptyState({ title, description }: NotificationEmptyStateProps) {
  return (
    <View style={styles.container}>
      <Image source={noAlarmIcon} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.desc}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 93,
    height: 121,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    color: '#8C8C8C',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default NotificationEmptyState;

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type PointsExchangeSummaryCardProps = {
  pointsLabel: string;
  onPressExchange?: () => void;
};

function PointsExchangeSummaryCard({
  pointsLabel,
  onPressExchange,
}: PointsExchangeSummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>내 포인트</Text>
      <Text style={styles.points}>{pointsLabel}</Text>
      <Pressable style={styles.button} onPress={onPressExchange}>
        <Text style={styles.buttonText}>환전하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    backgroundColor: '#FBFBFB',
    paddingVertical: 30,
    paddingHorizontal: 30,
    marginTop: 12,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#323232',
  },
  points: {
    fontSize: 32,
    fontWeight: '800',
    color: '#323232',
    marginTop: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
  },
});

export default PointsExchangeSummaryCard;

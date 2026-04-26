import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type PointsShopBalanceBarProps = {
  pointsLabel: string;
  onPressExchange?: () => void;
};

function PointsShopBalanceBar({ pointsLabel, onPressExchange }: PointsShopBalanceBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        {/* 수정: 내 포인트를 보여주는 부분임을 명시적으로 알 수 있게 스타일 유지 */}
        <Text style={styles.pillText}>{pointsLabel}</Text>
      </View>
      <Pressable 
        onPress={onPressExchange}
        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]} // 추가: 클릭 피드백
      >
        <Text style={styles.exchangeText}>포인트 환전하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  pill: {
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  exchangeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default PointsShopBalanceBar;
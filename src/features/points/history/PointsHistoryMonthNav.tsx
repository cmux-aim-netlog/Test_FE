import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type PointsHistoryMonthNavProps = {
  label: string;
  onPrev?: () => void;
  onNext?: () => void;
};

function PointsHistoryMonthNav({ label, onPrev, onNext }: PointsHistoryMonthNavProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPrev}
        style={({ pressed }) => [styles.arrowButton, pressed && styles.arrowButtonPressed]}
      >
        {({ pressed }) => (
          <Text style={[styles.arrowText, pressed && styles.arrowTextPressed]}>◀</Text>
        )}
      </Pressable>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={onNext}
        style={({ pressed }) => [styles.arrowButton, pressed && styles.arrowButtonPressed]}
      >
        {({ pressed }) => (
          <Text style={[styles.arrowText, pressed && styles.arrowTextPressed]}>▶</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  arrowButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  arrowButtonPressed: {
    opacity: 0.9,
  },
  arrowText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9A9A9A',
  },
  arrowTextPressed: {
    color: colors.primary,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2D2D',
  },
});

export default PointsHistoryMonthNav;

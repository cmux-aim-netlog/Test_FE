import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type MemberCounterProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
};

function MemberCounter({ value, onChange, min = 2, max = 10 }: MemberCounterProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <View style={styles.section}>
      <Text style={styles.label}>모집인원</Text>
      <View style={styles.counter}>
        <Pressable onPress={decrement} style={styles.counterButton}>
          <Text style={styles.counterText}>-</Text>
        </Pressable>
        <Text style={styles.counterValue}>{value}</Text>
        <Pressable onPress={increment} style={styles.counterButton}>
          <Text style={styles.counterText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 28,
    paddingTop: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginLeft: 'auto',
  },
  counterButton: {
    width: 20,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 20,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  counterValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

export default MemberCounter;

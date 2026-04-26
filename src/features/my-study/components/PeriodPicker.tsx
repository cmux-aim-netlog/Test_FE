import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type PeriodPickerProps = {
  startDate: string;
  endDate: string;
  onPressStart: () => void;
  onPressEnd: () => void;
};

function PeriodPicker({ startDate, endDate, onPressStart, onPressEnd }: PeriodPickerProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>기간 설정</Text>
      <View style={styles.row}>
        <Text style={styles.label}>시작일</Text>
        <Pressable style={styles.dateChip} onPress={onPressStart}>
          <Text style={styles.dateText}>{startDate}</Text>
        </Pressable>
        <Text style={styles.label}>종료일</Text>
        <Pressable style={styles.dateChip} onPress={onPressEnd}>
          <Text style={styles.dateText}>{endDate}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 28,
    paddingTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  dateChip: {
    backgroundColor: '#EFEFEF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

export default PeriodPicker;

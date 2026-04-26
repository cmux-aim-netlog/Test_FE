import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type WeekdayPickerProps = {
  value: string[];
  onChange: (next: string[]) => void;
};

const days = ['월', '화', '수', '목', '금', '토', '일'];

function WeekdayPicker({ value, onChange }: WeekdayPickerProps) {
  const toggleDay = (day: string) => {
    onChange(value.includes(day) ? value.filter((item) => item !== day) : [...value, day]);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.label}>인증요일</Text>
      <View style={styles.row}>
        {days.map((day) => {
          const isActive = value.includes(day);
          return (
            <Pressable
              key={day}
              onPress={() => toggleDay(day)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{day}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 28,
    paddingTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});

export default WeekdayPicker;

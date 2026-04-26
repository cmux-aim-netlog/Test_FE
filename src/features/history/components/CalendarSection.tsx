import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type CalendarSectionProps = {
  currentMonth: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (date: Date) => void;
};

const weekLabels = ['일', '월', '화', '수', '목', '금', '토'];
const levelColors = ['#A3FFC5', '#2FE377', '#18A04E', '#06521F'];
const DARK_LEVEL_INDEX = 3;
const CALENDAR_PADDING = 20;
const CALENDAR_GAP = 10;
const WEEK_COLUMNS = 7;
const CELL_WIDTH = 39;
const CELL_HEIGHT = 49;
const CALENDAR_WIDTH = CELL_WIDTH * WEEK_COLUMNS + CALENDAR_GAP * (WEEK_COLUMNS - 1);

const getMonthLabel = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
const isSameDay = (a: Date | null, b: Date) =>
  !!a &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

function CalendarSection({
  currentMonth,
  selectedDate,
  onSelectDate,
  onChangeMonth,
}: CalendarSectionProps) {
  const [activeArrow, setActiveArrow] = useState<'prev' | 'next' | null>(null);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const startDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const slots = [];
    for (let i = 0; i < startDay; i += 1) {
      slots.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      slots.push(new Date(year, month, day));
    }
    return slots;
  }, [currentMonth]);

  return (
    <View>
      <View style={styles.monthRow}>
        <Pressable
          onPress={() =>
            onChangeMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
            )
          }
          onPressIn={() => setActiveArrow('prev')}
          onPressOut={() => setActiveArrow(null)}
          style={styles.monthButton}
        >
          <Text style={[styles.monthArrow, activeArrow === 'prev' && styles.monthArrowActive]}>
            ◀
          </Text>
        </Pressable>
        <Text style={styles.monthText}>{getMonthLabel(currentMonth)}</Text>
        <Pressable
          onPress={() =>
            onChangeMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
            )
          }
          onPressIn={() => setActiveArrow('next')}
          onPressOut={() => setActiveArrow(null)}
          style={styles.monthButton}
        >
          <Text style={[styles.monthArrow, activeArrow === 'next' && styles.monthArrowActive]}>
            ▶
          </Text>
        </Pressable>
      </View>

      <View style={[styles.weekRow, { width: CALENDAR_WIDTH }]}>
        {weekLabels.map((day) => (
          <Text key={day} style={[styles.weekText, { width: CELL_WIDTH }]}>
            {day}
          </Text>
        ))}
      </View>

      <View style={[styles.calendarGrid, { width: CALENDAR_WIDTH }]}>
        {calendarDays.map((day, index) => {
          if (!day) {
            return (
              <View
                key={`empty-${index}`}
                style={[styles.emptyCell, { width: CELL_WIDTH, height: CELL_HEIGHT }]}
              />
            );
          }
          const isSelected = isSameDay(selectedDate, day);
          const level = (day.getDate() - 1) % 4;
          const dayColor = levelColors[level];
          const useWhiteText = level === DARK_LEVEL_INDEX || isSelected;
          return (
              <Pressable
                key={`day-${day.getDate()}`}
                onPress={() => onSelectDate(day)}
                style={[
                  styles.dayCell,
                  { width: CELL_WIDTH, height: CELL_HEIGHT },
                  { backgroundColor: dayColor },
                  isSelected ? styles.daySelected : null,
                ]}
              >
              <Text style={[styles.dayText, useWhiteText ? styles.dayTextSelected : null]}>
                {day.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  monthButton: {
    width: 32,
    alignItems: 'center',
  },
  monthText: {
    
    fontSize: 16,
    fontWeight: '700',
    color: '#373737'
  },
  monthArrow: {
    fontSize: 16,
    color: '#B7B7B7',
  },
  monthArrowActive: {
    color: colors.primary,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: CALENDAR_GAP,
    marginBottom: 12,
    alignSelf: 'center',
  },
  weekText: {
    textAlign: 'center',
    color: '#777777',
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CALENDAR_GAP,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  emptyCell: {
    backgroundColor: '#F4F4F4',
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    borderRadius: 4,
  },
  dayCell: {
    borderRadius: 4,
    backgroundColor: '#F4F4F4',
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    backgroundColor: '#ffffff',
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3C3C3C',
  },
  dayTextSelected: {
    color: '#111111',
  },
});

export default CalendarSection;

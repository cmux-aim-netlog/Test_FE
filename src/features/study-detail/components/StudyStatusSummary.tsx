import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

const profileImage = require('../../../assets/icon/profile_1.png');
const checkIcon = require('../../../assets/icon/check_icon.png');
const cancelIcon = require('../../../assets/icon/cancel_icon.png');

type StudyStatusSummaryProps = {
  methods: string[];
};

function StudyStatusSummary({ methods }: StudyStatusSummaryProps) {
  const days = ['월', '화', '수', '목', '금', '토'];
  const todayLabel = ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()];
  const normalizedMethods = methods.length > 0 ? methods : ['인증'];
  const legendMethods = normalizedMethods.slice(0, 2);
  const rows = [
    {
      name: '라즈베리 님',
      dots: [['photo'], ['todo', 'photo'], ['photo'], ['todo', 'photo'], [], []],
      status: { label: '완료', tone: 'success' as const },
    },
    {
      name: '라즈베리 님',
      dots: [['todo'], [], [], ['photo', 'todo'], ['todo'], []],
      status: { label: '완료', tone: 'success' as const },
    },
    {
      name: '라즈베리 님',
      dots: [[], [], ['todo'], [], ['photo'], []],
      status: { label: '미인증', tone: 'fail' as const },
    },
    {
      name: '라즈베리 님',
      dots: [['photo'], ['todo', 'photo'], ['photo', 'todo'], [], ['photo'], []],
      status: { label: '미인증', tone: 'fail' as const },
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.legendRow}>
        {legendMethods.map((method, index) => (
          <View key={`${method}-${index}`} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                index === 0 ? styles.primaryDot : styles.secondaryDot,
              ]}
            />
            <Text style={styles.legendText}>{method}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysHeaderRow}>
        <View style={styles.avatarSpacer} />
        <View style={styles.daysRow}>
          {days.map((day) => (
            <View key={day} style={styles.dayCell}>
              <Text style={[styles.dayLabel, day === todayLabel && styles.dayLabelActive]}>
                {day}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.statusSpacer} />
      </View>

      {rows.map((row, index) => (
        <View key={`${row.name}-${index}`} style={styles.row}>
          <View style={styles.avatarCol}>
            <Image source={profileImage} style={styles.avatar} />
            <Text style={styles.name}>{row.name}</Text>
          </View>
          <View style={styles.daysRow}>
            {days.map((day, idx) => {
              const rawDotList = row.dots[idx] ?? [];
              const dotList =
                legendMethods.length === 1
                  ? rawDotList.length > 0
                    ? ['primary']
                    : []
                  : rawDotList.map((dot) => (dot === 'todo' ? 'primary' : 'secondary'));
              return (
                <View key={`${day}-${idx}`} style={styles.dayCell}>
                  {dotList.length === 0 ? (
                    <View style={[styles.dayDot, styles.emptyDot]} />
                  ) : dotList.length === 1 ? (
                    <View
                      style={[
                        styles.dayDot,
                        dotList[0] === 'primary' && styles.primaryDot,
                        dotList[0] === 'secondary' && styles.secondaryDot,
                      ]}
                    />
                  ) : (
                    <View style={styles.dayDotStack}>
                      {dotList.map((dot, dotIndex) => (
                        <View
                          key={`${day}-${idx}-${dot}-${dotIndex}`}
                          style={[
                            styles.dayDot,
                            styles.dayDotStackItem,
                            dotIndex === 1 && styles.dayDotStackSecond,
                            dot === 'primary' && styles.primaryDot,
                            dot === 'secondary' && styles.secondaryDot,
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
          <View style={styles.statusCol}>
            <Text style={[styles.status, row.status.tone === 'fail' && styles.statusFail]}>
              {row.status.label}
            </Text>
            <Image
              source={row.status.tone === 'fail' ? cancelIcon : checkIcon}
              style={styles.statusIcon}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingBottom: 16,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  legendItem: {
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarSpacer: {
    width: 78,
  },
  statusSpacer: {
    width: 60,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  avatarCol: {
    width: 78,
    alignItems: 'flex-start',
    gap: 4,
    marginTop: -4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 21,
  },
  name: {
    fontSize: 10,
    fontWeight: '300',
    color: colors.textSecondary,
  },
  daysRow: {
    flexDirection: 'row',
    gap:10,
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dayLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  dayDot: {
    width: 17,
    height: 17,
    borderRadius: 10,
  },
  dayCell: {
    width: 28,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayDotStack: {
    width: 25,
    height: 17,
    position: 'relative',
  },
  dayDotStackItem: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  dayDotStackSecond: {
    left: 8,
  },
  primaryDot: {
    backgroundColor: colors.primary,
  },
  secondaryDot: {
    backgroundColor: '#7E72FD',
  },
  emptyDot: {
    backgroundColor: 'transparent',
  },
  statusCol: {
    marginLeft: 'auto',
    width: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  status: {
    fontSize: 12,
    color: '#7D7D7D',
    fontWeight: '600',
  },
  statusFail: {
    fontSize: 12,
    color: '#7D7D7D',
    fontWeight: '600',
    
  },
  statusIcon: {
    width: 11,
    height: 11,
  },
});

export default StudyStatusSummary;

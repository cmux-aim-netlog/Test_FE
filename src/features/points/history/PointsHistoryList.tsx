import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type PointsHistoryItem = {
  id: string;
  dateLabel: string;
  title: string;
  type: 'earn' | 'use' | 'exchange';
  amountLabel: string;
};

type PointsHistoryListProps = {
  items: PointsHistoryItem[];
};

const typeStyles = {
  earn: {
    badgeText: '적립',
    badgeColor: '#D8FFE7',
    badgeTextColor: colors.primary,
    badgeBorderColor: colors.primary,
    amountColor: colors.primary,
  },
  use: {
    badgeText: '사용',
    badgeColor: '#FFE2E2',
    badgeTextColor: '#FF7777',
    badgeBorderColor: '#FF7777',
    amountColor: '#FF7777',
  },
  exchange: {
    badgeText: '환전',
    badgeColor: '#FFE2E2',
    badgeTextColor: '#FF7B7B',
    badgeBorderColor: '#FF7B7B',
    amountColor: '#FF7B7B',
  },
} as const;

function PointsHistoryList({ items }: PointsHistoryListProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const styleSet = typeStyles[item.type];
        return (
          <View
            key={item.id}
            style={[styles.row, index < items.length - 1 && styles.rowDivider]}
          >
            <View style={styles.leftBlock}>
              <Text style={styles.dateText}>{item.dateLabel}</Text>
              <Text style={styles.titleText}>{item.title}</Text>
            </View>
            <View style={styles.rightBlock}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: styleSet.badgeColor },
                  { borderColor: styleSet.badgeBorderColor },
                ]}
              >
                <Text style={[styles.badgeText, { color: styleSet.badgeTextColor }]}>
                  {styleSet.badgeText}
                </Text>
              </View>
              <Text style={[styles.amountText, { color: styleSet.amountColor }]}>
                {item.amountLabel}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    paddingHorizontal: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  rowDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#D4D4D4',
  },
  leftBlock: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#373737',
    marginBottom: 6,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#262626',
  },
  rightBlock: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 80,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
    borderWidth: 0.5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PointsHistoryList;

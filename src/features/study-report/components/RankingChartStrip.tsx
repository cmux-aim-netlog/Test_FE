import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type RankingItem = {
  name: string;
  percent: number;
  badge: number;
  profile: number;
  tag: string;
};

type RankingChartStripProps = {
  items: RankingItem[];
};

function RankingChartStrip({ items }: RankingChartStripProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chartRow}
    >
      {items.map((item, index) => (
        <View key={`${item.name}-${index}`} style={styles.chartItem}>
          <View style={styles.chartBarWrap}>
            <View style={[styles.chartBarFill, { height: `${item.percent}%` }]} />
          </View>
          <Image source={item.profile} style={styles.profile} />
          <Text style={styles.chartName}>{item.name}</Text>
          <Text style={styles.chartScore}>
            {Number(item.percent).toFixed(1)}%
          </Text>
          <Image source={item.badge} style={styles.badge} />
          <View style={styles.badgeTag}>
            <Text style={styles.badgeTagText}>{item.tag}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chartRow: {
    gap: 35,
    alignItems: 'flex-end',
    paddingRight: 30,
  },
  chartItem: {
    alignItems: 'center',
  },
  chartBarWrap: {
    width: 30,
    height: 275,
    borderRadius: 2,
    backgroundColor: '#E6E6E6',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: -21,
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 37,
    backgroundColor: colors.primary,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 21,
    marginBottom: 6,
  },
  chartName: {
    fontSize: 14,
    fontWeight: '600',
    color: "#515151",
    marginBottom: 4,
  },
  chartScore: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 6,
  },
  badge: {
    width: 31,
    height: 39,
    marginBottom: 6,
  },
  badgeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    backgroundColor: '#F3F4F6',
  },
  badgeTagText: {
    fontSize: 10,
    color: "#565656",
  },
});

export default RankingChartStrip;

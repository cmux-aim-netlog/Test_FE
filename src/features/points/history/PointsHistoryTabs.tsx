import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type PointsHistoryTabsProps = {
  activeKey: string;
  onChange: (key: string) => void;
};

const tabs = [
  { key: 'all', label: '전체' },
  { key: 'earn', label: '적립' },
  { key: 'use', label: '사용' },
  { key: 'exchange', label: '환전' },
];

function PointsHistoryTabs({ activeKey, onChange }: PointsHistoryTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={styles.tabButton}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 25,
    paddingHorizontal: 20,
    justifyContent: 'flex-start'
  },
  tabButton: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  tabText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#515151',
  },
  tabTextActive: {
    fontWeight: '700',
    color: colors.primary,
  },
});

export default PointsHistoryTabs;

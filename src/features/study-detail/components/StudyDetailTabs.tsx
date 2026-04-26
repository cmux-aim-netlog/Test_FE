import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type TabKey = 'status' | 'report' | 'board' | 'info';

type StudyDetailTabsProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

function StudyDetailTabs({ activeTab, onChange }: StudyDetailTabsProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.tabRow}>
          {[
            { key: 'status', label: '현황' },
            { key: 'report', label: '리포트' },
            { key: 'board', label: '게시판' },
            { key: 'info', label: '상세정보' },
          ].map((tab) => (
            <Pressable key={tab.key} style={styles.tabButton} onPress={() => onChange(tab.key as TabKey)}>
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.tabLine}>
          <View
            style={[
              styles.indicator,
              activeTab === 'status' && styles.indicatorFirst,
              activeTab === 'report' && styles.indicatorSecond,
              activeTab === 'board' && styles.indicatorThird,
              activeTab === 'info' && styles.indicatorFourth,
            ]}
          />
        </View>
      </View>
      <View style={styles.bottomShadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    backgroundColor: '#FFFFFF',
  },
  bottomShadow: {
    height: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 7.4,
    elevation: 3,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 1,
    paddingBottom: 15,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B6B6B',
  },
  tabActive: {
    color: colors.primary,
  },
  tabLine: {
    height: 2,
  },
  indicator: {
    position: 'absolute',
    width: '25%',
    height: 2,
    backgroundColor: colors.primary,
  },
  indicatorFirst: {
    left: '0%',
  },
  indicatorSecond: {
    left: '25%',
  },
  indicatorThird: {
    left: '50%',
  },
  indicatorFourth: {
    left: '75%',
  },
});

export default StudyDetailTabs;

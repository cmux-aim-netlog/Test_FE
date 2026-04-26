import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type TabKey = 'notice' | 'study';

type NotificationTabsProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  studyBadgeCount?: number;
};

function NotificationTabs({ activeTab, onChange, studyBadgeCount = 0 }: NotificationTabsProps) {
  return (
    <View>
      <View style={styles.tabRow}>
        <Pressable style={styles.tabButton} onPress={() => onChange('notice')}>
          <Text style={[styles.tabText, activeTab === 'notice' && styles.tabActive]}>알림</Text>
        </Pressable>
        <Pressable style={styles.tabButton} onPress={() => onChange('study')}>
          <View style={styles.tabWithBadge}>
            <Text style={[styles.tabText, activeTab === 'study' && styles.tabActive]}>
              스터디룸
            </Text>
            {studyBadgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{studyBadgeCount}</Text>
              </View>
            )}
          </View>
        </Pressable>
      </View>
      <View style={styles.tabLine}>
        <View
          style={[
            styles.indicator,
            activeTab === 'study' ? styles.indicatorRight : styles.indicatorLeft,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B6B6B',
  },
  tabActive: {
    color: colors.primary,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  tabLine: {
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  indicator: {
    position: 'absolute',
    width: '50%',
    height: 2,
    backgroundColor: colors.primary,
  },
  indicatorLeft: {
    left: 0,
  },
  indicatorRight: {
    right: 0,
  },
});

export default NotificationTabs;

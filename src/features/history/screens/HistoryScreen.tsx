import React, { useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import HistoryFolderTab from '../components/HistoryFolderTab';
import HistoryStatsTab from '../components/HistoryStatsTab';
import { colors } from '../../../styles/colors';

const settingIcon = require('../../../assets/icon/setting_icon.png');

const getMonthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<'folder' | 'stats'>('stats');
  const [currentMonth, setCurrentMonth] = useState(getMonthStart(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>기록</Text>
          <Image source={settingIcon} style={styles.headerIcon} />
        </View>

        <View style={styles.tabRow}>
          <Pressable
            style={styles.tabButton}
            onPress={() => setActiveTab('folder')}
          >
            <Text style={[styles.tabText, activeTab === 'folder' ? styles.tabActive : null]}>
              폴더
            </Text>
          </Pressable>
          <Pressable
            style={styles.tabButton}
            onPress={() => setActiveTab('stats')}
          >
            <Text style={[styles.tabText, activeTab === 'stats' ? styles.tabActive : null]}>
              통계
            </Text>
          </Pressable>
        </View>
        <View style={styles.tabLine}>
          <View
            style={[
              styles.tabIndicator,
              activeTab === 'stats' ? styles.tabIndicatorRight : styles.tabIndicatorLeft,
            ]}
          />
        </View>

        {activeTab === 'folder' ? (
          <HistoryFolderTab />
        ) : (
          <HistoryStatsTab
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onChangeMonth={setCurrentMonth}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerIcon: {
    width: 22,
    height: 22,
    tintColor: '#9A9A9A',
  },
  tabRow: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
  },
  tabActive: {
    color: colors.primary,
  },
  tabLine: {
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    marginBottom: 18,
  },
  tabIndicator: {
    position: 'absolute',
    width: '50%',
    height: 2,
    backgroundColor: colors.primary,
  },
  tabIndicatorLeft: {
    left: 0,
  },
  tabIndicatorRight: {
    right: 0,
  },
});

export default HistoryScreen;

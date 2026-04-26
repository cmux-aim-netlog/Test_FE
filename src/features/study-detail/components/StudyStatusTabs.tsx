import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type StatusTab = 'summary' | 'todo' | 'photo' | 'github';

type StudyStatusTabsProps = {
  activeTab: StatusTab;
  onChange: (tab: StatusTab) => void;
  methods: string[];
};

const buildTabs = (methods: string[]) => {
  const normalized = methods.map((method) => method.toLowerCase());
  const hasTodo = normalized.some((method) => method.includes('todo'));
  const hasPhoto = normalized.some(
    (method) => method.includes('사진') || method.includes('photo'),
  );
  const hasGithub = normalized.some((method) => method.includes('github'));

  return [
    { key: 'summary' as const, label: '요약' },
    ...(hasTodo ? [{ key: 'todo' as const, label: 'TODO' }] : []),
    ...(hasPhoto ? [{ key: 'photo' as const, label: '사진' }] : []),
    ...(hasGithub ? [{ key: 'github' as const, label: 'GitHub' }] : []),
  ];
};

function StudyStatusTabs({ activeTab, onChange, methods }: StudyStatusTabsProps) {
  const tabs = buildTabs(methods);

  return (
    <View style={styles.row}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          style={[styles.chip, activeTab === tab.key && styles.chipActive]}
          onPress={() => onChange(tab.key as StatusTab)}
        >
          <Text style={[styles.chipText, activeTab === tab.key && styles.chipTextActive]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#373737',
  },
});

export default StudyStatusTabs;

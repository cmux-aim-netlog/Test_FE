import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import StudyStatusTabs from './StudyStatusTabs';
import StudyStatusSummary from './StudyStatusSummary';
import StudyStatusTodo from './StudyStatusTodo';
import StudyStatusPhoto from './StudyStatusPhoto';
import StudyStatusGithub from './StudyStatusGithub';

export type VerificationRule = {
  slot: number;
  methodCode: string;
  endTime?: string;
  checkEndTime?: string | null;
  daysOfWeek?: string[];
  timezone?: string;
  frequency?: { unit: string; requiredCnt: number };
};

type StudyStatusSectionProps = {
  resetKey: number;
  groupId: string;
  verificationRules: VerificationRule[];
  methods: string[];
};

function getSlotForMethod(
  rules: VerificationRule[],
  methodCode: string,
): number | null {
  const r = rules.find((x) => x.methodCode === methodCode);
  return r?.slot ?? null;
}

const getAvailableTabs = (methods: string[]) => {
  const normalized = methods.map((method) => method.toLowerCase());
  const hasTodo = normalized.some((method) => method.includes('todo'));
  const hasPhoto = normalized.some(
    (method) => method.includes('사진') || method.includes('photo'),
  );
  const hasGithub = normalized.some((method) => method.includes('github'));
  return [
    'summary',
    ...(hasTodo ? ['todo'] : []),
    ...(hasPhoto ? ['photo'] : []),
    ...(hasGithub ? ['github'] : []),
  ] as Array<'summary' | 'todo' | 'photo' | 'github'>;
};

function StudyStatusSection({
  resetKey,
  groupId,
  verificationRules,
  methods,
}: StudyStatusSectionProps) {
  const [activeTab, setActiveTab] = useState<
    'summary' | 'todo' | 'photo' | 'github'
  >('summary');
  const availableTabs = useMemo(() => getAvailableTabs(methods), [methods]);
  const slotChecklist = getSlotForMethod(verificationRules, 'CHECKLIST');
  const slotPhoto = getSlotForMethod(verificationRules, 'PHOTO');

  useEffect(() => {
    setActiveTab(availableTabs[0] ?? 'summary');
  }, [resetKey, availableTabs]);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>
          {activeTab === 'todo' ? '오늘' : '이번주'}
        </Text>
        <StudyStatusTabs activeTab={activeTab} onChange={setActiveTab} methods={methods} />
      </View>
      {activeTab === 'summary' && <StudyStatusSummary methods={methods} />}
      {activeTab === 'todo' &&
        (slotChecklist != null ? (
          <StudyStatusTodo groupId={groupId} slot={slotChecklist} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>체크리스트 인증 규칙을 불러오는 중이에요.</Text>
          </View>
        ))}
      {activeTab === 'photo' &&
        (slotPhoto != null ? (
          <StudyStatusPhoto groupId={groupId} slot={slotPhoto} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>사진 인증 규칙을 불러오는 중이에요.</Text>
          </View>
        ))}
      {activeTab === 'github' && <StudyStatusGithub />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  placeholder: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  placeholderText: {
    fontSize: 13,
    color: '#666',
  },
});

export default StudyStatusSection;

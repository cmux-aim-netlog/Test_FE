import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../../styles/colors';
import {
  fetchStudyGroupMembers,
  fetchVerificationRules,
} from '../../../api/studyGroups';
import type {
  StudyGroupMemberRes,
  VerificationRuleRes,
} from '../../../api/studyGroups';

const backIcon = require('../../../assets/icon/left_arrow.png');
const editIcon = require('../../../assets/icon/modify_icon.png');

const METHOD_LABEL: Record<string, string> = {
  PHOTO: '사진',
  CHECKLIST: 'TODO',
  GITHUB: 'GITHUB',
};

function displayName(member: StudyGroupMemberRes): string {
  if (member.nickname?.trim()) return member.nickname.trim();
  if (member.role === 'Leader') return '방장';
  const short = member.userId.replace(/-/g, '').slice(-8);
  return short ? `…${short}` : '방장';
}

type StudyDetailRulesViewProps = {
  groupId: string;
  currentUserId: string | null;
  onBack: () => void;
  onEditRule?: (groupId: string, slot: number) => void;
};

function StudyDetailRulesView({
  groupId,
  currentUserId,
  onBack,
  onEditRule,
}: StudyDetailRulesViewProps) {
  const [rules, setRules] = useState<VerificationRuleRes[]>([]);
  const [members, setMembers] = useState<StudyGroupMemberRes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rulesRes, membersRes] = await Promise.all([
        fetchVerificationRules(groupId),
        fetchStudyGroupMembers(groupId),
      ]);
      const rulesOk =
        rulesRes.data &&
        (rulesRes.data.isSuccess === true ||
          (rulesRes.data as { success?: boolean }).success === true);
      if (rulesOk && Array.isArray(rulesRes.data?.data)) {
        setRules(rulesRes.data.data);
      } else {
        setRules([]);
      }
      const membersOk =
        membersRes.data &&
        (membersRes.data.isSuccess === true ||
          (membersRes.data as { success?: boolean }).success === true);
      if (membersOk && Array.isArray(membersRes.data?.data)) {
        setMembers(membersRes.data.data);
      } else {
        setMembers([]);
      }
    } catch {
      setRules([]);
      setMembers([]);
      setError('상세 규칙을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const leader = members.find((m) => m.role === 'Leader');
  const hostName = leader ? displayName(leader) : '방장';
  const isOwner = Boolean(
    currentUserId && leader && leader.userId === currentUserId,
  );

  function renderRuleBlock(rule: VerificationRuleRes) {
    const { methodCode, endTime, checkEndTime, methodDetails } = rule;
    const details = methodDetails ?? {};
    const label = METHOD_LABEL[methodCode] ?? methodCode;

    if (methodCode === 'PHOTO') {
      const photo = details.photo ?? {};
      return (
        <View key={`slot-${rule.slot}`} style={styles.ruleBlock}>
          <Text style={styles.ruleBlockTitle}>{label} (슬롯 {rule.slot})</Text>
          <View style={styles.ruleRows}>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>마감 시각</Text>
              <Text style={styles.ruleValue}>{endTime || '-'}</Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>최소 파일 수</Text>
              <Text style={styles.ruleValue}>
                {photo.min_files != null ? photo.min_files : '-'}
              </Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>최대 파일 수</Text>
              <Text style={styles.ruleValue}>
                {photo.max_files != null ? photo.max_files : '-'}
              </Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>최대 파일 크기</Text>
              <Text style={styles.ruleValue}>
                {photo.max_size != null ? `${photo.max_size}MB` : '-'}
              </Text>
            </View>
            <View style={[styles.ruleRow, styles.ruleRowLast]}>
              <Text style={styles.ruleLabel}>허용 확장자</Text>
              <Text style={styles.ruleValue}>
                {Array.isArray(photo.allowed_extensions) && photo.allowed_extensions.length > 0
                  ? photo.allowed_extensions.join(', ')
                  : '-'}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    if (methodCode === 'CHECKLIST') {
      return (
        <View key={`slot-${rule.slot}`} style={styles.ruleBlock}>
          <Text style={styles.ruleBlockTitle}>{label} (슬롯 {rule.slot})</Text>
          <View style={styles.ruleRows}>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>작성 마감 시각</Text>
              <Text style={styles.ruleValue}>{endTime || '-'}</Text>
            </View>
            <View style={[styles.ruleRow, styles.ruleRowLast]}>
              <Text style={styles.ruleLabel}>인증 마감 시각</Text>
              <Text style={styles.ruleValue}>{checkEndTime || '-'}</Text>
            </View>
          </View>
        </View>
      );
    }

    if (methodCode === 'GITHUB') {
      const github = details.github ?? {};
      return (
        <View key={`slot-${rule.slot}`} style={styles.ruleBlock}>
          <Text style={styles.ruleBlockTitle}>{label} (슬롯 {rule.slot})</Text>
          <View style={styles.ruleRows}>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>마감 시각</Text>
              <Text style={styles.ruleValue}>{endTime || '-'}</Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleLabel}>레포 명</Text>
              <Text style={styles.ruleValue} numberOfLines={1}>
                {github.repo_url ?? '-'}
              </Text>
            </View>
            <View style={[styles.ruleRow, styles.ruleRowLast]}>
              <Text style={styles.ruleLabel}>브랜치 명</Text>
              <Text style={styles.ruleValue}>{github.branch ?? '-'}</Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View key={`slot-${rule.slot}`} style={styles.ruleBlock}>
        <Text style={styles.ruleBlockTitle}>{label} (슬롯 {rule.slot})</Text>
        <View style={styles.ruleRows}>
          <View style={[styles.ruleRow, styles.ruleRowLast]}>
            <Text style={styles.ruleLabel}>마감 시각</Text>
            <Text style={styles.ruleValue}>{endTime || '-'}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} style={styles.backButton} hitSlop={12}>
            <Image source={backIcon} style={styles.backIcon} resizeMode="contain" />
          </Pressable>
        </View>
        <View style={styles.card}>
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>상세 규칙 불러오는 중…</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backButton} hitSlop={12}>
          <Image source={backIcon} style={styles.backIcon} resizeMode="contain" />
        </Pressable>
      </View>
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <View style={styles.cardTitleLeft}>
            <Text style={styles.cardTitle}>상세 규칙</Text>
            {isOwner && onEditRule && (
              <Pressable
                style={styles.editButton}
                onPress={() => rules.length > 0 && onEditRule(groupId, rules[0].slot)}
                hitSlop={8}
              >
                <Image source={editIcon} style={styles.editIcon} resizeMode="contain" />
              </Pressable>
            )}
          </View>
          <Text style={styles.hostName} numberOfLines={1}>
            {hostName}
          </Text>
        </View>
        <Text style={styles.disclaimer}>
          규칙 위반 시 방장의 권한으로 퇴장 당할 수 있습니다.
        </Text>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : rules.length === 0 ? (
          <Text style={styles.emptyText}>등록된 인증 규칙이 없습니다.</Text>
        ) : (
          <View style={styles.ruleBlocks}>
            {rules.map(renderRuleBlock)}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    width: 22,
    height: 22,
    tintColor: colors.textSecondary,
  },
  hostName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    maxWidth: 120,
  },
  disclaimer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  loadingWrap: {
    paddingVertical: 28,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingVertical: 12,
  },
  ruleBlocks: {
    gap: 20,
  },
  ruleBlock: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  ruleBlockTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  ruleRows: {
    gap: 0,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  ruleRowLast: {
    borderBottomWidth: 0,
  },
  ruleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    width: 110,
  },
  ruleValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1,
  },
  ruleValueWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default StudyDetailRulesView;

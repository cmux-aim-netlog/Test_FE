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
import { fetchStudyGroupDetail } from '../../../api/studyGroups';
import type { StudyGroupDetailRes } from '../../../api/studyGroups';

const backIcon = require('../../../assets/icon/left_arrow.png');
const editIcon = require('../../../assets/icon/modify_icon.png');

const CATEGORY_LABEL: Record<string, string> = {
  WAKE: '기상',
  SEATED: '착석',
  COTE: '코테',
  LANG: '언어',
  CERT: '자격증',
  ETC: '기타',
};

const METHOD_LABEL: Record<string, string> = {
  PHOTO: '사진',
  CHECKLIST: 'TODO',
  GPS: '위치',
  GITHUB: 'GitHub',
};

function formatPeriod(startDate: string | null, endDate: string | null): string {
  if (!startDate) return '-';
  const fmt = (s: string) => s.replace(/-/g, '. ');
  if (!endDate) return fmt(startDate);
  return `${fmt(startDate)} - ${fmt(endDate)}`;
}

type StudySummaryInfoViewProps = {
  groupId: string;
  currentUserId: string | null;
  onBack: () => void;
  onEdit?: (groupId: string, data: StudyGroupDetailRes) => void;
  /** 변경 시 요약 데이터 다시 불러옴 (수정 완료 후 반영용) */
  refreshTrigger?: number;
};

function StudySummaryInfoView({
  groupId,
  currentUserId,
  onBack,
  onEdit,
  refreshTrigger,
}: StudySummaryInfoViewProps) {
  const [detail, setDetail] = useState<StudyGroupDetailRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchStudyGroupDetail(groupId);
      const ok =
        data &&
        (data.isSuccess === true || (data as { success?: boolean }).success === true);
      if (ok && data?.data) {
        setDetail(data.data);
      } else {
        setDetail(null);
      }
    } catch {
      setDetail(null);
      setError('스터디 정보를 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail, refreshTrigger]);

  const isOwner = Boolean(
    currentUserId && detail && detail.ownerUserId === currentUserId,
  );
  const categoryLabel = detail ? CATEGORY_LABEL[detail.category] ?? detail.category : '-';
  const methodLabels =
    detail?.verificationRules?.map((r) => METHOD_LABEL[r.methodCode] ?? r.methodCode) ?? [];
  const methodSummary = methodLabels.length > 0 ? methodLabels.join(', ') : '-';
  const periodStr = detail
    ? formatPeriod(detail.startDate, detail.endDate)
    : '-';

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
            <Text style={styles.loadingText}>스터디 정보 불러오는 중…</Text>
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
          <Text style={styles.cardTitle}>스터디 요약 정보</Text>
          {isOwner && onEdit && detail && (
            <Pressable
              style={styles.editButton}
              onPress={() => onEdit(groupId, detail)}
              hitSlop={8}
            >
              <Image source={editIcon} style={styles.editIcon} resizeMode="contain" />
            </Pressable>
          )}
        </View>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : detail ? (
          <View style={styles.rows}>
            <View style={styles.row}>
              <Text style={styles.label}>카테고리</Text>
              <Text style={styles.value}>{categoryLabel}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>인증 방식</Text>
              <Text style={styles.value}>{methodSummary}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>인원</Text>
              <Text style={styles.value}>
                {detail.currentMembers}/{detail.maxMembers}
              </Text>
            </View>
            <View style={[styles.row, styles.rowLast]}>
              <Text style={styles.label}>기간</Text>
              <Text style={styles.value}>{periodStr}</Text>
            </View>
          </View>
        ) : null}
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
  rows: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    width: 100,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
});

export default StudySummaryInfoView;

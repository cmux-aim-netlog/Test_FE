import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RankingChartStrip from './RankingChartStrip';
import RankingSummaryCard from './RankingSummaryCard';
import {
  fetchVerificationReport,
  fetchStudyGroupMembers,
  type VerificationReportRes,
  type VerificationReportMemberStat,
} from '../../../api/studyGroups';

const profileOne = require('../../../assets/icon/profile_1.png');
const profileTwo = require('../../../assets/icon/profile_2.png');
const badgeOne = require('../../../assets/badge/badge_1.png');
const badgeTwo = require('../../../assets/badge/badge_4.png');

/** 소수점 둘째 자리에서 반올림하여 소수 첫째 자리까지 */
function roundPercent(value: number): number {
  return Math.round(value * 10) / 10;
}

type StudyReportTabProps = {
  groupId: string;
};

function StudyReportTab({ groupId }: StudyReportTabProps) {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<VerificationReportRes | null>(null);
  const [nicknameMap, setNicknameMap] = useState<Record<string, string>>({});

  const loadReport = useCallback(() => {
    if (!groupId) return;
    setLoading(true);
    Promise.all([
      fetchVerificationReport(groupId),
      fetchStudyGroupMembers(groupId),
    ])
      .then(([reportRes, membersRes]) => {
        const data = reportRes.data?.data ?? null;
        setReport(data);
        const map: Record<string, string> = {};
        (membersRes.data?.data ?? []).forEach((m) => {
          map[m.userId] = m.nickname?.trim() || '회원';
        });
        setNicknameMap(map);
      })
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [groupId]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>인증 현황 불러오는 중…</Text>
        </View>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>인증 현황을 불러오지 못했습니다.</Text>
      </View>
    );
  }

  const members = report.members ?? [];
  const opportunityCount = report.opportunityCount;
  const startDate = report.startDate ?? '';
  const endDate = report.endDate ?? '';
  const periodLabel =
    startDate && endDate ? `${startDate} ~ ${endDate}` : '기간 내';

  const avgPercent =
    members.length > 0
      ? roundPercent(
          members.reduce((sum, m) => sum + m.percentage, 0) / members.length,
        )
      : 0;

  const rankingItems = members.map(
    (m: VerificationReportMemberStat, index: number) => {
      const userId = m.userId != null ? String(m.userId) : '';
      const nickname = nicknameMap[userId] ?? '회원';
      const percent = roundPercent(m.percentage);
      const profile = index % 2 === 0 ? profileOne : profileTwo;
      const badge = m.role === 'Leader' ? badgeTwo : badgeOne;
      const tag = m.role === 'Leader' ? '그룹장' : '멤버';
      return {
        name: nickname,
        percent,
        badge,
        profile,
        tag,
      };
    },
  );

  const summaryDescription =
    opportunityCount > 0
      ? `기간 내 총 인증 기회는 ${opportunityCount}회예요. 멤버별 인증률을 확인해 보세요.`
      : '아직 인증 기회가 없어요.';

  return (
    <View style={styles.container}>
      <RankingSummaryCard
        title="랭킹"
        description={summaryDescription}
        percent={avgPercent}
        points={Math.round(avgPercent)}
      />
      {rankingItems.length > 0 ? (
        <RankingChartStrip items={rankingItems} />
      ) : (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>멤버 인증 기록이 없습니다.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingBottom: 32,
  },
  loadingWrap: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 14,
    color: '#c00',
    textAlign: 'center',
    paddingVertical: 24,
  },
  emptyWrap: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
});

export default StudyReportTab;

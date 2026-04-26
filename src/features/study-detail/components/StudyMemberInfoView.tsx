import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../../styles/colors';

const backIcon = require('../../../assets/icon/left_arrow.png');
import { fetchStudyGroupMembers, kickStudyGroupMember } from '../../../api/studyGroups';
import type { StudyGroupMemberRes } from '../../../api/studyGroups';

/** 표시 이름: 닉네임 우선, 없으면 userId 끝 8자리 또는 역할 라벨 */
function displayName(member: StudyGroupMemberRes, index: number): string {
  if (member.nickname?.trim()) return member.nickname.trim();
  if (member.role === 'Leader') return '방장';
  const short = member.userId.replace(/-/g, '').slice(-8);
  return short ? `…${short}` : `멤버 ${index + 1}`;
}

type StudyMemberInfoViewProps = {
  groupId: string;
  currentUserId: string | null;
  onBack: () => void;
};

function StudyMemberInfoView({ groupId, currentUserId, onBack }: StudyMemberInfoViewProps) {
  const [members, setMembers] = useState<StudyGroupMemberRes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kickingUserId, setKickingUserId] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchStudyGroupMembers(groupId);
      const ok =
        data &&
        (data.isSuccess === true || (data as { success?: boolean }).success === true);
      if (ok && Array.isArray(data?.data)) {
        const sorted = [...data.data].sort((a, b) =>
          a.role === 'Leader' ? -1 : b.role === 'Leader' ? 1 : 0,
        );
        setMembers(sorted);
      } else {
        setMembers([]);
      }
    } catch {
      setMembers([]);
      setError('멤버 목록을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const isLeader = Boolean(
    currentUserId && members.some((m) => m.userId === currentUserId && m.role === 'Leader'),
  );

  const handleKick = (userId: string, name: string) => {
    Alert.alert('멤버 내보내기', `${name} 님을 스터디에서 내보낼까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '내보내기',
        style: 'destructive',
        onPress: async () => {
          setKickingUserId(userId);
          try {
            await kickStudyGroupMember(groupId, userId);
            setMembers((prev) => prev.filter((m) => m.userId !== userId));
          } catch {
            Alert.alert('실패', '내보내기를 처리하지 못했어요.');
          } finally {
            setKickingUserId(null);
          }
        },
      },
    ]);
  };

  const memberNumber = (idx: number) => {
    const memberIndices = members
      .map((m, i) => (m.role === 'Member' ? i : -1))
      .filter((i) => i >= 0);
    const pos = memberIndices.indexOf(idx);
    return pos >= 0 ? pos + 1 : 0;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} style={styles.backButton} hitSlop={12}>
            <Image source={backIcon} style={styles.backIcon} resizeMode="contain" />
          </Pressable>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>멤버 정보</Text>
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>멤버 목록 불러오는 중…</Text>
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
        <Text style={styles.cardTitle}>멤버 정보</Text>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.list}>
            {members.map((member, index) => {
              const name = displayName(member, index);
              const isCurrentUser = member.userId === currentUserId;
              const showKick = isLeader && !isCurrentUser && member.role !== 'Leader';
              const isKicking = kickingUserId === member.userId;
              const isLast = index === members.length - 1;

              return (
                <View
                  key={member.userId}
                  style={[styles.row, isLast && styles.rowLast]}
                >
                  <Text style={styles.roleLabel}>
                    {member.role === 'Leader' ? '방장' : `멤버 ${memberNumber(index)}`}
                  </Text>
                  <View style={styles.rightBlock}>
                    {member.role === 'Leader' && (
                      <View style={styles.crownWrap}>
                        <Text style={styles.crownIcon}>★</Text>
                      </View>
                    )}
                    <Text style={styles.nickname} numberOfLines={1}>
                      {name}
                    </Text>
                    {showKick && (
                      <Pressable
                        style={[styles.kickButton, isKicking && styles.kickButtonDisabled]}
                        onPress={() => handleKick(member.userId, name)}
                        disabled={isKicking}
                      >
                        <Text style={styles.kickButtonText}>
                          {isKicking ? '처리 중…' : '내보내기'}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
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
  list: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    minWidth: 52,
  },
  rightBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    gap: 8,
  },
  crownWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownIcon: {
    fontSize: 16,
    color: colors.primary,
  },
  nickname: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    maxWidth: 140,
  },
  kickButton: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  kickButtonDisabled: {
    opacity: 0.6,
  },
  kickButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default StudyMemberInfoView;

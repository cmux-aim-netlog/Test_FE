import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../../../styles/colors';
import {
  submitPhotoVerification,
  getVerificationDateToday,
  getPhotoVerificationRecords,
  situationFromFilePath,
  type PhotoVerificationRecordRes,
} from '../../../api/verification';
import { getCurrentUserDisplayName, getCurrentUserId } from '../../../api/client';
import { fetchStudyGroupMembers } from '../../../api/studyGroups';
import type { StudyGroupMemberRes } from '../../../api/studyGroups';

const profileImage = require('../../../assets/icon/profile_1.png');
const checkIcon = require('../../../assets/icon/check_icon.png');
const cancelIcon = require('../../../assets/icon/cancel_icon.png');
const vectorIcon = require('../../../assets/icon/sizeup_icon.png');
const closeIcon = require('../../../assets/icon/x_icon.png');

function displayName(member: StudyGroupMemberRes): string {
  if (member.nickname?.trim()) return member.nickname.trim();
  if (member.role === 'Leader') return '방장';
  const short = member.userId.replace(/-/g, '').slice(-8);
  return short ? `…${short}` : '회원';
}

/** 기록에서 상황 목록 추출 (업로드한 사진 제목 = 상황) */
function getSituations(record: PhotoVerificationRecordRes): string[] {
  if (record.titles?.length) return record.titles;
  return (record.filePaths ?? []).map(situationFromFilePath);
}

type StudyStatusPhotoProps = {
  groupId: string;
  slot: number;
};

function StudyStatusPhoto({ groupId, slot }: StudyStatusPhotoProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [members, setMembers] = useState<StudyGroupMemberRes[]>([]);
  const [records, setRecords] = useState<PhotoVerificationRecordRes[]>([]);
  const [loading, setLoading] = useState(true);

  const date = getVerificationDateToday();
  const currentUserId = getCurrentUserId();
  const myDisplayName = getCurrentUserDisplayName();

  const refresh = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetchStudyGroupMembers(groupId),
      getPhotoVerificationRecords(groupId, slot, date).catch(() => ({ data: { data: [] as PhotoVerificationRecordRes[] } })),
    ])
      .then(([membersRes, recordsRes]) => {
        const ok =
          membersRes.data &&
          ((membersRes.data as { isSuccess?: boolean }).isSuccess === true ||
            (membersRes.data as { success?: boolean }).success === true);
        setMembers(Array.isArray(membersRes.data?.data) ? membersRes.data.data : []);
        const list = (recordsRes as { data?: { data?: PhotoVerificationRecordRes[] } }).data?.data ?? [];
        setRecords(Array.isArray(list) ? list : []);
        const myRecord = list.find((r: PhotoVerificationRecordRes) => r.userId === currentUserId);
        if (myRecord) setSubmitted(true);
      })
      .catch(() => {
        setMembers([]);
        setRecords([]);
      })
      .finally(() => setLoading(false));
  }, [groupId, slot, date, currentUserId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openPreview = () => setPreviewVisible(true);
  const closePreview = () => setPreviewVisible(false);

  const handleVerify = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 10,
      },
      (res) => {
        if (res.didCancel || !res.assets?.length) return;
        const files = res.assets
          .map((a) => ({
            uri: a.uri ?? '',
            name: a.fileName ?? undefined,
            type: a.type ?? 'image/jpeg',
          }))
          .filter((f) => f.uri);
        if (files.length === 0) {
          Alert.alert('사진을 선택해 주세요.');
          return;
        }
        setSubmitting(true);
        submitPhotoVerification(groupId, slot, files, date)
          .then(() => {
            setSubmitted(true);
            if (files[0]?.uri) setPreviewUri(files[0].uri);
            refresh();
          })
          .catch((err) => {
            const msg =
              err?.response?.status === 400
                ? err?.response?.data?.message ?? '제출 시간이 지났거나 이미 제출했어요.'
                : '사진 인증 제출에 실패했어요.';
            Alert.alert('인증 실패', msg);
          })
          .finally(() => setSubmitting(false));
      },
    );
  };

  const myRecord = records.find((r) => r.userId === currentUserId);
  const isDone = submitted || Boolean(myRecord);
  const myTime = myRecord?.submittedAt
    ? new Date(myRecord.submittedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
    : isDone
      ? '제출 완료'
      : '--:--';
  const mySituations = myRecord ? getSituations(myRecord) : [];

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>불러오는 중…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 나의 사진 인증 카드 */}
        <View style={[styles.row, styles.myCard]}>
          <Image source={profileImage} style={styles.avatar} />
          <View style={styles.content}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{myDisplayName} (나)님</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.time}>{myTime}</Text>
              <View style={styles.statusWrap}>
                <Text style={[styles.statusText, !isDone && styles.statusFail]}>
                  {isDone ? '완료' : '미인증'}
                </Text>
                <Image source={isDone ? checkIcon : cancelIcon} style={styles.statusIcon} />
              </View>
            </View>
            {mySituations.length > 0 && (
              <Text style={styles.situationLabel} numberOfLines={2}>
                상황: {mySituations.join(', ')}
              </Text>
            )}
          </View>
          {!isDone ? (
            <Pressable
              style={[styles.verifyButton, submitting && styles.verifyButtonDisabled]}
              onPress={handleVerify}
              disabled={submitting}
            >
              <Text style={styles.verifyText}>
                {submitting ? '제출 중…' : '인증하기'}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.photoBox}>
              <Text style={styles.photoText}>사진</Text>
              <Pressable onPress={openPreview} hitSlop={6} style={styles.photoIconButton}>
                <Image source={vectorIcon} style={styles.photoIcon} />
              </Pressable>
            </View>
          )}
        </View>

        {/* 다른 멤버들 사진 인증 현황 (상황 = 사진 제목) */}
        {members
          .filter((m) => m.userId !== currentUserId)
          .map((member) => {
            const record = records.find((r) => r.userId === member.userId);
            const done = Boolean(record);
            const time = record?.submittedAt
              ? new Date(record.submittedAt).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
              : '--:--';
            const situations = record ? getSituations(record) : [];
            return (
              <View key={member.userId} style={styles.row}>
                <Image source={profileImage} style={styles.avatar} />
                <View style={styles.content}>
                  <Text style={styles.name}>{displayName(member)} 님</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.time}>{time}</Text>
                    <View style={styles.statusWrap}>
                      <Text style={[styles.statusText, !done && styles.statusFail]}>
                        {done ? '완료' : '미인증'}
                      </Text>
                      <Image source={done ? checkIcon : cancelIcon} style={styles.statusIcon} />
                    </View>
                  </View>
                  {situations.length > 0 && (
                    <Text style={styles.situationLabel} numberOfLines={2}>
                      상황: {situations.join(', ')}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
      </ScrollView>

      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={closePreview}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Pressable style={styles.modalClose} onPress={closePreview} hitSlop={6}>
              <Image source={closeIcon} style={styles.closeIcon} />
            </Pressable>
            <View style={styles.modalImage}>
              {previewUri ? (
                <Image
                  source={{ uri: previewUri }}
                  style={styles.modalImageImg}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.modalImageText}>사진</Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingBottom: 30,
    marginTop: 8,
  },
  loadingWrap: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  myCard: {
    backgroundColor: colors.secondary,
    marginHorizontal: -25,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 21,
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 76,
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#7D7D7D',
    fontWeight: '600',
  },
  statusIcon: {
    width: 14,
    height: 14,
  },
  statusFail: {
    color: '#7D7D7D',
  },
  situationLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusIcon: {
    width: 11,
    height: 11,
  },
  verifyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#F6F6F6',
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyText: {
    fontSize: 12,
    color: '#6F6F6F',
    fontWeight: '600',
  },
  photoBox: {
    width: 62,
    height: 62,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  photoText: {
    fontSize: 12,
    color: '#8B8B8B',
  },
  photoIconButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
  },
  photoIcon: {
    width: 8,
    height: 8,
    tintColor: '#969696',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  modalClose: {
    alignSelf: 'flex-end',
  },
  closeIcon: {
    width: 18,
    height: 18,
    tintColor: '#7D7D7D',
  },
  modalImage: {
    width: 240,
    height: 240,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    overflow: 'hidden',
  },
  modalImageImg: {
    width: '100%',
    height: '100%',
  },
  modalImageText: {
    fontSize: 14,
    color: '#8B8B8B',
  },
});

export default StudyStatusPhoto;

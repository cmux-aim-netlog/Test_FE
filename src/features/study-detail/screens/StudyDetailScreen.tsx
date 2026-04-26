import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import StudyBoardTab from '../../study-board/components/StudyBoardTab';
import StudyDetailHeader from '../components/StudyDetailHeader';
import StudyDetailTabs from '../components/StudyDetailTabs';
import StudyInfoTab from '../components/StudyInfoTab';
import StudyMemberInfoView from '../components/StudyMemberInfoView';
import StudySummaryInfoView from '../components/StudySummaryInfoView';
import StudyOverviewCard from '../components/StudyOverviewCard';
import CreateStudyGroupScreen from '../../my-study/screens/CreateStudyGroupScreen';
import type { StudyGroupDetailRes } from '../../../api/studyGroups';
import StudyReportTab from '../../study-report/components/StudyReportTab';
import StudyStatusSection from '../components/StudyStatusSection';
import { colors } from '../../../styles/colors';
import { type HomeStackParamList } from '../../../navigation/types';
import { getCurrentUserId } from '../../../api/client';
import { getMyInfo } from '../../../api/users';
import {
  deleteStudyGroup,
  fetchStudyGroupDetail,
  leaveStudyGroup,
} from '../../../api/studyGroups';

export type StudyDetail = {
  id: string;
  tag: string;
  title: string;
  members: string;
  description: string;
  schedule: string;
  count: string;
  methods: string[];
  image: ImageSourcePropType;
  statusText: string;
  statusVariant: 'success' | 'danger' | 'neutral';
  statusIcons: Array<'success' | 'danger'>;
  mascotSource: ImageSourcePropType;
  authTimes?: { method: string; time: string; deadline?: string; complete?: string }[];
  authTimeLabel?: string;
  authTime?: string;
  authTimeLabel2?: string;
  authTime2?: string;
  authDays?: string;
  period?: string;
};

type StudyDetailScreenProps = {
  study?: StudyDetail;
  onClose?: () => void;
};

function StudyDetailScreen({ study: studyProp, onClose }: StudyDetailScreenProps) {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<RouteProp<HomeStackParamList, 'StudyDetail'>>();
  const resolvedStudy = useMemo(
    () => studyProp ?? route.params?.study,
    [route.params, studyProp],
  );
  const [showWelcome, setShowWelcome] = useState(!!route.params?.showWelcome);
  const [welcomeUserName, setWelcomeUserName] = useState<string>('회원');
  const [activeTab, setActiveTab] = useState<'status' | 'report' | 'board' | 'info'>('status');
  const [statusResetKey, setStatusResetKey] = useState(0);
  const [infoSubView, setInfoSubView] = useState<'members' | 'rules' | 'info' | 'leave' | null>(null);
  const [showEditStudyModal, setShowEditStudyModal] = useState(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [editInitialData, setEditInitialData] = useState<StudyGroupDetailRes | null>(null);
  const [refreshSummaryKey, setRefreshSummaryKey] = useState(0);
  const [studyDetailForOwner, setStudyDetailForOwner] = useState<StudyGroupDetailRes | null>(null);

  const currentUserId = getCurrentUserId();
  const isOwner = Boolean(
    resolvedStudy &&
      currentUserId &&
      studyDetailForOwner &&
      studyDetailForOwner.ownerUserId === currentUserId,
  );

  React.useEffect(() => {
    if (!showWelcome) return;
    let cancelled = false;
    getMyInfo()
      .then(({ data }) => {
        if (cancelled) return;
        const user = data?.data;
        const name = user?.name?.trim() || user?.nickname?.trim();
        if (name) setWelcomeUserName(name);
      })
      .catch(() => {});
  }, [showWelcome]);

  React.useEffect(() => {
    if (!resolvedStudy?.id) return;
    let cancelled = false;
    fetchStudyGroupDetail(resolvedStudy.id)
      .then(({ data }) => {
        if (cancelled) return;
        if (data?.data) setStudyDetailForOwner(data.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [resolvedStudy?.id]);

  if (!resolvedStudy) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.fallback}>
          <View style={styles.fallbackCard}>
            <View style={styles.fallbackTitle} />
            <View style={styles.fallbackLine} />
            <View style={styles.fallbackLine} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleTabChange = (tab: 'status' | 'report' | 'board' | 'info') => {
    setActiveTab(tab);
    if (tab === 'status') {
      setStatusResetKey((prev) => prev + 1);
    }
  };

  const overviewImage =
    studyDetailForOwner?.thumbnailType === 'UPLOAD' &&
    studyDetailForOwner?.thumbnailUrl?.trim()
      ? { uri: studyDetailForOwner.thumbnailUrl.trim() }
      : resolvedStudy.image;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StudyDetailHeader title="내 스터디" onClose={onClose ?? navigation.goBack} />
        <StudyOverviewCard
          tag={resolvedStudy.tag}
          title={resolvedStudy.title}
          members={resolvedStudy.members}
          description={resolvedStudy.description}
          schedule={resolvedStudy.schedule}
          methods={resolvedStudy.methods}
          image={overviewImage}
          authTimes={resolvedStudy.authTimes}
          authDays={resolvedStudy.authDays}
          period={resolvedStudy.period}
        />
        <StudyDetailTabs activeTab={activeTab} onChange={handleTabChange} />
        <View style={styles.section}>
          {activeTab === 'status' && (
            <StudyStatusSection
              resetKey={statusResetKey}
              groupId={String(resolvedStudy.id)}
              verificationRules={studyDetailForOwner?.verificationRules ?? []}
              methods={resolvedStudy.methods}
            />
          )}
          {activeTab === 'report' && (
              <StudyReportTab groupId={String(resolvedStudy.id)} />
            )}
          {activeTab === 'board' && (
              <StudyBoardTab groupId={String(resolvedStudy.id)} studyName={resolvedStudy.title} />
            )}
          {activeTab === 'info' &&
            (infoSubView === 'members' ? (
              <StudyMemberInfoView
                groupId={resolvedStudy.id}
                currentUserId={getCurrentUserId()}
                onBack={() => setInfoSubView(null)}
              />
            ) : infoSubView === 'info' ? (
              <StudySummaryInfoView
                groupId={resolvedStudy.id}
                currentUserId={getCurrentUserId()}
                onBack={() => setInfoSubView(null)}
                refreshTrigger={refreshSummaryKey}
                onEdit={(groupId, data) => {
                  setEditGroupId(groupId);
                  setEditInitialData(data);
                  setShowEditStudyModal(true);
                }}
              />
            ) : (
              <StudyInfoTab
                isOwner={isOwner}
                onSelectRow={(id) => {
                  if (id === 'members') setInfoSubView('members');
                  if (id === 'info') setInfoSubView('info');
                  if (id === 'leave') {
                    const groupName = resolvedStudy.title || '이 스터디';
                    if (isOwner) {
                      Alert.alert(
                        '삭제하기',
                        `${groupName}을 정말로 삭제하시겠습니까?`,
                        [
                          { text: '아니오', style: 'cancel' },
                          {
                            text: '예',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                const { data } = await deleteStudyGroup(resolvedStudy.id);
                                const ok =
                                  data &&
                                  ((data as { isSuccess?: boolean }).isSuccess === true ||
                                    (data as { success?: boolean }).success === true);
                                if (ok) {
                                  if (onClose) onClose();
                                  else navigation.goBack();
                                } else {
                                  Alert.alert(
                                    '삭제 실패',
                                    (data as { message?: string })?.message ??
                                      '스터디 그룹 삭제에 실패했습니다.',
                                  );
                                }
                              } catch (err: unknown) {
                                const msg =
                                  err &&
                                  typeof err === 'object' &&
                                  'response' in err &&
                                  (err as { response?: { data?: { message?: string } } }).response
                                    ?.data?.message;
                                Alert.alert(
                                  '오류',
                                  typeof msg === 'string' ? msg : '삭제 요청을 처리하지 못했어요.',
                                );
                              }
                            },
                          },
                        ]
                      );
                    } else {
                      Alert.alert(
                        '탈퇴하기',
                        `${groupName}를 탈퇴하시겠습니까?`,
                        [
                          { text: '아니오', style: 'cancel' },
                          {
                            text: '예',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                const { data } = await leaveStudyGroup(resolvedStudy.id);
                                const ok =
                                  data &&
                                  ((data as { isSuccess?: boolean }).isSuccess === true ||
                                    (data as { success?: boolean }).success === true);
                                if (ok) {
                                  if (onClose) onClose();
                                  else navigation.goBack();
                                } else {
                                  Alert.alert(
                                    '탈퇴 실패',
                                    (data as { message?: string })?.message ??
                                      '탈퇴에 실패했습니다.',
                                  );
                                }
                              } catch (err: unknown) {
                                const msg =
                                  err &&
                                  typeof err === 'object' &&
                                  'response' in err &&
                                  (err as { response?: { data?: { message?: string } } }).response
                                    ?.data?.message;
                                Alert.alert(
                                  '오류',
                                  typeof msg === 'string' ? msg : '탈퇴 요청을 처리하지 못했어요.',
                                );
                              }
                            },
                          },
                        ]
                      );
                    }
                  }
                }}
              />
            ))}
        </View>
      </ScrollView>
      <Modal visible={showWelcome} animationType="fade" transparent>
        <View style={styles.welcomeOverlay}>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>{welcomeUserName} 회원님, 반가워요!</Text>
            <Text style={styles.welcomeSubtitle}>
              {resolvedStudy.title}에 오신 것을 환영합니다.
            </Text>
            <View style={styles.welcomeDivider} />
            <Text style={styles.welcomeBody}>
              스터디는 함께 만드는 공간입니다.{'\n'}
              무단 결석이 반복될 경우 강퇴될 수 있습니다.{'\n'}
              서로를 존중하는 태도로 참여해주세요.
            </Text>
            <Pressable style={styles.welcomeButton} onPress={() => setShowWelcome(false)}>
              <Text style={styles.welcomeButtonText}>확인했어요</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEditStudyModal}
        animationType="slide"
        onRequestClose={() => setShowEditStudyModal(false)}
      >
        <CreateStudyGroupScreen
          mode="edit"
          groupId={editGroupId ?? undefined}
          initialData={editInitialData ?? undefined}
          onClose={() => {
            setShowEditStudyModal(false);
            setEditGroupId(null);
            setEditInitialData(null);
          }}
          onComplete={() => {
            setShowEditStudyModal(false);
            setEditGroupId(null);
            setEditInitialData(null);
            setRefreshSummaryKey((k) => k + 1);
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingTop: 6,
  },
  welcomeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  welcomeCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 14,
    textAlign: 'center',
  },
  welcomeDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#EAEAEA',
    marginBottom: 14,
  },
  welcomeBody: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  welcomeButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  welcomeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fallbackCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  fallbackTitle: {
    height: 18,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
  },
  fallbackLine: {
    height: 12,
    backgroundColor: '#E6E6E6',
    borderRadius: 6,
  },
});

export default StudyDetailScreen;

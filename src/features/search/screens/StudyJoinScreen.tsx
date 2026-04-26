import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../../styles/colors';
import { type SearchStackParamList, type HomeStackParamList } from '../../../navigation/types';
import { type StudyDetail } from '../../study-detail/screens/StudyDetailScreen';
import { joinStudyGroup, fetchStudyGroupDetail } from '../../../api/studyGroups';
import AuthMethodRow from '../../../components/common/AuthMethodRow';

const backIcon = require('../../../assets/icon/left_arrow.png');
const categoryIcon = require('../../../assets/icon/category_icon.png');
const personIcon = require('../../../assets/icon/person_icon.png');
const timeIcon = require('../../../assets/icon/time_icon.png');

function StudyJoinScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();
  const route = useRoute<RouteProp<SearchStackParamList, 'StudyJoin'>>();
  const study = route.params?.study;
  const [description, setDescription] = useState(study?.description ?? '');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!study?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data: res } = await fetchStudyGroupDetail(study.id);
        const body = res as { data?: { description?: string } } | undefined;
        if (!cancelled && body?.data?.description != null) {
          setDescription(body.data.description);
        }
      } catch {
        // keep description from study or empty
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [study?.id]);

  const parseMembers = (membersStr: string): { current: number; max: number } => {
    const parts = membersStr.split('/').map((s) => parseInt(s.trim(), 10));
    const current = Number.isFinite(parts[0]) ? parts[0] : 0;
    const max = Number.isFinite(parts[1]) ? parts[1] : 0;
    return { current, max };
  };

  const handleJoinPress = async () => {
    if (!study) return;
    const { current, max } = parseMembers(study.members);
    if (max > 0 && current >= max) {
      Alert.alert('알림', '스터디 그룹이 마감되었습니다.');
      return;
    }
    setJoining(true);
    try {
      const { data: res } = await joinStudyGroup(study.id);
      const ok =
        (res as { isSuccess?: boolean; success?: boolean })?.isSuccess === true ||
        (res as { isSuccess?: boolean; success?: boolean })?.success === true;
      if (ok) {
        const detail: StudyDetail = {
          id: study.id,
          tag: study.tag,
          title: study.title,
          members: study.members,
          description: description || study.description,
          schedule: study.schedule,
          count: '-',
          methods: study.methods,
          authTimes: study.authTimes,
          authDays: study.authDays,
          period: study.period,
          image: study.image,
          statusText: '인증 미완료',
          statusVariant: 'neutral',
          statusIcons: [],
          mascotSource: study.image,
        };
        const tabNav = navigation.getParent();
        if (tabNav) {
          (tabNav as { navigate: (a: string, b: unknown) => void }).navigate('Home', {
            screen: 'StudyDetail',
            params: { study: detail, showWelcome: true },
          });
        }
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      const isAlreadyMember =
        typeof msg === 'string' &&
        (msg.includes('이미 가입') || msg.includes('이미 참여') || msg.includes('이미 소속'));
      Alert.alert(
        '알림',
        isAlreadyMember ? '이미 참여하고 있는 스터디 그룹입니다.' : (msg ?? '가입에 실패했어요. 스터디가 마감되었을 수 있어요.'),
      );
    } finally {
      setJoining(false);
    }
  };

  if (!study) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.fallback} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Image source={backIcon} style={styles.backIcon} />
          </Pressable>
        </View>

        <View style={styles.heroImageWrap}>
          <View style={styles.heroImageFrame}>
            <Image source={study.image} style={styles.heroImage} resizeMode="cover" />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ImageBackground source={categoryIcon} style={styles.tagChip} resizeMode="contain">
              <Text style={styles.tagText}>{study.tag}</Text>
            </ImageBackground>
            <View style={styles.memberRow}>
              <Image source={personIcon} style={styles.memberIcon} />
              <Text style={styles.memberText}>{study.members}</Text>
            </View>
          </View>

          <Text style={styles.title}>{study.title}</Text>
          {(description || study.description) ? (
            <Text style={styles.description}>{description || study.description}</Text>
          ) : null}
          <View style={styles.divider} />

          <View style={styles.metaBlock}>
            <View style={styles.metaRow}>
              <View style={styles.metaLabelWrap}>
                <Image source={timeIcon} style={styles.metaIcon} />
              </View>
              <Text style={styles.metaText}>{study.schedule}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>방식</Text>
              <AuthMethodRow methods={study.methods} label="" showIcon={false} />
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>기간</Text>
              <Text style={styles.metaText}>{study.period}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <Pressable
          style={[styles.joinButton, joining && styles.joinButtonDisabled]}
          onPress={handleJoinPress}
          disabled={joining}
        >
          {joining ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.joinText}>참여하기</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  backIcon: {
    width: 18,
    height: 18,
    tintColor: colors.textSecondary,
  },
  heroImageWrap: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
  heroImageFrame: {
    width: 180,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F2F2F2',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    marginHorizontal: 26,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 18,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tagChip: {
    height: 22,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberIcon: {
    width: 14,
    height: 10,
    tintColor: colors.primary,
  },
  memberText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#E9E9E9',
    marginVertical: 8,
  },
  metaBlock: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaLabelWrap: {
    width: 28,
    alignItems: 'flex-start',
  },
  metaIcon: {
    width: 14,
    height: 14,
    tintColor: colors.textSecondary,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    width: 28,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  bottom: {
    paddingHorizontal: 26,
    paddingBottom: 20,
  },
  joinButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.7,
  },
  joinText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  fallback: {
    flex: 1,
  },
});

export default StudyJoinScreen;

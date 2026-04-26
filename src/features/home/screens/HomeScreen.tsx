import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { type BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type BottomTabParamList, type HomeStackParamList } from '../../../navigation/types';
import { useNotificationCenter } from '../../../state/NotificationCenterContext';
import StudyCard from '../../study-board/components/StudyCard';
import RecommendStudyCard from '../../study-board/components/RecommendStudyCard';
import { colors } from '../../../styles/colors';
import NotificationScreen from '../../notification/screens/NotificationScreen';
import MyStudyScreen from '../../my-study/screens/MyStudyScreen';
import { type StudyDetail } from '../../study-detail/screens/StudyDetailScreen';
import { type StudyPreview } from '../../search/types';
import AdminHomeScreen from '../../admin/screen/AdminHomeScreen';
import { apiClient } from '../../../api';
import { fetchMyStudyGroups, fetchRecommendedStudyGroups } from '../../../api/studyGroups';
import { mapCardToStudyDetail } from '../../../api/studyGroupCard';
const rightIcon = require('../../../assets/icon/right_arrow.png');
const backgroundSource = require('../../../assets/image/background.png');
const emptyCardBg = require('../../../assets/image/linear_bg.png');
const brandLogoSource = require('../../../assets/checkmate_logo2.png');
const shopIconSource = require('../../../assets/icon/shop_icon.png');
const alarmIconSource = require('../../../assets/icon/alarm_icon.png');
const studyMascotOne = require('../../../assets/character/cha_1.png');
const studyMascotTwo = require('../../../assets/character/ch_2.png');
const studyMascotThree = require('../../../assets/character/ch_3.png');
const studyMascotFour = require('../../../assets/character/ch_4.png');
const emptyHeroMascot = require('../../../assets/character/ch_3.png');
const MASCOTS = [studyMascotOne, studyMascotTwo, studyMascotThree, studyMascotFour];
const { width: bgWidth, height: bgHeight } = Image.resolveAssetSource(backgroundSource);
const HEADER_HEIGHT = 40;
const HERO_TEXT_TOP = 12;

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [role, setRole] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const heroHeight = Math.round((screenWidth * bgHeight) / bgWidth) + insets.top;
  const heroContentTop = HEADER_HEIGHT + insets.top + HERO_TEXT_TOP;
  const [activePage, setActivePage] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyStudies, setShowMyStudies] = useState(false);
  const [headerWidth, setHeaderWidth] = useState(0);
  const [helpIconLayout, setHelpIconLayout] = useState({ x: 0, width: 0 });
  const [helpBubbleWidth, setHelpBubbleWidth] = useState(0);
  const [myStudies, setMyStudies] = useState<StudyDetail[]>([]);
  const [loadingMyStudies, setLoadingMyStudies] = useState(true);
  const [errorMyStudies, setErrorMyStudies] = useState<string | null>(null);
  const [recommendedStudies, setRecommendedStudies] = useState<StudyDetail[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const { notifications } = useNotificationCenter();
  
useEffect(() => {
  // ✅ apiClient 바구니(headers.common)에서 role을 꺼냅니다.
  // 직접 접근해도 되고, 만들어두신 getCurrentUserRole()을 써도 됩니다.
  const userRole = apiClient.defaults.headers.common['X-User-Role'] as string;
  
  console.log('홈에서 확인한 유저 권한:', userRole);
  
  setRole(userRole || 'USER'); // 상태에 저장
  setIsReady(true);            // 렌더링 준비 완료
}, []);

  const loadMyStudyGroups = useCallback(async () => {
    setLoadingMyStudies(true);
    setErrorMyStudies(null);
    try {
      const { data } = await fetchMyStudyGroups();
      const ok = data && ((data as { success?: boolean; isSuccess?: boolean }).success === true || data.isSuccess === true);
      if (ok && Array.isArray(data.data)) {
        const list = data.data.map((card, i) => mapCardToStudyDetail(card, i, MASCOTS));
        setMyStudies(list);
      } else {
        setMyStudies([]);
      }
    } catch (err) {
      setMyStudies([]);
      let msg = '목록을 불러오지 못했어요';
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { status?: number; data?: { message?: string } } }).response;
        if (res?.status === 401) msg = '로그인 정보가 없거나 만료됐어요. (X-User-Id 확인)';
        else if (res?.data?.message) msg = res.data.message;
      } else if (err && typeof err === 'object' && 'message' in err) {
        msg = String((err as Error).message);
      }
      setErrorMyStudies(msg);
    } finally {
      setLoadingMyStudies(false);
    }
  }, []);

  useEffect(() => {
    loadMyStudyGroups();
  }, [loadMyStudyGroups]);

  const loadRecommendedStudyGroups = useCallback(async () => {
    setLoadingRecommended(true);
    try {
      const { data } = await fetchRecommendedStudyGroups({ size: 10 });
      const ok =
        data &&
        ((data as { isSuccess?: boolean; success?: boolean }).isSuccess === true ||
          (data as { isSuccess?: boolean; success?: boolean }).success === true);
      if (ok && Array.isArray(data?.data)) {
        const list = data.data.map((card, i) =>
          mapCardToStudyDetail(card, i, MASCOTS),
        );
        setRecommendedStudies(list);
      } else {
        setRecommendedStudies([]);
      }
    } catch {
      setRecommendedStudies([]);
    } finally {
      setLoadingRecommended(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendedStudyGroups();
  }, [loadRecommendedStudyGroups]);

  const studyDetailToPreview = (study: StudyDetail): StudyPreview => ({
    id: study.id,
    tag: study.tag,
    title: study.title,
    members: study.members,
    description: study.description ?? '',
    schedule: study.schedule,
    period: study.period ?? '',
    methods: study.methods,
    authTimes: study.authTimes ?? [],
    authDays: study.authDays,
    image: study.image,
  });

  const bubbleLeft = headerWidth && helpBubbleWidth ? (headerWidth - helpBubbleWidth) / 2 : 0;
  const tailCenter = helpIconLayout.x + helpIconLayout.width / 2 - bubbleLeft;
  const tailLeft =
    helpBubbleWidth > 0
      ? Math.max(12, Math.min(helpBubbleWidth - 12, tailCenter + 15)) - 6
      : 0;

  useEffect(() => {
    const parent = navigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
    if (!parent) {
      return;
    }
    const unsubscribe = parent.addListener('tabPress', () => {
      setShowHelp(false);
      setShowNotifications(false);
      setShowMyStudies(false);
    });

    return unsubscribe;
  }, [navigation]);

  const studyPages = useMemo(() => {
    const pages: StudyDetail[][] = [];
    for (let i = 0; i < myStudies.length; i += 2) {
      pages.push(myStudies.slice(i, i + 2));
    }
    return pages;
  }, [myStudies]);
  const hasStudies = myStudies.length > 0;
  const heroHeightEmpty = heroHeight;
  const activeHeroHeight = hasStudies ? heroHeight : heroHeightEmpty;

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  if (role === 'ADMIN') {
    return <AdminHomeScreen />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <View
        style={[
          styles.headerOverlay,
          { height: HEADER_HEIGHT + insets.top, paddingTop: insets.top },
        ]}
      >
        <Image source={brandLogoSource} style={styles.brand} resizeMode="contain" />
          <View style={styles.iconRow}>
            <View style={styles.iconWrapper}>
              <Image
                source={shopIconSource}
                style={{ width: 30, height: 28 }}
              />
            </View>
            <Pressable style={styles.iconWrapper} onPress={() => setShowNotifications(true)}>
              <Image
                source={alarmIconSource}
                style={{ width: 22.28, height: 28 }}
              />
              {notifications.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notifications.length}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroWrap}>
          <ImageBackground
            source={backgroundSource}
            resizeMode="cover"
            style={[
              styles.heroBackground,
              {
                height: activeHeroHeight,
                marginTop: -insets.top -35,
              },
            ]}
          />
          <View
            style={[
              styles.heroContent,
              { paddingTop: heroContentTop },
            ]}
          >
            <View style={styles.heroTextBlock}>
              {loadingMyStudies ? (
                <>
                  <Text style={styles.heroLine}>승연 메이트님</Text>
                  <Text style={styles.heroLine}>스터디를 불러오는 중…</Text>
                </>
              ) : hasStudies ? (
                <>
                  <Text style={styles.heroLine}>승연 메이트님</Text>
                  <Text style={styles.heroLine}>오늘은 스터디 {myStudies.length}개가 있어요!</Text>
                </>
              ) : (
                <>
                  <Text style={styles.heroLine}>승연 메이트님 반가워요!</Text>
                  <Text style={styles.heroLine}>참여중인 스터디가 없네요.</Text>
                </>
              )}
            </View>

            {!loadingMyStudies && hasStudies ? (
              <Pressable style={styles.heroCtaRow} onPress={() => setShowMyStudies(true)}>
                <Text style={styles.heroCta}>스터디 전체 보기</Text>
                <Image source={rightIcon} style={styles.heroCtaIcon} />
              </Pressable>
            ) : null}

            {errorMyStudies ? (
              <Text style={styles.heroError} numberOfLines={2}>{errorMyStudies}</Text>
            ) : null}

            {!hasStudies && !loadingMyStudies ? (
              <>
                <View style={styles.emptyDots}>
                  {[0, 1, 2].map((dotIndex) => (
                    <View key={`empty-dot-${dotIndex}`} style={styles.emptyDot} />
                  ))}
                </View>
                <Image source={emptyHeroMascot} style={styles.heroMascot} resizeMode="contain" />
              </>
            ) : null}
          </View>
        </View>

        {loadingMyStudies ? (
          <View style={styles.heroCardsWrap}>
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          </View>
        ) : hasStudies ? (
          <>
            <View style={styles.heroCardsWrap}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const nextPage = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                  setActivePage(nextPage);
                }}
              >
                {studyPages.map((page, pageIndex) => (
                  <View key={`study-page-${pageIndex}`} style={[styles.page, { width: screenWidth }]}>
                    {page.map((card, cardIndex) => (
                      <StudyCard
                        key={`${card.title}-${cardIndex}`}
                        tag={card.tag}
                        title={card.title}
                        schedule={card.schedule}
                        members={card.members}
                        statusText={card.statusText}
                        statusVariant={card.statusVariant}
                        statusIcons={card.statusIcons}
                        methods={card.methods}
                        authTimes={card.authTimes}
                        authDays={card.authDays}
                        mascotSource={card.mascotSource}
                        onPress={() => {
                          navigation.navigate('StudyDetail', { study: card });
                        }}
                      />
                    ))}
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.dots}>
              {studyPages.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  style={[styles.dot, index === activePage ? styles.dotActive : null]}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyStudyWrap}>
            <Pressable
              onPress={() => {
                const parent = navigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
                parent?.navigate('Search', { screen: 'SearchMain', params: { fromHomeEmptyCard: true } });
              }}
            >
              <ImageBackground
                source={emptyCardBg}
                style={styles.emptyStudyCard}
                imageStyle={styles.emptyStudyCardImage}
              >
                <View style={styles.emptyPlusButton}>
                  <Text style={styles.emptyPlusText}>+</Text>
                </View>
                <Text style={styles.emptyStudyText}>
                  나만의 스터디를 만들거나 참여해보세요!
                </Text>
              </ImageBackground>
            </Pressable>
          </View>
        )}

        <View style={styles.section}>
          <View
            style={styles.sectionHeaderWrap}
            onLayout={(event) => setHeaderWidth(event.nativeEvent.layout.width)}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>이런 스터디는 어때요?</Text>
              {/* <Image source={require('../../../assets/icon/help_icon.png')} style={{ width: 14, height: 14 }} /> */}
              <View
                style={styles.helpWrap}
                onLayout={(event) => setHelpIconLayout(event.nativeEvent.layout)}
              >
                <Pressable onPress={() => setShowHelp(true)} hitSlop={10}>
                  <Image
                    source={require('../../../assets/icon/help_icon.png')}
                    style={{ width: 14, height: 14 }}
                  />
                </Pressable>
              </View>
            </View>

            {showHelp && (
              <View style={styles.helpBubbleContainer}>
                <View
                  style={styles.helpBubble}
                  onLayout={(event) => setHelpBubbleWidth(event.nativeEvent.layout.width)}
                >
                  <Text style={styles.helpBubbleText} numberOfLines={1}>
                    승연님의 관심사를 토대로 스터디 리스트를 짜봤어요!
                  </Text>

                  <Pressable onPress={() => setShowHelp(false)} hitSlop={10}>
                    <Text style={styles.helpBubbleClose}>×</Text>
                  </Pressable>

                  <View style={[styles.helpBubbleTail, { left: tailLeft }]} />
                </View>
              </View>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendRow}
          >
            {loadingRecommended ? (
              <View style={styles.recommendLoadingWrap}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.recommendLoadingText}>추천 스터디 불러오는 중...</Text>
              </View>
            ) : recommendedStudies.length === 0 ? (
              <View style={styles.recommendEmptyWrap}>
                <Text style={styles.recommendEmptyText}>
                  로그인하면 나에게 맞는 추천 스터디를 볼 수 있어요
                </Text>
              </View>
            ) : (
              recommendedStudies.map((study) => (
                <RecommendStudyCard
                  key={study.id}
                  tag={study.tag}
                  members={study.members}
                  title={study.title}
                  time={study.schedule}
                  method={study.methods.join(', ')}
                  authTimes={study.authTimes}
                  onPress={() => {
                    const parent = navigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
                    if (parent) {
                      parent.navigate('Search', {
                        screen: 'StudyJoin',
                        params: { study: studyDetailToPreview(study) },
                      });
                    } else {
                      navigation.navigate('StudyDetail', { study });
                    }
                  }}
                />
              ))
            )}
          </ScrollView>
        </View>

        <View style={styles.ad}>
          <Text style={styles.adText}>광고</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showNotifications}
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <NotificationScreen onClose={() => setShowNotifications(false)} />
      </Modal>

      <Modal
        visible={showMyStudies}
        animationType="slide"
        onRequestClose={() => setShowMyStudies(false)}
      >
        <MyStudyScreen
          onClose={() => {
            setShowMyStudies(false);
            loadMyStudyGroups();
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
    backgroundColor: colors.background,
  },
  headerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
  },
  heroWrap: {
    position: 'relative',
  },
  heroBackground: {
    width: '100%',
  },
  heroContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  brand: {
    width: 142,
    height: 28,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconWrapper: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  heroTextBlock: {
    paddingHorizontal:10,
    marginBottom: 50,
    marginTop: -50,
  },
  heroMascot: {
    position: 'absolute',
    right: 12,
    bottom: -90,
    width: 145,
    height: 165,
    zIndex: 1,
  },
  heroLine: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 40,
  },
  
  heroCta: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    
  },
  heroCtaRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroCtaIcon: {
    width: 6,
    height: 15,
    tintColor: '#FFFFFF',
  },
  heroCardsWrap: {
    marginTop: -400,
    paddingHorizontal: 0,
  },
  loadingWrap: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroError: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  emptyStudyWrap: {
    marginTop: -330,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  emptyStudyCard: {
    borderRadius: 12,
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  emptyStudyCardImage: {
    
    borderRadius: 12,
  },
  emptyPlusButton: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPlusText: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 28,
  },
  emptyStudyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    left: 40,
    right: 0,
    bottom: 15,
    justifyContent: 'center',
  },
  emptyDot: {
    width: 4,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#2F2F2F',
  },
  page: {
    paddingHorizontal: 16,
    gap: 12,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7D7D7D',
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.primary,
  },
  section: {
    marginTop: 16,
    paddingTop: 18,
    paddingBottom: 20,
    backgroundColor: colors.secondary,
  },
  sectionHeaderWrap: {
    paddingHorizontal: 16,
    marginBottom: 12,
    position: 'relative',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionInfo: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  recommendRow: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 7,
  },
  recommendLoadingWrap: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 10,
  },
  recommendLoadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recommendEmptyWrap: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  recommendEmptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  ad: {
    marginTop: 16,
    backgroundColor: '#D9D9D9',
    paddingVertical: 20,
    alignItems: 'center',
  },
  adText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  helpWrap: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpBubbleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -44,
    alignItems: 'center',
    zIndex: 50,
  },
  helpBubble: {
    backgroundColor: '#2FE377',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    maxWidth: 320,
  },
  helpBubbleText: {
    color: '#373737',
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 0,
  },
  helpBubbleClose: {
    color: '#373737',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 16,
  },
  helpBubbleTail: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
  },
  studyDetailOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 20,
  },
});

export default HomeScreen;

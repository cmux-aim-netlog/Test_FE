import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { colors } from '../../../styles/colors';

const lampMascotSource = require('../../../assets/character/ch_6.png');
const studyCreateMascotSource = require('../../../assets/character/ch_2.png');
const badgeMascotSource = require('../../../assets/character/ch_3.png');
const rewardMascotSource = require('../../../assets/character/ch_4.png');

const ONBOARDING_PAGES = [
  {
    title: '혼자서는\n자꾸 흐트러지나요?',
    subtitle: '같이 하면 끝까지 가요',
    body: '작심삼일이 반복되는 공부,\n이제는 혼자 버티지 않아도 돼요.\n\n같은 목표를 가진 사람들과 서로 인증하며\n끝까지 가보세요.',
    mascotSource: lampMascotSource,
  },
  {
    title: '스터디 만들고,\n바로 시작',
    subtitle: '모집부터 인증까지 한 번에',
    body: '복잡한 모집 과정 말고,\n간편하게 스터디를 만들거나 참여해보세요.',
    mascotSource: studyCreateMascotSource,
  },
  {
    title: '인증이 있어야,\n진짜 스터디',
    subtitle: '꾸준함이 실력이 되는 순간,\n우리는 그 과정을 함께해요.',
    body: '',
    mascotSource: badgeMascotSource,
  },
  {
    title: '꾸준함엔,\n보상이 따라옵니다',
    subtitle: '하루 인증 한 번,\n포인트가 차곡차곡 쌓여요.',
    body: '공부도 하고, 보상도 챙기는 스터디',
    mascotSource: rewardMascotSource,
  },
  {
    title: '스터디 하고싶은\n관심 주제',
    subtitle: '선택한 주제로 스터디를 추천해드릴게요.',
    body: '관심 주제는 나중에 다시 수정할 수 있어요.',
    chips: ['토익', '코딩 테스트', '자격증', '언어', '기상', '착석', '기타'],
  },
] as const;

type OnboardingPage = (typeof ONBOARDING_PAGES)[number];

type OnboardingScreenProps = {
  onComplete: () => void;
};

const renderIllustration = (page: OnboardingPage) => {
  if ('chips' in page) {
    const firstRow = page.chips.slice(0, 3);
    const secondRow = page.chips.slice(3);

    return (
      <View style={styles.chipStage}>
        <View style={styles.chipWrap}>
          <View style={styles.chipRow}>
            {firstRow.map((chip) => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chipRow}>
            {secondRow.map((chip) => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.illustrationWrap}>
      <Image source={page.mascotSource} style={styles.mascot} resizeMode="contain" />
    </View>
  );
};

function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const scrollRef = useRef<ScrollView | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const { width } = Dimensions.get('window');
  const isLastPage = pageIndex === ONBOARDING_PAGES.length - 1;

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setPageIndex(nextIndex);
  };

  const handleNext = () => {
    if (isLastPage) {
      onComplete();
      return;
    }

    const nextIndex = pageIndex + 1;
    scrollRef.current?.scrollTo({ x: width * nextIndex, animated: true });
    setPageIndex(nextIndex);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <ScrollView
          ref={scrollRef}
          style={styles.pager}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {ONBOARDING_PAGES.map((page) => {
            if ('chips' in page) {
              return (
                <View key={page.title} style={[styles.page, styles.lastPage, { width }]}>
                  <View style={styles.lastPageContent}>
                    <View style={styles.textBlock}>
                      <Text style={styles.title}>{page.title}</Text>
                      <Text style={styles.lastPageSubtitle}>{page.subtitle}</Text>
                    </View>
                    {renderIllustration(page)}
                  </View>
                </View>
              );
            }

            return (
              <View key={page.title} style={[styles.page, { width }]}>
                <View style={styles.textBlock}>
                  <Text style={styles.title}>{page.title}</Text>
                  <Text style={styles.subtitle}>{page.subtitle}</Text>
                  {page.body ? <Text style={styles.body}>{page.body}</Text> : null}
                </View>

                {renderIllustration(page)}
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {ONBOARDING_PAGES.map((_, index) => (
              <View
                key={`dot-${index}`}
                style={[styles.dot, index === pageIndex ? styles.dotActive : null]}
              />
            ))}
          </View>

          <View style={styles.footerNoteSlot}>
            <Text style={[styles.footerNote, !isLastPage ? styles.footerNoteHidden : null]}>
              관심 주제는 나중에 다시 수정할 수 있어요.
            </Text>
          </View>

          <Pressable style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>다음</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  root: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 24,
  },
  lastPage: {
    justifyContent: 'flex-start',
  },
  lastPageContent: {
    gap: 32,
  },
  textBlock: {
    marginTop: 20,
    paddingLeft: 10,
    gap: 28,
  },
  title: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  lastPageSubtitle: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '500',
    color: '#4D4D4D',
  },
  body: {
    fontSize: 16,
    lineHeight: 30,
    color: '#8B8B8B',
  },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 220,
  },
  mascot: {
    marginLeft: 140,
    width: 150,
    height: 150,
  },
  footer: {
    gap: 28,
    paddingHorizontal: 24,
    paddingBottom: 18,
  },
  chipStage: {
    minHeight: 220,
    justifyContent: 'flex-start',
  },
  chipWrap: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 14,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#8C8C8C',
  },
  dotActive: {
    width: 16,
    backgroundColor: colors.primary,
  },
  chip: {
    minWidth: 72,
    height: 32,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#727272',
  },
  footerNote: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: '#9B9B9B',
  },
  footerNoteSlot: {
    minHeight: 22,
    justifyContent: 'center',
  },
  footerNoteHidden: {
    opacity: 0,
  },
  button: {
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default OnboardingScreen;

import React, { useCallback, useEffect, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import MyStudyHeader from '../../study-board/components/MyStudyHeader';
import MyStudyItem from '../../study-board/components/MyStudyItem';
import { colors } from '../../../styles/colors';
import CreateStudyGroupScreen from '../../my-study/screens/CreateStudyGroupScreen';
import {
  categoryOptions,
  methodOptions,
  CATEGORY_TO_CODE,
  METHOD_TO_CODE,
  mapCardToStudyItem,
} from '../../../api/studyGroupCard';
import { fetchStudyGroupsList } from '../../../api/studyGroups';
import type { StudyGroupCardRes } from '../../../api/studyGroupCard';
import { type SearchStackParamList } from '../../../navigation/types';
import { type StudyPreview } from '../types';

const mascotOne = require('../../../assets/character/cha_1.png');
const mascotTwo = require('../../../assets/character/ch_2.png');
const mascotThree = require('../../../assets/character/ch_3.png');
const mascotFour = require('../../../assets/character/ch_4.png');
const MASCOTS = [mascotOne, mascotTwo, mascotThree, mascotFour];

const PAGE_SIZE = 5;

type StudyItem = {
  id: string;
  image: ImageSourcePropType;
  tag: string;
  title: string;
  members: string;
  time: string;
  methods: string[];
  description: string;
  period: string;
  authTimes: { method: string; time: string; deadline?: string; complete?: string }[];
  authDays: string;
};

type SearchTabScreenProps = {
  onClose: () => void;
};

function SearchTabScreen({ onClose }: SearchTabScreenProps) {
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();
  const [showCreateStudy, setShowCreateStudy] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [data, setData] = useState<StudyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const loadPage = useCallback(
    async (pageNum: number) => {
      const categoryCode = selectedCategory ? CATEGORY_TO_CODE[selectedCategory] : undefined;
      const methodCodes =
        selectedMethods.length > 0
          ? selectedMethods.map((m) => METHOD_TO_CODE[m]).filter(Boolean)
          : undefined;
      setLoading(true);
      setError(null);
      try {
        const { data: res } = await fetchStudyGroupsList({
          category: categoryCode,
          verificationMethod: methodCodes?.length ? methodCodes : undefined,
          keyword: searchSubmitted.trim() || undefined,
          page: pageNum,
          size: PAGE_SIZE,
          sort: 'createdAt,desc',
        });
        const success =
          (res as { isSuccess?: boolean; success?: boolean }).isSuccess === true ||
          (res as { isSuccess?: boolean; success?: boolean }).success === true;
        const ok =
          success &&
          res?.data != null &&
          Array.isArray((res.data as { content?: unknown }).content);
        if (!ok || !res?.data?.content) {
          setData([]);
          setLast(true);
          setTotalPages(0);
          return;
        }
        const pageData = res.data;
        const list = (pageData.content as StudyGroupCardRes[]).map((card, i) =>
          mapCardToStudyItem(card, (pageNum * PAGE_SIZE + i) % MASCOTS.length, MASCOTS),
        ) as StudyItem[];
        setData(list);
        setLast(pageData.last ?? true);
        setTotalPages((pageData as { totalPages?: number }).totalPages ?? 0);
      } catch {
        setError('목록을 불러오지 못했어요.');
        setData([]);
        setLast(true);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [searchSubmitted, selectedCategory, selectedMethods],
  );

  useEffect(() => {
    setPage(0);
    loadPage(0);
  }, [loadPage]);

  const goPrevPage = useCallback(() => {
    if (loading || page <= 0) return;
    const prevPage = page - 1;
    setPage(prevPage);
    loadPage(prevPage);
  }, [loading, page, loadPage]);

  const goNextPage = useCallback(() => {
    if (loading || last) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage);
  }, [loading, last, page, loadPage]);

  const handleCategoryPress = (value: string) => {
    setSelectedCategory((prev) => (prev === value ? null : value));
  };

  const handleMethodPress = (value: string) => {
    setSelectedMethods((prev) => {
      if (prev.includes(value)) return prev.filter((m) => m !== value);
      if (prev.length >= 2) return prev;
      return [...prev, value];
    });
  };

  const handlePressStudy = (item: StudyItem) => {
    const hasJoinRoute = navigation.getState().routeNames.includes('StudyJoin');
    if (!hasJoinRoute) return;
    const payload: StudyPreview = {
      id: item.id,
      tag: item.tag,
      title: item.title,
      members: item.members,
      description: item.description,
      schedule: item.time,
      period: item.period,
      methods: item.methods,
      authTimes: item.authTimes,
      image: item.image,
    };
    navigation.navigate('StudyJoin', { study: payload });
  };

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.createSection}>
        <Pressable style={styles.createButton} onPress={() => setShowCreateStudy(true)}>
          <Text style={styles.createText}>스터디 만들기</Text>
          <Text style={styles.createPlusText}>+</Text>
        </Pressable>
      </View>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색"
          placeholderTextColor="#B0B0B0"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={() => setSearchSubmitted(keyword)}
          returnKeyType="search"
        />
      </View>
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>카테고리</Text>
        <View style={styles.filterChipRow}>
          {categoryOptions.map((opt) => {
            const isActive = selectedCategory === opt;
            return (
              <Pressable
                key={opt}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => handleCategoryPress(opt)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.filterSectionTitle, styles.filterSectionTitleSecond]}>
          인증 방식
        </Text>
        <View style={styles.filterChipRow}>
          {methodOptions.map((opt) => {
            const isActive = selectedMethods.includes(opt);
            return (
              <Pressable
                key={opt}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => handleMethodPress(opt)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.root}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <MyStudyHeader onClose={onClose} />
              {listHeader}
            </>
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <MyStudyItem
              image={item.image}
              tag={item.tag}
              title={item.title}
              members={item.members}
              time={item.time}
              methods={item.methods}
              authTimes={item.authTimes}
              authDays={item.authDays}
              onPress={() => handlePressStudy(item)}
            />
          )}
          ListEmptyComponent={
            loading && data.length === 0 ? (
              <View style={styles.emptyWrap}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>스터디 그룹을 불러오는 중…</Text>
              </View>
            ) : error ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>조건에 맞는 스터디가 없어요</Text>
              </View>
            )
          }
        />
        <View style={styles.paginationBar}>
          <Pressable
            style={[styles.paginationButton, (page <= 0 || loading) && styles.paginationButtonDisabled]}
            onPress={goPrevPage}
            disabled={page <= 0 || loading}
          >
            <Text style={[styles.paginationButtonText, (page <= 0 || loading) && styles.paginationButtonTextDisabled]}>
              이전
            </Text>
          </Pressable>
          <Text style={styles.paginationPageText}>
            {totalPages > 0 ? page + 1 : 1} / {totalPages || 1}
          </Text>
          <Pressable
            style={[styles.paginationButton, (last || loading) && styles.paginationButtonDisabled]}
            onPress={goNextPage}
            disabled={last || loading}
          >
            <Text style={[styles.paginationButtonText, (last || loading) && styles.paginationButtonTextDisabled]}>
              다음
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
      <Modal
        visible={showCreateStudy}
        animationType="slide"
        onRequestClose={() => setShowCreateStudy(false)}
      >
        <CreateStudyGroupScreen
          onClose={() => {
            setShowCreateStudy(false);
            onClose();
          }}
          onComplete={() => {
            setShowCreateStudy(false);
            setTimeout(() => onClose(), 300);
          }}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  root: { flex: 1, backgroundColor: colors.background },
  headerBlock: { paddingHorizontal: 20 },
  createSection: { paddingBottom: 14 },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  createPlusText: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', lineHeight: 22 },
  searchRow: { marginBottom: 14 },
  searchInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  filterSection: { marginBottom: 10 },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  filterSectionTitleSecond: { marginTop: 4 },
  filterChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: '#E9FDF1',
  },
  filterChipText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  filterChipTextActive: { color: colors.textPrimary },
  divider: { height: 1, backgroundColor: '#E8E8E8', marginBottom: 6 },
  listContent: { paddingBottom: 16 },
  loadingText: { marginTop: 12, fontSize: 14, color: colors.textSecondary },
  emptyWrap: { paddingVertical: 24, alignItems: 'center' },
  errorText: { fontSize: 13, color: colors.textSecondary },
  emptyText: { fontSize: 13, color: colors.textSecondary },
  paginationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 24,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: colors.background,
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    minWidth: 64,
    alignItems: 'center',
  },
  paginationButtonDisabled: {
    backgroundColor: '#D0D0D0',
  },
  paginationButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  paginationButtonTextDisabled: {
    color: '#888888',
  },
  paginationPageText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 48,
    textAlign: 'center',
  },
});

export default SearchTabScreen;

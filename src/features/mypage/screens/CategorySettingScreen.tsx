import React, { useState, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { colors } from '../../../styles/colors';
import { getFavoriteCategories, updateFavoriteCategories } from '../../../api/users';
import RecommendStudyCard from '../../study-board/components/RecommendStudyCard';
import {
  getStudyGroups,
  formatCategory,
  formatMembers,
  formatPrimaryAuthTime,
  formatMethods,
  formatAuthTimes,
} from '../../../mocks/studyGroups';

const ALL_CATEGORIES = [
  { id: 'LANG', name: '언어' },
  { id: 'COTE', name: '코테' },
  { id: 'CERT', name: '자격증' },
  { id: 'WAKE', name: '기상' },
  { id: 'SEATED', name: '공부' },
  { id: 'ETC', name: '기타' },
];

function CategorySettingsScreen({ onClose }: { onClose: () => void }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const recommendStudies = useMemo(() => {
    const items = getStudyGroups();
    return items.slice(0, 5).map((item) => ({
      id: String(item.group_id),
      tag: formatCategory(item.category),
      members: formatMembers(item.member_count, item.max_members),
      title: item.title,
      time: formatPrimaryAuthTime(item.verify_methods, item.auth_times),
      method: formatMethods(item.verify_methods).join(', '),
      authTimes: formatAuthTimes(item.verify_methods, item.auth_times),
    }));
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getFavoriteCategories();
      if (res.data?.data) {
        setSelectedIds(res.data.data.favorites.map((f) => f.id));
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (id: string) => {
    if (!isEditing) return;
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) {
        Alert.alert('알림', '관심 카테고리는 최대 3개까지 선택 가능합니다.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateFavoriteCategories({ category_ids: selectedIds });
      setIsEditing(false);
      Alert.alert('성공', '관심 카테고리가 변경되었습니다.');
    } catch (error) {
      Alert.alert('실패', '저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} hitSlop={10}>
          <Text style={styles.headerText}>〈 추천 스터디 카테고리</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>선택한 카테고리</Text>
            <TouchableOpacity onPress={() => (isEditing ? handleSave() : setIsEditing(true))}>
              <View style={styles.editBtn}>
                <Text style={styles.editBtnText}>{isEditing ? '완료' : '수정'}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.chipContainer}>
            {ALL_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => toggleCategory(cat.id)}
                style={[styles.chip, selectedIds.includes(cat.id) && styles.activeChip]}
              >
                <Text style={[styles.chipText, selectedIds.includes(cat.id) && styles.activeChipText]}>
                  {cat.name}
                </Text>
                {isEditing && selectedIds.includes(cat.id) && (
                  <View style={styles.orderBadge}>
                    <Text style={styles.orderText}>{selectedIds.indexOf(cat.id) + 1}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.recommendSection}>
          <Text style={styles.sectionTitle}>추천 스터디</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendRow}
          >
            {recommendStudies.map((item) => (
              <RecommendStudyCard
                key={item.id}
                tag={item.tag}
                members={item.members}
                title={item.title}
                time={item.time}
                method={item.method}
                authTimes={item.authTimes}
                onPress={() => {
                }}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    paddingHorizontal: 20,
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  editBtnText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeChip: {
    backgroundColor: '#333333',
    borderColor: '#333333',
  },
  chipText: {
    color: '#888888',
    fontSize: 14,
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  orderBadge: {
    backgroundColor: '#fff',
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: {
    fontSize: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  recommendSection: {
    paddingTop: 24,
  },
  recommendRow: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default CategorySettingsScreen;
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View, SafeAreaView, FlatList, 
  Image, Pressable, ActivityIndicator, Alert, LayoutAnimation 
} from 'react-native';
import { getAllBadges, deleteBadge } from '../../../api/badges';
import { BadgeAdminRes } from '../../../types/badge';
import AdminBadgeWriteScreen from './AdminBadgeWriteScreen';
import { BADGE_IMAGE_MAP } from '../../../constants/icons';

const AdminBadgeScreen = ({ onClose }: { onClose: () => void }) => {
  const [badges, setBadges] = useState<BadgeAdminRes[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeAdminRes | null>(null);

  const fetchAllBadges = async () => {
    try {
      setLoading(true);
      const res = await getAllBadges();
      if (res.data?.data) {
        setBadges(res.data.data);
      }
    } catch (error) {
      Alert.alert('오류', '전체 뱃지 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllBadges(); }, []);

  const handleDelete = (id: number) => {
    Alert.alert('뱃지 삭제', '이 뱃지를 삭제하시겠습니까? (Soft Delete)', [
      { text: '취소', style: 'cancel' },
      { 
        text: '삭제', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await deleteBadge(id);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            fetchAllBadges();
          } catch (e) {
            Alert.alert('오류', '삭제 실패');
          }
        } 
      }
    ]);
  };

if (isWriting) {
    return (
      <AdminBadgeWriteScreen 
        editData={selectedBadge}
        onClose={(refresh: boolean) => {
          setIsWriting(false);
          setSelectedBadge(null);
          if (refresh) fetchAllBadges();
        }}
      />
    );
  }

  const renderBadgeItem = ({ item }: { item: BadgeAdminRes }) => (
    <View style={styles.badgeWrapper}>
      <View style={styles.badgeCard}>
        <Image 
          source={BADGE_IMAGE_MAP[item.imageUrl] || BADGE_IMAGE_MAP['default']} 
          style={styles.badgeImage} 
        />
        <View style={styles.adminActionOverlay}>
          <Pressable 
            style={styles.miniEditBtn} 
            onPress={() => { setSelectedBadge(item); setIsWriting(true); }}
          >
            <Text style={styles.miniBtnText}>수정</Text>
          </Pressable>
          <Pressable 
            style={styles.miniDelBtn} 
            onPress={() => handleDelete(item.badgeId)}
          >
            <Text style={styles.miniBtnText}>삭제</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.badgeName}>{item.name}</Text>
      <Text style={styles.badgeDesc} numberOfLines={1}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.backBtn}>
          <Text style={styles.backText}>뒤로</Text>
        </Pressable>
        <Text style={styles.headerTitle}>뱃지 마스터 관리</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.infoBar}>
        <Text style={styles.infoText}>시스템에 등록된 전체 뱃지: {badges.length}개</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#77E48C" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={badges}
          renderItem={renderBadgeItem}
          keyExtractor={(item) => item.badgeId.toString()}
          numColumns={3}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* 뱃지 추가 FAB */}
      <Pressable style={styles.fab} onPress={() => { setSelectedBadge(null); setIsWriting(true); }}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, backgroundColor: '#2FE377' 
  },
  backBtn: { padding: 5 },
  backText: { color: '#FFF', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  infoBar: { padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  infoText: { fontSize: 13, color: '#666', fontWeight: '600' },
  listContent: { padding: 15, paddingBottom: 100 },
  badgeWrapper: { flex: 1/3, alignItems: 'center', marginBottom: 25, padding: 5 },
  badgeCard: { 
    width: 90, height: 90, borderRadius: 20, backgroundColor: '#FFF',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5,
    justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden'
  },
  badgeImage: { width: 60, height: 60, resizeMode: 'contain' },
  adminActionOverlay: {
    position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row',
    height: 25, backgroundColor: 'rgba(0,0,0,0.5)'
  },
  miniEditBtn: { flex: 1, backgroundColor: '#4A90E2', justifyContent: 'center', alignItems: 'center' },
  miniDelBtn: { flex: 1, backgroundColor: '#FF5A5A', justifyContent: 'center', alignItems: 'center' },
  miniBtnText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  badgeName: { fontSize: 13, fontWeight: '700', color: '#333', marginTop: 10 },
  badgeDesc: { fontSize: 10, color: '#999', textAlign: 'center' },
  fab: { 
    position: 'absolute', right: 20, bottom: 30, width: 60, height: 60, 
    borderRadius: 30, backgroundColor: '#2FE377', justifyContent: 'center', 
    alignItems: 'center', elevation: 5 
  },
  fabText: { fontSize: 30, color: '#FFF' }
});

export default AdminBadgeScreen;
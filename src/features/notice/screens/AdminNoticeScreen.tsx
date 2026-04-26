import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { getAllNotices, deleteNotice, getNoticeDetail } from '../../../api'; 
import { NoticeListItem, NoticeDetail } from '../../../types/notice'; 
import AdminNoticeWriteScreen from './AdminNoticeWriteScreen';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  onClose: () => void;
}

const AdminNoticeScreen = ({ onClose }: Props) => {
  const [notices, setNotices] = useState<NoticeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('전체');
  const [isWriting, setIsWriting] = useState(false);
  
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetail | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [details, setDetails] = useState<Record<number, NoticeDetail>>({});
  const [detailLoadingId, setDetailLoadingId] = useState<number | null>(null);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const res = await getAllNotices(0, 50);
      if (res.data?.data?.notices) {
        setNotices(res.data.data.notices);
      }
    } catch (error) {
      console.error('공지 로드 실패:', error);
      Alert.alert('오류', '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const toggleExpand = async (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(id);

    if (!details[id]) {
      try {
        setDetailLoadingId(id);
        const res = await getNoticeDetail(id);
        if (res.data?.data) {
          setDetails((prev) => ({ ...prev, [id]: res.data.data }));
        }
      } catch (error) {
        Alert.alert('오류', '내용을 불러오지 못했습니다.');
      } finally {
        setDetailLoadingId(null);
      }
    }
  };

  const confirmDelete = (id: number) => {
    Alert.alert('공지 삭제', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNotice(id);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            loadNotices();
          } catch (e) {
            Alert.alert('오류', '삭제 처리 중 문제가 발생했습니다.');
          }
        },
      },
    ]);
  };

  if (isWriting) {
    return (
      <AdminNoticeWriteScreen
        editData={selectedNotice}
        onClose={(shouldRefresh) => {
          setIsWriting(false); 
          setSelectedNotice(null);
          if (shouldRefresh) {
            setDetails({}); 
            loadNotices();
          }
        }}
      />
    );
  }

  const filteredData = notices.filter((item) => {
    if (filter === '전체') return true;
    return item.title.includes(`[${filter}]`);
  });

  const renderAdminItem = ({ item }: { item: NoticeListItem }) => {
    const isEvent = item.title.includes('이벤트');
    const isExpanded = expandedId === item.notice_id;
    const currentDetail = details[item.notice_id];

    return (
      <View style={[styles.adminCard, isExpanded && styles.expandedCard]}>
        <Pressable style={styles.cardHeader} onPress={() => toggleExpand(item.notice_id)}>
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text style={[styles.categoryTag, isEvent && { color: '#FFAC4B' }]}>
                {isEvent ? '[이벤트]' : '[공지]'}
              </Text>
              <Text style={styles.adminTitle} numberOfLines={isExpanded ? undefined : 1}>
                {item.title.replace(/\[.*?\]/g, '').trim()} 
              </Text>
            </View>
            <Text style={styles.adminSub}>
              {item.created_at?.split('T')[0]} | 조회수: {item.view_count}
            </Text>
          </View>
          <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
        </Pressable>

        {isExpanded && (
          <View style={styles.cardContent}>
            <View style={styles.divider} />
            {detailLoadingId === item.notice_id ? (
              <ActivityIndicator size="small" color="#77E48C" style={{ padding: 20 }} />
            ) : (
              <>
                <Text style={styles.detailText}>
                  {currentDetail?.content || '내용이 없습니다.'}
                </Text>
                
                <View style={styles.btnGroup}>
                  <Pressable 
                    style={styles.editBtn} 
                    onPress={() => { 
                      if (currentDetail) {
                        setSelectedNotice(currentDetail); 
                        setIsWriting(true); 
                      } else {
                        Alert.alert('알림', '데이터 로딩 중입니다.');
                      }
                    }}
                  >
                    <Text style={styles.btnText}>수정</Text>
                  </Pressable>
                  <Pressable 
                    style={styles.delBtn} 
                    onPress={() => confirmDelete(item.notice_id)}
                  >
                    <Text style={[styles.btnText, { color: '#FF5A5A' }]}>삭제</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.adminHeader}>
        <View style={styles.headerTop}>
          <Pressable onPress={onClose} style={styles.backButton}>
            <Text style={styles.backButtonText}>뒤로</Text>
          </Pressable>
          <Text style={styles.headerTitle}>공지사항 관리</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSub}>총 {notices.length}개의 공지가 게시중입니다.</Text>
      </View>

      <View style={styles.filterBar}>
        {['전체', '이벤트', '공지'].map((tab) => (
          <Pressable
            key={tab}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setFilter(tab);
            }}
            style={[styles.chip, filter === tab && styles.activeChip]}
          >
            <Text style={[styles.chipText, filter === tab && styles.activeChipText]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color="#77E48C" size="large" />
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderAdminItem}
          keyExtractor={(item) => item.notice_id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Pressable style={styles.fab} onPress={() => { setSelectedNotice(null); setIsWriting(true); }}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  adminHeader: { paddingTop: 20, paddingBottom: 25, paddingHorizontal: 20, backgroundColor: '#2FE377', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { padding: 5 },
  backButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 13, color: '#EFFFF4', marginTop: 12, textAlign: 'center' },
  filterBar: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE' },
  activeChip: { backgroundColor: '#2FE377', borderColor: '#2FE377' },
  chipText: { fontSize: 13, color: '#999', fontWeight: '600' },
  activeChipText: { color: '#FFF' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 100 },
  adminCard: { backgroundColor: '#FFF', marginBottom: 12, borderRadius: 16, elevation: 2, overflow: 'hidden' },
  expandedCard: { borderColor: '#2FE377', borderWidth: 1.5 },
  cardHeader: { flexDirection: 'row', padding: 18, alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  categoryTag: { fontSize: 13, fontWeight: 'bold', color: '#2FE377', marginRight: 6 },
  adminTitle: { fontSize: 15, fontWeight: '700', color: '#333', flex: 1 },
  adminSub: { fontSize: 12, color: '#BBB' },
  expandIcon: { fontSize: 12, color: '#DDD', marginLeft: 8 },
  cardContent: { paddingHorizontal: 18, paddingBottom: 18 },
  divider: { height: 1, backgroundColor: '#F1F1F1', marginBottom: 12 },
  detailText: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 16 },
  btnGroup: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
  editBtn: { backgroundColor: '#F0F0F0', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  delBtn: { backgroundColor: '#FFEBEB', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  btnText: { fontSize: 13, fontWeight: '700', color: '#666' },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2FE377', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  fabText: { fontSize: 32, color: '#FFF', fontWeight: '300', marginTop: -2 },
});

export default AdminNoticeScreen;
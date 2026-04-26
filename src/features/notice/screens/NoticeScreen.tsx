import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, SafeAreaView, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import { getAllNotices, getNoticeDetail } from '../../../api';
import { NoticeListItem, NoticeDetail } from '../../../types/notice';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NoticeScreen = ({ onClose }: { onClose: () => void }) => {
  const [notices, setNotices] = useState<NoticeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('전체');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<Record<number, NoticeDetail>>({});

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const res = await getAllNotices(0, 50);
      setNotices(res.data.data.notices);
    } finally {
      setLoading(false);
    }
  };

  const toggleNotice = async (noticeId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    if (expandedId === noticeId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(noticeId);

    if (!detailData[noticeId]) {
      try {
        const res = await getNoticeDetail(noticeId);
        setDetailData(prev => ({ ...prev, [noticeId]: res.data.data }));
        setNotices(prev => prev.map(n => 
          n.notice_id === noticeId ? { ...n, view_count: res.data.data.view_count } : n
        ));
      } catch (e) {
        console.error("상세 로드 실패", e);
      }
    }
  };

  const filteredData = notices.filter(item => {
    if (filter === '전체') return true;
    return item.title.includes(`[${filter}]`);
  });

  const renderItem = ({ item }: { item: NoticeListItem }) => {
    const isExpanded = expandedId === item.notice_id;
    const detail = detailData[item.notice_id];

    return (
      <View style={styles.cardContainer}>
        <Pressable 
          style={[styles.card, isExpanded && styles.expandedCard]} 
          onPress={() => toggleNotice(item.notice_id)}
        >
          <View style={styles.cardMain}>
            <View style={styles.titleRow}>
              <Text style={[styles.categoryTag, item.title.includes('이벤트') && { color: '#FFAC4B' }]}>
                {item.title.includes('이벤트') ? '[이벤트]' : '[공지]'}
              </Text>
              <Text style={[styles.title, isExpanded && { fontWeight: 'bold' }]} numberOfLines={isExpanded ? 0 : 1}>
                {item.title}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.date}>{item.created_at?.split('T')[0] || '2026-03-02'}</Text>
              <Text style={styles.viewText}>조회 {item.view_count}</Text>
            </View>
          </View>
          <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
        </Pressable>

        {isExpanded && (
          <View style={styles.detailContent}>
            {detail ? (
              <Text style={styles.contentText}>{detail.content}</Text>
            ) : (
              <ActivityIndicator size="small" color="#77E48C" />
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={{ padding: 10 }}><Text>뒤로</Text></Pressable>
        <Text style={styles.headerTitle}>공지사항</Text>
        <View style={{ width: 45 }} />
      </View>

      <View style={styles.filterBar}>
        {['전체', '이벤트', '공지'].map((tab) => (
          <Pressable key={tab} onPress={() => setFilter(tab)}
            style={[styles.chip, filter === tab && styles.activeChip]}>
            <Text style={[styles.chipText, filter === tab && styles.activeChipText]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? <ActivityIndicator style={{ flex: 1 }} color="#77E48C" /> : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.notice_id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  filterBar: { flexDirection: 'row', padding: 16, gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5F5F5' },
  activeChip: { backgroundColor: '#77E48C' },
  chipText: { fontSize: 13, color: '#999' },
  activeChipText: { color: '#FFF' },
  list: { paddingHorizontal: 16 },
  cardContainer: { borderBottomWidth: 1, borderBottomColor: '#FAFAFA' },
  card: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  expandedCard: { backgroundColor: '#F9FFF9' },
  cardMain: { flex: 1, gap: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  categoryTag: { fontSize: 14, color: '#77E48C', fontWeight: 'bold' },
  title: { fontSize: 15, color: '#333', flex: 1 },
  infoRow: { flexDirection: 'row', gap: 12 },
  date: { fontSize: 12, color: '#BBB' },
  viewText: { fontSize: 12, color: '#BBB' },
  arrow: { fontSize: 12, color: '#CCC', marginLeft: 10 },
  detailContent: { padding: 20, backgroundColor: '#FCFCFC', borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  contentText: { fontSize: 15, color: '#555', lineHeight: 24 }
});

export default NoticeScreen;
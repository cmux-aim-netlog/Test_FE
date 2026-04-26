import React, { useState, useEffect, useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { colors } from '../../../styles/colors';
import NotificationEmptyState from './NotificationEmptyState';
import { notificationApi } from '../../../api/notification';
import { Notification, NotificationType } from '../../../types/notification';
import { apiClient } from '../../../api';
// 정확한 경로 확인 필수: getCurrentUserId를 가져옵니다
import { getCurrentUserId } from '../../../api/client'; 

const badgeOne = require('../../../assets/badge/badge_1.png');

type NoticeSectionProps = {
  title: string;
  notices: Notification[];
  onClear: () => void;
  onRead: (id: string | number) => void;
  showFilters?: boolean;
  activeFilter?: 'ALL' | NotificationType;
  onChangeFilter?: (filter: 'ALL' | NotificationType) => void;
};

function NoticeSection({ title, notices, onClear, onRead, showFilters, activeFilter, onChangeFilter }: NoticeSectionProps) {
  return (
    <View style={styles.sectionBlock}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable onPress={onClear}><Text style={styles.clearText}>전체삭제</Text></Pressable>
      </View>
      {showFilters && (
        <View style={styles.filterRow}>
          {(['ALL', 'NOTICE', 'EVENT', 'COMMUNITY', 'RANKING'] as const).map((f) => (
            <Pressable key={f} style={[styles.filterChip, activeFilter === f && styles.filterChipActive]} onPress={() => onChangeFilter?.(f)}>
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f === 'ALL' ? '전체' : f}</Text>
            </Pressable>
          ))}
        </View>
      )}
      {notices.map((notice) => (
        <Pressable key={notice.id} style={[styles.noticeCard, notice.isRead && styles.readCard]} onPress={() => onRead(notice.id)}>
          <View style={styles.noticeText}>
            <Text style={styles.noticeTitle}>{notice.title}</Text>
            <Text style={styles.noticeDesc}>{notice.content}</Text>
          </View>
          <Image source={badgeOne} style={styles.noticeBadge} />
        </Pressable>
      ))}
    </View>
  );
}

function NotificationNoticeTab() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'ALL' | NotificationType>('ALL');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId(); // UUID 문자열 가져오기

      if (!userId) {
        console.error('사용자 ID(UUID)를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      const res = await notificationApi.getAllNotifications(userId);
      if (res.data) {
        setNotifications(res.data);
      }
    } catch (e) {
      console.error('알림 로드 실패:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRead = async (id: string | number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) { console.log('읽음 처리 실패'); }
  };

  const handleClearAll = () => {
    const rawId = getCurrentUserId(); // UUID 직접 사용
    if (!rawId) return;

    Alert.alert("알림 삭제", "모든 알림을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { 
        text: "삭제", style: "destructive",
        onPress: async () => {
          try {
            // Number() 변환 없이 UUID 문자열 그대로 전달
            await notificationApi.clearAllNotifications(rawId); 
            setNotifications([]);
          } catch (e) { console.log('삭제 실패'); }
        }
      }
    ]);
  };

  const filtered = notifications.filter(n => filter === 'ALL' || n.type === filter);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayNotices = filtered.filter(n => n.createdAt?.startsWith(todayStr));
  const previousNotices = filtered.filter(n => !n.createdAt?.startsWith(todayStr));

  if (loading) return <ActivityIndicator style={{marginTop: 40}} color={colors.primary} />;
  
  if (notifications.length === 0) {
    return <NotificationEmptyState title="알림이 아직 없어요" description={`새로운 소식이 생기면\n바로 알려드릴게요.`} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {todayNotices.length > 0 && <NoticeSection title="오늘" notices={todayNotices} onRead={handleRead} onClear={handleClearAll} />}
      {previousNotices.length > 0 && <NoticeSection title="이전 알림" notices={previousNotices} onRead={handleRead} onClear={handleClearAll} showFilters activeFilter={filter} onChangeFilter={setFilter} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  sectionBlock: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  clearText: { fontSize: 12, color: '#9A9A9A' },
  noticeCard: { backgroundColor: '#F7F7F7', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  readCard: { opacity: 0.5 },
  noticeText: { flex: 1, paddingRight: 10 },
  noticeTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  noticeDesc: { fontSize: 12, color: '#666' },
  noticeBadge: { width: 40, height: 50 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.primary },
  filterChipActive: { backgroundColor: colors.primary },
  filterText: { fontSize: 12, color: colors.primary, fontWeight: '700' },
  filterTextActive: { color: '#FFF' },
});

export default NotificationNoticeTab;
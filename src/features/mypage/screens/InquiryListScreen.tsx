import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../../../styles/colors';
import { getMyInquiries, getInquiryDetail, addInquiryComment } from '../../../api/inquiries';
import { InquiryListItem, InquiryDetail } from '../../../types/inquiry';

type InquiryListScreenProps = {
  onClose: () => void;
  onPressWrite: () => void;
};

const backIcon = require('../../../assets/icon/right_arrow.png');

function InquiryListScreen({ onClose, onPressWrite }: InquiryListScreenProps) {
  const [items, setItems] = useState<InquiryListItem[]>([]);
  const [details, setDetails] = useState<Record<number, InquiryDetail>>({});
  const [openIds, setOpenIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReply, setShowReply] = useState(false);
  const [activeInquiryId, setActiveInquiryId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await getMyInquiries();
      if (res.data?.data) {
        setItems(res.data.data.inquiries);
      }
    } catch (error) {
      console.error('목록 로드 실패:', error);
      Alert.alert('오류', '문의 목록을 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const toggleOpen = async (id: number) => {
    const isOpen = openIds.includes(id);

    if (!isOpen && !details[id]) {
      try {
        const res = await getInquiryDetail(id);
        if (res.data?.data) {
          setDetails((prev) => ({ ...prev, [id]: res.data.data }));
        }
      } catch (error) {
        Alert.alert('오류', '상세 내용을 불러올 수 없습니다.');
        return;
      }
    }

    setOpenIds((prev) =>
      isOpen ? prev.filter((openId) => openId !== id) : [...prev, id]
    );
  };

  const openReplyModal = (id: number) => {
    setActiveInquiryId(id);
    setReplyContent('');
    setShowReply(true);
  };

  const submitReply = async () => {
    if (!activeInquiryId || !replyContent.trim()) return;

    try {
      setIsSubmitting(true);
      await addInquiryComment(activeInquiryId, replyContent.trim());
      
      const res = await getInquiryDetail(activeInquiryId);
      if (res.data?.data) {
        setDetails((prev) => ({ ...prev, [activeInquiryId]: res.data.data }));
      }
      
      setShowReply(false);
      Alert.alert('알림', '추가 문의가 등록되었습니다.');
    } catch (error) {
      Alert.alert('오류', '등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={10} style={styles.backButton}>
          <Image source={backIcon} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.headerTitle}>1:1 문의</Text>
      </View>

      {/* 로딩 표시를 전체 리턴이 아닌 내용 부분에만 적용 (Hook 에러 방지 최적화) */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>내 문의</Text>
            <Pressable style={styles.writeButton} onPress={onPressWrite}>
              <Text style={styles.writeButtonText}>문의 쓰기</Text>
            </Pressable>
          </View>

          {items.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>문의 내역이 없습니다.</Text>
            </View>
          ) : (
            items.map((item) => {
              const isOpen = openIds.includes(item.inquiry_id);
              const detail = details[item.inquiry_id];
              const isDone = item.status === 'ANSWERED';

              return (
                <View key={item.inquiry_id} style={styles.card}>
                  <Pressable style={styles.cardTop} onPress={() => toggleOpen(item.inquiry_id)}>
                    <View>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardDate}>상태: {isDone ? '답변 완료' : '진행중'}</Text>
                    </View>
                    <View style={styles.cardRight}>
                      <View style={[styles.statusChip, isDone ? styles.statusDone : styles.statusPending]}>
                        <Text style={[styles.statusText, isDone ? styles.statusTextDone : styles.statusTextPending]}>
                          {isDone ? '답변 완료' : '진행중'}
                        </Text>
                      </View>
                      <Image source={backIcon} style={[styles.arrowIcon, isOpen && styles.arrowIconOpen]} />
                    </View>
                  </Pressable>

                  {isOpen && detail && (
                    <View style={styles.cardBody}>
                      <View style={styles.qaRow}>
                        <Text style={styles.qaLabel}>Q</Text>
                        <View style={styles.qaContent}>
                          <Text style={styles.qaTitle}>{detail.title}</Text>
                          <Text style={styles.qaText}>{detail.content}</Text>
                        </View>
                      </View>

                      {detail.comments.map((comment) => (
                        <View key={comment.comment_id}>
                          <View style={styles.divider} />
                          <View style={styles.qaRow}>
                            <Text style={comment.author_type === 'ADMIN' ? styles.qaLabelAnswer : styles.qaLabel}>
                              {comment.author_type === 'ADMIN' ? 'A' : 'Q'}
                            </Text>
                            <View style={styles.qaContent}>
                              <Text style={styles.qaTitle}>
                                {comment.author_type === 'ADMIN' ? '체크메이트 답변' : '추가 문의'}
                              </Text>
                              <Text style={styles.qaText}>{comment.content}</Text>
                            </View>
                          </View>
                        </View>
                      ))}

                      <View style={styles.actionRow}>
                        <Pressable style={styles.actionButton} onPress={() => openReplyModal(item.inquiry_id)}>
                          <Text style={styles.actionText}>추가 문의하기</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* 추가 문의 모달 */}
      <Modal visible={showReply} animationType="slide" onRequestClose={() => setShowReply(false)}>
        <SafeAreaView style={styles.replyRoot}>
          <View style={styles.replyHeader}>
            <Pressable onPress={() => setShowReply(false)} hitSlop={10} style={styles.backButton}>
              <Image source={backIcon} style={styles.backIcon} />
            </Pressable>
            <Text style={styles.headerTitle}>추가 문의</Text>
          </View>
          <View style={styles.replyContent}>
            <Text style={styles.replyLabel}>내용</Text>
            <TextInput
              value={replyContent}
              onChangeText={setReplyContent}
              placeholder="궁금하신 내용을 입력해주세요."
              placeholderTextColor="#C9C9C9"
              style={styles.replyTextarea}
              multiline
              textAlignVertical="top"
            />
          </View>
          <View style={styles.replyBottom}>
            <Pressable 
              style={[styles.replySubmitButton, isSubmitting && { opacity: 0.6 }]} 
              onPress={submitReply}
              disabled={isSubmitting}
            >
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.replySubmitText}>등록</Text>}
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  backButton: { marginRight: 10 },
  backIcon: { width: 10, height: 14, tintColor: '#9A9A9A', transform: [{ scaleX: -1 }] },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  content: { paddingBottom: 32 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 10 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  writeButton: { borderWidth: 1, borderColor: '#D7D7D7', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 18 },
  writeButtonText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  card: { borderTopWidth: 1, borderTopColor: '#E5E5E5', paddingHorizontal: 20, paddingVertical: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 6 },
  cardDate: { fontSize: 14, color: '#B2B2B2' },
  cardRight: { alignItems: 'flex-end', gap: 10 },
  statusChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16, borderWidth: 1 },
  statusDone: { borderColor: colors.primary, backgroundColor: colors.primary },
  statusPending: { borderColor: '#FF6B6B', backgroundColor: '#FFECEC' },
  statusText: { fontSize: 12, fontWeight: '700' },
  statusTextDone: { color: '#FFFFFF' },
  statusTextPending: { color: '#FF6B6B' },
  arrowIcon: { marginRight: 20, width: 8, height: 20, tintColor: '#C2C2C2', transform: [{ rotate: '90deg' }] },
  arrowIconOpen: { transform: [{ rotate: '270deg' }] },
  cardBody: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#E5E5E5', paddingTop: 16, gap: 12 },
  qaRow: { flexDirection: 'row', gap: 12 },
  qaLabel: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, width: 24 },
  qaLabelAnswer: { fontSize: 18, fontWeight: '800', color: colors.primary, width: 24 },
  qaContent: { flex: 1, gap: 6 },
  qaTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  qaText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 4 },
  actionRow: { flexDirection: 'row', gap: 12, paddingTop: 6 },
  actionButton: { flex: 1, borderWidth: 1, borderColor: '#D7D7D7', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '700', color: '#3D3D3D' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyBox: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 16 },
  replyRoot: { flex: 1, backgroundColor: '#FFFFFF' },
  replyHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  replyContent: { paddingHorizontal: 20, paddingTop: 12, gap: 12 },
  replyLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  replyTextarea: { borderWidth: 1, borderColor: '#E2E2E2', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, minHeight: 220, fontSize: 14, color: colors.textPrimary },
  replyBottom: { marginTop: 'auto', paddingHorizontal: 20, paddingBottom: 26 },
  replySubmitButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  replySubmitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});

export default InquiryListScreen;
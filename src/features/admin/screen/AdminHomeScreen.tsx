import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '../../../api';
import AdminBadgeScreen from '../../badge/screens/AdminBadgeScreen';
import AdminStoreScreen from '../../points/screens/AdminStoreScreen';
import { colors } from '../../../styles/colors';

// 에셋 설정
const backgroundSource = require('../../../assets/image/background.png');
const cartIcon = require('../../../assets/icon/white_cart_icon.png');
const badgeIcon = require('../../../assets/icon/white_badge_icon.png');
const adminChar = require('../../../assets/character/ch_5.png');
const arrowDown = require('../../../assets/icon/right_arrow.png');
const brandLogoSource = require('../../../assets/checkmate_logo2.png'); // 로고 사용 시

const { width: bgWidth, height: bgHeight } = Image.resolveAssetSource(backgroundSource);
const HEADER_HEIGHT = 44;
const HERO_TEXT_TOP = 12;

function AdminHomeScreen() {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;

  const heroHeight = Math.round((screenWidth * bgHeight) / bgWidth) + insets.top;
  const heroContentTop = HEADER_HEIGHT + insets.top + HERO_TEXT_TOP;

  const [currentView, setCurrentView] = useState<'HOME' | 'BADGE' | 'STORE'>('HOME');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdminInquiries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/inquiries', {
        params: { page: 0, size: 20 }
      });
      if (response.data && response.data.data) {
        const rawData = response.data.data.inquiries;
        const sortedData = [...rawData].sort((a, b) => {
          if (a.status !== 'ANSWERED' && b.status === 'ANSWERED') return -1;
          if (a.status === 'ANSWERED' && b.status !== 'ANSWERED') return 1;
          return 0;
        });
        setInquiries(sortedData);
      }
    } catch (error: any) {
      console.error('목록 로드 실패:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminInquiries();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminInquiries();
  };

  const handlePressInquiry = async (inquiryId: number) => {
    try {
      const res = await apiClient.get(`/inquiries/${inquiryId}`);
      if (res.data?.data) {
        setSelectedInquiry(res.data.data);
        setIsDetailModalVisible(true);
      }
    } catch (error) {
      Alert.alert('에러', '상세 내용을 불러올 수 없습니다.');
    }
  };

  const submitAnswer = async () => {
    if (!replyText.trim() || !selectedInquiry) return;
    try {
      setIsSubmitting(true);
      await apiClient.post(`/inquiries/${selectedInquiry.inquiry_id}/comments`, {
        author_type: 'ADMIN',
        content: replyText.trim()
      });
      Alert.alert('완료', '답변이 등록되었습니다.');
      setIsDetailModalVisible(false);
      setReplyText('');
      fetchAdminInquiries();
    } catch (error) {
      Alert.alert('실패', '등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentView === 'BADGE') return <AdminBadgeScreen onClose={() => setCurrentView('HOME')} />;
  if (currentView === 'STORE') return <AdminStoreScreen onClose={() => setCurrentView('HOME')} />;

  return (
    <View style={styles.container}>
      {/* --- 해결된 상단 헤더 --- */}
      <View style={[styles.headerOverlay, { height: HEADER_HEIGHT + insets.top, paddingTop: insets.top }]}>
        <Image source={brandLogoSource} style={styles.logo} resizeMode="contain" />
        <View style={styles.iconRow}>
          <Pressable style={styles.iconWrapper} onPress={() => setCurrentView('STORE')}>
            <Image source={cartIcon} style={styles.headerIcon} />
          </Pressable>
          <Pressable style={styles.iconWrapper} onPress={() => setCurrentView('BADGE')}>
            <Image source={badgeIcon} style={styles.headerIcon} />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* --- Hero 섹션 --- */}
        <View style={styles.heroWrap}>
          <ImageBackground
            source={backgroundSource}
            resizeMode="cover"
            style={[styles.heroBackground, { height: heroHeight, marginTop: -insets.top - 10 }]}
          />
          <View style={[styles.heroContent, { paddingTop: heroContentTop + 20 }]}>
            <View style={styles.textBlock}>
              <Text style={styles.title}>안녕하세요,</Text>
              <Text style={styles.title}>관리자님 반갑습니다!</Text>
            </View>
            <Image source={adminChar} style={styles.heroMascot} resizeMode="contain" />
          </View>
        </View>

        {/* --- 하단 문의 목록 섹션 --- */}
        <View style={styles.bottomSection}>
          <Text style={styles.sectionTitle}>전체 문의 현황</Text>
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
          ) : (
            inquiries.map((item) => (
              <Pressable 
                key={item.inquiry_id} 
                style={styles.inquiryCard} 
                onPress={() => handlePressInquiry(item.inquiry_id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.userId}>Member ID: {item.member_id || '익명'}</Text>
                  <Text style={styles.inquiryTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.dateText}>2026. 02. 04.</Text>
                </View>
                <View style={styles.rightContent}>
                  <View style={[
                    styles.statusBadge, 
                    item.status === 'ANSWERED' ? styles.statusDone : styles.statusWait
                  ]}>
                    <Text style={styles.statusText}>
                      {item.status === 'ANSWERED' ? '답변 완료' : '대기중'}
                    </Text>
                  </View>
                  <Image source={arrowDown} style={styles.arrowIcon} />
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      {/* --- 모달 --- */}
      <Modal visible={isDetailModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setIsDetailModalVisible(false)}>
              <Text style={styles.closeText}>취소</Text>
            </Pressable>
            <Text style={styles.modalTitle}>문의 상세 답변</Text>
            <View style={{ width: 40 }} />
          </View>
          <ScrollView style={styles.modalContent}>
            {selectedInquiry && (
              <>
                <View style={styles.userQuestionBox}>
                  <Text style={styles.questionTitle}>{selectedInquiry.title}</Text>
                  <Text style={styles.questionContent}>{selectedInquiry.content}</Text>
                </View>
                {selectedInquiry.comments?.map((c: any, i: number) => (
                  <View key={i} style={c.author_type === 'ADMIN' ? styles.adminReply : styles.userAdditional}>
                    <Text style={styles.commentText}>{c.content}</Text>
                  </View>
                ))}
                <TextInput
                  style={styles.answerInput}
                  multiline
                  placeholder="답변 내용을 입력해주세요..."
                  value={replyText}
                  onChangeText={setReplyText}
                  placeholderTextColor="#BBB"
                />
              </>
            )}
          </ScrollView>
          <Pressable 
            style={[styles.submitButton, !replyText.trim() && { backgroundColor: '#DDD' }]} 
            onPress={submitAnswer} 
            disabled={isSubmitting || !replyText.trim()}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '저장 중...' : '답변 저장하기'}
            </Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 50 },

  // 헤더 스타일
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
  logo: { width: 120, height: 30 },
  iconRow: { flexDirection: 'row', gap: 12 },
  iconWrapper: { padding: 4 },
  headerIcon: { width: 28, height: 28, tintColor: '#FFFFFF' },

  // Hero 섹션
  heroWrap: { position: 'relative' },
  heroBackground: { width: '100%' },
  heroContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingHorizontal: 20,
  },
  textBlock: {
    marginTop: 20,
    paddingLeft: 10,
    gap: 8,
  },
  title: {
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  heroMascot: {
    position: 'absolute',
    right: 15,
    bottom: -60,
    width: 100,
    height: 100,
    zIndex: 1,
  },

  // 하단 섹션
  bottomSection: {
    marginTop: -350,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    minHeight: 600,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 20 },
  inquiryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userId: { fontSize: 12, color: '#AAA', marginBottom: 4 },
  inquiryTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  dateText: { fontSize: 12, color: '#BBB', marginTop: 6 },
  rightContent: { alignItems: 'flex-end', gap: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 44 },
  statusDone: { backgroundColor: '#2FE377' },
  statusWait: { backgroundColor: '#FF7777' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  arrowIcon: { width: 12, height: 12, tintColor: '#CCC', transform: [{ rotate: '90deg' }] },

  // 모달 스타일
  modalRoot: { flex: 1, backgroundColor: '#FFF' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  closeText: { fontSize: 16, color: '#FF5A5A' },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalContent: { padding: 20 },
  userQuestionBox: { backgroundColor: '#F9F9F9', padding: 15, borderRadius: 12, marginBottom: 20 },
  questionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  questionContent: { fontSize: 15, color: '#555', lineHeight: 22 },
  adminReply: { backgroundColor: '#E8FBF0', padding: 12, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 10 },
  userAdditional: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 10, alignSelf: 'flex-end', marginBottom: 10 },
  commentText: { fontSize: 14, color: '#333' },
  answerInput: {
    height: 150,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 15,
    marginTop: 20,
  },
  submitButton: {
    margin: 20,
    height: 55,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
});

export default AdminHomeScreen;
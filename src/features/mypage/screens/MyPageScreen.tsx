import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ActivityIndicator, Text, Modal } from 'react-native';
import { colors } from '../../../styles/colors';
import MyPageHeader from '../components/MyPageHeader';
import MyPageProfileRow from '../components/MyPageProfileRow';
import MyPagePointsCard from '../components/MyPagePointsCard';
import MyPageQuickActions from '../components/MyPageQuickActions';
import MyPageSection from '../components/MyPageSection';
import AccountSettingsScreen from './AccountSettingsScreen';
import PointsHistoryScreen from '../../points/screens/PointsHistoryScreen';
import PointsShopScreen from '../../points/screens/PointsShopScreen';
import PointsExchangeScreen from '../../points/screens/PointsShopScreen'; // 기존 경로 유지
import SocialAccountSettingScreen from './SocialAccountSettingScreen';
import InquiryListScreen from './InquiryListScreen';
import InquiryWriteScreen from './InquiryWriteScreen';
import CategorySettingsScreen from './CategorySettingScreen';
import { getMyInfo } from '../../../api/users';
import { UserResponse } from '../../../types/users';
import { getPointBalance } from '../../../api/point';
import NoticeScreen from '../../notice/screens/NoticeScreen';
import AdminNoticeScreen from '../../notice/screens/AdminNoticeScreen';
import BadgeScreen from '../../badge/screens/BadgeScreen';
import AdminBadgeScreen from '../../badge/screens/AdminBadgeScreen';
import MyInventoryScreen from '../../points/screens/MyInventoryScreen';
import MyStudyScreen from '../../my-study/screens/MyStudyScreen'; 
import NotificationScreen from '../../notification/screens/NotificationScreen'; // 알림 화면
import { apiClient } from '../../../api';

function MyPageScreen() {
  /**
   * [중요] 모든 Hook(useState, useEffect)은 
   * 어떤 조건문(if)보다도 무조건 컴포넌트 최상단에 위치해야 합니다.
   */
  const [showSettings, setShowSettings] = useState(false);
  const [showPointsHistory, setShowPointsHistory] = useState(false);
  const [showPointsShop, setShowPointsShop] = useState(false);
  const [showPointsExchange, setShowPointsExchange] = useState(false);
  const [showInquiryList, setShowInquiryList] = useState(false);
  const [showInquiryWrite, setShowInquiryWrite] = useState(false);
  const [showCategorySettings, setShowCategorySettings] = useState(false);
  const [showSocialSettings, setShowSocialSettings] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showMyStudies, setShowMyStudies] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // 알림 상태 추가

  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Header에서 userId를 직접 참조하므로 여기서는 role 정보만 체크
        const userRole = (apiClient.defaults.headers['X-User-Role'] || 
                          apiClient.defaults.headers.common['X-User-Role']) as string;
        setRole(userRole || 'USER');

        const [userResponse, balanceResponse] = await Promise.all([
          getMyInfo(),
          getPointBalance()
        ]);

        if (userResponse.data?.data) setUserInfo(userResponse.data.data);
        if (balanceResponse.data?.data !== undefined) setBalance(balanceResponse.data.data);
      } catch (error) {
        console.error('마이페이지 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
        setIsReady(true);
      }
    };
    fetchAllData();
  }, []);

  /**
   * [에러 해결] 로딩 및 화면 전환 분기 처리는 
   * 반드시 위 Hook 선언들이 다 끝난 뒤에 작성해야 합니다.
   */
  if (loading || !isReady) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  // 전체 화면을 덮는 서브 스크린들
  if (showSettings) return <AccountSettingsScreen onClose={() => setShowSettings(false)} />;
  if (showPointsHistory) return <PointsHistoryScreen onClose={() => setShowPointsHistory(false)} />;
  if (showPointsShop) return <PointsShopScreen onClose={() => setShowPointsShop(false)} />;
  if (showPointsExchange) return <PointsExchangeScreen onClose={() => setShowPointsExchange(false)} />;
  if (showCategorySettings) return <CategorySettingsScreen onClose={() => setShowCategorySettings(false)} />;
  if (showSocialSettings) return <SocialAccountSettingScreen onClose={() => setShowSocialSettings(false)} />;
  if (showInventory) return <MyInventoryScreen onClose={() => setShowInventory(false)} />;
  if (showMyStudies) return <MyStudyScreen onClose={() => setShowMyStudies(false)} />;
  
  if (showInquiryWrite) {
    return (
      <InquiryWriteScreen
        onClose={() => setShowInquiryWrite(false)}
        onBack={() => { setShowInquiryWrite(false); setShowInquiryList(true); }}
      />
    );
  }
  
  if (showInquiryList) {
    return (
      <InquiryListScreen
        onClose={() => setShowInquiryList(false)}
        onPressWrite={() => { setShowInquiryList(false); setShowInquiryWrite(true); }}
      />
    );
  }

  if (showNotice) {
    return role === 'ADMIN' 
      ? <AdminNoticeScreen onClose={() => setShowNotice(false)} />
      : <NoticeScreen onClose={() => setShowNotice(false)} />;
  }

  if (showBadge) {
    return role === 'ADMIN'
      ? <AdminBadgeScreen onClose={() => setShowBadge(false)} />
      : <BadgeScreen onClose={() => setShowBadge(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 헤더에서 알림 아이콘 클릭 시 showNotifications를 true로 변경 */}
        <MyPageHeader 
          onPressAlarm={() => setShowNotifications(true)} 
          onPressSetting={() => setShowSettings(true)} 
        />
        
        <MyPageProfileRow name={`${userInfo?.nickname || '회원'} 메이트님`} />
        
        <MyPagePointsCard current={balance} total={5000} />
        
        <MyPageQuickActions
          onPressHistory={() => setShowPointsHistory(true)}
          onPressShop={() => setShowPointsShop(true)}
          onPressExchange={() => setShowPointsExchange(true)}
        />

        <View style={styles.sectionDivider}>
          <Text style={styles.adText}>AD</Text>
        </View>

        <View style={styles.sectionGroup}>
          <MyPageSection 
            title="관리" 
            rows={[
              { 
                left: '스터디', 
                onPressLeft: () => setShowMyStudies(true),
                right: '연동계정', 
                onPressRight: () => setShowSocialSettings(true) 
              }, 
              { 
                left: '아이템', 
                onPressLeft: () => setShowInventory(true), 
                right: '뱃지', 
                onPressRight: () => setShowBadge(true)
              },
              { 
                left: '추천 스터디 카테고리', 
                onPress: () => setShowCategorySettings(true) 
              }
            ]} 
          />
        </View>

        <View style={styles.sectionGroup}>
          <MyPageSection 
            title="고객지원" 
            rows={[
              { 
                left: '공지사항', 
                onPressLeft: () => setShowNotice(true),
                right: '이용안내', 
                onPressRight: () => {} 
              }, 
              { 
                left: '문의하기', 
                onPress: () => setShowInquiryList(true) 
              }
            ]} 
          />
        </View>
      </ScrollView>

      {/* 알림 화면은 Modal로 띄워야 기존 마이페이지 Hook 순서에 영향을 주지 않습니다. */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <NotificationScreen onClose={() => setShowNotifications(false)} />
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 32 },
  sectionGroup: { marginTop: 8 },
  sectionDivider: {
    height: 60,
    backgroundColor: '#F5F5F5',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adText: { color: '#999', fontWeight: 'bold' },
  center: { justifyContent: 'center', alignItems: 'center' },
});

export default MyPageScreen;
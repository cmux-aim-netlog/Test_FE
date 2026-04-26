import React, { useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../../../styles/colors';
import { getMyInfo, withdrawAccount } from '../../../api/users';
import { UserResponse } from '../../../types/users';

const backIcon = require('../../../assets/icon/left_arrow.png');
const profileImage = require('../../../assets/icon/profile_1.png');

type AccountSettingsScreenProps = {
  onClose?: () => void;
};

function AccountSettingsScreen({ onClose }: AccountSettingsScreenProps) {
  // 1. 상태 관리: 서버에서 받아온 유저 정보를 담을 공간
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  // 2. 데이터 페칭: 화면이 열릴 때 실행
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response = await getMyInfo();
        // ApiResponse 구조에 따라 response.data.data가 실제 UserResponse입니다.
        if (response.data.success) {
          setUserInfo(response.data.data);
        }
      } catch (error) {
        console.error('유저 정보 로드 실패:', error);
        Alert.alert('에러', '서버에서 정보를 가져올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  // 3. 회원 탈퇴 처리
  const handleWithdraw = async () => {
    Alert.alert('회원 탈퇴', '정말 탈퇴하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '탈퇴',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await withdrawAccount();
            if (res.data.success) {
              Alert.alert('성공', '탈퇴 처리가 완료되었습니다.');
              onClose?.();
            }
          } catch (error) {
            Alert.alert('실패', '탈퇴 처리 중 오류가 발생했습니다.');
          }
        },
      },
    ]);
  };

  // 로딩 중일 때 보여줄 화면
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.backButton}>
            <Image source={backIcon} style={styles.backIcon} />
          </Pressable>
          <Text style={styles.headerTitle}>계정관리</Text>
        </View>

        <Text style={styles.sectionTitle}>기본 정보</Text>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.profileBlock}>
              <Image source={profileImage} style={styles.avatar} />
              <Text style={styles.name}>{userInfo?.name || '이름 없음'}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>닉네임</Text>
                <Text style={styles.infoValue}>{userInfo?.nickname || '-'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>성별</Text>
                <Text style={styles.infoValue}>{userInfo?.gender === 'Male' ? '남' : userInfo?.gender === 'Female' ? '여' : '-'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>생년월일</Text>
                <Text style={styles.infoValue}>{userInfo?.birthdate ? String(userInfo?.birthdate) : '-'}</Text>
              </View>
            </View>

            <View style={styles.phoneRow}>
              <Text style={styles.infoLabel}>전화번호</Text>
              <Text style={styles.infoValueMuted}>{userInfo?.phoneNumber}</Text>
            </View>
          </View>

          <View>
            <View style={styles.cardDivider} />
            <Pressable style={styles.actionButton}
            onPress={() => navigation.navigate('EditProfileScreen', { userInfo })}>
              <Text style={styles.actionText}>정보 수정</Text>
            </Pressable>
            <View style={styles.cardDivider} />
            <Pressable style={styles.actionButton} onPress={handleWithdraw}> 
              <Text style={styles.withdrawText}>회원 탈퇴</Text>
            </Pressable>
          </View>
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
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    padding: 6,
    marginRight: 6,
  },
  backIcon: {
    width: 8,
    height: 16,
    tintColor: '#B8B8B8',
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: 30,
    marginTop: 40,
    marginBottom: 20,
  },
  card: {
    marginTop:10,
    marginHorizontal: 30,
    height: 480,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    backgroundColor: '#FBFBFB',
    paddingHorizontal: 18,
    paddingTop: 22,
    
  },
  cardContent: {
    flex: 1,
    
    justifyContent: 'space-between',  
  },
  profileBlock: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 77,
    height: 77,
    borderRadius: 35,
    marginBottom:15,
  },
  name: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: '#373737',
    fontWeight: '700',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: "#606060",
  },
  infoValueMuted: {
    fontSize: 16,
    color: '#B5B5B5',
    fontWeight: '500',
  },
  phoneRow: {
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginHorizontal: -18,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: "#4F4F4F"
  },
  withdrawText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF7777',
  },
});

export default AccountSettingsScreen;

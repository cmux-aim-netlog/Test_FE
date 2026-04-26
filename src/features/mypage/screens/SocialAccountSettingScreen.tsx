import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { colors } from '../../../styles/colors';
import { getSocialAccounts, unlinkSocialAccount } from '../../../api/users';
import { SocialAccountRes } from '../../../types/users';

interface SocialAccountSettingScreenProps {
  onClose: () => void;
}

const renderAccountCard = (
  type: 'Google' | 'GitHub',
  accounts: SocialAccountRes[],
  handleLink: (provider: 'google' | 'github') => void,
  handleUnlink: (provider: string) => void
) => {
  const account = accounts.find((a) => a.provider.toUpperCase() === type.toUpperCase());
  const isLinked = !!account;

  return (
    <View style={[styles.card, isLinked && styles.linkedCard]}>
      <View style={styles.cardHeader}>
        <Text style={styles.providerName}>{type}</Text>
        <View style={isLinked ? styles.badgeLinked : styles.badgeUnlinked}>
          <Text style={isLinked ? styles.badgeTextLinked : styles.badgeTextUnlinked}>
            {isLinked ? '연결됨' : '인증필요'}
          </Text>
        </View>
      </View>

      {isLinked ? (
        <View style={styles.accountInfoRow}>
          <Text style={styles.emailText}>{account.email}</Text>
          <TouchableOpacity onPress={() => handleUnlink(type)} hitSlop={10}>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.plusButton}
          onPress={() => handleLink(type.toLowerCase() as 'google' | 'github')}
        >
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

function SocialAccountSettingScreen({ onClose }: SocialAccountSettingScreenProps) {
  const [accounts, setAccounts] = useState<SocialAccountRes[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await getSocialAccounts();
      if (res.data?.data) {
        setAccounts(res.data.data);
      }
    } catch (error) {
      console.error('계정 정보 로드 실패:', error);
      Alert.alert('오류', '계정 정보를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchAccounts();
    }
  }, [isFocused]);

  const handleLink = async (provider: 'google' | 'github') => {
    // Android 에뮬레이터는 localhost가 호스트 PC를 가리키지 않음. 10.0.2.2 = 호스트 루프백.
    const oauthHost = Platform.OS === 'android' ? 'http://10.0.2.2:8085' : 'http://localhost:8085';
    const url = `${oauthHost}/oauth2/authorization/${provider}`;
    try {
      // Android에서는 canOpenURL이 http(s)에 대해 false를 반환하는 경우가 있어, 직접 openURL 시도.
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else if (url.startsWith('http://') || url.startsWith('https://')) {
        await Linking.openURL(url);
      } else {
        Alert.alert('오류', '인증 페이지를 열 수 없습니다.');
      }
    } catch (error) {
      console.error('Linking Error:', error);
      Alert.alert('오류', '인증 페이지를 열 수 없습니다.');
    }
  };

  const handleUnlink = (provider: string) => {
    Alert.alert('연동 해제', `${provider} 계정의 연동을 해제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '해제',
        style: 'destructive',
        onPress: async () => {
          try {
            await unlinkSocialAccount(provider.toLowerCase());
            Alert.alert('알림', '연동이 해제되었습니다.');
            fetchAccounts(); 
          } catch (error: any) {
            Alert.alert('오류', '연동 해제에 실패했습니다.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn} hitSlop={15}>
          <Text style={styles.headerTitle}>〈 연동계정</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>계정</Text>
        
        {renderAccountCard('Google', accounts, handleLink, handleUnlink)}
        {renderAccountCard('GitHub', accounts, handleLink, handleUnlink)}

        <View style={styles.guideBox}>
          <Text style={styles.guideText}>• 최소 하나 이상의 소셜 계정이 연동되어 있어야 합니다.</Text>
          <Text style={styles.guideText}>• 연동 해제 시 해당 계정으로의 로그인이 제한될 수 있습니다.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  backBtn: { alignSelf: 'flex-start' },
  container: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 24, color: '#333' },
  card: {
    borderRadius: 12, padding: 20, marginBottom: 16, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#EFEFEF', minHeight: 120, justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  linkedCard: { borderColor: '#5CDE90', borderWidth: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  providerName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  badgeLinked: { backgroundColor: '#E8FBF0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeTextLinked: { color: '#2FE377', fontSize: 12, fontWeight: 'bold' },
  badgeUnlinked: { backgroundColor: '#FFF0F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeTextUnlinked: { color: '#FF8080', fontSize: 12, fontWeight: 'bold' },
  accountInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  emailText: { fontSize: 15, color: '#666' },
  editIcon: { fontSize: 18, color: '#CCC', marginLeft: 8 },
  plusButton: { alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  plusIcon: { fontSize: 32, color: '#D9D9D9', fontWeight: '300' },
  guideBox: { marginTop: 20, padding: 16, backgroundColor: '#F9F9F9', borderRadius: 8 },
  guideText: { fontSize: 12, color: '#999', lineHeight: 18 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default SocialAccountSettingScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../styles/colors';
import { updateMyInfo } from '../../../api/users';
import { UserResponse } from '../../../types/users';

const backIcon = require('../../../assets/icon/left_arrow.png');
const profileImage = require('../../../assets/icon/profile_1.png');
const cameraIcon = require('../../../assets/icon/camera_icon.png'); // 카메라 아이콘 확인 필요

function EditProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // AccountSettingsScreen에서 넘어온 유저 정보
  const { userInfo } = route.params as { userInfo: UserResponse };

  // 입력값 상태 관리
  const [nickname, setNickname] = useState(userInfo.nickname || '');
  const [birthdate, setBirthdate] = useState(userInfo.birthdate || '');
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber || '');

  const handleUpdate = async () => {
    try {
      const response = await updateMyInfo({
        nickname,
        birthdate,
        phoneNumber,
        gender: userInfo.gender,
      });

      if (response.data.success) {
        Alert.alert('성공', '프로필 정보가 수정되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('실패', '정보 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={backIcon} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.headerTitle}>계정관리</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>기본 정보</Text>

        <View style={styles.card}>
          {/* 프로필 이미지 섹션 */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={profileImage} style={styles.avatar} />
              <View style={styles.cameraBadge}>
                <Image source={cameraIcon} style={styles.cameraIcon} />
              </View>
            </View>
            <Text style={styles.userName}>{userInfo.name}</Text>
          </View>

          {/* 입력 폼 섹션 */}
          <View style={styles.formContainer}>
            <View style={styles.row}>
              <View style={styles.inputItem}>
                <Text style={styles.label}>닉네임</Text>
                <TextInput
                  style={styles.input}
                  value={nickname}
                  onChangeText={setNickname}
                />
              </View>
              <View style={styles.inputItem}>
                <Text style={styles.label}>성별</Text>
                <Text style={styles.fixedValue}>{userInfo.gender === 'Male' ? '남' : '여'}</Text>
              </View>
              <View style={styles.inputItem}>
                <Text style={styles.label}>생년월일</Text>
                <TextInput
                  style={styles.input}
                  value={birthdate}
                  onChangeText={setBirthdate}
                />
              </View>
            </View>

            <View style={styles.fullWidthInput}>
              <Text style={styles.label}>전화번호</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* 하단 버튼 */}
          <View style={styles.buttonContainer}>
            <View style={styles.divider} />
            <Pressable style={styles.submitButton} onPress={handleUpdate}>
              <Text style={styles.submitText}>수정 완료</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, paddingTop: 12 },
  backButton: { padding: 6 },
  backIcon: { width: 8, height: 16, tintColor: '#B8B8B8' },
  headerTitle: { fontSize: 24, fontWeight: '700', marginLeft: 10, color: '#333' },
  scrollContent: { paddingBottom: 40 },
  sectionTitle: { fontSize: 20, fontWeight: '700', paddingHorizontal: 30, marginTop: 40, marginBottom: 20 },
  card: {
    marginHorizontal: 30,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    backgroundColor: '#FBFBFB',
    paddingTop: 40,
  },
  profileSection: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 85, height: 85, borderRadius: 42.5 },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  cameraIcon: { width: 14, height: 12 },
  userName: { fontSize: 20, fontWeight: '700', marginTop: 12 },
  formContainer: { paddingHorizontal: 20, marginBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  inputItem: { width: '30%' },
  label: { fontSize: 16, fontWeight: '700', color: '#373737', marginBottom: 8 },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
    paddingVertical: 4,
    color: '#606060',
  },
  fixedValue: { fontSize: 16, color: '#B5B5B5', paddingTop: 4 },
  fullWidthInput: { paddingRight: '40%' },
  buttonContainer: { marginTop: 20 },
  divider: { height: 1, backgroundColor: '#EAEAEA' },
  submitButton: { paddingVertical: 20, alignItems: 'center' },
  submitText: { fontSize: 18, fontWeight: '600', color: '#4F4F4F' },
});

export default EditProfileScreen;
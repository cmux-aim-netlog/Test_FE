import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  SafeAreaView, // 추가
} from 'react-native';
import { BADGE_IMAGE_MAP } from '../../../constants/icons';
import { createBadge, updateBadge } from '../../../api/badges';

// 뒤로가기 아이콘 (기존에 쓰시던 right_arrow를 회전해서 쓰거나 다른 아이콘 사용)
const backIcon = require('../../../assets/icon/right_arrow.png'); 

const AdminBadgeWriteScreen = ({ editData, onClose }: any) => {
  const [name, setName] = useState(editData?.name || '');
  const [description, setDescription] = useState(editData?.description || '');
  const [selectedKey, setSelectedKey] = useState(editData?.imageUrl || 'badge_1');

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('알림', '뱃지 이름을 입력해주세요.');
      return;
    }
    
    const payload = { name, description, imageUrl: selectedKey };
    try {
      if (editData) {
        await updateBadge(editData.badgeId, payload);
      } else {
        await createBadge(payload);
      }
      onClose(true); // 성공 시 true 반환하여 목록 새로고침 유도
    } catch (e) {
      Alert.alert('오류', '저장 실패');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => onClose(false)} style={styles.backBtn} hitSlop={15}>
          <Image source={backIcon} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {editData ? '뱃지 수정' : '새 뱃지 등록'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>뱃지 이름</Text>
        <TextInput 
          value={name} 
          onChangeText={setName} 
          style={styles.input} 
          placeholder="예: 얼리버드 챌린지"
        />

        <Text style={styles.label}>뱃지 설명</Text>
        <TextInput 
          value={description} 
          onChangeText={setDescription} 
          style={[styles.input, styles.textArea]} 
          multiline
          placeholder="뱃지 획득 조건을 입력하세요."
        />

        <Text style={styles.label}>이미지 선택</Text>
        <View style={styles.imageGrid}>
          {Object.keys(BADGE_IMAGE_MAP).map((key) => (
            <Pressable 
              key={key} 
              onPress={() => setSelectedKey(key)}
              style={[styles.imageItem, selectedKey === key && styles.selectedItem]}
            >
              <Image source={BADGE_IMAGE_MAP[key]} style={styles.previewImage} />
              <Text style={styles.imageText}>{key}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={handleSubmit} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>저장하기</Text>
        </Pressable>
        
        <Pressable onPress={() => onClose(false)} style={styles.cancelLink}>
          <Text style={styles.cancelLinkText}>작성 취소</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backBtn: { padding: 5 },
  backIcon: { width: 18, height: 18, tintColor: '#333', transform: [{ rotate: '180deg' }] }, 
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#333' },

  container: { padding: 20, paddingBottom: 50 },
  label: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginTop: 20, marginBottom: 8 },
  input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#EEE', padding: 12, borderRadius: 10, fontSize: 14 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10 },
  imageItem: { width: '30%', padding: 10, borderWidth: 2, borderColor: '#F5F5F5', borderRadius: 12, alignItems: 'center' },
  selectedItem: { borderColor: '#2FE377', backgroundColor: '#F0FFF4' },
  previewImage: { width: 45, height: 45, marginBottom: 5, resizeMode: 'contain' },
  imageText: { fontSize: 10, color: '#999', fontWeight: '600' },
  
  saveBtn: { backgroundColor: '#2FE377', padding: 16, borderRadius: 12, marginTop: 40, alignItems: 'center', elevation: 2 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  cancelLink: { marginTop: 20, alignItems: 'center' },
  cancelLinkText: { color: '#AAA', fontSize: 14 },
});

export default AdminBadgeWriteScreen;
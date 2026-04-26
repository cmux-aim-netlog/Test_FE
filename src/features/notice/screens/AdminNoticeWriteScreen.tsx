import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../styles/colors';
import { createNotice, updateNotice } from '../../../api'; 

interface Props {
  onClose: (shouldRefresh?: boolean) => void;
  editData?: any; 
}

const AdminNoticeWriteScreen = ({ onClose, editData }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setContent(editData.content);
    }
  }, [editData]);

  const handleSave = async () => {
    try {
      setLoading(true);
      if (editData) {
        await updateNotice(editData.notice_id, { title, content });
        Alert.alert('성공', '공지가 수정되었습니다.');
      } else {
        await createNotice({ title, content });
        Alert.alert('성공', '새 공지가 등록되었습니다.');
      }
      onClose(true);
    } catch (e) {
      Alert.alert('오류', '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => onClose()}>
          <Text style={styles.cancelText}>취소</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{editData ? '공지 수정하기' : '새 공지 쓰기'}</Text>
        <Pressable onPress={handleSave}>
          <Text style={styles.saveText}>완료</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>공지 제목</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="제목을 입력하세요"
        />

        <Text style={styles.label}>상세 내용</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          placeholder="내용을 입력하세요"
          multiline
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE',
    alignItems: 'center'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  cancelText: { color: '#666', fontSize: 16 },
  saveText: { color: colors.primary, fontSize: 16, fontWeight: 'bold' },
  form: { padding: 20 },
  label: { fontSize: 14, color: '#888', marginBottom: 8 },
  input: { 
    borderWidth: 1, 
    borderColor: '#DDD', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 20,
    fontSize: 16 
  },
  textArea: { minHeight: 200, textAlignVertical: 'top' }
});

export default AdminNoticeWriteScreen;
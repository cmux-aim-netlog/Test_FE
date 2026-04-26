import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../styles/colors';
import { createInquiry } from '../../../api';

type InquiryWriteScreenProps = {
  onClose: () => void;
  onBack: () => void;
};

function InquiryWriteScreen({ onClose, onBack }: InquiryWriteScreenProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('알림', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createInquiry({ title, content });
      Alert.alert('성공', '문의가 등록되었습니다.', [
        { text: '확인', onPress: onBack } // 등록 후 목록으로 이동
      ]);
    } catch (error) {
      Alert.alert('오류', '문의 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={10} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>1:1 문의</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>제목</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="제목을 작성해주세요."
          placeholderTextColor="#C9C9C9"
          style={styles.input}
        />
        <Text style={styles.label}>내용</Text>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="내용을 작성해주세요."
          placeholderTextColor="#C9C9C9"
          style={styles.textarea}
          multiline
          textAlignVertical="top"
        />
      </View>
      <View style={styles.bottom}>
        <Pressable 
          style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>등록</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 28,
    color: '#9A9A9A',
    marginTop: -4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 220,
    fontSize: 14,
    color: colors.textPrimary,
  },
  bottom: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 26,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default InquiryWriteScreen;

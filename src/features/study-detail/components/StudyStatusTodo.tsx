import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import StudyStatusTodoMyEmpty from './StudyStatusTodoMyEmpty';
import StudyStatusTodoMyFilled from './StudyStatusTodoMyFilled';
import StudyStatusTodoOthers from './StudyStatusTodoOthers';
import {
  getChecklistItems,
  addChecklistItem,
  setChecklistCheck,
  getChecklistResult,
  getVerificationDateToday,
  type ChecklistItemRes,
} from '../../../api/verification';
import { colors } from '../../../styles/colors';

type StudyStatusTodoProps = {
  groupId: string;
  slot: number;
};

function StudyStatusTodo({ groupId, slot }: StudyStatusTodoProps) {
  const [items, setItems] = useState<ChecklistItemRes[]>([]);
  const [result, setResult] = useState<{ passed: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const date = getVerificationDateToday();

  const refresh = useCallback(() => {
    setLoading(true);
    Promise.all([
      getChecklistItems(groupId, slot, date),
      getChecklistResult(groupId, slot, date).then(
        (r) => r.data?.data ?? null,
      ).catch(() => null),
    ])
      .then(([itemsRes, resultData]) => {
        setItems(itemsRes.data?.data ?? []);
        setResult(resultData ? { passed: resultData.passed } : null);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [groupId, slot, date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleToggleCheck = useCallback(
    (itemId: number, checked: boolean) => {
      setChecklistCheck(groupId, slot, {
        itemId,
        verificationDate: date,
        checked,
      })
        .then(() => refresh())
        .catch(() => Alert.alert('체크 저장 실패', '다시 시도해 주세요.'));
    },
    [groupId, slot, date, refresh],
  );

  const handleAddItem = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;
      setSubmitting(true);
      addChecklistItem(groupId, slot, { content: trimmed }, date)
        .then(() => {
          setAddModalVisible(false);
          setDraftContent('');
          refresh();
        })
        .catch((err) => {
          const msg =
            err?.response?.status === 400
              ? '작성 마감 시간이 지났거나 오늘만 작성할 수 있어요.'
              : '항목 추가에 실패했어요.';
          Alert.alert('추가 실패', msg);
        })
        .finally(() => setSubmitting(false));
    },
    [groupId, slot, date, refresh],
  );

  const hasMyTodos = items.length > 0;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingText}>불러오는 중…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {hasMyTodos ? (
        <StudyStatusTodoMyFilled
          items={items}
          result={result}
          onToggleCheck={handleToggleCheck}
          onAddPress={() => setAddModalVisible(true)}
        />
      ) : (
        <StudyStatusTodoMyEmpty onAddPress={() => setAddModalVisible(true)} />
      )}
      <StudyStatusTodoOthers />

      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => !submitting && setAddModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>TODO 항목 추가</Text>
            <TextInput
              style={styles.modalInput}
              value={draftContent}
              onChangeText={setDraftContent}
              placeholder="내용 (최대 500자)"
              placeholderTextColor="#B0B0B0"
              maxLength={500}
              editable={!submitting}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => !submitting && setAddModalVisible(false)}
                disabled={submitting}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </Pressable>
              <Pressable
                style={[styles.modalSubmit, submitting && styles.modalSubmitDisabled]}
                onPress={() => handleAddItem(draftContent)}
                disabled={submitting || !draftContent.trim()}
              >
                <Text style={styles.modalSubmitText}>
                  {submitting ? '등록 중…' : '등록'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  loadingWrap: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
    minHeight: 44,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalCancelText: {
    fontSize: 14,
    color: '#666',
  },
  modalSubmit: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  modalSubmitDisabled: {
    opacity: 0.6,
  },
  modalSubmitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default StudyStatusTodo;

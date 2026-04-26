import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import type { ChecklistItemRes } from '../../../api/verification';

const vectorIcon = require('../../../assets/icon/vector_icon.png');
const mascotImage = require('../../../assets/character/ch_2.png');

type StudyStatusTodoMyFilledProps = {
  items: ChecklistItemRes[];
  result: { passed: boolean } | null;
  onToggleCheck: (itemId: number, checked: boolean) => void;
  onAddPress: () => void;
};

function StudyStatusTodoMyFilled({
  items,
  result,
  onToggleCheck,
  onAddPress,
}: StudyStatusTodoMyFilledProps) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>나의 TODO</Text>
        {result != null && (
          <Text style={result.passed ? styles.resultPass : styles.resultFail}>
            {result.passed ? '인증 완료' : '인증 미완료'}
          </Text>
        )}
      </View>
      <View style={styles.contentRow}>
        <View style={styles.todoList}>
          {items.map((item) => (
            <View key={item.itemId} style={styles.todoRow}>
              <Pressable
                style={[styles.check, item.checked && styles.checkActive]}
                onPress={() => onToggleCheck(item.itemId, !item.checked)}
              >
                {item.checked && (
                  <Image source={vectorIcon} style={styles.checkIcon} />
                )}
              </Pressable>
              <Text
                style={[styles.todoText, item.checked && styles.todoTextChecked]}
              >
                {item.content}
              </Text>
            </View>
          ))}
        </View>
        <Image source={mascotImage} style={styles.mascot} resizeMode="contain" />
      </View>
      <Pressable style={styles.addButton} onPress={onAddPress}>
        <Text style={styles.addText}>+ 추가하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  resultPass: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  resultFail: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  todoList: {
    flex: 1,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  check: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#C8C8C8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkIcon: {
    width: 9,
    height: 7,
    tintColor: '#FFFFFF',
  },
  todoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  todoTextChecked: {
    textDecorationLine: 'line-through',
  },
  mascot: {
    width: 86,
    height: 86,
  },
  addButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  addText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default StudyStatusTodoMyFilled;

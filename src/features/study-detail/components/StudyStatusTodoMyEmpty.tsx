import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type StudyStatusTodoMyEmptyProps = {
  onAddPress: () => void;
};

function StudyStatusTodoMyEmpty({ onAddPress }: StudyStatusTodoMyEmptyProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>나의 TODO</Text>
      <View style={styles.emptyWrap}>
        <Pressable style={styles.plusButton} onPress={onAddPress}>
          <Text style={styles.plusText}>+</Text>
        </Pressable>
        <Text style={styles.emptyText}>등록한 일정이 없어요.</Text>
      </View>
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
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  plusButton: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  plusText: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default StudyStatusTodoMyEmpty;

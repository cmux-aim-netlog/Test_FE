import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

const people = [
  {
    name: '라즈베리님',
    todos: [
      { id: 1, label: '영단어 10개 외우기', checked: true },
      { id: 2, label: '영단어 10개 외우기', checked: false },
      { id: 3, label: '영단어 10개 외우기', checked: false },
    ],
  },
  {
    name: '단쌀말님',
    todos: [
      { id: 1, label: '영단어 10개 외우기', checked: true },
      { id: 2, label: '영단어 10개 외우기', checked: false },
      { id: 3, label: '영단어 10개 외우기', checked: false },
    ],
  },
];

function StudyStatusTodoOthers() {
  return (
    <View style={styles.gridRow}>
      {people.map((person) => (
        <View key={person.name} style={styles.todoSmall}>
          <Text style={styles.smallName}>{person.name}</Text>
          {person.todos.map((todo) => (
            <View key={todo.id} style={styles.todoRow}>
              <View style={[styles.check, todo.checked && styles.checkActive]} />
              <Text style={styles.todoText}>{todo.label}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  todoSmall: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    padding: 12,
  },
  smallName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  check: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#C8C8C8',
    backgroundColor: '#FFFFFF',
  },
  checkActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  todoText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});

export default StudyStatusTodoOthers;

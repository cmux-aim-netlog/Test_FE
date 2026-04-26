import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../../styles/colors';

type GroupNameSectionProps = {
  value: string;
  count: number;
  maxLength: number;
  onChange: (next: string) => void;
};

function GroupNameSection({ value, count, maxLength, onChange }: GroupNameSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>그룹명</Text>
      <View style={styles.inputWrap}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="예) 지기는 스터디"
          placeholderTextColor="#B0B0B0"
          style={styles.input}
          editable
          maxLength={maxLength}
        />
        <Text style={styles.countText}>
          {count}/{maxLength}자
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 28,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  inputWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 2,
    position: 'relative',
  },
  input: {
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 2,
  },
  countText: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    fontSize: 11,
    color: '#B0B0B0',
  },
});

export default GroupNameSection;

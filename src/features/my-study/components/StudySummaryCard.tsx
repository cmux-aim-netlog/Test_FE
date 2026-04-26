import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type SummaryRowProps = {
  label: string;
  value: string;
  multiline?: boolean;
};

function SummaryRow({ label, value, multiline }: SummaryRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, multiline && styles.valueMultiline]}>{value}</Text>
    </View>
  );
}

type StudySummaryCardProps = {
  rows: SummaryRowProps[];
  onEdit?: () => void;
};

const modifyIcon = require('../../../assets/icon/modify_icon.png');

function StudySummaryCard({ rows, onEdit }: StudySummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>스터디 요약 정보</Text>
        <Pressable onPress={onEdit} hitSlop={6} disabled={!onEdit}>
          <Image source={modifyIcon} style={styles.editIcon} />
        </Pressable>
      </View>
      {rows.map((row) => (
        <SummaryRow key={`${row.label}-${row.value}`} {...row} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginHorizontal: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  editIcon: {
    width: 16,
    height: 18,
    tintColor: '#C2C2C2',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  value: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'right',
    maxWidth: '60%',
  },
  valueMultiline: {
    textAlign: 'right',
    lineHeight: 18,
  },
});

export default StudySummaryCard;

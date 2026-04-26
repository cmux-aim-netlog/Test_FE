import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

const memberIcon = require('../../../assets/icon/people_icon.png');
const rulesIcon = require('../../../assets/icon/rule_icon.png');
const infoIcon = require('../../../assets/icon/study_info_icon.png');
const leaveIcon = require('../../../assets/icon/exit_icon.png');
const arrowIcon = require('../../../assets/icon/right_arrow.png');

const rows = [
  { id: 'members', label: '멤버 정보', icon: memberIcon, width: 24, height: 16 },
  { id: 'rules', label: '상세규칙', icon: rulesIcon, width: 24, height: 22 },
  { id: 'info', label: '스터디 정보', icon: infoIcon, width: 24, height: 24 },
  { id: 'leave', label: '탈퇴하기', icon: leaveIcon, width: 18, height: 26 },
] as const;

type InfoRowId = (typeof rows)[number]['id'];

type StudyInfoTabProps = {
  onSelectRow?: (id: InfoRowId) => void;
  /** 방장일 때 탈퇴하기 대신 삭제하기 표시 */
  isOwner?: boolean;
};

function StudyInfoTab({ onSelectRow, isOwner }: StudyInfoTabProps) {
  const getRowLabel = (row: (typeof rows)[number]) =>
    row.id === 'leave' && isOwner ? '삭제하기' : row.label;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {rows.map((row) => (
          <Pressable
            key={row.id}
            style={styles.row}
            onPress={() => onSelectRow?.(row.id)}
          >
            <View style={styles.rowLeft}>
              <Image source={row.icon} style={[styles.icon, { width: row.width, height: row.height }]} />
              <Text style={styles.label}>{getRowLabel(row)}</Text>
            </View>
            <Image source={arrowIcon} style={styles.arrow} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: {
    paddingHorizontal: 25,
    paddingVertical: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  arrow: {
    position: 'absolute',
    right: 18,
    top: 18,
    width: 7,
    height: 14,
    tintColor: '#C2C2C2',
  },
  divider: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 0,
    height: 1,
    backgroundColor: '#EFEFEF',
  },
});

export default StudyInfoTab;

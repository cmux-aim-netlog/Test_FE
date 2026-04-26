import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../../styles/colors';

const profileImage = require('../../../assets/icon/profile_2.png');
const linkIcon = require('../../../assets/icon/link_icon.png');
const modifyIcon = require('../../../assets/icon/modify_icon.png');
const checkIcon = require('../../../assets/icon/check_icon.png');
const cancelIcon = require('../../../assets/icon/cancel_icon.png');

const initialRows = [
  {
    name: '라즈베리',
    title: '백준 20001번',
    status: { label: '완료', tone: 'success' as const },
    editable: true,
    hasLink: true,
  },
  {
    name: '단쌀말',
    title: '백준 20001번',
    status: { label: '완료', tone: 'success' as const },
    editable: false,
    hasLink: true,
  },
  {
    name: 'LDK',
    title: '백준 20001번',
    status: { label: '완료', tone: 'success' as const },
    editable: false,
    hasLink: true,
  },
  {
    name: '서윤호',
    title: '백준 20001번',
    status: { label: '미인증', tone: 'fail' as const },
    editable: false,
    hasLink: false,
  },
];

function StudyStatusGithub() {
  const [rows, setRows] = useState(initialRows);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftTitle, setDraftTitle] = useState('');

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setDraftTitle(rows[index].title);
  };

  const submitEditing = () => {
    if (editingIndex === null) return;
    const trimmed = draftTitle.trim();
    setRows((prev) =>
      prev.map((row, index) =>
        index === editingIndex ? { ...row, title: trimmed || row.title } : row,
      ),
    );
    setEditingIndex(null);
    setDraftTitle('');
  };

  return (
    <View style={styles.container}>
      {rows.map((row, index) => (
        <View key={`${row.name}-${index}`} style={styles.row}>
          <Image source={profileImage} style={styles.avatar} />
          <View style={styles.content}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{row.name} 님</Text>
              {row.editable && (
                <Pressable onPress={() => startEditing(index)} hitSlop={6}>
                  <Image source={modifyIcon} style={styles.modifyIcon} />
                </Pressable>
              )}
            </View>
            <View style={styles.statusRow}>
              {editingIndex === index ? (
                <TextInput
                  value={draftTitle}
                  onChangeText={setDraftTitle}
                  onSubmitEditing={submitEditing}
                  onBlur={submitEditing}
                  style={styles.titleInput}
                  returnKeyType="done"
                  autoFocus
                />
              ) : (
                <Text style={styles.title}>{row.title}</Text>
              )}
              <View style={styles.statusWrap}>
                <Text style={[styles.statusText, row.status.tone === 'fail' && styles.statusFail]}>
                  {row.status.label}
                </Text>
                <Image
                  source={row.status.tone === 'fail' ? cancelIcon : checkIcon}
                  style={styles.statusIcon}
                />
              </View>
            </View>
          </View>
          {row.hasLink && (
            <Pressable style={styles.linkButton}>
              <Image source={linkIcon} style={styles.linkIcon} />
              <Text style={styles.linkText}>링크</Text>
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingBottom: 30,
    marginTop: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 22,
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 10,
    color: '#6E6E6E',
    fontWeight: '400',
  },
  modifyIcon: {
    width: 8,
    height: 9,
    tintColor: '#7D7D7D',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  titleInput: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingVertical: 0,
    minWidth: 120,
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#7D7D7D',
    fontWeight: '600',
  },
  statusFail: {
    fontSize: 12,
    color: '#7D7D7D',
    fontWeight: '600',
  },
  statusIcon: {
    width: 11,
    height: 11,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  linkIcon: {
    marginLeft: -3,
    width: 23,
    height: 23,
    tintColor: colors.primary,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default StudyStatusGithub;

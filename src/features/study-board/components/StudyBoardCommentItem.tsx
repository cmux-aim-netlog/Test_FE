import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../../styles/colors';
import { Comment } from './StudyBoardPostTypes';

const profileImage = require('../../../assets/icon/profile_1.png');

type StudyBoardCommentItemProps = {
  comment: Comment;
  onEdit?: (content: string) => void;
  onDelete?: () => void;
};

function StudyBoardCommentItem({
  comment,
  onEdit,
  onDelete,
}: StudyBoardCommentItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const canEdit = Boolean(comment.isMine && onEdit);
  const canDelete = Boolean(comment.isMine && onDelete);

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && onEdit) {
      onEdit(trimmed);
      setEditing(false);
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;
    Alert.alert('댓글 삭제', '이 댓글을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <View style={styles.commentRow}>
      <Image source={profileImage} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentName} numberOfLines={1}>
            {comment.name}
          </Text>
          {comment.date && <Text style={styles.commentDate}>{comment.date}</Text>}
          {(canEdit || canDelete) && !editing && (
            <View style={styles.actions}>
              {canEdit && (
                <Pressable onPress={() => setEditing(true)} style={styles.actionBtn}>
                  <Text style={styles.actionText}>수정</Text>
                </Pressable>
              )}
              {canDelete && (
                <Pressable onPress={handleDelete} style={styles.actionBtn}>
                  <Text style={[styles.actionText, styles.actionDanger]}>삭제</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
        {editing ? (
          <View style={styles.editWrap}>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              placeholder="댓글 내용"
              placeholderTextColor="#B0B0B0"
              multiline
              maxLength={2000}
            />
            <View style={styles.editActions}>
              <Pressable onPress={() => { setEditing(false); setEditText(comment.text); }} style={styles.editCancelBtn}>
                <Text style={styles.editCancelText}>취소</Text>
              </Pressable>
              <Pressable onPress={handleSaveEdit} style={styles.editSaveBtn}>
                <Text style={styles.editSaveText}>저장</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Text style={styles.commentText}>{comment.text}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 4,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
    paddingTop: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  commentName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    maxWidth: 140,
  },
  commentDate: {
    fontSize: 12,
    color: '#9B9B9B',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 'auto',
  },
  actionBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  actionText: {
    fontSize: 12,
    color: '#3B82F6',
  },
  actionDanger: {
    color: '#dc2626',
  },
  commentText: {
    fontSize: 13,
    color: '#4F4F4F',
    lineHeight: 18,
  },
  editWrap: {
    marginTop: 4,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 6,
  },
  editCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editCancelText: {
    fontSize: 13,
    color: '#666',
  },
  editSaveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  editSaveText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});

export default StudyBoardCommentItem;

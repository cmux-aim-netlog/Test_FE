import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type GestureResponderHandlers,
} from 'react-native';
import { colors } from '../../../styles/colors';
import StudyBoardCommentItem from './StudyBoardCommentItem';
import StudyBoardMetaItem from './StudyBoardMetaItem';
import { Post } from './StudyBoardPostTypes';

const likeIcon = require('../../../assets/icon/like_icon.png');
const commentIcon = require('../../../assets/icon/comment_icon.png');
const submitIcon = require('../../../assets/icon/submit_icon.png');
const profileImage = require('../../../assets/icon/profile_1.png');
const alarmIcon = require('../../../assets/icon/alarm_icon.png');

type StudyBoardPostModalProps = {
  visible: boolean;
  post: Post | null;
  postDetailLoading?: boolean;
  translateY: Animated.Value;
  panHandlers: GestureResponderHandlers;
  draftComment: string;
  onChangeDraft: (value: string) => void;
  onClose: () => void;
  onToggleLike: (postId: number) => void;
  onToggleAlarm: (postId: number) => void;
  onSubmitComment?: (postId: number, content: string) => void;
  onEditComment?: (postId: number, commentId: number, content: string) => void;
  onDeleteComment?: (postId: number, commentId: number) => void;
  onEditPost?: (postId: number, title: string, content: string) => void;
  onDeletePost?: (postId: number) => void;
};

function StudyBoardPostModal({
  visible,
  post,
  postDetailLoading = false,
  translateY,
  panHandlers,
  draftComment,
  onChangeDraft,
  onClose,
  onToggleLike,
  onToggleAlarm,
  onSubmitComment,
  onEditComment,
  onDeleteComment,
  onEditPost,
  onDeletePost,
}: StudyBoardPostModalProps) {
  const [editingPost, setEditingPost] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const imageAspectRatio = React.useMemo(() => {
    if (!post?.image) return null;
    const source = Image.resolveAssetSource(post.image);
    if (!source?.width || !source?.height) return null;
    return source.width / source.height;
  }, [post?.image]);

  const startEditPost = () => {
    if (post) {
      setEditTitle(post.title);
      setEditContent(post.detail);
      setEditingPost(true);
    }
  };

  const saveEditPost = () => {
    if (post && onEditPost) {
      onEditPost(post.id, editTitle.trim(), editContent.trim());
      setEditingPost(false);
    }
  };

  const cancelEditPost = () => {
    setEditingPost(false);
  };

  const handleDeletePost = () => {
    if (!post || !onDeletePost) return;
    Alert.alert('게시글 삭제', '이 게시글을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => onDeletePost(post.id) },
    ]);
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]} {...panHandlers}>
          <View style={styles.sheetHandle} />
          {postDetailLoading && !post ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>불러오는 중…</Text>
            </View>
          ) : post ? (
            <ScrollView contentContainerStyle={styles.sheetContent} keyboardShouldPersistTaps="handled">
              <View style={styles.sheetHeader}>
                <View style={styles.sheetHeaderLeft}>
                  <Image source={profileImage} style={styles.sheetAvatar} />
                  <View>
                    <Text style={styles.sheetName}>{post.name}</Text>
                    <Text style={styles.sheetDate}>{post.date}</Text>
                  </View>
                </View>
                <View style={styles.sheetHeaderRight}>
                  {(onEditPost || onDeletePost) && !editingPost && (
                    <>
                      {onEditPost && (
                        <Pressable onPress={startEditPost} style={styles.headerActionBtn}>
                          <Text style={styles.headerActionText}>수정</Text>
                        </Pressable>
                      )}
                      {onDeletePost && (
                        <Pressable onPress={handleDeletePost} style={styles.headerActionBtn}>
                          <Text style={[styles.headerActionText, styles.headerActionDanger]}>삭제</Text>
                        </Pressable>
                      )}
                    </>
                  )}
                  <Pressable onPress={() => onToggleAlarm(post.id)}>
                    <Image
                      source={alarmIcon}
                      style={[styles.sheetAlarm, post.alarmEnabled && styles.sheetAlarmActive]}
                    />
                  </Pressable>
                </View>
              </View>

              {editingPost ? (
                <View style={styles.editPostWrap}>
                  <Text style={styles.createLabel}>제목</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editTitle}
                    onChangeText={setEditTitle}
                    placeholder="제목"
                    placeholderTextColor="#B0B0B0"
                    maxLength={255}
                  />
                  <Text style={styles.createLabel}>내용</Text>
                  <TextInput
                    style={[styles.editInput, styles.editContentInput]}
                    value={editContent}
                    onChangeText={setEditContent}
                    placeholder="내용"
                    placeholderTextColor="#B0B0B0"
                    multiline
                    maxLength={10000}
                  />
                  <View style={styles.editPostActions}>
                    <Pressable onPress={cancelEditPost} style={styles.editCancelBtn}>
                      <Text style={styles.editCancelText}>취소</Text>
                    </Pressable>
                    <Pressable onPress={saveEditPost} style={styles.editSaveBtn}>
                      <Text style={styles.editSaveText}>저장</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={styles.sheetTitle}>{post.title}</Text>
                  <Text style={styles.sheetText}>{post.detail}</Text>
                </>
              )}

              {!editingPost && (
                <>
                  {post.image && (
                    <Image
                      source={post.image}
                      style={[
                        styles.sheetImage,
                        imageAspectRatio ? { aspectRatio: imageAspectRatio } : undefined,
                      ]}
                      resizeMode="contain"
                    />
                  )}
                  <View style={styles.sheetMetaRow}>
                    <Pressable onPress={() => onToggleLike(post.id)}>
                      <StudyBoardMetaItem
                        icon={likeIcon}
                        text={`공감 ${post.likes}`}
                        iconSize={{ width: 17, height: 19 }}
                        iconStyle={post.liked ? styles.likedIcon : undefined}
                        textStyle={post.liked ? styles.likedText : undefined}
                      />
                    </Pressable>
                    <StudyBoardMetaItem
                      icon={commentIcon}
                      text={`댓글 ${post.comments}`}
                      iconSize={{ width: 16, height: 16 }}
                    />
                  </View>

                  <View style={styles.commentDivider} />
                  <View style={styles.adBanner}>
                    <Text style={styles.adText}>광고</Text>
                  </View>
                  <View style={styles.commentList}>
                    {post.commentList.map((comment) => (
                      <StudyBoardCommentItem
                        key={comment.id}
                        comment={comment}
                        onEdit={
                          comment.isMine && onEditComment
                            ? (content) => onEditComment(post.id, comment.id, content)
                            : undefined
                        }
                        onDelete={
                          comment.isMine && onDeleteComment
                            ? () => onDeleteComment(post.id, comment.id)
                            : undefined
                        }
                      />
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          ) : null}
          {post && !editingPost && (
            <View style={styles.commentInputRow}>
              <View style={styles.commentInputWrap}>
                <TextInput
                  value={draftComment}
                  onChangeText={onChangeDraft}
                  placeholder="댓글을 입력하세요. (최대 2000자)"
                  placeholderTextColor="#B0B0B0"
                  style={styles.commentInput}
                  maxLength={2000}
                />
                <Pressable
                  style={styles.submitButton}
                  onPress={() => {
                    if (draftComment.trim() && onSubmitComment) {
                      onSubmitComment(post.id, draftComment);
                    }
                  }}
                >
                  <Image source={submitIcon} style={styles.submitIcon} />
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sheet: {
    height: '90%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    overflow: 'hidden',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 72,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E1E1E1',
    marginBottom: 12,
  },
  sheetContent: {
    paddingHorizontal: 40,
    paddingBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 45,
  },
  sheetAlarm: {
    alignSelf: 'flex-start',
    width: 22,
    height: 27,
    tintColor: '#CFCFCF',
  },
  sheetAlarmActive: {
    tintColor: colors.primary,
  },
  sheetAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sheetName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sheetDate: {
    fontSize: 12,
    color: '#9B9B9B',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sheetText: {
    fontSize: 14,
    color: '#6F6F6F',
    lineHeight: 20,
    marginBottom: 16,
  },
  sheetImage: {
    width: '100%',
    maxHeight: 311,
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 16,
  },
  sheetMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  likedIcon: {
    tintColor: colors.primary,
  },
  likedText: {
    color: colors.primary,
  },
  commentDivider: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginBottom: 10,
  },
  adBanner: {
    height: 52,
    borderRadius: 0,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  adText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5F5F5F',
  },
  commentList: {
    gap: 12,
  },
  commentInputRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
  },
  commentInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    paddingVertical: 6,
    fontSize: 12,
    color: colors.textPrimary,
  },
  submitButton: {
    width: 29,
    height: 29,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  submitIcon: {
    width: 29,
    height: 29,
  },
  loadingWrap: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  sheetHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerActionText: {
    fontSize: 13,
    color: '#3B82F6',
  },
  headerActionDanger: {
    color: '#dc2626',
  },
  editPostWrap: {
    marginBottom: 16,
  },
  createLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  editContentInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  editPostActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  editCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editCancelText: {
    fontSize: 14,
    color: '#666',
  },
  editSaveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  editSaveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default StudyBoardPostModal;

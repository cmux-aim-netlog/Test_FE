import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import StudyBoardPostCard from './StudyBoardPostCard';
import StudyBoardPostModal from './StudyBoardPostModal';
import { Post, formatPostDate } from './StudyBoardPostTypes';
import { useNotificationCenter } from '../../../state/NotificationCenterContext';
import { getCurrentUserId } from '../../../api/client';
import {
  fetchBoardPosts,
  fetchBoardPostDetail,
  createBoardPost,
  updateBoardPost,
  deleteBoardPost,
  createBoardComment,
  updateBoardComment,
  deleteBoardComment,
  toggleBoardEmpathy,
  type BoardPostListItem,
  type BoardPostDetailRes,
  type BoardCommentRes,
} from '../../../api/studyBoard';
import { fetchStudyGroupMembers } from '../../../api/studyGroups';

const screenHeight = Dimensions.get('window').height;

type NicknameMap = Record<string, string>;

function listItemToPost(
  item: BoardPostListItem,
  studyName: string,
  nicknameMap: NicknameMap,
): Post {
  const authorUserId = item.authorUserId != null ? String(item.authorUserId) : undefined;
  return {
    id: item.postId,
    studyName,
    name: authorUserId ? (nicknameMap[authorUserId] ?? '회원') : '회원',
    title: item.title,
    desc: item.title.length > 50 ? item.title.slice(0, 50) + '…' : item.title,
    detail: '',
    date: '',
    likes: item.empathyCount,
    liked: false,
    alarmEnabled: false,
    comments: item.commentCount,
    commentList: [],
    authorUserId,
  };
}

function detailToPost(
  d: BoardPostDetailRes,
  studyName: string,
  nicknameMap: NicknameMap,
): Post {
  const authorUserIdStr = d.authorUserId != null ? String(d.authorUserId) : '';
  const commentList: Post['commentList'] = d.comments.map((c: BoardCommentRes) => {
    const userIdStr = c.userId != null ? String(c.userId) : '';
    return {
      id: c.commentId,
      name: nicknameMap[userIdStr] ?? '회원',
      text: c.content,
      date: formatPostDate(c.createdAt),
      isMine: c.isMine,
    };
  });
  return {
    id: d.postId,
    studyName,
    name: nicknameMap[authorUserIdStr] ?? '회원',
    title: d.title,
    desc: d.title,
    detail: d.content,
    date: formatPostDate(d.createdAt),
    likes: d.empathyCount,
    liked: d.empathized,
    alarmEnabled: false,
    comments: d.commentCount,
    commentList,
    authorUserId: authorUserIdStr || undefined,
  };
}

type StudyBoardTabProps = {
  groupId: string;
  studyName: string;
};

function StudyBoardTab({ groupId, studyName }: StudyBoardTabProps) {
  const currentUserId = getCurrentUserId();
  const { notifications, addNotification, removeNotification, updateNotification } =
    useNotificationCenter();

  const [nicknameMap, setNicknameMap] = useState<NicknameMap>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [draftComment, setDraftComment] = useState('');
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (!groupId) return;
    fetchStudyGroupMembers(groupId)
      .then(({ data }) => {
        if (data?.data) {
          const map: NicknameMap = {};
          data.data.forEach((m) => {
            map[m.userId] = m.nickname?.trim() || '회원';
          });
          setNicknameMap(map);
        }
      })
      .catch(() => {});
  }, [groupId]);

  const refreshList = useCallback((silent = false) => {
    if (!groupId) return;
    if (!silent) {
      setListLoading(true);
      setListError(null);
    }
    fetchBoardPosts(groupId, { page: 0, size: 50 })
      .then(({ data }) => {
        if (data?.data?.content) {
          setPosts(
            data.data.content.map((item) => listItemToPost(item, studyName, nicknameMap)),
          );
        } else {
          setPosts([]);
        }
      })
      .catch((err) => {
        if (silent) return;
        const status = err?.response?.status;
        const msg =
          status === 403
            ? '스터디 멤버만 게시판을 볼 수 있습니다.'
            : status === 404
              ? '스터디 그룹을 찾을 수 없습니다.'
              : status === 401
                ? '로그인이 필요합니다.'
                : '목록을 불러오지 못했습니다. 연결을 확인해 주세요.';
        setListError(msg);
        setPosts([]);
      })
      .finally(() => {
        if (!silent) setListLoading(false);
      });
  }, [groupId, studyName, nicknameMap]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  useEffect(() => {
    if (Object.keys(nicknameMap).length === 0) return;
    setPosts((prev) =>
      prev.map((p) => ({
        ...p,
        name: p.authorUserId ? (nicknameMap[p.authorUserId] ?? '회원') : p.name,
      })),
    );
  }, [nicknameMap]);

  const openPost = useCallback(
    (post: Post) => {
      setModalVisible(true);
      setDetailLoading(true);
      setSelectedPost(null);
      translateY.setValue(screenHeight);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();

      fetchBoardPostDetail(groupId, post.id)
        .then(({ data }) => {
          if (data?.data) {
            setSelectedPost(detailToPost(data.data, studyName, nicknameMap));
          }
        })
        .catch(() => {})
        .finally(() => setDetailLoading(false));
    },
    [groupId, studyName, nicknameMap, translateY],
  );

  const closePost = useCallback(() => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedPost(null);
      setDraftComment('');
    });
  }, [translateY]);

  const toggleLike = useCallback(
    (postId: number) => {
      toggleBoardEmpathy(groupId, postId)
        .then(({ data }) => {
          if (!data?.data) return;
          const { empathized, empathyCount } = data.data;
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId ? { ...p, liked: empathized, likes: empathyCount } : p,
            ),
          );
          if (selectedPost?.id === postId) {
            setSelectedPost((p) =>
              p ? { ...p, liked: empathized, likes: empathyCount } : null,
            );
          }
          const updated = posts.find((p) => p.id === postId);
          if (updated) {
            updateNotification({ ...updated, liked: empathized, likes: empathyCount });
          }
        })
        .catch(() => {});
    },
    [groupId, selectedPost?.id, posts, updateNotification],
  );

  const toggleAlarm = useCallback(
    (postId: number) => {
      const currentPost = posts.find((p) => p.id === postId) || selectedPost;
      if (!currentPost || currentPost.id !== postId) return;
      const nextPost = { ...currentPost, alarmEnabled: !currentPost.alarmEnabled };
      setPosts((prev) => prev.map((p) => (p.id === postId ? nextPost : p)));
      if (nextPost.alarmEnabled) {
        addNotification(nextPost);
      } else {
        removeNotification(postId);
      }
    },
    [posts, selectedPost, addNotification, removeNotification],
  );

  useEffect(() => {
    const notificationMap = new Map(notifications.map((post) => [post.id, post]));
    setPosts((prev) =>
      prev.map((post) => {
        const match = notificationMap.get(post.id);
        return match
          ? { ...post, alarmEnabled: true, liked: match.liked, likes: match.likes }
          : { ...post, alarmEnabled: false };
      }),
    );
  }, [notifications]);

  const handleSubmitComment = useCallback(
    (postId: number, content: string) => {
      if (!content.trim()) return;
      createBoardComment(groupId, postId, { content: content.trim() })
        .then(() => {
          setDraftComment('');
          return fetchBoardPostDetail(groupId, postId);
        })
        .then(({ data }) => {
          if (data?.data && selectedPost?.id === postId) {
            setSelectedPost(detailToPost(data.data, studyName, nicknameMap));
          }
          refreshList();
        })
        .catch(() => {});
    },
    [groupId, studyName, selectedPost?.id, refreshList],
  );

  const handleEditComment = useCallback(
    (postId: number, commentId: number, content: string) => {
      if (!content.trim()) return;
      updateBoardComment(groupId, postId, commentId, { content: content.trim() })
        .then(() => fetchBoardPostDetail(groupId, postId))
        .then(({ data }) => {
          if (data?.data && selectedPost?.id === postId) {
            setSelectedPost(detailToPost(data.data, studyName, nicknameMap));
          }
          refreshList();
        })
        .catch(() => {});
    },
    [groupId, studyName, selectedPost?.id, refreshList],
  );

  const handleDeleteComment = useCallback(
    (postId: number, commentId: number) => {
      deleteBoardComment(groupId, postId, commentId)
        .then(() => fetchBoardPostDetail(groupId, postId))
        .then(({ data }) => {
          if (data?.data && selectedPost?.id === postId) {
            setSelectedPost(detailToPost(data.data, studyName, nicknameMap));
          }
          refreshList();
        })
        .catch(() => {});
    },
    [groupId, studyName, selectedPost?.id, refreshList],
  );

  const handleDeletePost = useCallback(
    (postId: number) => {
      deleteBoardPost(groupId, postId)
        .then(() => {
          closePost();
          refreshList();
        })
        .catch(() => {});
    },
    [groupId, closePost, refreshList],
  );

  const handleEditPost = useCallback(
    (postId: number, title: string, content: string) => {
      updateBoardPost(groupId, postId, { title, content })
        .then(() => fetchBoardPostDetail(groupId, postId))
        .then(({ data }) => {
          if (data?.data) {
            setSelectedPost(detailToPost(data.data, studyName, nicknameMap));
          }
          refreshList();
        })
        .catch(() => {});
    },
    [groupId, studyName, refreshList],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 6,
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) translateY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > 120 || gesture.vy > 1) {
            closePost();
          } else {
            Animated.timing(translateY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [translateY, closePost],
  );

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createContent, setCreateContent] = useState('');
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const handleCreatePost = useCallback(() => {
    if (!createTitle.trim() || !createContent.trim()) return;
    setCreateSubmitting(true);
    createBoardPost(groupId, { title: createTitle.trim(), content: createContent.trim() })
      .then(() => {
        setShowCreateModal(false);
        setCreateTitle('');
        setCreateContent('');
        setCreateSubmitting(false);
        refreshList(true);
      })
      .catch((err) => {
        setCreateSubmitting(false);
        const status = err?.response?.status;
        const serverMsg = err?.response?.data?.message;
        const msg =
          status === 403
            ? '스터디 멤버만 글을 쓸 수 있습니다.'
            : status === 401
              ? '로그인이 필요합니다. (토큰 만료 시 재로그인)'
              : status === 400
                ? serverMsg || '제목과 내용을 확인해 주세요.'
                : status != null
                  ? `서버 오류 (${status})`
                  : err?.message || '연결을 확인해 주세요.';
        Alert.alert('글 등록 실패', msg);
      });
  }, [groupId, createTitle, createContent, refreshList]);

  const isPostMine = selectedPost?.authorUserId != null && selectedPost.authorUserId === currentUserId;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerSpacer} />
        <Pressable style={styles.writeButton} onPress={() => setShowCreateModal(true)}>
          <Text style={styles.writeButtonText}>글쓰기</Text>
        </Pressable>
      </View>

      {listLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>게시글 목록 불러오는 중…</Text>
        </View>
      ) : listError ? (
        <View style={styles.center}>
          <Text style={styles.emptyDesc}>새글을 작성해 보세요.</Text>
        </View>
      ) : (
        <>
          {posts.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyDesc}>새글을 작성해 보세요.</Text>
            </View>
          ) : (
            posts.map((post) => (
              <StudyBoardPostCard
                key={post.id}
                post={post}
                onPress={openPost}
                onToggleLike={toggleLike}
              />
            ))
          )}
        </>
      )}

      <StudyBoardPostModal
        visible={modalVisible}
        post={selectedPost}
        postDetailLoading={detailLoading}
        translateY={translateY}
        panHandlers={panResponder.panHandlers}
        draftComment={draftComment}
        onChangeDraft={setDraftComment}
        onClose={closePost}
        onToggleLike={toggleLike}
        onToggleAlarm={toggleAlarm}
        onSubmitComment={handleSubmitComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onEditPost={isPostMine ? handleEditPost : undefined}
        onDeletePost={isPostMine ? handleDeletePost : undefined}
      />

      {showCreateModal && (
        <View style={styles.createModalOverlay}>
          <View style={styles.createModal}>
            <Text style={styles.createModalTitle}>새 게시글</Text>
            <Text style={styles.createLabel}>제목</Text>
            <TextInput
              style={styles.createInput}
              value={createTitle}
              onChangeText={setCreateTitle}
              placeholder="제목 (최대 255자)"
              placeholderTextColor="#B0B0B0"
              maxLength={255}
            />
            <Text style={styles.createLabel}>내용</Text>
            <TextInput
              style={[styles.createInput, styles.createContentInput]}
              value={createContent}
              onChangeText={setCreateContent}
              placeholder="내용 (최대 10000자)"
              placeholderTextColor="#B0B0B0"
              multiline
              maxLength={10000}
            />
            <View style={styles.createActions}>
              <Pressable
                style={styles.createCancelBtn}
                onPress={() => {
                  setShowCreateModal(false);
                  setCreateTitle('');
                  setCreateContent('');
                }}
              >
                <Text style={styles.createCancelText}>취소</Text>
              </Pressable>
              <Pressable
                style={[styles.createSubmitBtn, createSubmitting && styles.createSubmitDisabled]}
                onPress={handleCreatePost}
                disabled={createSubmitting || !createTitle.trim() || !createContent.trim()}
              >
                <Text style={styles.createSubmitText}>
                  {createSubmitting ? '등록 중…' : '등록'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 35,
    paddingBottom: 24,
  },
  center: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
    marginBottom: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  writeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#9CA3AF',
    borderRadius: 10,
  },
  writeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  emptyWrap: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyDesc: {
    fontSize: 14,
    color: '#666',
  },
  createModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  createModal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  createModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  createLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  createInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  createContentInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  createActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  createCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  createCancelText: {
    fontSize: 14,
    color: '#666',
  },
  createSubmitBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  createSubmitDisabled: {
    opacity: 0.6,
  },
  createSubmitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default StudyBoardTab;

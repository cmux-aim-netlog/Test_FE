import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import StudyBoardMetaItem from './StudyBoardMetaItem';
import { Post } from './StudyBoardPostTypes';

const likeIcon = require('../../../assets/icon/like_icon.png');
const commentIcon = require('../../../assets/icon/comment_icon.png');

type StudyBoardPostCardProps = {
  post: Post;
  onPress: (post: Post) => void;
  onToggleLike: (postId: number) => void;
  variant?: 'list' | 'card';
  showNamePill?: boolean;
  showStudyPill?: boolean;
};

function StudyBoardPostCard({
  post,
  onPress,
  onToggleLike,
  variant = 'list',
  showNamePill = true,
  showStudyPill = false,
}: StudyBoardPostCardProps) {
  const isCard = variant === 'card';

  return (
    <Pressable
      style={[styles.postCard, isCard && styles.postCardCard]}
      onPress={() => onPress(post)}
    >
      <View style={styles.contentRow}>
        <View style={styles.leftCol}>
          {showStudyPill && (
            <View style={styles.studyPill}>
              <Text style={styles.studyText}>{post.studyName}</Text>
            </View>
          )}
          {showNamePill && (
            <View style={styles.namePill}>
              <Text style={styles.nameText}>{post.name}</Text>
            </View>
          )}
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postDesc}>{post.desc}</Text>
          <View style={styles.metaRow}>
            <Pressable onPress={() => onToggleLike(post.id)}>
              <StudyBoardMetaItem
                icon={likeIcon}
                text={post.likes}
                iconStyle={[styles.metaIcon, post.liked && styles.likedIcon]}
                textStyle={[styles.metaText, post.liked && styles.likedText]}
              />
            </Pressable>
            <StudyBoardMetaItem
              icon={commentIcon}
              text={post.comments}
              iconSize={{ width: 12, height: 12 }}
              iconStyle={styles.metaIcon}
              textStyle={styles.metaText}
            />
          </View>
        </View>
        <View style={styles.postImage}>
          <Text style={styles.postImageText}>사진</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  postCard: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
    backgroundColor: '#FFFFFF',
  },
  postCardCard: {
    
    borderColor: '#EFEFEF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 14,
    borderBottomWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  leftCol: {
    flex: 1,
  },
  namePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 9,
    color: '#858585',
    fontWeight: '400',
  },
  studyPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  studyText: {
    fontSize: 10,
    color: '#9A9A9A',
    fontWeight: '500',
  },
  postTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  postDesc: {
    fontSize: 9,
    color: '#7A7A7A',
    fontWeight: '400',
    lineHeight: 15,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaIcon: {
    tintColor: '#A1A1A1',
  },
  metaText: {
    color: '#A1A1A1',
    fontSize: 9,
    fontWeight: '600',
  },
  likedIcon: {
    tintColor: colors.primary,
    
  },
  likedText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '600',
  },
  postImage: {
    width: 79,
    height: 79,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postImageText: {
    fontSize: 12,
    color: '#8B8B8B',
  },
});

export default StudyBoardPostCard;

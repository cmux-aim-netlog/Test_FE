/**
 * 스터디 그룹 게시판 API — api-study-group-board.md
 * Base path: /study-groups/{groupId}/board
 */

import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from './studyGroupCreate';

const boardPath = (groupId: string | number) =>
  `${ENDPOINTS.studyGroups}/${groupId}/board`;

// --- 목록 조회 (GET /posts) ---
export type BoardPostListItem = {
  postId: number;
  title: string;
  authorUserId?: string;
  empathyCount: number;
  commentCount: number;
};

export type BoardPostListPage = {
  content: BoardPostListItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
};

export type BoardPostListParams = {
  page?: number;
  size?: number;
};

export const fetchBoardPosts = (
  groupId: string | number,
  params?: BoardPostListParams,
) => {
  const page = params?.page ?? 0;
  const size = params?.size ?? 20;
  return apiClient.get<ApiResponse<BoardPostListPage>>(
    `${boardPath(groupId)}/posts`,
    { params: { page, size } },
  );
};

// --- 게시글 상세 (GET /posts/{postId}) ---
export type BoardCommentRes = {
  commentId: number;
  userId: string;
  createdAt: string;
  content: string;
  isMine: boolean;
};

export type BoardPostDetailRes = {
  postId: number;
  title: string;
  authorUserId: string;
  createdAt: string;
  content: string;
  empathyCount: number;
  commentCount: number;
  empathized: boolean;
  comments: BoardCommentRes[];
};

export const fetchBoardPostDetail = (
  groupId: string | number,
  postId: number,
) =>
  apiClient.get<ApiResponse<BoardPostDetailRes>>(
    `${boardPath(groupId)}/posts/${postId}`,
  );

// --- 게시글 작성 (POST /posts) ---
export type BoardPostCreateReq = {
  title: string;
  content: string;
};

export const createBoardPost = (
  groupId: string | number,
  payload: BoardPostCreateReq,
) =>
  apiClient.post<ApiResponse<number>>(`${boardPath(groupId)}/posts`, payload);

// --- 게시글 수정 (PATCH /posts/{postId}) ---
export type BoardPostUpdateReq = {
  title: string;
  content: string;
};

export const updateBoardPost = (
  groupId: string | number,
  postId: number,
  payload: BoardPostUpdateReq,
) =>
  apiClient.patch<ApiResponse<null>>(
    `${boardPath(groupId)}/posts/${postId}`,
    payload,
  );

// --- 게시글 삭제 (DELETE /posts/{postId}) ---
export const deleteBoardPost = (groupId: string | number, postId: number) =>
  apiClient.delete<ApiResponse<null>>(`${boardPath(groupId)}/posts/${postId}`);

// --- 댓글 작성 (POST /posts/{postId}/comments) ---
export type BoardCommentCreateReq = {
  content: string;
};

export const createBoardComment = (
  groupId: string | number,
  postId: number,
  payload: BoardCommentCreateReq,
) =>
  apiClient.post<ApiResponse<number>>(
    `${boardPath(groupId)}/posts/${postId}/comments`,
    payload,
  );

// --- 댓글 수정 (PATCH /posts/{postId}/comments/{commentId}) ---
export type BoardCommentUpdateReq = {
  content: string;
};

export const updateBoardComment = (
  groupId: string | number,
  postId: number,
  commentId: number,
  payload: BoardCommentUpdateReq,
) =>
  apiClient.patch<ApiResponse<null>>(
    `${boardPath(groupId)}/posts/${postId}/comments/${commentId}`,
    payload,
  );

// --- 댓글 삭제 (DELETE /posts/{postId}/comments/{commentId}) ---
export const deleteBoardComment = (
  groupId: string | number,
  postId: number,
  commentId: number,
) =>
  apiClient.delete<ApiResponse<null>>(
    `${boardPath(groupId)}/posts/${postId}/comments/${commentId}`,
  );

// --- 공감 토글 (POST /posts/{postId}/empathy) ---
export type BoardEmpathyRes = {
  empathized: boolean;
  empathyCount: number;
};

export const toggleBoardEmpathy = (
  groupId: string | number,
  postId: number,
) =>
  apiClient.post<ApiResponse<BoardEmpathyRes>>(
    `${boardPath(groupId)}/posts/${postId}/empathy`,
  );

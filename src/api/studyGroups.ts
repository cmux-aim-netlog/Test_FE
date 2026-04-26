import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, StudyGroupCreateRes } from './studyGroupCreate';
import type { StudyGroupCardRes } from './studyGroupCard';

/** GET /study-groups 목록 응답 data (페이징) — api-study-group-search.md */
export type StudyGroupPageRes = {
  content: StudyGroupCardRes[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
};

/** GET /study-groups 쿼리 파라미터 — category, verificationMethod, keyword, page, size, sort 등 */
export type StudyGroupListParams = {
  category?: string;
  verificationMethod?: string[];
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
};

/** GET /study-groups — 검색·필터·페이징 (최신순 기본) */
export const fetchStudyGroupsList = (params?: StudyGroupListParams) => {
  const page = params?.page ?? 0;
  const size = params?.size ?? 20;
  const sort = params?.sort ?? 'createdAt,desc';
  const build: Record<string, unknown> = { page, size, sort };
  if (params?.category != null && params.category !== '') build.category = params.category;
  if (params?.verificationMethod?.length) build.verificationMethod = params.verificationMethod;
  if (params?.keyword != null && params.keyword.trim() !== '') build.keyword = params.keyword.trim();
  return apiClient.get<ApiResponse<StudyGroupPageRes>>(ENDPOINTS.studyGroups, { params: build });
};

/** GET /study-groups/{groupId} 응답 data */
export type StudyGroupDetailRes = {
  groupId: number;
  title: string;
  description: string;
  thumbnailType: string;
  thumbnailUrl: string | null;
  category: string;
  status: string;
  ownerUserId: string;
  minMembers: number;
  maxMembers: number;
  currentMembers: number;
  joinType: string;
  startDate: string | null;
  endDate: string | null;
  durationWeeks: number | null;
  isIndefinite: boolean;
  verificationRules: VerificationRuleRes[];
  hashtags: string[];
};

/** 상세 규칙용 규칙 한 건 (methodDetails는 백엔드가 반환 시 포함) */
export type VerificationRuleRes = {
  slot: number;
  endTime: string;
  checkEndTime: string | null;
  daysOfWeek: string[];
  timezone: string;
  frequency: { unit: string; requiredCnt: number };
  exemption: unknown;
  methodCode: string;
  methodDetails?: {
    photo?: { min_files?: number; max_files?: number; max_size?: number; allowed_extensions?: string[] };
    gps?: { radius_mode?: string; locations?: Array<{ name?: string; latitude?: number; longitude?: number }> };
    github?: { repo_url?: string; branch?: string };
  };
};

/** GET /study-groups/{groupId}/members 응답 한 건 */
export type StudyGroupMemberRes = {
  userId: string;
  role: 'Leader' | 'Member';
  status: string;
  joinedAt: string;
  nickname: string | null;
};

export const fetchStudyGroups = <T = unknown>(params?: Record<string, unknown>) =>
  apiClient.get<T>(ENDPOINTS.studyGroups, { params });

/** GET /study-groups/my — 내가 가입한 스터디 그룹 목록 (카드 배열). X-User-Id 필수 */
export const fetchMyStudyGroups = () =>
  apiClient.get<ApiResponse<StudyGroupCardRes[]>>(`${ENDPOINTS.studyGroups}/my`);

/** GET /study-groups/recommended — 추천 스터디 (로그인 시 선호 카테고리 기반, 비로그인 시 빈 배열). size 1~50, 기본 10 */
export const fetchRecommendedStudyGroups = (params?: { size?: number }) =>
  apiClient.get<ApiResponse<StudyGroupCardRes[]>>(`${ENDPOINTS.studyGroups}/recommended`, {
    params: params?.size != null ? { size: params.size } : undefined,
  });

/** GET /study-groups/{groupId} — 스터디 그룹 상세 */
export const fetchStudyGroupDetail = (groupId: string | number) =>
  apiClient.get<ApiResponse<StudyGroupDetailRes>>(`${ENDPOINTS.studyGroups}/${groupId}`);

/** GET /study-groups/{groupId} — 상세 규칙용 verificationRules만 반환 (상세 규칙 뷰용) */
export const fetchVerificationRules = (groupId: string | number) =>
  fetchStudyGroupDetail(groupId).then((res) => ({
    ...res,
    data: {
      ...res.data,
      data: res.data?.data?.verificationRules ?? [],
    },
  }));

/** POST /study-groups. 응답은 ApiResponse<StudyGroupCreateRes> (data.groupId, data.createdAt) */
export const createStudyGroup = (payload: Record<string, unknown>) =>
  apiClient.post<ApiResponse<StudyGroupCreateRes>>(ENDPOINTS.studyGroups, payload);

export const updateStudyGroup = <T = unknown, P = unknown>(
  groupId: string | number,
  payload: P,
) => apiClient.patch<T>(`${ENDPOINTS.studyGroups}/${groupId}`, payload);

export const deleteStudyGroup = <T = unknown>(groupId: string | number) =>
  apiClient.delete<T>(`${ENDPOINTS.studyGroups}/${groupId}`);

/** GET /study-groups/{groupId}/members — 멤버 목록 (그룹 멤버만). X-User-Id 필수 */
export const fetchStudyGroupMembers = (groupId: string | number) =>
  apiClient.get<ApiResponse<StudyGroupMemberRes[]>>(
    `${ENDPOINTS.studyGroups}/${groupId}/members`,
  );

/** DELETE /study-groups/{groupId}/members/{userId} — 그룹장이 멤버 강퇴. X-User-Id 필수 */
export const kickStudyGroupMember = (groupId: string | number, userId: string) =>
  apiClient.delete<ApiResponse<null>>(
    `${ENDPOINTS.studyGroups}/${groupId}/members/${userId}`,
  );

/** POST /study-groups/{groupId}/leave — 스터디 그룹 탈퇴 (그룹장 불가). X-User-Id 필수 */
export const leaveStudyGroup = (groupId: string | number) =>
  apiClient.post<ApiResponse<null>>(`${ENDPOINTS.studyGroups}/${groupId}/leave`);

/** POST /study-groups/{groupId}/join — 공개 스터디 가입. X-User-Id 필수. api-study-group-join-public.md */
export type StudyGroupJoinRes = { groupId: number; joinedAt: string };
export const joinStudyGroup = (groupId: string | number) =>
  apiClient.post<ApiResponse<StudyGroupJoinRes>>(`${ENDPOINTS.studyGroups}/${groupId}/join`);

/** GET /study-groups/{groupId}/report — 인증 현황 리포트. api-study-group-report.md */
export type VerificationReportMemberStat = {
  userId: string;
  role: string;
  fulfilledCount: number;
  opportunityCount: number;
  /** 인증률 0~100, 소수 둘째 자리 반올림 */
  percentage: number;
};

export type VerificationReportRes = {
  startDate: string;
  endDate: string;
  opportunityCount: number;
  members: VerificationReportMemberStat[];
};

export const fetchVerificationReport = (
  groupId: string | number,
  params?: { endDate?: string },
) =>
  apiClient.get<ApiResponse<VerificationReportRes>>(
    `${ENDPOINTS.studyGroups}/${groupId}/report`,
    { params: params?.endDate != null ? { endDate: params.endDate } : undefined },
  );

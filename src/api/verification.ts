/**
 * 스터디 그룹 인증 API — photo, checklist, GPS
 * api-verification-photo-submit.md, api-verification-checklist.md, api-verification-gps.md
 */

import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from './studyGroupCreate';

const verificationPath = (groupId: string | number, slot: number) =>
  `${ENDPOINTS.studyGroups}/${groupId}/verification/slots/${slot}`;

const today = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

// --- Photo ---
export type VerificationPhotoSubmitRes = {
  recordId: number;
  groupId: number;
  slot: number;
  verificationDate: string;
  photoCount: number;
  filePaths: string[];
};

/** 멤버별 사진 인증 기록 (업로드한 사진 제목 = 상황) */
export type PhotoVerificationRecordRes = {
  userId: string;
  nickname: string | null;
  verificationDate: string;
  submittedAt: string | null;
  filePaths: string[];
  /** 사진별 제목(상황). 없으면 filePaths에서 파일명(확장자 제외)으로 표시 */
  titles?: string[];
};

/** GET .../photo/records — 해당 날짜 멤버별 사진 인증 목록 (현황 탭용) */
export const getPhotoVerificationRecords = (
  groupId: string | number,
  slot: number,
  verificationDate?: string,
) =>
  apiClient.get<ApiResponse<PhotoVerificationRecordRes[]>>(
    `${verificationPath(groupId, slot)}/photo/records`,
    {
      params: verificationDate ? { verificationDate } : undefined,
    },
  );

/** 파일 경로/이름에서 상황명 추출 (확장자 제외). 업로드한 사진 제목 = 상황 */
export function situationFromFilePath(filePath: string): string {
  const name = typeof filePath === 'string' ? filePath.split('/').pop() ?? filePath : '';
  const base = name.replace(/\.[^.]+$/, '').trim();
  return base || '사진';
}

/** POST .../photo — multipart/form-data, param "files" */
export const submitPhotoVerification = (
  groupId: string | number,
  slot: number,
  files: { uri: string; name?: string; type?: string }[],
  verificationDate?: string,
) => {
  const formData = new FormData();
  files.forEach((f, i) => {
    formData.append('files', {
      uri: f.uri,
      name: f.name ?? `photo_${i}.jpg`,
      type: f.type ?? 'image/jpeg',
    } as unknown as Blob);
  });
  const params = verificationDate ? { verificationDate } : undefined;
  return apiClient.post<ApiResponse<VerificationPhotoSubmitRes>>(
    `${verificationPath(groupId, slot)}/photo`,
    formData,
    {
      params,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

// --- Checklist ---
export type ChecklistItemRes = {
  itemId: number;
  groupId: number;
  slot: number;
  sortOrder: number;
  content: string;
  checked: boolean;
  checkedAt: string | null;
};

export type ChecklistItemCreateReq = {
  content: string;
  sortOrder?: number;
};

/** GET .../checklist/items */
export const getChecklistItems = (
  groupId: string | number,
  slot: number,
  verificationDate?: string,
) =>
  apiClient.get<ApiResponse<ChecklistItemRes[]>>(
    `${verificationPath(groupId, slot)}/checklist/items`,
    {
      params: verificationDate ? { verificationDate } : undefined,
    },
  );

/** POST .../checklist/items */
export const addChecklistItem = (
  groupId: string | number,
  slot: number,
  payload: ChecklistItemCreateReq,
  verificationDate?: string,
) =>
  apiClient.post<ApiResponse<ChecklistItemRes>>(
    `${verificationPath(groupId, slot)}/checklist/items`,
    payload,
    {
      params: verificationDate ? { verificationDate } : undefined,
    },
  );

export type ChecklistCheckReq = {
  itemId: number;
  verificationDate?: string;
  checked: boolean;
};

/** PUT .../checklist/check */
export const setChecklistCheck = (
  groupId: string | number,
  slot: number,
  payload: ChecklistCheckReq,
) =>
  apiClient.put<ApiResponse<null>>(
    `${verificationPath(groupId, slot)}/checklist/check`,
    payload,
  );

export type ChecklistVerificationResultRes = {
  groupId: number;
  slot: number;
  verificationDate: string;
  passed: boolean;
  evaluatedAt: string;
};

/** GET .../checklist/result — 404 if not yet evaluated or no items */
export const getChecklistResult = (
  groupId: string | number,
  slot: number,
  verificationDate?: string,
) =>
  apiClient.get<ApiResponse<ChecklistVerificationResultRes>>(
    `${verificationPath(groupId, slot)}/checklist/result`,
    {
      params: verificationDate ? { verificationDate } : undefined,
    },
  );

// --- GPS ---
export type GpsLocationRes = {
  locationId: number;
  groupId: number;
  name: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
};

export type GpsVerificationSubmitRes = {
  recordId: number;
  groupId: number;
  slot: number;
  verificationDate: string;
  latitude: number;
  longitude: number;
};

export type GpsVerificationSubmitReq = {
  latitude: number;
  longitude: number;
};

/** POST .../gps */
export const submitGpsVerification = (
  groupId: string | number,
  slot: number,
  payload: GpsVerificationSubmitReq,
  verificationDate?: string,
) =>
  apiClient.post<ApiResponse<GpsVerificationSubmitRes>>(
    `${verificationPath(groupId, slot)}/gps`,
    payload,
    {
      params: verificationDate ? { verificationDate } : undefined,
    },
  );

/** GET .../gps/locations */
export const getGpsLocations = (groupId: string | number, slot: number) =>
  apiClient.get<ApiResponse<GpsLocationRes[]>>(
    `${verificationPath(groupId, slot)}/gps/locations`,
  );

export type GpsLocationCreateReq = {
  name: string;
  latitude: number;
  longitude: number;
};

/** POST .../gps/locations */
export const addGpsLocation = (
  groupId: string | number,
  slot: number,
  payload: GpsLocationCreateReq,
) =>
  apiClient.post<ApiResponse<GpsLocationRes>>(
    `${verificationPath(groupId, slot)}/gps/locations`,
    payload,
  );

export { today as getVerificationDateToday };

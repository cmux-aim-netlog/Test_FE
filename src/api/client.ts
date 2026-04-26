import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from './config';

/** client 기본 헤더에 박아둔 사용자 UUID (담당 팀원 방식) */
const DEFAULT_USER_ID = '51c19566-90d2-4495-91d0-4cd498124822';
const DEFAULT_USER_ROLE = 'USER';
const DEFAULT_DISPLAY_NAME = '회원';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// 로그인 성공 시 호출하여 헤더를 업데이트하는 함수
export const setAuthSession = (token: string, userId: string, role: string) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  apiClient.defaults.headers.common['X-User-Id'] = userId;
  apiClient.defaults.headers.common['X-User-Role'] = role;
};

let currentUserDisplayName: string | null = DEFAULT_DISPLAY_NAME;

export const setAuthToken = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};


export const setUserId = (userId?: string) => {


  if (userId) {
    apiClient.defaults.headers.common['X-User-Id'] = userId;
  } else {
    delete apiClient.defaults.headers.common['X-User-Id'];
  }
};

export const setUserRole = (role?: string) => {
  if (role) {
    apiClient.defaults.headers.common['X-User-Role'] = role;
  } else {
    delete apiClient.defaults.headers.common['X-User-Role'];
  }
};

export const setCurrentUserDisplayName = (displayName?: string | null) => {
  currentUserDisplayName = displayName?.trim() || DEFAULT_DISPLAY_NAME;
};

export const getCurrentUserId = (): string | null => {
  const userId = apiClient.defaults.headers.common['X-User-Id'];
  if (typeof userId === 'string' && userId.trim()) {
    return userId;
  }
  return DEFAULT_USER_ID;
};

export const getCurrentUserRole = (): string => {
  const role = apiClient.defaults.headers.common['X-User-Role'];
  if (typeof role === 'string' && role.trim()) {
    return role;
  }
  return DEFAULT_USER_ROLE;
};

export const getCurrentUserDisplayName = (): string => currentUserDisplayName ?? DEFAULT_DISPLAY_NAME;

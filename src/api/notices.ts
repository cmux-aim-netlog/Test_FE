import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { ApiResponse } from '../types/api'; // 공통 응답 타입
import { NoticeListResponse, NoticeDetail, NoticeCreateReq, NoticeUpdateReq } from '../types/notice';

export const getAllNotices = (page = 0, size = 10) => {
  return apiClient.get<ApiResponse<NoticeListResponse>>(ENDPOINTS.notices, {
    params: { page, size },
  });
};

export const getNoticeDetail = (noticeId: number) => {
  return apiClient.get<ApiResponse<NoticeDetail>>(
    `${ENDPOINTS.notices}/${noticeId}`
  );
};

export const createNotice = (data: NoticeCreateReq) => {
  return apiClient.post<ApiResponse<NoticeDetail>>(ENDPOINTS.notices, data);
};

export const updateNotice = (noticeId: number, data: NoticeUpdateReq) => {
  return apiClient.patch<ApiResponse<NoticeDetail>>(
    `${ENDPOINTS.notices}/${noticeId}`,
    data
  );
};

export const deleteNotice = (noticeId: number) => {
  return apiClient.delete<ApiResponse<void>>(
    `${ENDPOINTS.notices}/${noticeId}`
  );
};
import { apiClient } from './index';
import { Notification, NotificationType } from '../types/notification';

const BASE_URL = '/notifications'; 

export const notificationApi = {
  // 전체 알림 조회
  getAllNotifications: (userId: string) => {
    return apiClient.get<Notification[]>(`${BASE_URL}`, {
      params: { userId },
    });
  },

  // 카테고리별 필터 조회
  getNotificationsByType: (userId: string, type: NotificationType) => {
    return apiClient.get<Notification[]>(`${BASE_URL}/filter`, {
      params: { userId, type },
    });
  },

  // 알림 읽음 처리
  markAsRead: (notificationId: string | number) => {
    return apiClient.patch<void>(`${BASE_URL}/${notificationId}/read`);
  },

  // 안 읽은 알림 개수 확인
  getUnreadCount: (userId: string) => {
    return apiClient.get<number>(`${BASE_URL}/unread-count`, {
      params: { userId },
    });
  },

  // 알림 전체 삭제
  clearAllNotifications: (userId: string) => {
    return apiClient.delete<void>(`${BASE_URL}/clear`, {
      params: { userId },
    });
  },
};
export type NotificationType = 'RANKING' | 'COMMUNITY' | 'EVENT' | 'NOTICE';

export interface Notification {
  // 알림 자체의 PK는 백엔드에서 Long이므로 string | number로 유연하게 받습니다.
  id: string | number; 
  // 수신자 ID는 이제 UUID(String)이므로 string으로 수정해야 합니다.
  receiverId: string; 
  type: NotificationType;
  title: string;
  content: string;
  redirectUrl?: string;
  isRead: boolean;
  createdAt: string; 
  updatedAt?: string;
}

export interface NotificationResponse {
  status: string;
  message: string;
  data: Notification[];
}
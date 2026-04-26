import React, { createContext, useContext, useMemo, useState } from 'react';
import { Post } from '../features/study-board/components/StudyBoardPostTypes';

type NotificationCenterContextValue = {
  notifications: Post[];
  addNotification: (post: Post) => void;
  removeNotification: (postId: number) => void;
  updateNotification: (post: Post) => void;
  toggleNotificationLike: (postId: number) => void;
};

const NotificationCenterContext = createContext<NotificationCenterContextValue | undefined>(undefined);

export function NotificationCenterProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Post[]>([]);

  const addNotification = (post: Post) => {
    setNotifications((prev) => {
      const exists = prev.some((item) => item.id === post.id);
      if (exists) {
        return prev.map((item) => (item.id === post.id ? post : item));
      }
      return [post, ...prev];
    });
  };

  const removeNotification = (postId: number) => {
    setNotifications((prev) => prev.filter((item) => item.id !== postId));
  };

  const updateNotification = (post: Post) => {
    setNotifications((prev) => prev.map((item) => (item.id === post.id ? post : item)));
  };

  const toggleNotificationLike = (postId: number) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === postId
          ? {
              ...item,
              liked: !item.liked,
              likes: item.liked ? Math.max(0, item.likes - 1) : item.likes + 1,
            }
          : item,
      ),
    );
  };

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      updateNotification,
      toggleNotificationLike,
    }),
    [notifications],
  );

  return (
    <NotificationCenterContext.Provider value={value}>
      {children}
    </NotificationCenterContext.Provider>
  );
}

export function useNotificationCenter() {
  const context = useContext(NotificationCenterContext);
  if (!context) {
    throw new Error('useNotificationCenter must be used within NotificationCenterProvider');
  }
  return context;
}

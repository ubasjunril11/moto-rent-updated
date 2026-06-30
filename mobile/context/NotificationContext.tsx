import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppState } from 'react-native';
import { notificationService, AppNotification } from '@/services/notificationService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  unreadCount: number;
  notifications: AppNotification[];
  refresh: () => Promise<void>;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  notifications: [],
  refresh: async () => {},
  markRead: async () => {},
  markAllRead: async () => {},
});

const POLL_INTERVAL_MS = 30_000;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [countRes, listRes] = await Promise.all([
        notificationService.getUnreadCount(),
        notificationService.getAll(),
      ]);
      if (countRes.success && countRes.data != null) setUnreadCount(countRes.data.count);
      if (listRes.success && listRes.data) setNotifications(listRes.data);
    } catch {
      // Silently ignore — offline or token expired
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }

    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });

    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [isAuthenticated, refresh]);

  const markRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {}
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, notifications, refresh, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

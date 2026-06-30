import api from './api';
import { ApiResponse } from '@/types';

export interface AppNotification {
  id: number;
  user_id: number;
  title: string;
  body: string;
  type: string;
  booking_id?: number;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  getAll: async () => {
    const res = await api.get<ApiResponse<AppNotification[]>>('/notifications');
    return res.data;
  },

  getUnreadCount: async () => {
    const res = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return res.data;
  },

  markAsRead: async (id: number) => {
    const res = await api.patch<ApiResponse<null>>(`/notifications/${id}/read`);
    return res.data;
  },

  markAllRead: async () => {
    const res = await api.patch<ApiResponse<null>>('/notifications/read-all');
    return res.data;
  },
};

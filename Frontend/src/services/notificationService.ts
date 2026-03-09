import axiosInstance from '../lib/axios';

export interface NotificationDTO {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    timestamp: string;
    isRead: boolean;
}

export const notificationService = {
  getRecentNotifications: async (limit: number = 10) => {
    return await axiosInstance.get(`/notifications/recent?limit=${limit}`);
  },
  
  markAsRead: async (id: string) => {
    return await axiosInstance.put(`/notifications/${id}/read`);
  },
  
  deleteNotification: async (id: string) => {
    return await axiosInstance.delete(`/notifications/${id}`);
  },
  
  clearAll: async () => {
    return await axiosInstance.delete('/notifications');
  }
};

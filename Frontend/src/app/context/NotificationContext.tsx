"use client"
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { socketService } from '../../services/socketService';
import { notificationService, NotificationDTO } from '../../services/notificationService';

interface NotificationContextProps {
  notifications: NotificationDTO[];
  unreadCount: number;
  liveToast: NotificationDTO | null;
  clearNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  unreadCount: 0,
  liveToast: null,
  clearNotification: async () => {},
  clearAll: async () => {},
  markAsRead: async () => {}
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [liveToast, setLiveToast] = useState<NotificationDTO | null>(null);

  const fetchRecent = useCallback(async () => {
    try {
      const res = await notificationService.getRecentNotifications(10);
      setNotifications(res.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchRecent();
    socketService.connect();

    const handleNewNotification = (notification: NotificationDTO) => {
      // Add to list and cap at 10
      setNotifications(prev => {
        const updated = [notification, ...prev];
        return updated.slice(0, 10);
      });

      // Live notification show toast
      setLiveToast(notification);
      
      // Auto clear set after 3 seconds 
      setTimeout(() => {
        setLiveToast(null);
      }, 3000);
    };

    const handleNotificationCleared = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleAllCleared = () => {
      setNotifications([]);
    };

    socketService.onNotification(handleNewNotification);
    socketService.onNotificationCleared(handleNotificationCleared);
    socketService.onAllNotificationsCleared(handleAllCleared);

    return () => {
      socketService.offNotification(handleNewNotification);
      socketService.offNotificationCleared(handleNotificationCleared);
      socketService.offAllNotificationsCleared(handleAllCleared);
    };
  }, [fetchRecent]);

  const clearNotification = async (id: string) => {
    try {
     
      setNotifications(prev => prev.filter(n => n.id !== id));
      await notificationService.deleteNotification(id);
    } catch (e) {
      fetchRecent();
    }
  };

  const clearAll = async () => {
    try {
      setNotifications([]);
      await notificationService.clearAll();
    } catch (e) {
      fetchRecent();
    }
  };

  const markAsRead = async (id: string) => {
    try {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      await notificationService.markAsRead(id);
    } catch (e) {
      fetchRecent();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, liveToast, clearNotification, clearAll, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

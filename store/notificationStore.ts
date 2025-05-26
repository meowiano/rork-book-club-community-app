import { create } from 'zustand';
import { Notification } from '@/types';
import { mockNotifications } from '@/mocks/notifications';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  
  fetchNotifications: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter notifications for user
      const userNotifications = mockNotifications.filter(
        notification => notification.userId === userId
      );
      
      const unreadCount = userNotifications.filter(
        notification => !notification.isRead
      ).length;
      
      set({ 
        notifications: userNotifications, 
        unreadCount,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  markAsRead: async (notificationId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => {
        const updatedNotifications = state.notifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        );
        
        const unreadCount = updatedNotifications.filter(
          notification => !notification.isRead
        ).length;
        
        return { 
          notifications: updatedNotifications, 
          unreadCount,
          isLoading: false 
        };
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  markAllAsRead: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => {
        const updatedNotifications = state.notifications.map(notification => 
          notification.userId === userId 
            ? { ...notification, isRead: true } 
            : notification
        );
        
        return { 
          notifications: updatedNotifications, 
          unreadCount: 0,
          isLoading: false 
        };
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  deleteNotification: async (notificationId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => {
        const updatedNotifications = state.notifications.filter(
          notification => notification.id !== notificationId
        );
        
        const unreadCount = updatedNotifications.filter(
          notification => !notification.isRead
        ).length;
        
        return { 
          notifications: updatedNotifications, 
          unreadCount,
          isLoading: false 
        };
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  }
}));
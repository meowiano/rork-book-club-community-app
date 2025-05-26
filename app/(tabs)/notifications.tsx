import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { colors } from '@/constants/colors';
import { NotificationItem } from '@/components/NotificationItem';
import { EmptyState } from '@/components/EmptyState';
import { Bell, CheckCircle } from 'lucide-react-native';

export default function NotificationsScreen() {
  const { user } = useAuthStore();
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);
  
  const loadData = async () => {
    if (user) {
      await fetchNotifications(user.id);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const handleNotificationPress = (notificationId: string, referenceId: string, type: string) => {
    // Mark as read
    markAsRead(notificationId);
    
    // Navigate based on notification type
    if (type === 'message' || type === 'mention') {
      router.push(`/club/${referenceId}`);
    } else if (type === 'invite' || type === 'approval') {
      router.push(`/club/${referenceId}`);
    } else if (type === 'request') {
      // This would go to a requests management screen in a real app
      alert('This would navigate to a request management screen in a real app');
    }
  };
  
  const handleMarkAllAsRead = async () => {
    if (user) {
      await markAllAsRead(user.id);
    }
  };
  
  const renderEmptyState = () => {
    return (
      <EmptyState
        title="No notifications"
        message="You're all caught up! Notifications about your book clubs and activity will appear here."
        icon={<Bell size={32} color={colors.primary} />}
      />
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
            <CheckCircle size={16} color={colors.primary} />
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadText}>
            {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
          </Text>
        </View>
      )}
      
      <FlatList
        data={notifications.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item.id, item.referenceId, item.type)}
            onMarkAsRead={() => markAsRead(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  markAllText: {
    marginLeft: 4,
    color: colors.primary,
    fontWeight: '500',
  },
  unreadBanner: {
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  unreadText: {
    color: colors.primary,
    fontWeight: '500',
  },
  listContent: {
    flexGrow: 1,
  },
});
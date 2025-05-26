import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Notification } from '@/types';
import { colors } from '@/constants/colors';
import { formatRelativeTime } from '@/utils/dateUtils';
import { Bell, MessageSquare, UserPlus, Check, AtSign } from 'lucide-react-native';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
  onMarkAsRead: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onMarkAsRead
}) => {
  const { type, title, body, isRead, timestamp } = notification;
  
  const getIcon = () => {
    switch (type) {
      case 'message':
        return <MessageSquare size={20} color={colors.primary} />;
      case 'invite':
        return <UserPlus size={20} color={colors.primary} />;
      case 'approval':
        return <Check size={20} color={colors.success} />;
      case 'mention':
        return <AtSign size={20} color={colors.primary} />;
      case 'request':
        return <UserPlus size={20} color={colors.warning} />;
      default:
        return <Bell size={20} color={colors.primary} />;
    }
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isRead ? styles.readContainer : styles.unreadContainer
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.body} numberOfLines={2}>{body}</Text>
        <Text style={styles.time}>{formatRelativeTime(new Date(timestamp))}</Text>
      </View>
      
      {!isRead && (
        <TouchableOpacity 
          style={styles.readButton}
          onPress={onMarkAsRead}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <View style={styles.unreadDot} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  unreadContainer: {
    backgroundColor: 'rgba(74, 111, 165, 0.05)',
  },
  readContainer: {
    backgroundColor: colors.white,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  readButton: {
    justifyContent: 'center',
    paddingLeft: 12,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
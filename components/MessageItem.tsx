import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Message } from '@/types';
import { colors } from '@/constants/colors';
import { MoreVertical, Reply, Flag } from 'lucide-react-native';
import { mockUsers } from '@/mocks/users';
import { formatRelativeTime } from '@/utils/dateUtils';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  onReply: (message: Message) => void;
  onReport: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  replyToMessage?: Message | null;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isCurrentUser,
  onReply,
  onReport,
  onDelete,
  replyToMessage
}) => {
  const [showActions, setShowActions] = useState(false);
  
  // Find user who sent the message
  const user = mockUsers.find(u => u.id === message.userId);
  
  // Find user who sent the reply-to message
  const replyToUser = replyToMessage 
    ? mockUsers.find(u => u.id === replyToMessage.userId) 
    : null;
  
  const toggleActions = () => {
    setShowActions(!showActions);
  };
  
  const handleReply = () => {
    onReply(message);
    setShowActions(false);
  };
  
  const handleReport = () => {
    Alert.alert(
      'Report Message',
      'Are you sure you want to report this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Report', 
          style: 'destructive',
          onPress: () => {
            onReport(message.id);
            setShowActions(false);
          }
        }
      ]
    );
  };
  
  const handleDelete = () => {
    if (!onDelete) return;
    
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            onDelete(message.id);
            setShowActions(false);
          }
        }
      ]
    );
  };
  
  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : null
    ]}>
      {!isCurrentUser && (
        <Image
          source={{ uri: user?.profileImage }}
          style={styles.avatar}
          contentFit="cover"
        />
      )}
      
      <View style={[
        styles.messageContent,
        isCurrentUser ? styles.currentUserContent : null
      ]}>
        {/* Reply reference */}
        {replyToMessage && (
          <View style={styles.replyContainer}>
            <View style={styles.replyLine} />
            <View style={styles.replyContent}>
              <Text style={styles.replyName}>{replyToUser?.displayName}</Text>
              <Text style={styles.replyText} numberOfLines={1}>
                {replyToMessage.text}
              </Text>
            </View>
          </View>
        )}
        
        {/* Message header */}
        <View style={styles.header}>
          {!isCurrentUser && (
            <Text style={styles.name}>{user?.displayName}</Text>
          )}
          <Text style={styles.time}>
            {formatRelativeTime(new Date(message.timestamp))}
          </Text>
        </View>
        
        {/* Message text */}
        <Text style={styles.text}>{message.text}</Text>
        
        {/* Message actions */}
        <TouchableOpacity 
          style={styles.actionsButton} 
          onPress={toggleActions}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <MoreVertical size={16} color={colors.textSecondary} />
        </TouchableOpacity>
        
        {showActions && (
          <View style={[
            styles.actionsMenu,
            isCurrentUser ? styles.currentUserActionsMenu : null
          ]}>
            <TouchableOpacity style={styles.actionItem} onPress={handleReply}>
              <Reply size={16} color={colors.text} />
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
            
            {!isCurrentUser && (
              <TouchableOpacity style={styles.actionItem} onPress={handleReport}>
                <Flag size={16} color={colors.error} />
                <Text style={[styles.actionText, styles.reportText]}>Report</Text>
              </TouchableOpacity>
            )}
            
            {isCurrentUser && onDelete && (
              <TouchableOpacity style={styles.actionItem} onPress={handleDelete}>
                <Flag size={16} color={colors.error} />
                <Text style={[styles.actionText, styles.reportText]}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      
      {isCurrentUser && (
        <Image
          source={{ uri: user?.profileImage }}
          style={styles.avatar}
          contentFit="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  currentUserContainer: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  messageContent: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    maxWidth: '80%',
    position: 'relative',
  },
  currentUserContent: {
    marginLeft: 0,
    marginRight: 12,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  text: {
    fontSize: 14,
    color: colors.text,
  },
  actionsButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  actionsMenu: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  currentUserActionsMenu: {
    right: 0,
    left: 'auto',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
  },
  reportText: {
    color: colors.error,
  },
  replyContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  replyLine: {
    width: 2,
    backgroundColor: colors.secondary,
    marginRight: 8,
    borderRadius: 1,
  },
  replyContent: {
    flex: 1,
  },
  replyName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 2,
  },
  replyText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
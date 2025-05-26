import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/authStore';
import { useClubStore } from '@/store/clubStore';
import { useBookStore } from '@/store/bookStore';
import { colors } from '@/constants/colors';
import { MessageItem } from '@/components/MessageItem';
import { Button } from '@/components/Button';
import { Message } from '@/types';
import { 
  Send, 
  Users, 
  BookOpen, 
  MoreVertical, 
  Share2, 
  LogOut, 
  UserPlus,
  X
} from 'lucide-react-native';
import { mockUsers } from '@/mocks/users';

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { 
    currentClub, 
    messages, 
    fetchClubById, 
    fetchClubMessages, 
    sendMessage,
    joinClub,
    requestToJoinClub,
    leaveClub,
    reportMessage,
    deleteMessage
  } = useClubStore();
  const { books, fetchBooks } = useBookStore();
  
  const [messageText, setMessageText] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    if (user && id) {
      loadData();
    }
  }, [user, id]);
  
  const loadData = async () => {
    if (user) {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchClubById(id),
          fetchClubMessages(id),
          fetchBooks()
        ]);
      } catch (error) {
        console.error('Error loading club data:', error);
        Alert.alert('Error', 'Failed to load club data');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleSendMessage = async () => {
    if (!user || !messageText.trim()) return;
    
    try {
      await sendMessage(
        id, 
        user.id, 
        messageText.trim(), 
        replyTo ? replyTo.id : undefined
      );
      setMessageText('');
      setReplyTo(null);
      
      // Scroll to bottom after message is sent
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };
  
  const handleReply = (message: Message) => {
    setReplyTo(message);
  };
  
  const handleCancelReply = () => {
    setReplyTo(null);
  };
  
  const handleReportMessage = async (messageId: string) => {
    try {
      await reportMessage(messageId);
      Alert.alert('Report Sent', 'Thank you for reporting this message. Our moderators will review it.');
    } catch (error) {
      console.error('Error reporting message:', error);
      Alert.alert('Error', 'Failed to report message');
    }
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
      Alert.alert('Error', 'Failed to delete message');
    }
  };
  
  const handleJoinClub = async () => {
    if (!user) return;
    
    setIsJoining(true);
    try {
      if (currentClub?.isPublic) {
        await joinClub(id, user.id);
        // Reload data to update UI
        await loadData();
        Alert.alert('Success', 'You have joined the club!');
      } else {
        await requestToJoinClub(id, user.id);
        // Reload data to update UI
        await loadData();
        Alert.alert('Request Sent', 'Your request to join has been sent to the club moderators.');
      }
    } catch (error) {
      console.error('Error joining club:', error);
      Alert.alert('Error', 'Failed to join club');
    } finally {
      setIsJoining(false);
    }
  };
  
  const handleLeaveClub = async () => {
    if (!user) return;
    
    Alert.alert(
      'Leave Club',
      'Are you sure you want to leave this book club?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Leave', 
          style: 'destructive',
          onPress: async () => {
            try {
              await leaveClub(id, user.id);
              Alert.alert('Success', 'You have left the club');
              router.back();
            } catch (error) {
              console.error('Error leaving club:', error);
              Alert.alert('Error', 'Failed to leave club');
            }
          }
        }
      ]
    );
  };
  
  const handleShare = async () => {
    if (Platform.OS === 'web') {
      alert('Sharing is not available on web');
      return;
    }
    
    try {
      await Share.share({
        title: currentClub?.name,
        message: `Join me in the "${currentClub?.name}" book club on BookClub!`
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  
  const handleViewMembers = () => {
    // In a real app, this would navigate to a members list screen
    alert('This would open a members list screen in a real app');
    setShowMenu(false);
  };
  
  const handleInviteMembers = () => {
    // In a real app, this would navigate to an invite screen
    alert('This would open an invite members screen in a real app');
    setShowMenu(false);
  };
  
  const handleViewBook = () => {
    if (currentClub?.currentBookId) {
      router.push(`/book/${currentClub.currentBookId}`);
    }
    setShowMenu(false);
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading club...</Text>
      </SafeAreaView>
    );
  }
  
  if (!currentClub) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Club not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          variant="primary"
          style={styles.errorButton}
        />
      </SafeAreaView>
    );
  }
  
  const isUserMember = user ? currentClub.memberIds.includes(user.id) : false;
  const isPendingMember = user ? currentClub.pendingMemberIds.includes(user.id) : false;
  const isUserOwner = user ? currentClub.ownerId === user.id : false;
  const isUserModerator = user ? currentClub.moderatorIds.includes(user.id) : false;
  
  const currentBook = currentClub.currentBookId 
    ? books.find(book => book.id === currentClub.currentBookId) 
    : null;
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: currentClub.name,
          headerRight: () => (
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
              <MoreVertical size={24} color={colors.text} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        {showMenu && (
          <View style={styles.menuOverlay}>
            <View style={styles.menu}>
              <TouchableOpacity style={styles.closeMenuButton} onPress={toggleMenu}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={handleViewMembers}>
                <Users size={20} color={colors.text} />
                <Text style={styles.menuItemText}>View Members ({currentClub.memberIds.length})</Text>
              </TouchableOpacity>
              
              {currentBook && (
                <TouchableOpacity style={styles.menuItem} onPress={handleViewBook}>
                  <BookOpen size={20} color={colors.text} />
                  <Text style={styles.menuItemText}>Current Book</Text>
                </TouchableOpacity>
              )}
              
              {isUserMember && (
                <TouchableOpacity style={styles.menuItem} onPress={handleInviteMembers}>
                  <UserPlus size={20} color={colors.text} />
                  <Text style={styles.menuItemText}>Invite Members</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
                <Share2 size={20} color={colors.text} />
                <Text style={styles.menuItemText}>Share Club</Text>
              </TouchableOpacity>
              
              {isUserMember && !isUserOwner && (
                <TouchableOpacity style={styles.menuItem} onPress={handleLeaveClub}>
                  <LogOut size={20} color={colors.error} />
                  <Text style={[styles.menuItemText, styles.leaveText]}>Leave Club</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        
        {currentBook && (
          <TouchableOpacity 
            style={styles.currentBookBanner}
            onPress={handleViewBook}
          >
            <Image
              source={{ uri: currentBook.coverImage }}
              style={styles.currentBookImage}
              contentFit="cover"
            />
            <View style={styles.currentBookInfo}>
              <Text style={styles.currentBookLabel}>Current Book</Text>
              <Text style={styles.currentBookTitle} numberOfLines={1}>{currentBook.title}</Text>
              <Text style={styles.currentBookAuthor} numberOfLines={1}>by {currentBook.author}</Text>
            </View>
            <BookOpen size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        
        {!isUserMember && (
          <View style={styles.joinBanner}>
            <Text style={styles.joinText}>
              {isPendingMember 
                ? 'Your request to join is pending approval' 
                : `Join this ${currentClub.isPublic ? 'public' : 'private'} book club to participate in discussions`
              }
            </Text>
            {!isPendingMember && (
              <Button
                title={currentClub.isPublic ? 'Join Club' : 'Request to Join'}
                onPress={handleJoinClub}
                variant="primary"
                size="small"
                isLoading={isJoining}
                style={styles.joinButton}
              />
            )}
          </View>
        )}
        
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const replyToMessage = item.replyToId 
                ? messages.find(m => m.id === item.replyToId) 
                : null;
              
              return (
                <MessageItem
                  message={item}
                  isCurrentUser={item.userId === user?.id}
                  onReply={handleReply}
                  onReport={handleReportMessage}
                  onDelete={
                    isUserOwner || isUserModerator || item.userId === user?.id 
                      ? handleDeleteMessage 
                      : undefined
                  }
                  replyToMessage={replyToMessage}
                />
              );
            }}
            contentContainerStyle={styles.messagesList}
            inverted={false}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: false });
            }}
            ListEmptyComponent={
              isUserMember ? (
                <View style={styles.emptyMessages}>
                  <Text style={styles.emptyMessagesText}>
                    No messages yet. Start the conversation!
                  </Text>
                </View>
              ) : null
            }
          />
          
          {isUserMember && (
            <>
              {replyTo && (
                <View style={styles.replyPreview}>
                  <View style={styles.replyPreviewContent}>
                    <Text style={styles.replyPreviewName}>
                      Replying to {mockUsers.find(u => u.id === replyTo.userId)?.displayName}
                    </Text>
                    <Text style={styles.replyPreviewText} numberOfLines={1}>
                      {replyTo.text}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={handleCancelReply}>
                    <X size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              )}
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={messageText}
                  onChangeText={setMessageText}
                  placeholder="Type a message..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    !messageText.trim() && styles.sendButtonDisabled
                  ]} 
                  onPress={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send size={20} color={!messageText.trim() ? colors.textSecondary : colors.white} />
                </TouchableOpacity>
              </View>
            </>
          )}
          
          {!isUserMember && (
            <View style={styles.nonMemberView}>
              <Text style={styles.nonMemberText}>
                Join this club to participate in discussions
              </Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    marginBottom: 16,
  },
  errorButton: {
    minWidth: 120,
  },
  menuButton: {
    padding: 8,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
    justifyContent: 'flex-end',
  },
  menu: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 32,
  },
  closeMenuButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  leaveText: {
    color: colors.error,
  },
  currentBookBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  currentBookImage: {
    width: 40,
    height: 60,
    borderRadius: 4,
  },
  currentBookInfo: {
    flex: 1,
    marginLeft: 12,
  },
  currentBookLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  currentBookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  currentBookAuthor: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  joinBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    padding: 12,
  },
  joinText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
  },
  joinButton: {
    
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesList: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  emptyMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyMessagesText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  replyPreviewContent: {
    flex: 1,
    marginRight: 8,
  },
  replyPreviewName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  replyPreviewText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    color: colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  nonMemberView: {
    padding: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nonMemberText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
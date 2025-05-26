import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/authStore';
import { useBookStore } from '@/store/bookStore';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { BookStatus } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { Share2, BookOpen, Check, PlusCircle } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { 
    books, 
    userBooks, 
    fetchBooks, 
    fetchUserBooks, 
    addUserBook, 
    updateUserBookStatus,
    updateUserBookProgress,
    removeUserBook
  } = useBookStore();
  
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user && id) {
      loadData();
    }
  }, [user, id]);
  
  const loadData = async () => {
    if (user) {
      await Promise.all([
        fetchBooks(),
        fetchUserBooks(user.id)
      ]);
    }
  };
  
  const book = books.find(b => b.id === id);
  const userBook = userBooks.find(ub => ub.bookId === id);
  
  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Book not found</Text>
      </SafeAreaView>
    );
  }
  
  const handleAddToList = async (status: BookStatus) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (userBook) {
        await updateUserBookStatus(user.id, book.id, status);
      } else {
        await addUserBook(user.id, book.id, status);
      }
    } catch (error) {
      console.error('Error updating book status:', error);
      Alert.alert('Error', 'Failed to update book status');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveFromList = async () => {
    if (!user || !userBook) return;
    
    Alert.alert(
      'Remove Book',
      'Are you sure you want to remove this book from your lists?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await removeUserBook(user.id, book.id);
            } catch (error) {
              console.error('Error removing book:', error);
              Alert.alert('Error', 'Failed to remove book');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const handleUpdateProgress = async (progress: number) => {
    if (!user || !userBook) return;
    
    setIsLoading(true);
    try {
      await updateUserBookProgress(user.id, book.id, progress);
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Error', 'Failed to update reading progress');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShare = async () => {
    if (Platform.OS === 'web') {
      alert('Sharing is not available on web');
      return;
    }
    
    try {
      await Share.share({
        title: book.title,
        message: `Check out "${book.title}" by ${book.author} on BookClub!`
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: '',
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Share2 size={24} color={colors.text} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Image
              source={{ uri: book.coverImage }}
              style={styles.coverImage}
              contentFit="cover"
            />
            
            <View style={styles.bookInfo}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>by {book.author}</Text>
              
              {book.publishedDate && (
                <Text style={styles.publishDate}>
                  Published: {formatDate(new Date(book.publishedDate))}
                </Text>
              )}
              
              {book.pageCount && (
                <Text style={styles.pageCount}>
                  {book.pageCount} pages
                </Text>
              )}
              
              {userBook && (
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: {
                    wishlist: colors.wishlist,
                    reading: colors.reading,
                    read: colors.read
                  }[userBook.status] }
                ]}>
                  <Text style={styles.statusText}>
                    {{
                      wishlist: 'Want to Read',
                      reading: 'Currently Reading',
                      read: 'Read'
                    }[userBook.status]}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {userBook?.status === 'reading' && (
            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>Reading Progress</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${userBook.progress || 0}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{userBook.progress || 0}%</Text>
              </View>
              
              <View style={styles.progressButtons}>
                {[25, 50, 75, 100].map(value => (
                  <TouchableOpacity
                    key={value}
                    style={styles.progressButton}
                    onPress={() => handleUpdateProgress(value)}
                    disabled={isLoading}
                  >
                    <Text style={styles.progressButtonText}>{value}%</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.description}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{book.description}</Text>
          </View>
          
          {book.genres && book.genres.length > 0 && (
            <View style={styles.genres}>
              <Text style={styles.genresTitle}>Genres</Text>
              <View style={styles.genresList}>
                {book.genres.map(genre => (
                  <View key={genre} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
        
        <View style={styles.footer}>
          {!userBook ? (
            <View style={styles.actionButtons}>
              <Button
                title="Want to Read"
                onPress={() => handleAddToList('wishlist')}
                variant="outline"
                isLoading={isLoading}
                style={styles.actionButton}
                icon={<PlusCircle size={18} color={colors.primary} />}
              />
              
              <Button
                title="Start Reading"
                onPress={() => handleAddToList('reading')}
                variant="primary"
                isLoading={isLoading}
                style={styles.actionButton}
                icon={<BookOpen size={18} color={colors.white} />}
              />
            </View>
          ) : (
            <View style={styles.actionButtons}>
              {userBook.status !== 'reading' && (
                <Button
                  title="Start Reading"
                  onPress={() => handleAddToList('reading')}
                  variant={userBook.status === 'wishlist' ? 'primary' : 'outline'}
                  isLoading={isLoading}
                  style={styles.actionButton}
                  icon={<BookOpen size={18} color={userBook.status === 'wishlist' ? colors.white : colors.primary} />}
                />
              )}
              
              {userBook.status !== 'read' && (
                <Button
                  title="Mark as Read"
                  onPress={() => handleAddToList('read')}
                  variant={userBook.status === 'reading' ? 'primary' : 'outline'}
                  isLoading={isLoading}
                  style={styles.actionButton}
                  icon={<Check size={18} color={userBook.status === 'reading' ? colors.white : colors.primary} />}
                />
              )}
              
              <Button
                title="Remove"
                onPress={handleRemoveFromList}
                variant="outline"
                isLoading={isLoading}
                style={[styles.actionButton, styles.removeButton]}
                textStyle={styles.removeButtonText}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  publishDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  pageCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  progressSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.reading,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.text,
    width: 40,
    textAlign: 'right',
  },
  progressButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressButton: {
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  progressButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  genres: {
    padding: 16,
  },
  genresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  genresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: colors.primary,
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  removeButton: {
    borderColor: colors.error,
  },
  removeButtonText: {
    color: colors.error,
  },
  shareButton: {
    padding: 8,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 24,
  },
});
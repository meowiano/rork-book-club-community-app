import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Book, BookStatus } from '@/types';
import { colors } from '@/constants/colors';

// Default book cover for when no image is available
const DEFAULT_BOOK_COVER = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1887&auto=format&fit=crop';

interface BookCardProps {
  book: Book;
  onPress: () => void;
  status?: BookStatus;
  progress?: number;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  status,
  progress,
  style,
  compact = false
}) => {
  const { title, author, coverImage } = book;
  
  const statusColor = status ? {
    wishlist: colors.wishlist,
    reading: colors.reading,
    read: colors.read
  }[status] : undefined;
  
  const statusLabel = status ? {
    wishlist: 'Want to Read',
    reading: 'Reading',
    read: 'Read'
  }[status] : undefined;

  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.compactContainer, style]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: coverImage || DEFAULT_BOOK_COVER }}
          style={styles.compactCover}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.compactInfo}>
          <Text style={styles.compactTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.compactAuthor} numberOfLines={1}>{author}</Text>
          
          {status && (
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{statusLabel}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: coverImage || DEFAULT_BOOK_COVER }}
        style={styles.cover}
        contentFit="cover"
        transition={300}
      />
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.author} numberOfLines={1}>{author}</Text>
        
        {status && (
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        )}
        
        {status === 'reading' && progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.reading,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    width: 36,
    textAlign: 'right',
  },
  
  // Compact styles
  compactContainer: {
    width: 120,
    marginRight: 12,
  },
  compactCover: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  compactInfo: {
    width: '100%',
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  compactAuthor: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
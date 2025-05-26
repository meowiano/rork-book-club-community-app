import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useBookStore } from '@/store/bookStore';
import { colors } from '@/constants/colors';
import { BookCard } from '@/components/BookCard';
import { SearchBar } from '@/components/SearchBar';
import { Book, BookStatus } from '@/types';
import { EmptyState } from '@/components/EmptyState';
import { BookOpen, PlusCircle } from 'lucide-react-native';

export default function MyBooksScreen() {
  const { user } = useAuthStore();
  const { books, userBooks, fetchBooks, fetchUserBooks } = useBookStore();
  const [activeTab, setActiveTab] = useState<BookStatus>('reading');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);
  
  const loadData = async () => {
    if (user) {
      await Promise.all([
        fetchBooks(),
        fetchUserBooks(user.id)
      ]);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const handleBookPress = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };
  
  const handleAddBook = () => {
    router.push('/add-book');
  };
  
  // Filter books based on active tab and search query
  const filteredBooks = userBooks
    .filter(userBook => userBook.status === activeTab)
    .map(userBook => {
      const book = books.find(b => b.id === userBook.bookId);
      if (!book) return null;
      
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        if (
          !book.title.toLowerCase().includes(query) &&
          !book.author.toLowerCase().includes(query)
        ) {
          return null;
        }
      }
      
      return {
        ...book,
        progress: userBook.progress
      };
    })
    .filter(Boolean) as (Book & { progress?: number })[];
  
  const renderEmptyState = () => {
    const messages = {
      reading: {
        title: "You're not reading any books",
        message: "Add books to your 'Currently Reading' list to track your progress."
      },
      wishlist: {
        title: "Your wishlist is empty",
        message: "Add books you want to read in the future to your wishlist."
      },
      read: {
        title: "You haven't marked any books as read",
        message: "Books you finish reading will appear here."
      }
    };
    
    return (
      <EmptyState
        title={messages[activeTab].title}
        message={messages[activeTab].message}
        icon={<BookOpen size={32} color={colors.primary} />}
        actionLabel="Add a Book"
        onAction={handleAddBook}
      />
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Books</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
          <PlusCircle size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <SearchBar
        placeholder="Search your books"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />
      
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reading' && styles.activeTab]}
          onPress={() => setActiveTab('reading')}
        >
          <Text style={[styles.tabText, activeTab === 'reading' && styles.activeTabText]}>
            Reading
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'wishlist' && styles.activeTab]}
          onPress={() => setActiveTab('wishlist')}
        >
          <Text style={[styles.tabText, activeTab === 'wishlist' && styles.activeTabText]}>
            Want to Read
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'read' && styles.activeTab]}
          onPress={() => setActiveTab('read')}
        >
          <Text style={[styles.tabText, activeTab === 'read' && styles.activeTabText]}>
            Read
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredBooks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            status={activeTab}
            progress={item.progress}
            onPress={() => handleBookPress(item.id)}
            style={styles.bookCard}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    padding: 4,
  },
  searchBar: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    flexGrow: 1,
  },
  bookCard: {
    marginBottom: 12,
  },
});
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useBookStore } from '@/store/bookStore';
import { useClubStore } from '@/store/clubStore';
import { colors } from '@/constants/colors';
import { BookCard } from '@/components/BookCard';
import { ClubCard } from '@/components/ClubCard';
import { SearchBar } from '@/components/SearchBar';
import { Book, BookClub } from '@/types';
import { ChevronRight } from 'lucide-react-native';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { books, userBooks, fetchBooks, fetchUserBooks } = useBookStore();
  const { userClubs, fetchUserClubs } = useClubStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
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
        fetchUserBooks(user.id),
        fetchUserClubs(user.id)
      ]);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const handleSearch = async () => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      const results = await useBookStore.getState().searchBooks(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };
  
  const handleBookPress = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };
  
  const handleClubPress = (clubId: string) => {
    router.push(`/club/${clubId}`);
  };
  
  const handleViewAllBooks = () => {
    router.push('/my-books');
  };
  
  const handleViewAllClubs = () => {
    router.push('/clubs');
  };
  
  // Get currently reading books
  const readingBooks = userBooks
    .filter(userBook => userBook.status === 'reading')
    .map(userBook => books.find(book => book.id === userBook.bookId))
    .filter(Boolean) as Book[];
  
  // Get recently added books to wishlist
  const wishlistBooks = userBooks
    .filter(userBook => userBook.status === 'wishlist')
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 5)
    .map(userBook => books.find(book => book.id === userBook.bookId))
    .filter(Boolean) as Book[];
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {user?.displayName?.split(' ')[0] || 'Reader'}
          </Text>
          <Text style={styles.subgreeting}>
            {readingBooks.length > 0 
              ? "Continue your reading journey" 
              : "Discover your next favorite book"}
          </Text>
        </View>
        
        <SearchBar
          placeholder="Search for books"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
        />
        
        {searchQuery.trim().length > 0 && (
          <View style={styles.searchResults}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {isSearching ? (
              <Text style={styles.loadingText}>Searching...</Text>
            ) : searchResults.length > 0 ? (
              searchResults.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onPress={() => handleBookPress(book.id)}
                  style={styles.bookCard}
                />
              ))
            ) : (
              <Text style={styles.noResultsText}>No books found matching "{searchQuery}"</Text>
            )}
          </View>
        )}
        
        {searchQuery.trim().length === 0 && (
          <>
            {readingBooks.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Continue Reading</Text>
                </View>
                
                {readingBooks.map(book => (
                  <BookCard
                    key={book.id}
                    book={book}
                    status="reading"
                    progress={userBooks.find(ub => ub.bookId === book.id)?.progress}
                    onPress={() => handleBookPress(book.id)}
                    style={styles.bookCard}
                  />
                ))}
              </View>
            )}
            
            {userClubs.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Your Book Clubs</Text>
                  <TouchableOpacity onPress={handleViewAllClubs} style={styles.viewAll}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <ChevronRight size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  {userClubs.map(club => (
                    <ClubCard
                      key={club.id}
                      club={club}
                      onPress={() => handleClubPress(club.id)}
                      compact
                    />
                  ))}
                </ScrollView>
              </View>
            )}
            
            {wishlistBooks.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Your Wishlist</Text>
                  <TouchableOpacity onPress={handleViewAllBooks} style={styles.viewAll}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <ChevronRight size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  {wishlistBooks.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      status="wishlist"
                      onPress={() => handleBookPress(book.id)}
                      compact
                    />
                  ))}
                </ScrollView>
              </View>
            )}
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Discover Books</Text>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {books.slice(0, 6).map(book => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onPress={() => handleBookPress(book.id)}
                    compact
                  />
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subgreeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  horizontalScroll: {
    marginHorizontal: -4,
    paddingHorizontal: 4,
  },
  bookCard: {
    marginBottom: 12,
  },
  searchResults: {
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});
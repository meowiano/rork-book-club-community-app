import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useBookStore } from '@/store/bookStore';
import { colors } from '@/constants/colors';
import { SearchBar } from '@/components/SearchBar';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Book, BookStatus } from '@/types';
import { ArrowLeft, BookOpen, PlusCircle, Check, Search, Edit } from 'lucide-react-native';

// Mock function to simulate Google Books API
const searchGoogleBooks = async (query: string): Promise<Book[]> => {
  // In a real app, this would call the Google Books API
  // For demo purposes, we'll just return mock data with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate some fake books based on the query
  return [
    {
      id: `google-${Date.now()}-1`,
      title: `${query} - A Novel`,
      author: 'Jane Author',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop',
      description: `A fascinating book about ${query} that explores themes of love, loss, and redemption.`,
      isbn: '9781234567897',
      publishedDate: new Date().toISOString(),
      pageCount: 320,
      genres: ['Fiction', 'Contemporary']
    },
    {
      id: `google-${Date.now()}-2`,
      title: `The History of ${query}`,
      author: 'John Historian',
      coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1776&auto=format&fit=crop',
      description: `A comprehensive history of ${query} from ancient times to the present day.`,
      isbn: '9781234567898',
      publishedDate: new Date().toISOString(),
      pageCount: 450,
      genres: ['Non-fiction', 'History']
    },
    {
      id: `google-${Date.now()}-3`,
      title: `${query} for Beginners`,
      author: 'Sarah Teacher',
      coverImage: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=1770&auto=format&fit=crop',
      description: `An easy-to-follow guide to ${query} for those just starting out.`,
      isbn: '9781234567899',
      publishedDate: new Date().toISOString(),
      pageCount: 250,
      genres: ['Non-fiction', 'Self-help']
    }
  ];
};

// Mock function to simulate ISBN lookup
const lookupByISBN = async (isbn: string): Promise<Book | null> => {
  // In a real app, this would call an ISBN database API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a mock book for demo purposes
  if (isbn.length >= 10) {
    return {
      id: `isbn-${Date.now()}`,
      title: `Book with ISBN ${isbn}`,
      author: 'ISBN Author',
      coverImage: 'https://images.unsplash.com/photo-1531901599143-df5010ab9438?q=80&w=1769&auto=format&fit=crop',
      description: 'This book was found using its ISBN number.',
      isbn: isbn,
      publishedDate: new Date().toISOString(),
      pageCount: 300,
      genres: ['Fiction']
    };
  }
  
  return null;
};

type AddBookMode = 'search' | 'manual' | 'isbn';

export default function AddBookScreen() {
  const { user } = useAuthStore();
  const { books, userBooks, searchBooks, addUserBook, addBook } = useBookStore();
  
  const [mode, setMode] = useState<AddBookMode>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(books);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<BookStatus>('wishlist');
  const [isAdding, setIsAdding] = useState(false);
  
  // Manual book entry fields
  const [manualTitle, setManualTitle] = useState('');
  const [manualAuthor, setManualAuthor] = useState('');
  const [manualIsbn, setManualIsbn] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  
  // ISBN lookup fields
  const [isbnToLookup, setIsbnToLookup] = useState('');
  const [isbnLookupResult, setIsbnLookupResult] = useState<Book | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  
  useEffect(() => {
    // Initially show all books
    setSearchResults(books);
  }, [books]);
  
  const handleSearch = async () => {
    if (searchQuery.trim().length === 0) {
      setSearchResults(books);
      return;
    }
    
    setIsSearching(true);
    try {
      // First search local books
      const localResults = await searchBooks(searchQuery);
      
      // Then search Google Books API
      const googleResults = await searchGoogleBooks(searchQuery);
      
      // Combine results, removing duplicates
      const combinedResults = [...localResults];
      googleResults.forEach(googleBook => {
        if (!combinedResults.some(book => book.title === googleBook.title && book.author === googleBook.author)) {
          combinedResults.push(googleBook);
        }
      });
      
      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Error searching books:', error);
      Alert.alert('Error', 'Failed to search books');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
  };
  
  const handleAddBook = async () => {
    if (!user) return;
    
    setIsAdding(true);
    try {
      if (mode === 'search' && selectedBookId) {
        // For search mode, we need to check if the book is from Google Books API
        // If so, we need to add it to our book store first
        const selectedBook = searchResults.find(book => book.id === selectedBookId);
        if (selectedBook && selectedBook.id.startsWith('google-')) {
          await addBook(selectedBook);
        }
        
        await addUserBook(user.id, selectedBookId, selectedStatus);
        Alert.alert(
          'Success',
          'Book added to your list!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else if (mode === 'manual') {
        if (!manualTitle || !manualAuthor) {
          Alert.alert('Error', 'Please enter at least a title and author');
          setIsAdding(false);
          return;
        }
        
        // Create a new book with manual entry data
        const newBook: Book = {
          id: `manual-${Date.now()}`,
          title: manualTitle,
          author: manualAuthor,
          coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop', // Default cover
          description: manualDescription || `A book by ${manualAuthor}`,
          ...(manualIsbn ? { isbn: manualIsbn } : {}),
          publishedDate: new Date().toISOString(),
        };
        
        // Add the book to the store and user's list
        await addBook(newBook);
        await addUserBook(user.id, newBook.id, selectedStatus);
        
        Alert.alert(
          'Success',
          'Book added to your list!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else if (mode === 'isbn' && isbnLookupResult) {
        // Add the book from ISBN lookup to the store and user's list
        await addBook(isbnLookupResult);
        await addUserBook(user.id, isbnLookupResult.id, selectedStatus);
        
        Alert.alert(
          'Success',
          'Book added to your list!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Error adding book:', error);
      Alert.alert('Error', 'Failed to add book to your list');
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleIsbnLookup = async () => {
    if (!isbnToLookup.trim()) {
      Alert.alert('Error', 'Please enter an ISBN');
      return;
    }
    
    setIsLookingUp(true);
    try {
      const result = await lookupByISBN(isbnToLookup.trim());
      setIsbnLookupResult(result);
      
      if (!result) {
        Alert.alert('Not Found', 'No book found with this ISBN. Please try another or enter the book details manually.');
      }
    } catch (error) {
      console.error('Error looking up ISBN:', error);
      Alert.alert('Error', 'Failed to look up ISBN');
    } finally {
      setIsLookingUp(false);
    }
  };
  
  const isBookInUserLibrary = (bookId: string) => {
    return userBooks.some(userBook => userBook.bookId === bookId);
  };
  
  const renderBookItem = ({ item }) => {
    const isInLibrary = isBookInUserLibrary(item.id);
    const isSelected = selectedBookId === item.id;
    
    return (
      <TouchableOpacity
        onPress={() => handleSelectBook(item.id)}
        disabled={isInLibrary}
        style={[
          styles.bookItem,
          isSelected && styles.selectedBookItem,
          isInLibrary && styles.disabledBookItem
        ]}
      >
        <BookCard
          book={item}
          onPress={() => {}}
          style={styles.bookCard}
        />
        {isInLibrary && (
          <View style={styles.inLibraryBadge}>
            <Text style={styles.inLibraryText}>Already in your library</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  const renderModeSelector = () => (
    <View style={styles.modeSelector}>
      <TouchableOpacity
        style={[styles.modeButton, mode === 'search' && styles.activeModeButton]}
        onPress={() => setMode('search')}
      >
        <Search size={20} color={mode === 'search' ? colors.white : colors.primary} />
        <Text style={[styles.modeButtonText, mode === 'search' && styles.activeModeButtonText]}>
          Search
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.modeButton, mode === 'isbn' && styles.activeModeButton]}
        onPress={() => setMode('isbn')}
      >
        <BookOpen size={20} color={mode === 'isbn' ? colors.white : colors.primary} />
        <Text style={[styles.modeButtonText, mode === 'isbn' && styles.activeModeButtonText]}>
          ISBN Lookup
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.modeButton, mode === 'manual' && styles.activeModeButton]}
        onPress={() => setMode('manual')}
      >
        <Edit size={20} color={mode === 'manual' ? colors.white : colors.primary} />
        <Text style={[styles.modeButtonText, mode === 'manual' && styles.activeModeButtonText]}>
          Manual Entry
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderSearchMode = () => (
    <View style={styles.contentScrollContainer}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search by title or author"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          autoFocus={mode === 'search'}
        />
      </View>
      
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Searching books...</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          renderItem={renderBookItem}
          contentContainerStyle={styles.booksList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No books found. Try a different search term.
            </Text>
          }
        />
      )}
    </View>
  );
  
  const renderManualEntryMode = () => (
    <ScrollView style={styles.contentScrollContainer} contentContainerStyle={styles.manualEntryContent}>
      <Input
        label="Title *"
        value={manualTitle}
        onChangeText={setManualTitle}
        placeholder="Enter book title"
        autoCapitalize="words"
      />
      
      <Input
        label="Author *"
        value={manualAuthor}
        onChangeText={setManualAuthor}
        placeholder="Enter author name"
        autoCapitalize="words"
      />
      
      <Input
        label="ISBN (optional)"
        value={manualIsbn}
        onChangeText={setManualIsbn}
        placeholder="Enter ISBN"
        keyboardType="number-pad"
      />
      
      <Input
        label="Description (optional)"
        value={manualDescription}
        onChangeText={setManualDescription}
        placeholder="Enter book description"
        multiline
        numberOfLines={4}
      />
      
      <Text style={styles.requiredFieldsNote}>* Required fields</Text>
      
      {/* Add extra padding at the bottom to ensure content isn't covered by the footer */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
  
  const renderIsbnLookupMode = () => (
    <ScrollView style={styles.contentScrollContainer} contentContainerStyle={styles.isbnLookupContent}>
      <View style={styles.isbnInputContainer}>
        <Input
          label="ISBN"
          value={isbnToLookup}
          onChangeText={setIsbnToLookup}
          placeholder="Enter ISBN number"
          keyboardType="number-pad"
          style={styles.isbnInput}
        />
        
        <Button
          title="Lookup"
          onPress={handleIsbnLookup}
          variant="primary"
          isLoading={isLookingUp}
          style={styles.lookupButton}
        />
      </View>
      
      {isLookingUp ? (
        <View style={styles.lookupLoadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Looking up ISBN...</Text>
        </View>
      ) : isbnLookupResult ? (
        <View style={styles.isbnResultContainer}>
          <Text style={styles.isbnResultTitle}>Book Found:</Text>
          <BookCard
            book={isbnLookupResult}
            onPress={() => {}}
            style={styles.isbnResultBook}
          />
        </View>
      ) : (
        <View style={styles.isbnInstructions}>
          <Text style={styles.isbnInstructionsText}>
            Enter an ISBN number to look up book details automatically.
          </Text>
          <Text style={styles.isbnInstructionsSubtext}>
            ISBN numbers are typically found on the back cover or copyright page of a book.
          </Text>
        </View>
      )}
      
      {/* Add extra padding at the bottom to ensure content isn't covered by the footer */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
  
  const canAddBook = () => {
    if (mode === 'search') return !!selectedBookId;
    if (mode === 'manual') return !!manualTitle && !!manualAuthor;
    if (mode === 'isbn') return !!isbnLookupResult;
    return false;
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Add Book',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {renderModeSelector()}
          
          <View style={styles.contentContainer}>
            {mode === 'search' && renderSearchMode()}
            {mode === 'manual' && renderManualEntryMode()}
            {mode === 'isbn' && renderIsbnLookupMode()}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Add to:</Text>
            
            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  selectedStatus === 'wishlist' && styles.selectedStatusButton
                ]}
                onPress={() => setSelectedStatus('wishlist')}
              >
                <PlusCircle size={20} color={selectedStatus === 'wishlist' ? colors.white : colors.primary} />
                <Text style={[
                  styles.statusButtonText,
                  selectedStatus === 'wishlist' && styles.selectedStatusButtonText
                ]}>
                  Want to Read
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  selectedStatus === 'reading' && styles.selectedStatusButton
                ]}
                onPress={() => setSelectedStatus('reading')}
              >
                <BookOpen size={20} color={selectedStatus === 'reading' ? colors.white : colors.primary} />
                <Text style={[
                  styles.statusButtonText,
                  selectedStatus === 'reading' && styles.selectedStatusButtonText
                ]}>
                  Currently Reading
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  selectedStatus === 'read' && styles.selectedStatusButton
                ]}
                onPress={() => setSelectedStatus('read')}
              >
                <Check size={20} color={selectedStatus === 'read' ? colors.white : colors.primary} />
                <Text style={[
                  styles.statusButtonText,
                  selectedStatus === 'read' && styles.selectedStatusButtonText
                ]}>
                  Read
                </Text>
              </TouchableOpacity>
            </View>
            
            <Button
              title="Add Book"
              onPress={handleAddBook}
              variant="primary"
              size="large"
              isLoading={isAdding}
              disabled={!canAddBook()}
            />
          </View>
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
  keyboardAvoid: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  modeSelector: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    marginHorizontal: 4,
  },
  activeModeButton: {
    backgroundColor: colors.primary,
  },
  modeButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  activeModeButtonText: {
    color: colors.white,
  },
  contentContainer: {
    flex: 1,
  },
  contentScrollContainer: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  booksList: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 200, // Add extra padding at the bottom to ensure content isn't covered by the footer
  },
  bookItem: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBookItem: {
    borderColor: colors.primary,
  },
  disabledBookItem: {
    opacity: 0.7,
  },
  bookCard: {
    marginBottom: 0,
  },
  inLibraryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  inLibraryText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 24,
    fontSize: 16,
  },
  manualEntryContent: {
    padding: 16,
    paddingBottom: 200, // Add extra padding at the bottom
  },
  requiredFieldsNote: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  isbnLookupContent: {
    padding: 16,
    paddingBottom: 200, // Add extra padding at the bottom
  },
  isbnInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  isbnInput: {
    flex: 1,
    marginRight: 8,
  },
  lookupButton: {
    marginBottom: 16,
  },
  lookupLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  isbnResultContainer: {
    marginTop: 16,
  },
  isbnResultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  isbnResultBook: {
    marginBottom: 0,
  },
  isbnInstructions: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 40,
  },
  isbnInstructionsText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  isbnInstructionsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statusButtons: {
    marginBottom: 16,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedStatusButton: {
    backgroundColor: colors.primary,
  },
  statusButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  selectedStatusButtonText: {
    color: colors.white,
  },
  bottomPadding: {
    height: 200, // Extra padding at the bottom
  },
});
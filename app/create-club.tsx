import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/authStore';
import { useClubStore } from '@/store/clubStore';
import { useBookStore } from '@/store/bookStore';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { BookCard } from '@/components/BookCard';
import { Camera, X } from 'lucide-react-native';

// Sample club cover images
const SAMPLE_COVERS = [
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1770&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=1770&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551029506-0807df4e2031?q=80&w=1934&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1776&auto=format&fit=crop',
];

export default function CreateClubScreen() {
  const { user } = useAuthStore();
  const { createClub } = useClubStore();
  const { books, fetchBooks } = useBookStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedCover, setSelectedCover] = useState(SAMPLE_COVERS[0]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation
  const isFormValid = name.trim().length > 0 && description.trim().length > 0;
  
  const handleCreateClub = async () => {
    if (!user || !isFormValid) return;
    
    setIsLoading(true);
    try {
      await createClub({
        name: name.trim(),
        description: description.trim(),
        image: selectedCover,
        isPublic,
        ownerId: user.id,
        moderatorIds: [user.id],
        memberIds: [user.id],
        pendingMemberIds: [],
        currentBookId: selectedBookId || undefined,
        previousBookIds: [],
        genres: []
      });
      
      Alert.alert(
        'Success',
        'Your book club has been created!',
        [
          { 
            text: 'OK', 
            onPress: () => router.replace('/clubs')
          }
        ]
      );
    } catch (error) {
      console.error('Error creating club:', error);
      Alert.alert('Error', 'Failed to create book club');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setShowBookSelector(false);
  };
  
  const handleRemoveSelectedBook = () => {
    setSelectedBookId(null);
  };
  
  const selectedBook = selectedBookId ? books.find(book => book.id === selectedBookId) : null;
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Create Book Club',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
              <X size={24} color={colors.text} />
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
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.coverSection}>
              <Text style={styles.sectionTitle}>Club Cover</Text>
              <View style={styles.coverPreview}>
                <Image
                  source={{ uri: selectedCover }}
                  style={styles.coverImage}
                  contentFit="cover"
                />
                <TouchableOpacity style={styles.changeCoverButton}>
                  <Camera size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coverOptions}>
                {SAMPLE_COVERS.map((cover, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.coverOption,
                      selectedCover === cover && styles.selectedCoverOption
                    ]}
                    onPress={() => setSelectedCover(cover)}
                  >
                    <Image
                      source={{ uri: cover }}
                      style={styles.coverOptionImage}
                      contentFit="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.formSection}>
              <Input
                label="Club Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter a name for your book club"
                autoCapitalize="words"
              />
              
              <Input
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="What is your book club about?"
                multiline
                numberOfLines={4}
              />
              
              <View style={styles.privacySection}>
                <View style={styles.privacyHeader}>
                  <Text style={styles.privacyLabel}>Club Privacy</Text>
                  <Switch
                    value={isPublic}
                    onValueChange={setIsPublic}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.white}
                  />
                </View>
                <Text style={styles.privacyDescription}>
                  {isPublic 
                    ? 'Public clubs can be found by anyone and joined instantly.' 
                    : 'Private clubs require approval to join and are not visible in search.'
                  }
                </Text>
              </View>
              
              <View style={styles.currentBookSection}>
                <Text style={styles.sectionTitle}>Current Book (Optional)</Text>
                
                {selectedBook ? (
                  <View style={styles.selectedBookContainer}>
                    <BookCard
                      book={selectedBook}
                      onPress={() => {}}
                      compact={false}
                    />
                    <TouchableOpacity 
                      style={styles.removeBookButton}
                      onPress={handleRemoveSelectedBook}
                    >
                      <X size={20} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Button
                    title="Select a Book"
                    onPress={() => setShowBookSelector(true)}
                    variant="outline"
                    style={styles.selectBookButton}
                  />
                )}
              </View>
              
              {showBookSelector && (
                <View style={styles.bookSelector}>
                  <View style={styles.bookSelectorHeader}>
                    <Text style={styles.bookSelectorTitle}>Select a Book</Text>
                    <TouchableOpacity onPress={() => setShowBookSelector(false)}>
                      <X size={20} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.bookList}>
                    {books.map(book => (
                      <TouchableOpacity
                        key={book.id}
                        style={styles.bookItem}
                        onPress={() => handleSelectBook(book.id)}
                      >
                        <BookCard
                          book={book}
                          onPress={() => handleSelectBook(book.id)}
                          compact={false}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <Button
              title="Create Book Club"
              onPress={handleCreateClub}
              variant="primary"
              size="large"
              isLoading={isLoading}
              disabled={!isFormValid}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  closeButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  coverSection: {
    marginBottom: 24,
  },
  coverPreview: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  changeCoverButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverOptions: {
    flexDirection: 'row',
  },
  coverOption: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCoverOption: {
    borderColor: colors.primary,
  },
  coverOptionImage: {
    width: '100%',
    height: '100%',
  },
  formSection: {
    marginBottom: 24,
  },
  privacySection: {
    marginBottom: 24,
  },
  privacyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  privacyLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  privacyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  currentBookSection: {
    marginBottom: 24,
  },
  selectedBookContainer: {
    position: 'relative',
  },
  removeBookButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(220, 53, 69, 0.8)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectBookButton: {
    
  },
  bookSelector: {
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookSelectorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  bookList: {
    maxHeight: 400,
  },
  bookItem: {
    marginBottom: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
});
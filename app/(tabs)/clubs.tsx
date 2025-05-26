import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useClubStore } from '@/store/clubStore';
import { colors } from '@/constants/colors';
import { ClubCard } from '@/components/ClubCard';
import { SearchBar } from '@/components/SearchBar';
import { BookClub } from '@/types';
import { EmptyState } from '@/components/EmptyState';
import { Users, PlusCircle } from 'lucide-react-native';

export default function ClubsScreen() {
  const { user } = useAuthStore();
  const { clubs, userClubs, fetchClubs, fetchUserClubs } = useClubStore();
  const [activeTab, setActiveTab] = useState<'my' | 'discover'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookClub[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);
  
  const loadData = async () => {
    if (user) {
      await Promise.all([
        fetchClubs(),
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
      const results = await useClubStore.getState().searchClubs(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  
  const handleClubPress = (clubId: string) => {
    router.push(`/club/${clubId}`);
  };
  
  const handleCreateClub = () => {
    router.push('/create-club');
  };
  
  // Filter clubs based on active tab and search query
  const getFilteredClubs = () => {
    if (searchQuery.trim() !== '') {
      return searchResults;
    }
    
    if (activeTab === 'my') {
      return userClubs;
    } else {
      // For discover tab, show all clubs except those the user is already in
      return clubs.filter(club => 
        !userClubs.some(userClub => userClub.id === club.id) &&
        club.isPublic
      );
    }
  };
  
  const filteredClubs = getFilteredClubs();
  
  const renderEmptyState = () => {
    if (searchQuery.trim() !== '') {
      return (
        <EmptyState
          title="No clubs found"
          message={`No book clubs matching "${searchQuery}"`}
          icon={<Users size={32} color={colors.primary} />}
        />
      );
    }
    
    if (activeTab === 'my') {
      return (
        <EmptyState
          title="You haven't joined any clubs yet"
          message="Join a book club or create your own to start discussing books with others."
          icon={<Users size={32} color={colors.primary} />}
          actionLabel="Create a Club"
          onAction={handleCreateClub}
        />
      );
    } else {
      return (
        <EmptyState
          title="No clubs to discover"
          message="Check back later for new book clubs to join, or create your own!"
          icon={<Users size={32} color={colors.primary} />}
          actionLabel="Create a Club"
          onAction={handleCreateClub}
        />
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Clubs</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateClub}>
          <PlusCircle size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <SearchBar
        placeholder="Search book clubs"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        style={styles.searchBar}
      />
      
      {searchQuery.trim() === '' && (
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'my' && styles.activeTab]}
            onPress={() => setActiveTab('my')}
          >
            <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
              My Clubs
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
            onPress={() => setActiveTab('discover')}
          >
            <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>
              Discover
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={filteredClubs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ClubCard
            club={item}
            onPress={() => handleClubPress(item.id)}
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
  createButton: {
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
});
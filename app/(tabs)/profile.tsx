import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/authStore';
import { useBookStore } from '@/store/bookStore';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { 
  User, 
  BookOpen, 
  Users, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronRight,
  Camera
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuthStore();
  const { userBooks, fetchUserBooks } = useBookStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);
  
  const loadData = async () => {
    if (user) {
      await fetchUserBooks(user.id);
    }
  };
  
  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)');
          }
        }
      ]
    );
  };
  
  const handleEditProfile = () => {
    // In a real app, this would navigate to a profile edit screen
    alert('This would open a profile edit screen in a real app');
  };
  
  const handleChangeProfilePicture = () => {
    // In a real app, this would open the image picker
    alert('This would open the image picker in a real app');
  };
  
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  // Count books by status
  const readingCount = userBooks.filter(book => book.status === 'reading').length;
  const readCount = userBooks.filter(book => book.status === 'read').length;
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: user?.profileImage }}
              style={styles.profileImage}
              contentFit="cover"
            />
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={handleChangeProfilePicture}
            >
              <Camera size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            
            <Button
              title="Edit Profile"
              onPress={handleEditProfile}
              variant="outline"
              size="small"
              style={styles.editButton}
            />
          </View>
        </View>
        
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <BookOpen size={20} color={colors.primary} />
            <Text style={styles.statValue}>{readCount}</Text>
            <Text style={styles.statLabel}>Books Read</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Users size={20} color={colors.primary} />
            <Text style={styles.statValue}>{user?.joinedClubs.length || 0}</Text>
            <Text style={styles.statLabel}>Book Clubs</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <BookOpen size={20} color={colors.primary} />
            <Text style={styles.statValue}>{readingCount}</Text>
            <Text style={styles.statLabel}>Reading</Text>
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={colors.text} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Settings size={20} color={colors.text} />
              <Text style={styles.settingText}>App Settings</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <User size={20} color={colors.text} />
              <Text style={styles.settingText}>Account</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Privacy Policy</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Terms of Service</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Help & Support</Text>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="outline"
          size="large"
          isLoading={isLoading}
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
          icon={<LogOut size={20} color={colors.error} />}
        />
        
        <Text style={styles.versionText}>BookClub v1.0.0</Text>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  aboutSection: {
    marginBottom: 24,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderColor: colors.error,
  },
  logoutButtonText: {
    color: colors.error,
  },
  versionText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 32,
  },
});
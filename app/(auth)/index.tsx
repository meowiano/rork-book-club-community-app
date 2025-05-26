import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function WelcomeScreen() {
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    // If user is already authenticated, redirect to main app
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);
  
  const handleLogin = () => {
    router.push('/login');
  };
  
  const handleSignup = () => {
    router.push('/signup');
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(74, 111, 165, 0.1)', 'rgba(157, 200, 141, 0.1)']}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2070&auto=format&fit=crop' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>BookClub</Text>
        <Text style={styles.subtitle}>Connect with readers, discover new books, and join the conversation.</Text>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📚</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Track Your Reading</Text>
              <Text style={styles.featureDescription}>Keep a record of books you've read, are reading, or want to read.</Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>👥</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Join Book Clubs</Text>
              <Text style={styles.featureDescription}>Connect with other readers who share your interests.</Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>💬</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Discuss & Share</Text>
              <Text style={styles.featureDescription}>Engage in meaningful discussions about your favorite books.</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button
          title="Sign Up"
          onPress={handleSignup}
          variant="primary"
          size="large"
          style={styles.signupButton}
        />
        
        <Button
          title="Log In"
          onPress={handleLogin}
          variant="outline"
          size="large"
          style={styles.loginButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  features: {
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    padding: 24,
    paddingBottom: 36,
  },
  signupButton: {
    marginBottom: 12,
  },
  loginButton: {
    
  },
});
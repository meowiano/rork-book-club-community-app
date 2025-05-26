import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { BookClub } from '@/types';
import { colors } from '@/constants/colors';
import { Users, Lock, Unlock } from 'lucide-react-native';

interface ClubCardProps {
  club: BookClub;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

export const ClubCard: React.FC<ClubCardProps> = ({
  club,
  onPress,
  style,
  compact = false
}) => {
  const { name, description, image, isPublic, memberIds } = club;
  
  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.compactContainer, style]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: image }}
          style={styles.compactImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.compactOverlay}>
          <Text style={styles.compactName} numberOfLines={1}>{name}</Text>
          <View style={styles.compactMeta}>
            <View style={styles.compactMembers}>
              <Users size={14} color={colors.white} />
              <Text style={styles.compactMembersText}>{memberIds.length}</Text>
            </View>
            {!isPublic && <Lock size={14} color={colors.white} />}
          </View>
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
        source={{ uri: image }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {isPublic ? (
            <View style={styles.badge}>
              <Unlock size={14} color={colors.white} />
              <Text style={styles.badgeText}>Public</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.privateBadge]}>
              <Lock size={14} color={colors.white} />
              <Text style={styles.badgeText}>Private</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.members}>
            <Users size={16} color={colors.textSecondary} />
            <Text style={styles.membersText}>{memberIds.length} members</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  privateBadge: {
    backgroundColor: colors.textSecondary,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  members: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  membersText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  
  // Compact styles
  compactContainer: {
    width: 160,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
  },
  compactName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  compactMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactMembers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactMembersText: {
    color: colors.white,
    fontSize: 12,
  },
});
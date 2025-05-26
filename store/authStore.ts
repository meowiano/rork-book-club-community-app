import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, User } from '@/types';
import { currentUser } from '@/mocks/users';

// Default avatar images for new users
const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop'
];

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithSocial: (provider: 'google' | 'apple') => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, validate credentials against backend
          if (email === 'demo@example.com' && password === 'password') {
            set({ isAuthenticated: true, user: currentUser, isLoading: false });
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred' 
          });
        }
      },

      loginWithSocial: async (provider) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would integrate with Google/Apple auth
          set({ isAuthenticated: true, user: currentUser, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred' 
          });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({ isAuthenticated: false, user: null, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred' 
          });
        }
      },

      signup: async (email, password, displayName) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Select a random default avatar
          const randomAvatar = DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
          
          // In a real app, create user in backend
          const newUser: User = {
            id: `user-${Date.now()}`,
            email,
            displayName,
            profileImage: randomAvatar,
            joinedClubs: [],
            createdAt: new Date().toISOString()
          };
          
          set({ isAuthenticated: true, user: newUser, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred' 
          });
        }
      },

      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            isLoading: false,
            user: state.user ? { ...state.user, ...userData } : null
          }));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An error occurred' 
          });
        }
      }
    }),
    {
      name: 'book-club-auth-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
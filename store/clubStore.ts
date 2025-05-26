import { create } from 'zustand';
import { BookClub, Message } from '@/types';
import { mockBookClubs } from '@/mocks/bookClubs';
import { mockMessages } from '@/mocks/messages';

interface ClubStore {
  clubs: BookClub[];
  userClubs: BookClub[];
  currentClub: BookClub | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  fetchClubs: () => Promise<void>;
  fetchUserClubs: (userId: string) => Promise<void>;
  fetchClubById: (clubId: string) => Promise<void>;
  fetchClubMessages: (clubId: string) => Promise<void>;
  createClub: (clubData: Omit<BookClub, 'id' | 'createdAt'>) => Promise<void>;
  joinClub: (clubId: string, userId: string) => Promise<void>;
  requestToJoinClub: (clubId: string, userId: string) => Promise<void>;
  approveJoinRequest: (clubId: string, userId: string) => Promise<void>;
  leaveClub: (clubId: string, userId: string) => Promise<void>;
  updateClub: (clubId: string, clubData: Partial<BookClub>) => Promise<void>;
  sendMessage: (clubId: string, userId: string, text: string, replyToId?: string) => Promise<void>;
  reportMessage: (messageId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  searchClubs: (query: string) => Promise<BookClub[]>;
}

export const useClubStore = create<ClubStore>((set, get) => ({
  clubs: [],
  userClubs: [],
  currentClub: null,
  messages: [],
  isLoading: false,
  error: null,
  
  fetchClubs: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({ clubs: mockBookClubs, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  fetchUserClubs: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter clubs where user is a member
      const userClubsForUser = mockBookClubs.filter(club => 
        club.memberIds.includes(userId)
      );
      
      set({ userClubs: userClubsForUser, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  fetchClubById: async (clubId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const club = mockBookClubs.find(c => c.id === clubId);
      if (!club) {
        throw new Error('Club not found');
      }
      
      set({ currentClub: club, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  fetchClubMessages: async (clubId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const clubMessages = mockMessages[clubId] || [];
      set({ messages: clubMessages, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  createClub: async (clubData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newClub: BookClub = {
        ...clubData,
        id: `club-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      // Update the mock data
      mockBookClubs.push(newClub);
      
      set(state => ({
        clubs: [...state.clubs, newClub],
        userClubs: [...state.userClubs, newClub],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  joinClub: async (clubId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the mock data
      const clubIndex = mockBookClubs.findIndex(club => club.id === clubId);
      if (clubIndex !== -1) {
        if (!mockBookClubs[clubIndex].memberIds.includes(userId)) {
          mockBookClubs[clubIndex].memberIds.push(userId);
        }
      }
      
      set(state => {
        const updatedClubs = state.clubs.map(club => {
          if (club.id === clubId && !club.memberIds.includes(userId)) {
            return {
              ...club,
              memberIds: [...club.memberIds, userId]
            };
          }
          return club;
        });
        
        const updatedUserClubs = updatedClubs.filter(club => 
          club.memberIds.includes(userId)
        );
        
        const updatedCurrentClub = state.currentClub?.id === clubId
          ? { ...state.currentClub, memberIds: [...state.currentClub.memberIds, userId] }
          : state.currentClub;
        
        return {
          clubs: updatedClubs,
          userClubs: updatedUserClubs,
          currentClub: updatedCurrentClub,
          isLoading: false
        };
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  requestToJoinClub: async (clubId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the mock data
      const clubIndex = mockBookClubs.findIndex(club => club.id === clubId);
      if (clubIndex !== -1) {
        if (!mockBookClubs[clubIndex].pendingMemberIds.includes(userId)) {
          mockBookClubs[clubIndex].pendingMemberIds.push(userId);
        }
      }
      
      set(state => {
        const updatedClubs = state.clubs.map(club => {
          if (club.id === clubId && !club.pendingMemberIds.includes(userId)) {
            return {
              ...club,
              pendingMemberIds: [...club.pendingMemberIds, userId]
            };
          }
          return club;
        });
        
        const updatedCurrentClub = state.currentClub?.id === clubId
          ? { ...state.currentClub, pendingMemberIds: [...state.currentClub.pendingMemberIds, userId] }
          : state.currentClub;
        
        return {
          clubs: updatedClubs,
          currentClub: updatedCurrentClub,
          isLoading: false
        };
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  approveJoinRequest: async (clubId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the mock data
      const clubIndex = mockBookClubs.findIndex(club => club.id === clubId);
      if (clubIndex !== -1) {
        if (!mockBookClubs[clubIndex].memberIds.includes(userId)) {
          mockBookClubs[clubIndex].memberIds.push(userId);
        }
        mockBookClubs[clubIndex].pendingMemberIds = mockBookClubs[clubIndex].pendingMemberIds.filter(id => id !== userId);
      }
      
      set(state => {
        const updatedClubs = state.clubs.map(club => {
          if (club.id === clubId) {
            return {
              ...club,
              memberIds: club.memberIds.includes(userId) ? club.memberIds : [...club.memberIds, userId],
              pendingMemberIds: club.pendingMemberIds.filter(id => id !== userId)
            };
          }
          return club;
        });
        
        const updatedUserClubs = updatedClubs.filter(club => 
          club.memberIds.includes(userId)
        );
        
        const updatedCurrentClub = state.currentClub?.id === clubId
          ? {
              ...state.currentClub,
              memberIds: state.currentClub.memberIds.includes(userId) 
                ? state.currentClub.memberIds 
                : [...state.currentClub.memberIds, userId],
              pendingMemberIds: state.currentClub.pendingMemberIds.filter(id => id !== userId)
            }
          : state.currentClub;
        
        return {
          clubs: updatedClubs,
          userClubs: updatedUserClubs,
          currentClub: updatedCurrentClub,
          isLoading: false
        };
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  leaveClub: async (clubId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the mock data
      const clubIndex = mockBookClubs.findIndex(club => club.id === clubId);
      if (clubIndex !== -1) {
        mockBookClubs[clubIndex].memberIds = mockBookClubs[clubIndex].memberIds.filter(id => id !== userId);
        mockBookClubs[clubIndex].moderatorIds = mockBookClubs[clubIndex].moderatorIds.filter(id => id !== userId);
      }
      
      set(state => {
        const updatedClubs = state.clubs.map(club => {
          if (club.id === clubId) {
            return {
              ...club,
              memberIds: club.memberIds.filter(id => id !== userId),
              moderatorIds: club.moderatorIds.filter(id => id !== userId)
            };
          }
          return club;
        });
        
        const updatedUserClubs = updatedClubs.filter(club => 
          club.memberIds.includes(userId)
        );
        
        const updatedCurrentClub = state.currentClub?.id === clubId
          ? {
              ...state.currentClub,
              memberIds: state.currentClub.memberIds.filter(id => id !== userId),
              moderatorIds: state.currentClub.moderatorIds.filter(id => id !== userId)
            }
          : state.currentClub;
        
        return {
          clubs: updatedClubs,
          userClubs: updatedUserClubs,
          currentClub: updatedCurrentClub,
          isLoading: false
        };
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  updateClub: async (clubId, clubData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the mock data
      const clubIndex = mockBookClubs.findIndex(club => club.id === clubId);
      if (clubIndex !== -1) {
        mockBookClubs[clubIndex] = { ...mockBookClubs[clubIndex], ...clubData };
      }
      
      set(state => {
        const updatedClubs = state.clubs.map(club => {
          if (club.id === clubId) {
            return { ...club, ...clubData };
          }
          return club;
        });
        
        const updatedUserClubs = state.userClubs.map(club => {
          if (club.id === clubId) {
            return { ...club, ...clubData };
          }
          return club;
        });
        
        const updatedCurrentClub = state.currentClub?.id === clubId
          ? { ...state.currentClub, ...clubData }
          : state.currentClub;
        
        return {
          clubs: updatedClubs,
          userClubs: updatedUserClubs,
          currentClub: updatedCurrentClub,
          isLoading: false
        };
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  sendMessage: async (clubId, userId, text, replyToId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        clubId,
        userId,
        text,
        timestamp: new Date().toISOString(),
        ...(replyToId ? { replyToId } : {})
      };
      
      // Update the mock data
      if (!mockMessages[clubId]) {
        mockMessages[clubId] = [];
      }
      mockMessages[clubId].push(newMessage);
      
      set(state => ({
        messages: [...state.messages, newMessage],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  reportMessage: async (messageId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the mock data
      for (const clubId in mockMessages) {
        const messageIndex = mockMessages[clubId].findIndex(msg => msg.id === messageId);
        if (messageIndex !== -1) {
          mockMessages[clubId][messageIndex] = { ...mockMessages[clubId][messageIndex], isReported: true };
          break;
        }
      }
      
      set(state => ({
        messages: state.messages.map(message => 
          message.id === messageId ? { ...message, isReported: true } : message
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  deleteMessage: async (messageId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the mock data
      for (const clubId in mockMessages) {
        mockMessages[clubId] = mockMessages[clubId].filter(msg => msg.id !== messageId);
      }
      
      set(state => ({
        messages: state.messages.filter(message => message.id !== messageId),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  searchClubs: async (query) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const searchResults = mockBookClubs.filter(club => 
        club.name.toLowerCase().includes(query.toLowerCase()) ||
        club.description.toLowerCase().includes(query.toLowerCase()) ||
        (club.genres && club.genres.some(genre => 
          genre.toLowerCase().includes(query.toLowerCase())
        ))
      );
      
      set({ isLoading: false });
      return searchResults;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
      return [];
    }
  }
}));
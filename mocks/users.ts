import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'alex@example.com',
    displayName: 'Alex Johnson',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
    joinedClubs: ['1', '3'],
    createdAt: '2023-01-01T10:00:00Z'
  },
  {
    id: 'user2',
    email: 'sam@example.com',
    displayName: 'Sam Wilson',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
    joinedClubs: ['1', '2'],
    createdAt: '2023-01-05T14:30:00Z'
  },
  {
    id: 'user3',
    email: 'taylor@example.com',
    displayName: 'Taylor Smith',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop',
    joinedClubs: ['1', '3'],
    createdAt: '2023-01-10T09:15:00Z'
  },
  {
    id: 'user4',
    email: 'jordan@example.com',
    displayName: 'Jordan Lee',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop',
    joinedClubs: ['1', '4'],
    createdAt: '2023-01-15T16:45:00Z'
  },
  {
    id: 'user5',
    email: 'morgan@example.com',
    displayName: 'Morgan Chen',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop',
    joinedClubs: ['2', '5'],
    createdAt: '2023-01-20T11:20:00Z'
  }
];

export const currentUser = mockUsers[0];
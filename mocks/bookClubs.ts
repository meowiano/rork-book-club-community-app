import { BookClub } from '@/types';

export const mockBookClubs: BookClub[] = [
  {
    id: '1',
    name: 'Fiction Fanatics',
    description: 'A club for lovers of all fiction genres. We read one book per month and meet weekly to discuss our progress.',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1770&auto=format&fit=crop',
    isPublic: true,
    ownerId: 'user1',
    moderatorIds: ['user1', 'user2'],
    memberIds: ['user1', 'user2', 'user3', 'user4'],
    pendingMemberIds: [],
    currentBookId: '1',
    previousBookIds: ['2', '5'],
    createdAt: '2023-01-15T12:00:00Z',
    genres: ['Fiction', 'Fantasy', 'Mystery', 'Thriller']
  },
  {
    id: '2',
    name: 'Science & Beyond',
    description: 'Exploring the wonders of science through non-fiction books. From physics to biology, we cover it all!',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop',
    isPublic: true,
    ownerId: 'user2',
    moderatorIds: ['user2'],
    memberIds: ['user2', 'user5', 'user6'],
    pendingMemberIds: ['user7'],
    currentBookId: '3',
    previousBookIds: ['6'],
    createdAt: '2023-02-20T15:30:00Z',
    genres: ['Science', 'Non-fiction', 'Technology', 'Education']
  },
  {
    id: '3',
    name: 'Literary Classics',
    description: 'Dedicated to reading and discussing the greatest works of literature throughout history.',
    image: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=1770&auto=format&fit=crop',
    isPublic: false,
    ownerId: 'user3',
    moderatorIds: ['user3'],
    memberIds: ['user3', 'user1', 'user8'],
    pendingMemberIds: ['user9', 'user10'],
    currentBookId: '4',
    previousBookIds: [],
    createdAt: '2023-03-10T09:15:00Z',
    genres: ['Classics', 'Literary Fiction', 'Historical Fiction']
  },
  {
    id: '4',
    name: 'Personal Growth',
    description: 'A supportive community focused on self-improvement books and implementing positive changes in our lives.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop',
    isPublic: true,
    ownerId: 'user4',
    moderatorIds: ['user4', 'user11'],
    memberIds: ['user4', 'user11', 'user12', 'user13', 'user14'],
    pendingMemberIds: [],
    currentBookId: '6',
    previousBookIds: [],
    createdAt: '2023-04-05T14:45:00Z',
    genres: ['Self Help', 'Psychology', 'Productivity', 'Wellness']
  },
  {
    id: '5',
    name: 'Mystery Lovers',
    description: 'For those who enjoy solving puzzles and unraveling mysteries through books.',
    image: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?q=80&w=1934&auto=format&fit=crop',
    isPublic: true,
    ownerId: 'user5',
    moderatorIds: ['user5'],
    memberIds: ['user5', 'user15', 'user16'],
    pendingMemberIds: [],
    currentBookId: '5',
    previousBookIds: ['1'],
    createdAt: '2023-05-12T11:20:00Z',
    genres: ['Mystery', 'Thriller', 'Crime', 'Suspense']
  }
];
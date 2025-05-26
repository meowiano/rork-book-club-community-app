import { UserBook } from '@/types';

export const mockUserBooks: UserBook[] = [
  {
    bookId: '1',
    userId: 'user1',
    status: 'reading',
    progress: 65,
    dateAdded: '2023-05-15T10:00:00Z',
    dateStarted: '2023-05-16T14:30:00Z'
  },
  {
    bookId: '2',
    userId: 'user1',
    status: 'read',
    progress: 100,
    dateAdded: '2023-04-10T09:15:00Z',
    dateStarted: '2023-04-12T18:45:00Z',
    dateFinished: '2023-04-30T20:20:00Z'
  },
  {
    bookId: '3',
    userId: 'user1',
    status: 'wishlist',
    dateAdded: '2023-05-20T16:30:00Z'
  },
  {
    bookId: '4',
    userId: 'user1',
    status: 'wishlist',
    dateAdded: '2023-05-25T11:45:00Z'
  },
  {
    bookId: '5',
    userId: 'user1',
    status: 'read',
    progress: 100,
    dateAdded: '2023-03-05T08:30:00Z',
    dateStarted: '2023-03-07T19:15:00Z',
    dateFinished: '2023-03-25T22:10:00Z'
  }
];
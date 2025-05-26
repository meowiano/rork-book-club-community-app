export type User = {
  id: string;
  email: string;
  displayName: string;
  profileImage?: string;
  joinedClubs: string[];
  createdAt: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  isbn?: string;
  publishedDate?: string;
  pageCount?: number;
  genres?: string[];
};

export type BookStatus = 'wishlist' | 'reading' | 'read';

export type UserBook = {
  bookId: string;
  userId: string;
  status: BookStatus;
  progress?: number;
  dateAdded: string;
  dateStarted?: string;
  dateFinished?: string;
};

export type BookClub = {
  id: string;
  name: string;
  description: string;
  image: string;
  isPublic: boolean;
  ownerId: string;
  moderatorIds: string[];
  memberIds: string[];
  pendingMemberIds: string[];
  currentBookId?: string;
  previousBookIds: string[];
  createdAt: string;
  genres?: string[];
};

export type Message = {
  id: string;
  clubId: string;
  userId: string;
  text: string;
  timestamp: string;
  replyToId?: string;
  attachments?: string[];
  isReported?: boolean;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'invite' | 'mention' | 'approval' | 'message' | 'request';
  referenceId: string; // Could be clubId, messageId, etc.
  title: string;
  body: string;
  isRead: boolean;
  timestamp: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
};
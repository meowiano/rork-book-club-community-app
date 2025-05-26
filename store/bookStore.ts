import { create } from 'zustand';
import { Book, UserBook, BookStatus } from '@/types';
import { mockBooks } from '@/mocks/books';
import { mockUserBooks } from '@/mocks/userBooks';

interface BookStore {
  books: Book[];
  userBooks: UserBook[];
  isLoading: boolean;
  error: string | null;
  
  fetchBooks: () => Promise<void>;
  fetchUserBooks: (userId: string) => Promise<void>;
  addUserBook: (userId: string, bookId: string, status: BookStatus) => Promise<void>;
  updateUserBookStatus: (userId: string, bookId: string, status: BookStatus) => Promise<void>;
  updateUserBookProgress: (userId: string, bookId: string, progress: number) => Promise<void>;
  removeUserBook: (userId: string, bookId: string) => Promise<void>;
  searchBooks: (query: string) => Promise<Book[]>;
  addBook: (book: Book) => Promise<void>;
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  userBooks: [],
  isLoading: false,
  error: null,
  
  fetchBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({ books: mockBooks, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  fetchUserBooks: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter user books by userId
      const userBooksForUser = mockUserBooks.filter(book => book.userId === userId);
      set({ userBooks: userBooksForUser, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  addUserBook: async (userId, bookId, status) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUserBook: UserBook = {
        userId,
        bookId,
        status,
        dateAdded: new Date().toISOString(),
        ...(status === 'reading' ? { dateStarted: new Date().toISOString(), progress: 0 } : {}),
        ...(status === 'read' ? { 
          dateStarted: new Date().toISOString(), 
          dateFinished: new Date().toISOString(),
          progress: 100
        } : {})
      };
      
      set(state => ({
        userBooks: [...state.userBooks, newUserBook],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  updateUserBookStatus: async (userId, bookId, status) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => {
        const updatedUserBooks = state.userBooks.map(book => {
          if (book.userId === userId && book.bookId === bookId) {
            const updates: Partial<UserBook> = { status };
            
            // Add appropriate date fields based on new status
            if (status === 'reading' && !book.dateStarted) {
              updates.dateStarted = new Date().toISOString();
              updates.progress = 0;
            }
            
            if (status === 'read') {
              updates.dateFinished = new Date().toISOString();
              updates.progress = 100;
              if (!book.dateStarted) {
                updates.dateStarted = new Date().toISOString();
              }
            }
            
            return { ...book, ...updates };
          }
          return book;
        });
        
        return { userBooks: updatedUserBooks, isLoading: false };
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  updateUserBookProgress: async (userId, bookId, progress) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => {
        const updatedUserBooks = state.userBooks.map(book => {
          if (book.userId === userId && book.bookId === bookId) {
            // If progress is 100%, also mark as read and set dateFinished
            if (progress === 100 && book.status !== 'read') {
              return {
                ...book,
                progress,
                status: 'read',
                dateFinished: new Date().toISOString()
              };
            }
            return { ...book, progress };
          }
          return book;
        });
        
        return { userBooks: updatedUserBooks, isLoading: false };
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  },
  
  removeUserBook: async (userId, bookId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        userBooks: state.userBooks.filter(
          book => !(book.userId === userId && book.bookId === bookId)
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
  
  searchBooks: async (query) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const searchResults = mockBooks.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
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
  },
  
  addBook: async (book) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => {
        // Check if book already exists
        const existingBook = state.books.find(b => 
          (book.isbn && b.isbn === book.isbn) || 
          (b.title === book.title && b.author === book.author)
        );
        
        if (existingBook) {
          return { isLoading: false };
        }
        
        return {
          books: [...state.books, book],
          isLoading: false
        };
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  }
}));
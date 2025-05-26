import { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'user1',
    type: 'message',
    referenceId: '1', // clubId
    title: 'New message in Fiction Fanatics',
    body: 'Sam Wilson: "I\'m loving the concept so far..."',
    isRead: false,
    timestamp: '2023-06-01T10:05:00Z'
  },
  {
    id: 'n2',
    userId: 'user1',
    type: 'mention',
    referenceId: 'm5', // messageId
    title: 'You were mentioned',
    body: 'Alex Johnson mentioned you in Fiction Fanatics',
    isRead: true,
    timestamp: '2023-06-01T10:20:00Z'
  },
  {
    id: 'n3',
    userId: 'user1',
    type: 'invite',
    referenceId: '4', // clubId
    title: 'Club Invitation',
    body: 'Jordan Lee invited you to join Personal Growth',
    isRead: false,
    timestamp: '2023-06-02T15:30:00Z'
  },
  {
    id: 'n4',
    userId: 'user1',
    type: 'approval',
    referenceId: '3', // clubId
    title: 'Club Request Approved',
    body: 'Your request to join Literary Classics was approved',
    isRead: true,
    timestamp: '2023-06-03T09:00:00Z'
  }
];
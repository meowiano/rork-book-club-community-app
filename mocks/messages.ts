import { Message } from '@/types';

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      clubId: '1',
      userId: 'user1',
      text: "Welcome everyone to our first discussion of 'The Midnight Library'! What are your initial thoughts?",
      timestamp: '2023-06-01T10:00:00Z'
    },
    {
      id: 'm2',
      clubId: '1',
      userId: 'user2',
      text: "I'm loving the concept so far. The idea of a library between life and death is fascinating!",
      timestamp: '2023-06-01T10:05:00Z'
    },
    {
      id: 'm3',
      clubId: '1',
      userId: 'user3',
      text: "The main character's journey is so relatable. I think we've all wondered about different paths we could have taken.",
      timestamp: '2023-06-01T10:10:00Z'
    },
    {
      id: 'm4',
      clubId: '1',
      userId: 'user4',
      text: "I'm about halfway through. The writing style is beautiful but I'm finding some parts a bit slow. Anyone else?",
      timestamp: '2023-06-01T10:15:00Z'
    },
    {
      id: 'm5',
      clubId: '1',
      userId: 'user1',
      text: "That's interesting @Jordan. I actually found the pacing perfect. Maybe it picks up in the second half?",
      timestamp: '2023-06-01T10:20:00Z',
      replyToId: 'm4'
    }
  ],
  '2': [
    {
      id: 'm6',
      clubId: '2',
      userId: 'user2',
      text: "Let's start our discussion of 'Project Hail Mary'. What did everyone think of the scientific concepts?",
      timestamp: '2023-06-02T14:00:00Z'
    },
    {
      id: 'm7',
      clubId: '2',
      userId: 'user5',
      text: "I was blown away by how accessible the complex science was made. Andy Weir has a talent for that!",
      timestamp: '2023-06-02T14:05:00Z'
    },
    {
      id: 'm8',
      clubId: '2',
      userId: 'user6',
      text: "The relationship between Grace and Rocky was my favorite part. Such a unique take on first contact!",
      timestamp: '2023-06-02T14:10:00Z'
    }
  ],
  '3': [
    {
      id: 'm9',
      clubId: '3',
      userId: 'user3',
      text: "Welcome to our discussion of 'Klara and the Sun'. Let's start with the theme of artificial intelligence and humanity.",
      timestamp: '2023-06-03T09:00:00Z'
    },
    {
      id: 'm10',
      clubId: '3',
      userId: 'user1',
      text: "Ishiguro's portrayal of AI consciousness through Klara's perspective is so thoughtful. It made me question what it means to be human.",
      timestamp: '2023-06-03T09:05:00Z'
    },
    {
      id: 'm11',
      clubId: '3',
      userId: 'user8',
      text: "I found the social hierarchy and the treatment of the AFs quite disturbing. It seems like a commentary on how we treat those we consider 'other'.",
      timestamp: '2023-06-03T09:10:00Z'
    }
  ]
};
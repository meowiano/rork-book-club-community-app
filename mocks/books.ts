import { Book } from '@/types';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    isbn: '9780525559474',
    publishedDate: '2020-09-29',
    pageCount: 304,
    genres: ['Fiction', 'Fantasy', 'Contemporary']
  },
  {
    id: '2',
    title: 'Educated',
    author: 'Tara Westover',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1776&auto=format&fit=crop',
    description: 'An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
    isbn: '9780399590504',
    publishedDate: '2018-02-20',
    pageCount: 352,
    genres: ['Memoir', 'Biography', 'Nonfiction']
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverImage: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=1770&auto=format&fit=crop',
    description: 'A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian.',
    isbn: '9780593135204',
    publishedDate: '2021-05-04',
    pageCount: 496,
    genres: ['Science Fiction', 'Space', 'Adventure']
  },
  {
    id: '4',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    coverImage: 'https://images.unsplash.com/photo-1531901599143-df5010ab9438?q=80&w=1769&auto=format&fit=crop',
    description: 'From the Nobel Prize-winning author, a novel about an Artificial Friend who observes the world around her, watching and learning about human behavior.',
    isbn: '9780571364879',
    publishedDate: '2021-03-02',
    pageCount: 320,
    genres: ['Science Fiction', 'Literary Fiction', 'Dystopian']
  },
  {
    id: '5',
    title: 'The Vanishing Half',
    author: 'Brit Bennett',
    coverImage: 'https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b6?q=80&w=1887&auto=format&fit=crop',
    description: 'The Vignes twin sisters will always be identical. But after growing up together in a small, southern black community and running away at age sixteen, one sister lives with her black daughter in the same southern town, while the other secretly passes for white.',
    isbn: '9780525536291',
    publishedDate: '2020-06-02',
    pageCount: 352,
    genres: ['Historical Fiction', 'Literary Fiction', 'Contemporary']
  },
  {
    id: '6',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverImage: 'https://images.unsplash.com/photo-1598618443855-232ee0f819f6?q=80&w=1770&auto=format&fit=crop',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    isbn: '9780735211292',
    publishedDate: '2018-10-16',
    pageCount: 320,
    genres: ['Self Help', 'Nonfiction', 'Psychology']
  }
];
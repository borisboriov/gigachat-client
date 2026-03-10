import type { Chat } from '../types';

export const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    title: 'Как работает React?',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 60 * 60 * 1000,
    messages: [],
  },
  {
    id: '2',
    title: 'Настройка Vite + TypeScript',
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
    messages: [],
  },
  {
    id: '3',
    title: 'SSE стриминг в браузере',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 24 * 60 * 60 * 1000,
    messages: [],
  },
  {
    id: '4',
    title: 'Zustand vs Redux',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    messages: [],
  },
  {
    id: '5',
    title: 'SCSS модули и миксины',
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    messages: [],
  },
];


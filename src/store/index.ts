import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Chat, Message } from '../types';

interface StreamingState {
  isStreaming: boolean;
  streamingMessageId: string | null;
}

interface UIState {
  isSidebarOpen: boolean;
  activeModal: 'delete' | 'rename' | null;
  modalTargetChatId: string | null;
}

interface AppStore {
  chats: Chat[];
  activeChatId: string | null;
  streaming: StreamingState;
  ui: UIState;

  createChat: () => string;
  setActiveChat: (id: string) => void;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessageContent: (chatId: string, messageId: string, content: string) => void;
  setStreaming: (isStreaming: boolean, messageId?: string | null) => void;
  openModal: (modal: 'delete' | 'rename', chatId: string) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const generateTitle = (content: string): string => {
  const trimmed = content.trim();
  if (!trimmed || trimmed.length < 2) return 'Новый чат';
  if (trimmed.length <= 40) return trimmed;
  return trimmed.slice(0, 37) + '...';
};

export const useAppStore = create<AppStore>()(
  persist(
    immer((set) => ({
      chats: [],
      activeChatId: null,
      streaming: { isStreaming: false, streamingMessageId: null },
      ui: { isSidebarOpen: true, activeModal: null, modalTargetChatId: null },

      createChat: () => {
        const id = crypto.randomUUID();
        const now = Date.now();
        set((state) => {
          state.chats.unshift({
            id,
            title: 'Новый чат',
            createdAt: now,
            updatedAt: now,
            messages: [],
          });
          state.activeChatId = id;
        });
        return id;
      },

      setActiveChat: (id) => {
        set((state) => {
          state.activeChatId = id;
        });
      },

      deleteChat: (id) => {
        set((state) => {
          const idx = state.chats.findIndex((c) => c.id === id);
          if (idx === -1) return;
          state.chats.splice(idx, 1);
          if (state.activeChatId === id) {
            state.activeChatId = state.chats[0]?.id ?? null;
          }
          state.ui.activeModal = null;
          state.ui.modalTargetChatId = null;
        });
      },

      renameChat: (id, title) => {
        set((state) => {
          const chat = state.chats.find((c) => c.id === id);
          if (chat) {
            chat.title = title;
            chat.updatedAt = Date.now();
          }
          state.ui.activeModal = null;
          state.ui.modalTargetChatId = null;
        });
      },

      addMessage: (chatId, message) => {
        set((state) => {
          const chat = state.chats.find((c) => c.id === chatId);
          if (!chat) return;
          chat.messages.push(message);
          chat.updatedAt = Date.now();
          if (
            message.role === 'user' &&
            chat.messages.filter((m) => m.role === 'user').length === 1 &&
            chat.title === 'Новый чат'
          ) {
            chat.title = generateTitle(message.content);
          }
        });
      },

      updateMessageContent: (chatId, messageId, content) => {
        set((state) => {
          const chat = state.chats.find((c) => c.id === chatId);
          if (!chat) return;
          const msg = chat.messages.find((m) => m.id === messageId);
          if (msg) {
            msg.content = content;
            chat.updatedAt = Date.now();
          }
        });
      },

      setStreaming: (isStreaming, messageId = null) => {
        set((state) => {
          state.streaming.isStreaming = isStreaming;
          state.streaming.streamingMessageId = messageId ?? null;
        });
      },

      openModal: (modal, chatId) => {
        set((state) => {
          state.ui.activeModal = modal;
          state.ui.modalTargetChatId = chatId;
        });
      },

      closeModal: () => {
        set((state) => {
          state.ui.activeModal = null;
          state.ui.modalTargetChatId = null;
        });
      },

      toggleSidebar: () => {
        set((state) => {
          state.ui.isSidebarOpen = !state.ui.isSidebarOpen;
        });
      },

      setSidebarOpen: (open) => {
        set((state) => {
          state.ui.isSidebarOpen = open;
        });
      },
    })),
    {
      name: 'gigachat-storage',
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
      }),
    },
  ),
);

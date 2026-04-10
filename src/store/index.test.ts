import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './index';

const resetStore = () => {
  useAppStore.setState({
    chats: [],
    activeChatId: null,
    streaming: { isStreaming: false, streamingMessageId: null },
    ui: { isSidebarOpen: true, activeModal: null, modalTargetChatId: null },
  });
};

describe('useAppStore', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('createChat', () => {
    it('creates a new chat with unique id', () => {
      const id = useAppStore.getState().createChat();

      const { chats, activeChatId } = useAppStore.getState();
      expect(chats).toHaveLength(1);
      expect(chats[0].id).toBe(id);
      expect(chats[0].title).toBe('Новый чат');
      expect(chats[0].messages).toEqual([]);
      expect(activeChatId).toBe(id);
    });

    it('creates multiple chats with different ids', () => {
      const id1 = useAppStore.getState().createChat();
      const id2 = useAppStore.getState().createChat();

      expect(id1).not.toBe(id2);
      expect(useAppStore.getState().chats).toHaveLength(2);
    });

    it('sets the new chat as active', () => {
      useAppStore.getState().createChat();
      const id2 = useAppStore.getState().createChat();

      expect(useAppStore.getState().activeChatId).toBe(id2);
    });
  });

  describe('deleteChat', () => {
    it('removes chat from the array', () => {
      const id = useAppStore.getState().createChat();
      useAppStore.getState().deleteChat(id);

      expect(useAppStore.getState().chats).toHaveLength(0);
    });

    it('resets activeChatId when deleting the active chat', () => {
      const id1 = useAppStore.getState().createChat();
      useAppStore.getState().createChat();
      useAppStore.getState().setActiveChat(id1);

      useAppStore.getState().deleteChat(id1);

      const { activeChatId, chats } = useAppStore.getState();
      expect(activeChatId).toBe(chats[0].id);
    });

    it('sets activeChatId to null when deleting the last chat', () => {
      const id = useAppStore.getState().createChat();
      useAppStore.getState().deleteChat(id);

      expect(useAppStore.getState().activeChatId).toBeNull();
    });

    it('does not affect other chats', () => {
      const id1 = useAppStore.getState().createChat();
      const id2 = useAppStore.getState().createChat();

      useAppStore.getState().deleteChat(id1);

      const { chats } = useAppStore.getState();
      expect(chats).toHaveLength(1);
      expect(chats[0].id).toBe(id2);
    });
  });

  describe('renameChat', () => {
    it('updates the chat title', () => {
      const id = useAppStore.getState().createChat();
      useAppStore.getState().renameChat(id, 'Переименованный чат');

      const chat = useAppStore.getState().chats.find((c) => c.id === id);
      expect(chat?.title).toBe('Переименованный чат');
    });

    it('updates updatedAt timestamp', () => {
      const id = useAppStore.getState().createChat();
      const before = useAppStore.getState().chats[0].updatedAt;

      useAppStore.getState().renameChat(id, 'Новое название');

      const after = useAppStore.getState().chats[0].updatedAt;
      expect(after).toBeGreaterThanOrEqual(before);
    });

    it('does nothing for non-existent chat', () => {
      useAppStore.getState().createChat();
      useAppStore.getState().renameChat('non-existent', 'Test');

      expect(useAppStore.getState().chats).toHaveLength(1);
    });
  });

  describe('addMessage', () => {
    it('adds a message to the chat', () => {
      const chatId = useAppStore.getState().createChat();
      const msg = { id: 'm1', role: 'user' as const, content: 'Привет', createdAt: Date.now() };

      useAppStore.getState().addMessage(chatId, msg);

      const chat = useAppStore.getState().chats.find((c) => c.id === chatId);
      expect(chat?.messages).toHaveLength(1);
      expect(chat?.messages[0]).toMatchObject({ id: 'm1', content: 'Привет' });
    });

    it('appends message to the end', () => {
      const chatId = useAppStore.getState().createChat();
      const msg1 = { id: 'm1', role: 'user' as const, content: 'Первое', createdAt: Date.now() };
      const msg2 = { id: 'm2', role: 'assistant' as const, content: 'Второе', createdAt: Date.now() };

      useAppStore.getState().addMessage(chatId, msg1);
      useAppStore.getState().addMessage(chatId, msg2);

      const messages = useAppStore.getState().chats.find((c) => c.id === chatId)!.messages;
      expect(messages).toHaveLength(2);
      expect(messages[1].id).toBe('m2');
    });

    it('auto-generates title from first user message', () => {
      const chatId = useAppStore.getState().createChat();
      const msg = { id: 'm1', role: 'user' as const, content: 'Как работает React?', createdAt: Date.now() };

      useAppStore.getState().addMessage(chatId, msg);

      const chat = useAppStore.getState().chats.find((c) => c.id === chatId);
      expect(chat?.title).toBe('Как работает React?');
    });

    it('truncates long titles to 40 characters', () => {
      const chatId = useAppStore.getState().createChat();
      const longContent = 'Это очень длинное сообщение которое точно не поместится в заголовок чата';
      const msg = { id: 'm1', role: 'user' as const, content: longContent, createdAt: Date.now() };

      useAppStore.getState().addMessage(chatId, msg);

      const chat = useAppStore.getState().chats.find((c) => c.id === chatId);
      expect(chat!.title.length).toBeLessThanOrEqual(40);
      expect(chat!.title.endsWith('...')).toBe(true);
    });

    it('does not overwrite title after first user message', () => {
      const chatId = useAppStore.getState().createChat();
      const msg1 = { id: 'm1', role: 'user' as const, content: 'Первый вопрос', createdAt: Date.now() };
      const msg2 = { id: 'm2', role: 'user' as const, content: 'Второй вопрос', createdAt: Date.now() };

      useAppStore.getState().addMessage(chatId, msg1);
      useAppStore.getState().addMessage(chatId, msg2);

      const chat = useAppStore.getState().chats.find((c) => c.id === chatId);
      expect(chat?.title).toBe('Первый вопрос');
    });
  });

  describe('updateMessageContent', () => {
    it('updates message content by id', () => {
      const chatId = useAppStore.getState().createChat();
      const msg = { id: 'm1', role: 'assistant' as const, content: '', createdAt: Date.now() };

      useAppStore.getState().addMessage(chatId, msg);
      useAppStore.getState().updateMessageContent(chatId, 'm1', 'Обновлённый контент');

      const chat = useAppStore.getState().chats.find((c) => c.id === chatId);
      expect(chat?.messages[0].content).toBe('Обновлённый контент');
    });
  });

  describe('setActiveChat', () => {
    it('sets the active chat id', () => {
      const id1 = useAppStore.getState().createChat();
      useAppStore.getState().createChat();

      useAppStore.getState().setActiveChat(id1);
      expect(useAppStore.getState().activeChatId).toBe(id1);
    });
  });

  describe('modal actions', () => {
    it('opens and closes modal', () => {
      const id = useAppStore.getState().createChat();

      useAppStore.getState().openModal('delete', id);
      expect(useAppStore.getState().ui.activeModal).toBe('delete');
      expect(useAppStore.getState().ui.modalTargetChatId).toBe(id);

      useAppStore.getState().closeModal();
      expect(useAppStore.getState().ui.activeModal).toBeNull();
      expect(useAppStore.getState().ui.modalTargetChatId).toBeNull();
    });
  });

  describe('sidebar actions', () => {
    it('toggles sidebar', () => {
      expect(useAppStore.getState().ui.isSidebarOpen).toBe(true);

      useAppStore.getState().toggleSidebar();
      expect(useAppStore.getState().ui.isSidebarOpen).toBe(false);

      useAppStore.getState().toggleSidebar();
      expect(useAppStore.getState().ui.isSidebarOpen).toBe(true);
    });

    it('sets sidebar open state', () => {
      useAppStore.getState().setSidebarOpen(false);
      expect(useAppStore.getState().ui.isSidebarOpen).toBe(false);
    });
  });
});

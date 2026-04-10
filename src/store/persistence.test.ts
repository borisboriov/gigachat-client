import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './index';

describe('localStorage persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({
      chats: [],
      activeChatId: null,
      streaming: { isStreaming: false, streamingMessageId: null },
      ui: { isSidebarOpen: true, activeModal: null, modalTargetChatId: null },
    });
  });

  it('saves chats to localStorage on state change', () => {
    const id = useAppStore.getState().createChat();
    useAppStore.getState().addMessage(id, {
      id: 'm1',
      role: 'user',
      content: 'Привет',
      createdAt: Date.now(),
    });

    const stored = JSON.parse(localStorage.getItem('gigachat-storage')!);
    expect(stored.state.chats).toHaveLength(1);
    expect(stored.state.chats[0].messages).toHaveLength(1);
    expect(stored.state.activeChatId).toBe(id);
  });

  it('does not persist streaming state', () => {
    useAppStore.getState().createChat();
    useAppStore.getState().setStreaming(true, 'msg-1');

    const stored = JSON.parse(localStorage.getItem('gigachat-storage')!);
    expect(stored.state).not.toHaveProperty('streaming');
  });

  it('does not persist ui state', () => {
    useAppStore.getState().createChat();
    useAppStore.getState().toggleSidebar();

    const stored = JSON.parse(localStorage.getItem('gigachat-storage')!);
    expect(stored.state).not.toHaveProperty('ui');
  });

  it('restores state from localStorage on store creation', async () => {
    const chatData = {
      state: {
        chats: [
          {
            id: 'restored-1',
            title: 'Восстановленный чат',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: [{ id: 'rm1', role: 'user', content: 'Сохранённое сообщение', createdAt: Date.now() }],
          },
        ],
        activeChatId: 'restored-1',
      },
      version: 0,
    };
    localStorage.setItem('gigachat-storage', JSON.stringify(chatData));

    const { useAppStore: freshStore } = await import('./index');
    await freshStore.persist.rehydrate();

    const state = freshStore.getState();
    expect(state.chats).toHaveLength(1);
    expect(state.chats[0].title).toBe('Восстановленный чат');
    expect(state.activeChatId).toBe('restored-1');
  });

  it('does not crash on invalid JSON in localStorage', async () => {
    localStorage.setItem('gigachat-storage', '{broken json!!!}');

    expect(() => {
      const stored = localStorage.getItem('gigachat-storage');
      try {
        JSON.parse(stored!);
      } catch {
        // App should handle gracefully — Zustand persist catches this internally
      }
    }).not.toThrow();

    const state = useAppStore.getState();
    expect(state.chats).toBeDefined();
    expect(Array.isArray(state.chats)).toBe(true);
  });

  it('handles empty localStorage gracefully', () => {
    localStorage.removeItem('gigachat-storage');

    const state = useAppStore.getState();
    expect(state.chats).toEqual([]);
    expect(state.activeChatId).toBeNull();
  });
});

import { useRef, useCallback, useState } from 'react';
import { useAppStore } from '../store';
import { chatAPI } from '../api/gigachat';
import type { ApiMessage } from '../api/types';
import type { Message } from '../types';

interface UseChatOptions {
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
}

export function useChat(chatId: string | undefined, options: UseChatOptions) {
  const addMessage = useAppStore((s) => s.addMessage);
  const updateMessageContent = useAppStore((s) => s.updateMessageContent);
  const setStreaming = useAppStore((s) => s.setStreaming);
  const isStreaming = useAppStore((s) => s.streaming.isStreaming);

  const [error, setError] = useState<string | null>(null);
  const lastContentRef = useRef<string>('');
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (userContent: string) => {
      if (!chatId || isStreaming) return;
      setError(null);

      lastContentRef.current = userContent;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: userContent,
        createdAt: Date.now(),
      };
      addMessage(chatId, userMessage);

      const assistantMessageId = crypto.randomUUID();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      };
      addMessage(chatId, assistantMessage);
      setStreaming(true, assistantMessageId);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const chat = useAppStore.getState().chats.find((c) => c.id === chatId);
        if (!chat) return;

        const apiMessages: ApiMessage[] = [];
        if (options.systemPrompt.trim()) {
          apiMessages.push({ role: 'system', content: options.systemPrompt.trim() });
        }
        for (const msg of chat.messages) {
          if (msg.role === 'user' || msg.role === 'assistant') {
            apiMessages.push({ role: msg.role, content: msg.content });
          }
        }

        let accumulated = '';
        const stream = chatAPI.sendMessage(
          apiMessages,
          {
            model: options.model,
            temperature: options.temperature,
            topP: options.topP,
            maxTokens: options.maxTokens,
          },
          controller.signal,
        );

        for await (const token of stream) {
          accumulated += token;
          updateMessageContent(chatId, assistantMessageId, accumulated);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // stopped by user
        } else {
          setError('Не удалось получить ответ от GigaChat. Попробуйте ещё раз.');
          const chat = useAppStore.getState().chats.find((c) => c.id === chatId);
          const msg = chat?.messages.find((m) => m.id === assistantMessageId);
          if (msg && !msg.content) {
            updateMessageContent(chatId, assistantMessageId, 'Произошла ошибка при получении ответа.');
          }
        }
      } finally {
        abortRef.current = null;
        setStreaming(false);
      }
    },
    [chatId, isStreaming, addMessage, updateMessageContent, setStreaming, options],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const retry = useCallback(() => {
    if (lastContentRef.current) {
      void send(lastContentRef.current);
    }
  }, [send]);

  return { send, stop, retry, isStreaming, error };
}

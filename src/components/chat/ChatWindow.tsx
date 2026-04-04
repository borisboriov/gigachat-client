import type React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { useChat } from '../../hooks/useChat';
import { MessageList } from './MessageList';
import { EmptyState } from './EmptyState';
import { InputArea } from '../input/InputArea';
import { SettingsPanel, type UserSettings } from '../settings/SettingsPanel';
import { Toggle } from '../ui/Toggle';
import styles from './ChatWindow.module.scss';

export const ChatWindow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const chat = useAppStore((s) => s.chats.find((c) => c.id === id));
  const setActiveChat = useAppStore((s) => s.setActiveChat);

  const [input, setInput] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    model: 'GigaChat',
    temperature: 1,
    topP: 1,
    maxTokens: 1024,
    systemPrompt: '',
    theme: 'light',
  });

  const { send, stop, isStreaming } = useChat(id, {
    model: settings.model,
    temperature: settings.temperature,
    topP: settings.topP,
    maxTokens: settings.maxTokens,
    systemPrompt: settings.systemPrompt,
  });

  useEffect(() => {
    if (id) setActiveChat(id);
  }, [id, setActiveChat]);

  useEffect(() => {
    if (id && !chat) navigate('/', { replace: true });
  }, [id, chat, navigate]);

  const handleSubmit = () => {
    const value = input.trim();
    if (!value || isStreaming) return;
    setInput('');
    send(value);
  };

  if (!chat) return null;

  const hasMessages = chat.messages.length > 0;

  return (
    <div className={styles.chatWindow}>
      <header className={styles.header}>
        <div className={styles.title}>{chat.title}</div>
        <div className={styles.headerActions}>
          <Toggle />
          <button
            type="button"
            className={styles.settingsButton}
            aria-label="Открыть настройки"
            onClick={() => setIsSettingsOpen(true)}
          >
            ⚙
          </button>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.messagesWrapper}>
          {hasMessages ? (
            <MessageList messages={chat.messages} showTypingIndicator={isStreaming} />
          ) : (
            <EmptyState />
          )}
        </div>
        <div className={styles.inputWrapper}>
          <InputArea
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onStop={stop}
            isLoading={isStreaming}
          />
        </div>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(next) => {
          setSettings(next);
          setIsSettingsOpen(false);
        }}
      />
    </div>
  );
};

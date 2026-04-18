import type React from 'react';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { useChat } from '../../hooks/useChat';
import { MessageList } from './MessageList';
import { EmptyState } from './EmptyState';
import { InputArea } from '../input/InputArea';
import { Toggle } from '../ui/Toggle';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { ErrorMessage } from '../ui/ErrorMessage';
import type { UserSettings } from '../settings/SettingsPanel';
import styles from './ChatWindow.module.scss';

const SettingsPanel = lazy(() =>
  import('../settings/SettingsPanel').then((m) => ({ default: m.SettingsPanel })),
);

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

  const { send, stop, retry, isStreaming, error } = useChat(id, {
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

  const handleSubmit = useCallback(() => {
    const value = input.trim();
    if (!value || isStreaming) return;
    setInput('');
    void send(value);
  }, [input, isStreaming, send]);

  const handleOpenSettings = useCallback(() => setIsSettingsOpen(true), []);
  const handleCloseSettings = useCallback(() => setIsSettingsOpen(false), []);
  const handleSaveSettings = useCallback((next: UserSettings) => {
    setSettings(next);
    setIsSettingsOpen(false);
  }, []);

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
            onClick={handleOpenSettings}
          >
            ⚙
          </button>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.messagesWrapper}>
          <ErrorBoundary>
            {hasMessages ? (
              <MessageList messages={chat.messages} showTypingIndicator={isStreaming} />
            ) : (
              <EmptyState />
            )}
          </ErrorBoundary>
        </div>
        <div className={styles.inputWrapper}>
          {error && <ErrorMessage message={error} onRetry={retry} />}
          <InputArea
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onStop={stop}
            isLoading={isStreaming}
          />
        </div>
      </div>

      <Suspense fallback={null}>
        <SettingsPanel
          isOpen={isSettingsOpen}
          settings={settings}
          onClose={handleCloseSettings}
          onSave={handleSaveSettings}
        />
      </Suspense>
    </div>
  );
};

import type React from 'react';
import { useState } from 'react';
import type { Message as MessageType } from '../../types';
import { MessageList } from './MessageList';
import { EmptyState } from './EmptyState';
import { InputArea } from '../input/InputArea';
import { SettingsPanel, type UserSettings } from '../settings/SettingsPanel';
import styles from './ChatWindow.module.scss';

interface ChatWindowProps {
  title: string;
  messages: MessageType[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ title, messages }) => {
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

  const handleSubmit = () => {
    // На этапе 1 просто очищаем поле
    setInput('');
  };

  const hasMessages = messages.length > 0;

  return (
    <div className={styles.chatWindow}>
      <header className={styles.header}>
        <div className={styles.title}>{title}</div>
        <button
          type="button"
          className={styles.settingsButton}
          aria-label="Открыть настройки"
          onClick={() => setIsSettingsOpen(true)}
        >
          ⚙
        </button>
      </header>

      <div className={styles.body}>
        <div className={styles.messagesWrapper}>
          {hasMessages ? (
            <MessageList messages={messages} showTypingIndicator />
          ) : (
            <EmptyState />
          )}
        </div>
        <div className={styles.inputWrapper}>
          <InputArea value={input} onChange={setInput} onSubmit={handleSubmit} />
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


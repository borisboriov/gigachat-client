import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { Message as MessageType } from '../../types';
import { MessageList } from './MessageList';
import { EmptyState } from './EmptyState';
import { InputArea } from '../input/InputArea';
import { SettingsPanel, type UserSettings } from '../settings/SettingsPanel';
import styles from './ChatWindow.module.scss';

const MOCK_RESPONSES = [
  '## useEffect\n\n`useEffect` выполняется **после рендера** компонента.\n\n```js\nuseEffect(() => {\n  // side effect\n  return () => { /* cleanup */ };\n}, [deps]);\n```\n\nЕсли массив зависимостей пуст — эффект сработает один раз.',
  'Отличный вопрос! Вот основные **хуки React**:\n\n1. `useState` — локальное состояние\n2. `useEffect` — побочные эффекты\n3. `useRef` — мутабельная ссылка\n4. `useMemo` — мемоизация значения\n5. `useCallback` — мемоизация функции',
  '**useMemo** кэширует *значение*, **useCallback** кэширует *функцию*:\n\n- `useMemo(() => compute(a, b), [a, b])`\n- `useCallback((x) => fn(x, a), [a])`\n\n> Используйте их только когда есть реальная проблема с производительностью.',
  'Вот простой счётчик на `useReducer`:\n\n```tsx\ntype Action = { type: "inc" } | { type: "dec" };\n\nfunction reducer(state: number, action: Action) {\n  switch (action.type) {\n    case "inc": return state + 1;\n    case "dec": return state - 1;\n  }\n}\n\nconst [count, dispatch] = useReducer(reducer, 0);\n```',
  'Для работы с формами в React рекомендую **управляемые компоненты**:\n\n```tsx\nconst [value, setValue] = useState("");\n\n<input\n  value={value}\n  onChange={(e) => setValue(e.target.value)}\n/>\n```\n\nТак React всегда знает актуальное значение поля.',
];

interface ChatWindowProps {
  title: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ title }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    model: 'GigaChat',
    temperature: 1,
    topP: 1,
    maxTokens: 1024,
    systemPrompt: '',
    theme: 'light',
  });

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSubmit = () => {
    const value = input.trim();
    if (!value || isLoading) {
      return;
    }

    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content: value,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const replyDelay = 1000 + Math.floor(Math.random() * 1000);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      const assistantMessage: MessageType = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)],
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, replyDelay);
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
            <MessageList messages={messages} showTypingIndicator={isLoading} />
          ) : (
            <EmptyState />
          )}
        </div>
        <div className={styles.inputWrapper}>
          <InputArea
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
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


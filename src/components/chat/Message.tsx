import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Message as MessageType } from '../../types';
import styles from './Message.module.scss';

interface MessageProps {
  message: MessageType;
  variant: 'user' | 'assistant';
}

export const Message: React.FC<MessageProps> = ({ message, variant }) => {
  const isUser = variant === 'user';

  const rowClassName = [
    styles.messageRow,
    isUser ? styles.messageRowUser : '',
  ]
    .filter(Boolean)
    .join(' ');

  const bubbleClassName = [
    styles.bubble,
    isUser ? styles.bubbleUser : styles.bubbleAssistant,
  ]
    .filter(Boolean)
    .join(' ');

  const formattedTime = new Date(message.createdAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(message.content);
    } catch {
      // clipboard error silently ignored
    }
  };

  return (
    <div className={rowClassName}>
      {!isUser && <div className={styles.avatar}>GC</div>}
      <div className={bubbleClassName}>
        <div className={styles.header}>
          <span className={styles.role}>{isUser ? 'Вы' : 'GigaChat'}</span>
          <span className={styles.timestamp}>{formattedTime}</span>
        </div>
        <div className={styles.content}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ node: _node, className, children, ...props }: ComponentPropsWithoutRef<'code'> & { node?: unknown }) {
                const isInline = !className?.startsWith('language-');
                if (isInline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <pre className={styles.codeBlock}>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <button type="button" className={styles.copyButton} onClick={handleCopy}>
          <span>⧉</span>
          <span>Копировать</span>
        </button>
      </div>
    </div>
  );
};


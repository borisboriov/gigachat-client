import type React from 'react';
import type { Message as MessageType } from '../../types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import styles from './MessageList.module.scss';

interface MessageListProps {
  messages: MessageType[];
  showTypingIndicator?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, showTypingIndicator }) => {
  return (
    <div
      className={styles.messageList}
      role="log"
      aria-live="polite"
      aria-label="История сообщений"
    >
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          variant={message.role === 'user' ? 'user' : 'assistant'}
        />
      ))}

      {showTypingIndicator && (
        <div className={styles.typingWrapper}>
          <TypingIndicator isVisible />
        </div>
      )}
    </div>
  );
};


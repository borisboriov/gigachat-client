import { memo } from 'react';
import type React from 'react';
import type { Chat } from '../../types';
import styles from './ChatItem.module.scss';

interface ChatItemProps {
  chat: Pick<Chat, 'id' | 'title' | 'updatedAt'>;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ChatItemComponent: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const date = new Date(chat.updatedAt);
  const formattedDate = date.toLocaleDateString('ru-RU', {
    month: 'short',
    day: 'numeric',
  });

  const className = [
    styles.chatItem,
    isActive ? styles.chatItemActive : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      role="button"
      tabIndex={0}
      className={className}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div className={styles.textBlock}>
        <div className={styles.title}>{chat.title}</div>
        <div className={styles.meta}>{formattedDate}</div>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Переименовать чат"
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
        >
          ✎
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Удалить чат"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          🗑
        </button>
      </div>
    </div>
  );
};

export const ChatItem = memo(ChatItemComponent);


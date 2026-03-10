import type React from 'react';
import type { Chat } from '../../types';
import { ChatItem } from './ChatItem';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ chats, activeChatId, onSelectChat }) => {
  return (
    <nav className={styles.sidebarRoot} aria-label="Список чатов">
      <button type="button" className={styles.newChatButton}>
        <span className={styles.newChatIcon}>＋</span>
        Новый чат
      </button>

      <input
        className={styles.searchInput}
        type="search"
        placeholder="Поиск по чатам"
        aria-label="Поиск по чатам"
      />

      <div className={styles.sectionTitle}>Чаты</div>
      <div className={styles.chatList}>
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onSelect={() => onSelectChat(chat.id)}
            onEdit={() => {
              // будет реализовано позже (модалка переименования)
            }}
            onDelete={() => {
              // будет реализовано позже (модалка подтверждения)
            }}
          />
        ))}
      </div>
    </nav>
  );
};


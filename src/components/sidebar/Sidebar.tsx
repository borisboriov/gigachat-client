import type React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { ChatItem } from './ChatItem';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { EditChatNameModal } from '../modals/EditChatNameModal';
import styles from './Sidebar.module.scss';

export const Sidebar: React.FC = () => {
  const chats = useAppStore((s) => s.chats);
  const activeChatId = useAppStore((s) => s.activeChatId);
  const createChat = useAppStore((s) => s.createChat);
  const deleteChat = useAppStore((s) => s.deleteChat);
  const renameChat = useAppStore((s) => s.renameChat);
  const setActiveChat = useAppStore((s) => s.setActiveChat);
  const activeModal = useAppStore((s) => s.ui.activeModal);
  const modalTargetChatId = useAppStore((s) => s.ui.modalTargetChatId);
  const openModal = useAppStore((s) => s.openModal);
  const closeModal = useAppStore((s) => s.closeModal);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((chat) => {
      if (chat.title.toLowerCase().includes(q)) return true;
      const lastMsg = chat.messages[chat.messages.length - 1];
      return lastMsg && lastMsg.content.toLowerCase().includes(q);

    });
  }, [chats, searchQuery]);

  const modalTargetChat = chats.find((c) => c.id === modalTargetChatId);

  const handleNewChat = () => {
    const id = createChat();
    navigate(`/chat/${id}`);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    navigate(`/chat/${id}`);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!modalTargetChatId) return;
    const wasActive = activeChatId === modalTargetChatId;
    deleteChat(modalTargetChatId);
    if (wasActive) {
      const remaining = chats.filter((c) => c.id !== modalTargetChatId);
      if (remaining.length > 0) {
        navigate(`/chat/${remaining[0].id}`);
      } else {
        navigate('/');
      }
    }
  };

  const handleConfirmRename = (newTitle: string) => {
    if (!modalTargetChatId) return;
    renameChat(modalTargetChatId, newTitle);
  };

  return (
    <>
      <nav className={styles.sidebarRoot} aria-label="Список чатов">
        <button type="button" className={styles.newChatButton} onClick={handleNewChat}>
          <span className={styles.newChatIcon}>＋</span>
          Новый чат
        </button>

        <input
          className={styles.searchInput}
          type="search"
          placeholder="Поиск по чатам"
          aria-label="Поиск по чатам"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSearchQuery('');
          }}
        />

        <div className={styles.sectionTitle}>Чаты</div>
        <div className={styles.chatList}>
          {filteredChats.length === 0 && (
            <div className={styles.emptySearch}>Ничего не найдено</div>
          )}
          {filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChatId}
              onSelect={() => handleSelectChat(chat.id)}
              onEdit={() => openModal('rename', chat.id)}
              onDelete={() => openModal('delete', chat.id)}
            />
          ))}
        </div>
      </nav>

      {activeModal === 'delete' && modalTargetChat && (
        <ConfirmDeleteModal
          chatTitle={modalTargetChat.title}
          onConfirm={handleConfirmDelete}
          onCancel={closeModal}
        />
      )}

      {activeModal === 'rename' && modalTargetChat && (
        <EditChatNameModal
          currentTitle={modalTargetChat.title}
          onConfirm={handleConfirmRename}
          onCancel={closeModal}
        />
      )}
    </>
  );
};

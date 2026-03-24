import type React from 'react';
import { useState } from 'react';
import { AuthForm } from './components/auth/AuthForm';
import { AppLayout } from './components/layout/AppLayout';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { MOCK_CHATS } from './mocks/chats';

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(MOCK_CHATS[0]?.id ?? null);

  if (!isAuthorized) {
    return (
      <AuthForm
        onLogin={() => {
          setIsAuthorized(true);
        }}
      />
    );
  }

  return (
    <AppLayout
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      sidebar={
        <Sidebar
          chats={MOCK_CHATS}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
        />
      }
    >
      <ChatWindow
        title={
          MOCK_CHATS.find((chat) => chat.id === activeChatId)?.title ??
          'Выберите чат или создайте новый'
        }
      />
    </AppLayout>
  );
};

export default App;

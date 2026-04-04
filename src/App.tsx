import type React from 'react';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/auth/AuthForm';
import { AppLayout } from './components/layout/AppLayout';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { EmptyState } from './components/chat/EmptyState';
import { useAppStore } from './store';

const ChatPage: React.FC = () => {
  return (
    <AppLayout sidebar={<Sidebar />}>
      <ChatWindow />
    </AppLayout>
  );
};

const EmptyPage: React.FC = () => {
  const activeChatId = useAppStore((s) => s.activeChatId);

  if (activeChatId) {
    return <Navigate to={`/chat/${activeChatId}`} replace />;
  }

  return (
    <AppLayout sidebar={<Sidebar />}>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <EmptyState />
      </div>
    </AppLayout>
  );
};

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmptyPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

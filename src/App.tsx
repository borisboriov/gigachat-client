import type React from 'react';
import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/auth/AuthForm';
import { AppLayout } from './components/layout/AppLayout';
import { EmptyState } from './components/chat/EmptyState';
import { useAppStore } from './store';

const Sidebar = lazy(() =>
  import('./components/sidebar/Sidebar').then((m) => ({ default: m.Sidebar })),
);

const ChatWindow = lazy(() =>
  import('./components/chat/ChatWindow').then((m) => ({ default: m.ChatWindow })),
);

const ChatPage: React.FC = () => {
  return (
    <AppLayout
      sidebar={
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
      }
    >
      <Suspense fallback={null}>
        <ChatWindow />
      </Suspense>
    </AppLayout>
  );
};

const EmptyPage: React.FC = () => {
  const activeChatId = useAppStore((s) => s.activeChatId);

  if (activeChatId) {
    return <Navigate to={`/chat/${activeChatId}`} replace />;
  }

  return (
    <AppLayout
      sidebar={
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
      }
    >
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

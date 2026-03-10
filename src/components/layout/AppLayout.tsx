import type React from 'react';
import { useMemo } from 'react';
import styles from './AppLayout.module.scss';

interface AppLayoutProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  sidebar,
  children,
}) => {
  const sidebarClassName = useMemo(
    () =>
      [
        styles.sidebar,
        isSidebarOpen ? styles.sidebarOpen : '',
      ]
        .filter(Boolean)
        .join(' '),
    [isSidebarOpen],
  );

  return (
    <div className={styles.appLayout} data-theme="light">
      <aside className={sidebarClassName}>{sidebar}</aside>

      {isSidebarOpen && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Закрыть список чатов"
          onClick={onToggleSidebar}
        />
      )}

      <main className={styles.main}>
        <header className={styles.mobileHeader}>
          <button
            type="button"
            className={styles.burgerButton}
            onClick={onToggleSidebar}
            aria-label="Открыть список чатов"
          >
            ☰
          </button>
          <span>GigaChat Client</span>
        </header>
        {children}
      </main>
    </div>
  );
};


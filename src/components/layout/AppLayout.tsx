import type React from 'react';
import { useAppStore } from '../../store';
import styles from './AppLayout.module.scss';

interface AppLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ sidebar, children }) => {
  const isSidebarOpen = useAppStore((s) => s.ui.isSidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  const sidebarClassName = [styles.sidebar, isSidebarOpen ? styles.sidebarOpen : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.appLayout}>
      <aside className={sidebarClassName}>{sidebar}</aside>

      {isSidebarOpen && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Закрыть список чатов"
          onClick={toggleSidebar}
        />
      )}

      <main className={styles.main}>
        <header className={styles.mobileHeader}>
          <button
            type="button"
            className={styles.burgerButton}
            onClick={toggleSidebar}
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

import type React from 'react';
import styles from './EmptyState.module.scss';

export const EmptyState: React.FC = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.content}>
        <div className={styles.icon}>💬</div>
        <div className={styles.title}>Начните новый диалог</div>
        <div className={styles.subtitle}>Создайте чат слева, чтобы начать общение с GigaChat.</div>
      </div>
    </div>
  );
};


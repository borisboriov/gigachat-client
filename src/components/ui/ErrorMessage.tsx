import type React from 'react';
import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={styles.error} role="alert">
      <span className={styles.icon}>⚠️</span>
      <span className={styles.text}>{message}</span>
      {onRetry && (
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
};


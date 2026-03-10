import type React from 'react';
import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={styles.error} role="alert">
      <span className={styles.icon}>⚠️</span>
      <span>{message}</span>
    </div>
  );
};


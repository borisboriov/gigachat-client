import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import styles from './Modal.module.scss';

interface EditChatNameModalProps {
  currentTitle: string;
  onConfirm: (newTitle: string) => void;
  onCancel: () => void;
}

export const EditChatNameModal: React.FC<EditChatNameModalProps> = ({
  currentTitle,
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = useState(currentTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onConfirm(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className={styles.overlay} onClick={onCancel} onKeyDown={handleKeyDown}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Переименование чата"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={styles.title}>Переименовать чат</h3>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={value}
          maxLength={100}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Отмена
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={handleSubmit}
            disabled={!value.trim()}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

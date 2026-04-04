import type React from 'react';
import { useEffect, useRef } from 'react';
import styles from './Modal.module.scss';

interface ConfirmDeleteModalProps {
  chatTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  chatTitle,
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className={styles.overlay} onClick={onCancel} onKeyDown={handleKeyDown}>
      <div
        className={styles.modal}
        role="alertdialog"
        aria-modal="true"
        aria-label="Подтверждение удаления"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={styles.title}>Удалить чат?</h3>
        <p className={styles.message}>
          Чат «{chatTitle}» будет удалён без возможности восстановления.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            ref={cancelRef}
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Отмена
          </button>
          <button
            type="button"
            className={styles.dangerButton}
            onClick={onConfirm}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

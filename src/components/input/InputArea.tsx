import type React from 'react';
import { useRef } from 'react';
import styles from './InputArea.module.scss';

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isDisabled?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ value, onChange, onSubmit, isDisabled }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleAutoResize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isDisabled && value.trim()) {
        onSubmit();
      }
    }
    if (event.key === 'Escape') {
      (event.target as HTMLTextAreaElement).blur();
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    onChange(event.target.value);
    handleAutoResize();
  };

  const canSend = !isDisabled && value.trim().length > 0;

  return (
    <div className={styles.inputContainer}>
      <div className={styles.row}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          rows={1}
          maxLength={4000}
          value={value}
          placeholder="Напишите сообщение..."
          aria-label="Введите сообщение"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Прикрепить изображение"
            disabled
          >
            📎
          </button>
          <button
            type="button"
            className={`${styles.iconButton}`}
            aria-label="Остановить генерацию"
            disabled
          >
            ⏹
          </button>
          <button
            type="button"
            className={`${styles.sendButton} ${!canSend ? styles.sendButtonDisabled : ''}`}
            onClick={() => {
              if (canSend) {
                onSubmit();
              }
            }}
            disabled={!canSend}
            aria-label="Отправить сообщение"
          >
            ⮞
          </button>
        </div>
      </div>
      <div className={styles.hint}>Enter — отправить, Shift+Enter — новая строка</div>
    </div>
  );
};


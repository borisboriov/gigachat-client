import type React from 'react';
import { useEffect, useState } from 'react';
import styles from './SettingsPanel.module.scss';

export interface UserSettings {
  model: 'GigaChat' | 'GigaChat-Plus' | 'GigaChat-Pro' | 'GigaChat-Max';
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
  theme: 'dark' | 'light';
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [draft, setDraft] = useState<UserSettings>(settings);

  useEffect(() => {
    setDraft(settings);
  }, [settings, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Настройки чата"
      onClick={onClose}
    >
      <div
        className={styles.panel}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className={styles.title}>Настройки</div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="model">
            Модель
          </label>
          <select
            id="model"
            className={styles.select}
            value={draft.model}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, model: event.target.value as UserSettings['model'] }))
            }
          >
            <option value="GigaChat">GigaChat</option>
            <option value="GigaChat-Plus">GigaChat-Plus</option>
            <option value="GigaChat-Pro">GigaChat-Pro</option>
            <option value="GigaChat-Max">GigaChat-Max</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="temperature">
            Temperature
          </label>
          <div className={styles.rangeRow}>
            <input
              id="temperature"
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={draft.temperature}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, temperature: Number(event.target.value) }))
              }
            />
            <span className={styles.rangeValue}>{draft.temperature.toFixed(1)}</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="topP">
            Top-p
          </label>
          <div className={styles.rangeRow}>
            <input
              id="topP"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={draft.topP}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, topP: Number(event.target.value) }))
              }
            />
            <span className={styles.rangeValue}>{draft.topP.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="maxTokens">
            Max tokens
          </label>
          <input
            id="maxTokens"
            className={styles.input}
            type="number"
            min={1}
            max={4096}
            value={draft.maxTokens}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, maxTokens: Number(event.target.value) }))
            }
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="systemPrompt">
            System prompt
          </label>
          <textarea
            id="systemPrompt"
            className={styles.textarea}
            value={draft.systemPrompt}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, systemPrompt: event.target.value }))
            }
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Тема</span>
          <div>
            <label>
              <input
                type="radio"
                name="theme"
                value="light"
                checked={draft.theme === 'light'}
                onChange={() => setDraft((prev) => ({ ...prev, theme: 'light' }))}
              />
              {' Светлая'}
            </label>
            {'  '}
            <label>
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={draft.theme === 'dark'}
                onChange={() => setDraft((prev) => ({ ...prev, theme: 'dark' }))}
              />
              {' Тёмная'}
            </label>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              setDraft(settings);
            }}
          >
            Сбросить
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={() => onSave(draft)}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};


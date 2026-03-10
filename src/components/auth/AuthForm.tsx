import type React from 'react';
import { useState } from 'react';
import { ErrorMessage } from '../ui/ErrorMessage';
import styles from './AuthForm.module.scss';

type Scope = 'GIGACHAT_API_PERS' | 'GIGACHAT_API_B2B' | 'GIGACHAT_API_CORP';

interface AuthFormProps {
  onLogin: (credentials: string, scope: Scope) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState('');
  const [scope, setScope] = useState<Scope>('GIGACHAT_API_PERS');
  const [error, setError] = useState('');

  const canSubmit = credentials.trim().length > 0;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!canSubmit) {
      setError('Введите credentials в формате Base64.');
      return;
    }

    setError('');
    onLogin(credentials.trim(), scope);
  };

  return (
    <div className={styles.authRoot}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.title}>Вход в GigaChat Client</div>
        <div className={styles.subtitle}>
          Введите credentials и выберите scope, чтобы запросить токен GigaChat.
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="credentials">
            Credentials (Base64)
          </label>
          <input
            id="credentials"
            className={styles.input}
            type="password"
            value={credentials}
            onChange={(event) => setCredentials(event.target.value)}
            placeholder="Basic xxxxxxx"
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Scope</span>
          <div className={styles.scopeGroup}>
            <label className={styles.scopeOption}>
              <input
                type="radio"
                name="scope"
                value="GIGACHAT_API_PERS"
                checked={scope === 'GIGACHAT_API_PERS'}
                onChange={() => setScope('GIGACHAT_API_PERS')}
              />
              {' GIGACHAT_API_PERS'}
            </label>
            <label className={styles.scopeOption}>
              <input
                type="radio"
                name="scope"
                value="GIGACHAT_API_B2B"
                checked={scope === 'GIGACHAT_API_B2B'}
                onChange={() => setScope('GIGACHAT_API_B2B')}
              />
              {' GIGACHAT_API_B2B'}
            </label>
            <label className={styles.scopeOption}>
              <input
                type="radio"
                name="scope"
                value="GIGACHAT_API_CORP"
                checked={scope === 'GIGACHAT_API_CORP'}
                onChange={() => setScope('GIGACHAT_API_CORP')}
              />
              {' GIGACHAT_API_CORP'}
            </label>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <button
          type="submit"
          className={`${styles.submitButton} ${!canSubmit ? styles.submitButtonDisabled : ''}`}
          disabled={!canSubmit}
        >
          Войти
        </button>

        <div className={styles.help}>
          Credentials можно получить в личном кабинете Sber Developers. На этом этапе они
          используются только для учебной авторизации.
        </div>
      </form>
    </div>
  );
};


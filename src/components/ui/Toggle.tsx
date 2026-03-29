import type React from 'react';
import { useState, useEffect } from 'react';
import styles from './Toggle.module.scss';

const getInitialTheme = (): 'light' | 'dark' => {
  const stored = document.documentElement.getAttribute('data-theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const Toggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={handleToggle}
      aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

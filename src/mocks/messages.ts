import type { Message } from '../types';

export const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Привет! Объясни, как работает useEffect?',
    createdAt: Date.now() - 6 * 60 * 60 * 1000,
  },
  {
    id: '2',
    role: 'assistant',
    content:
      '## useEffect\n\n`useEffect` выполняется после рендера компонента.\n\n```ts\nuseEffect(() => {\n  // эффект\n  return () => {\n    // очистка\n  };\n}, [deps]);\n```',
    createdAt: Date.now() - 5.5 * 60 * 60 * 1000,
  },
  {
    id: '3',
    role: 'user',
    content: 'А в чём разница между useMemo и useCallback?',
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
  },
  {
    id: '4',
    role: 'assistant',
    content:
      '**useMemo** кэширует **значение**, а **useCallback** кэширует **функцию**:\n\n- `useMemo(() => compute(a, b), [a, b])`\n- `useCallback(() => fn(a), [a])`',
    createdAt: Date.now() - 4.5 * 60 * 60 * 1000,
  },
  {
    id: '5',
    role: 'user',
    content: 'Покажи пример с useReducer.',
    createdAt: Date.now() - 4 * 60 * 60 * 1000,
  },
  {
    id: '6',
    role: 'assistant',
    content:
      'Вот простой счётчик на `useReducer`:\n\n```tsx\ntype Action = { type: "inc" } | { type: "dec" };\n\nfunction reducer(state: number, action: Action) {\n  switch (action.type) {\n    case "inc":\n      return state + 1;\n    case "dec":\n      return state - 1;\n    default:\n      return state;\n  }\n}\n```',
    createdAt: Date.now() - 3.5 * 60 * 60 * 1000,
  },
];


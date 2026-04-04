import type { ChatAdapter } from '../types';

const MOCK_RESPONSES = [
  '## useEffect\n\n`useEffect` выполняется **после рендера** компонента.\n\n```js\nuseEffect(() => {\n  // side effect\n  return () => { /* cleanup */ };\n}, [deps]);\n```\n\nЕсли массив зависимостей пуст — эффект сработает один раз.',
  'Отличный вопрос! Вот основные **хуки React**:\n\n1. `useState` — локальное состояние\n2. `useEffect` — побочные эффекты\n3. `useRef` — мутабельная ссылка\n4. `useMemo` — мемоизация значения\n5. `useCallback` — мемоизация функции',
  '**useMemo** кэширует *значение*, **useCallback** кэширует *функцию*:\n\n- `useMemo(() => compute(a, b), [a, b])`\n- `useCallback((x) => fn(x, a), [a])`\n\n> Используйте их только когда есть реальная проблема с производительностью.',
  'Вот простой счётчик на `useReducer`:\n\n```tsx\ntype Action = { type: "inc" } | { type: "dec" };\n\nfunction reducer(state: number, action: Action) {\n  switch (action.type) {\n    case "inc": return state + 1;\n    case "dec": return state - 1;\n  }\n}\n\nconst [count, dispatch] = useReducer(reducer, 0);\n```',
  'Для работы с формами в React рекомендую **управляемые компоненты**:\n\n```tsx\nconst [value, setValue] = useState("");\n\n<input\n  value={value}\n  onChange={(e) => setValue(e.target.value)}\n/>\n```\n\nТак React всегда знает актуальное значение поля.',
  '### Таблица сравнения\n\n| Хук | Назначение | Возвращает |\n|---|---|---|\n| `useState` | Локальное состояние | `[value, setter]` |\n| `useReducer` | Сложное состояние | `[state, dispatch]` |\n| `useContext` | Глобальный контекст | значение контекста |\n| `useRef` | Мутабельная ссылка | `{ current }` |\n\n> Все хуки должны вызываться на **верхнем уровне** компонента.',
];

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const mockAdapter: ChatAdapter = {
  async *sendMessage(_messages, _options, signal) {
    const text = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
    const words = text.split(' ');

    for (const word of words) {
      if (signal?.aborted) return;
      await delay(60 + Math.random() * 40);
      if (signal?.aborted) return;
      yield word + ' ';
    }
  },
};

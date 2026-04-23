# GigaChat Web Client

Веб-приложение для диалога с нейросетью GigaChat (Сбербанк) с интерфейсом в стиле ChatGPT.

---

## Демо

> **Live:** https://gigachat-client.vercel.app

---

## Стек

| Технология | Версия | Назначение |
|---|---|---|
| React | 18.3 | UI-фреймворк |
| TypeScript | 5.6 | Строгая типизация |
| Vite | 8.0 | Сборщик + dev-proxy для GigaChat API |
| React Router | 7.x | Маршрутизация (SPA) |
| Zustand | 5.x | Глобальный стейт + persist в localStorage |
| Immer | 10.x | Иммутабельные обновления стора |
| SCSS Modules | — | Scoped стили, CSS-переменные для тем |
| react-markdown | 9.x | Рендер Markdown в ответах ассистента |
| remark-gfm | 4.x | GitHub Flavored Markdown (таблицы, задачи) |
| rehype-highlight | 7.x | Подсветка синтаксиса кода |
| highlight.js | 11.x | Движок подсветки |

---

## Запуск локально

### 1. Клонировать репозиторий

```bash
git clone <repo-url>
cd gigachat-client
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Настроить переменные окружения

```bash
cp .env.example .env.local
```

Открыть `.env.local` и заполнить значения (см. таблицу ниже).

### 4. Запустить dev-сервер

```bash
npm run dev
```

Открыть: http://localhost:5173

### 5. Другие команды

```bash
npm run build      # Продакшн-сборка → dist/
npm run preview    # Предпросмотр продакшн-сборки
npm run lint       # ESLint проверка
npm test           # Запуск тестов (Vitest)
npm run analyze    # Анализ размера бандла (vite-bundle-visualizer)
```

---

## Переменные окружения

Все переменные задаются в файле `.env.local` (не коммитить в git).

| Переменная | Обязательная | Описание |
|---|---|---|
| `VITE_GIGACHAT_AUTH_KEY` | Да | Base64 от `client_id:client_secret` из Sber Developers |
| `VITE_GIGACHAT_SCOPE` | Да | `GIGACHAT_API_PERS` / `GIGACHAT_API_B2B` / `GIGACHAT_API_CORP` |
| `VITE_USE_MOCK` | Нет | `true` — использовать мок-адаптер (без API), `false` — реальный GigaChat |

Получить ключи: https://developers.sber.ru/portal/products/gigachat

> При деплое добавьте переменные в настройки хостинга (Vercel → Settings → Environment Variables), **не** в исходный код.

---

## Функциональность

- Диалог с GigaChat с потоковым выводом ответа (SSE streaming)
- Markdown-форматирование ответов с подсветкой кода
- Несколько независимых чатов с историей
- Автосохранение истории в localStorage
- Поиск по названию и содержимому чатов
- Копирование ответов ассистента
- Остановка генерации
- Обработка ошибок с кнопкой «Повторить»
- Светлая и тёмная темы

---

## Анализ бандла

Запустить визуализатор:

```bash
npm run analyze
```

Скриншот последнего анализа → [`docs/bundle.png`](./docs/bundle.png)

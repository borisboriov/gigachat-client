# GigaChat Web Client

Веб-приложение для диалога с нейросетью GigaChat (Сбербанк) с интерфейсом в стиле ChatGPT.

Итоговое домашнее задание по дисциплине «Основы frontend-разработки».

---

## Технологии

- React 18 + TypeScript
- Vite
- Zustand (state management)
- SCSS Modules
- react-markdown + remark-gfm + rehype-highlight

---

## Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone <repo-url>
cd front-end-Final-Project
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Настроить переменные окружения

```bash
cp .env.example .env.local
```

Открыть `.env.local` и заполнить:
- `VITE_GIGACHAT_CLIENT_ID` — Client ID из личного кабинета Sber Developers
- `VITE_GIGACHAT_CLIENT_SECRET` — Client Secret

Получить ключи: https://developers.sber.ru/portal/products/gigachat

### 4. Запустить dev-сервер

```bash
npm run dev
```

Открыть: http://localhost:5173

---

## Функциональность

- Диалог с GigaChat с потоковым выводом ответа (SSE streaming)
- Markdown-форматирование ответов с подсветкой кода
- Несколько независимых чатов с историей
- Автосохранение в localStorage
- Поиск по чатам
- Копирование ответов, остановка генерации
- Загрузка изображений (мультимодальный режим)

---

## Скриншоты

<!-- TODO: добавить скриншоты перед сдачей -->

---

## Структура проекта

```
src/
├── api/         # GigaChat API: авторизация, стриминг, адаптер
├── components/  # UI компоненты
├── hooks/       # Кастомные хуки
├── store/       # Zustand store
├── types/       # TypeScript типы
├── styles/      # Глобальные стили SCSS
└── utils/       # Утилиты
```

Подробный план реализации: [PLAN.md](./PLAN.md)

# Деплой на Vercel

Репозиторий: `borisboriov/gigachat-client` на GitHub  
Хостинг: [vercel.com](https://vercel.com) — бесплатный план

---

## Шаг 1 — Закоммитить и запушить

```bash
git add README.md package.json src/ docs/
git commit -m "Complete ДЗ6: code splitting, lazy loading, ErrorBoundary and performance optimizations"
git push
```

> Vercel деплоит то, что в GitHub. Без `git push` — задеплоится старый код.

---

## Шаг 2 — Создать аккаунт

Открыть **https://vercel.com** → **Sign Up** → **Continue with GitHub**

Авторизация через GitHub даёт Vercel доступ к репозиториям и включает автодеплой при каждом `git push`.

---

## Шаг 3 — Импортировать репозиторий

**Add New... → Project** → найти `gigachat-client` → **Import**

---

## Шаг 4 — Настройки проекта

Vercel автоматически определит Vite. Ничего не менять:

| Поле | Значение |
|---|---|
| Framework Preset | `Vite` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

---

## Шаг 5 — Переменные окружения ⚠️

В секции **Environment Variables** добавить три переменные.  
Ключи вводятся здесь — **не в код и не в git**.

| Name | Value |
|---|---|
| `VITE_GIGACHAT_AUTH_KEY` | Base64 от `client_id:client_secret` из Sber Developers |
| `VITE_GIGACHAT_SCOPE` | `GIGACHAT_API_PERS` |
| `VITE_USE_MOCK` | `false` |

> `VITE_USE_MOCK=false` переключает с моков на реальный GigaChat API.  
> Ключи в коде → попадут в GitHub → утекут. В Vercel они зашифрованы.

---

## Шаг 6 — Задеплоить

Нажать **Deploy**.

Vercel выполнит:
1. `git clone`
2. `npm install`
3. `npm run build` (с env-переменными из шага 5)
4. Публикация `dist/` на CDN

Через ~1 минуту появится ссылка:

```
https://gigachat-client-xxxxxxxxx.vercel.app
```

---

## Шаг 7 — Проверить в режиме инкогнито

Открыть ссылку в **режиме инкогнито** (без кэша и localStorage из разработки).

- [ ] Страница открывается — форма авторизации
- [ ] Ввести Auth Key + Scope → войти
- [ ] Отправить сообщение → реальный ответ GigaChat (не мок)
- [ ] Открыть `/chat/any-id` напрямую в адресной строке → **не 404**
- [ ] Создать чат, перезагрузить → чат сохранился (localStorage)

---

## Шаг 8 — Обновить README

Вставить публичную ссылку в `README.md`:

```markdown
## Демо

> **Live:** https://gigachat-client-xxxxxxxxx.vercel.app
```

```bash
git add README.md
git commit -m "docs: add Vercel deployment link"
git push
```

> После `git push` Vercel автоматически передеплоит. Это теперь работает само.

---

## Шаг 9 — Скриншот анализа бандла

```bash
npm run analyze
```

Откроется браузер с визуализацией бандла. Сделать скриншот → сохранить как `docs/bundle.png`.

```bash
git add docs/bundle.png
git commit -m "docs: add bundle analysis screenshot"
git push
```

---

## Автодеплой

После настройки каждый `git push` в ветку `main` запускает деплой автоматически:

```
git push  →  Vercel build  →  новая версия live
```

Ручных действий больше не требуется.

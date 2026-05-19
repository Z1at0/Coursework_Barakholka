# Барахолка

Одностраничное веб-приложение для продажи подержанных вещей.  
Курсовая работа. Златев Михаил, 2026.

## Стек

- HTML5, CSS3 (БЭМ + CSS Custom Properties)
- JavaScript (ES6+), нативные ES-модули
- Vite 5 — dev-сервер и сборщик
- localStorage — клиентское хранилище
- Web Crypto API — генерация идентификаторов
- Fetch API + open.er-api.com — курсы валют

## Установка

```bash
npm install
```

## Запуск

Режим разработки (HMR, dev-сервер на http://localhost:5173):

```bash
npm run dev
```

Production-сборка в каталог `dist/`:

```bash
npm run build
```

Локальный предпросмотр production-сборки:

```bash
npm run preview
```

## Структура проекта

```
.
├── index.html         # точка входа
├── app.js             # логика SPA: роутер, состояние, компоненты
├── styles.css         # стили (БЭМ, дизайн-токены)
├── vite.config.js     # конфигурация Vite
└── package.json
```
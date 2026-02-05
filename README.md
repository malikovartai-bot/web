# AMMA Театр — интеграция Intickets

## Что добавлено
- Серверный proxy для API Intickets (`/api/intickets/*`).
- Приём вебхуков Intickets (`/api/intickets/webhook`) с идемпотентностью по `uuid`.
- Страница покупки `/buy/:showId` с iframe виджета и UTM‑передачей.

## Переменные окружения
Создайте `.env` рядом с `server.js` (см. `.env.example`):
```
INTICKETS_API_KEY=
INTICKETS_IFRAME_BASE_URL=https://iframeab-pre2514.intickets.ru/
PUBLIC_SITE_URL=https://amma-production.ru/
```

> `INTICKETS_API_KEY` — секретный ключ, **не размещать в клиентском коде**.

## Запуск локально
```
npm install
npm start
```
Сайт будет доступен на `http://localhost:3000`.

## API proxy
- `GET /api/intickets/events`
- `GET /api/intickets/events/:eventId`
- `GET /api/intickets/shows?from=&to=&closed=&event_id=&venue_id=`
- `GET /api/intickets/shows/:showId`
- `GET /api/intickets/node/:nid?closed=`

## Вебхуки
Укажите в личном кабинете Intickets:
```
WEBHOOK_URL=https://amma-production.ru/api/intickets/webhook
```

Проверка вебхука (ответ всегда 200):
```
curl -X POST https://amma-production.ru/api/intickets/webhook \
  -H "Content-Type: application/json" \
  -d '{"Event":"OrderPayed","Context":{"Order":{"num":"123","status":"paid","paymentDt":"2026-02-05","sum":1200}},"uuid":"demo-uuid-123"}'
```

Логи:
- `logs/intickets-webhooks.jsonl`
- `logs/intickets-paid.jsonl`

## Покупка билета
- Кнопка «Купить билет» ведёт на `/buy/:showId`
- На странице покупки:
  - запрашиваются данные шоу через `/api/intickets/shows/:showId`
  - вставляется iframe `INTICKETS_IFRAME_BASE_URL`
  - UTM‑метки пробрасываются из текущего URL

# Румбы — фронтенд (ЛР-6)

SPA на React + TypeScript + Vite с React-Bootstrap, Redux Toolkit и axios. Данные берутся
из API бэкенда `rhumbs-backend`. Если бэкенд недоступен, гость видит mock-данные
(`src/modules/rhumbsMock.ts`, файлы в `public/rhumbs-mock`).

## Запуск

1. Запустить бэкенд: API — http://localhost:3000, S3 (Minio) — http://localhost:9000.
2. Запустить фронтенд:

```bash
npm install
npm run dev
```

Адрес — http://localhost:5173, открывается «Плитка» (`/rhumbs`).

## Нижняя панель

Видна на всех четырёх страницах.

| Пункт | Гость | Вошедший |
|---|---|---|
| «Лента» | `/rhumbs/feed` | `/rhumbs/feed` |
| «Добавление» | неактивен | `/rhumbs/draft` |
| «Плитка» | `/rhumbs` | `/rhumbs` |
| «Вход» / «Выход» | «Вход» — `/rhumbs/login` | «Выход» |

«Выход» — `axios.post('/api/users/logout')` в обработчике, затем вручную
`resetRhumbsUser()`, `resetRhumbsFilter()`, переход на `/rhumbs` и `getRhumbsList()`.

## Страница «Плитка» — `/rhumbs`

- заголовок «Румбы ветра»;
- фильтр: подпись «Азимут от», слайдер от 0 до 315 с шагом 45 и значение в градусах,
  кнопка «Найти». Значение хранится в Redux (`minAzimuth`) и сохраняется при переходах,
  запрос уходит только по «Найти»;
- карточки в 2 колонки: изображение, название, роза румбов, «Географический» и
  «Магнитный» азимуты, число лайков. Клик открывает ленту с этого румба;
- кнопка «Удалить» — только у вошедшего и только на своих румбах (`isCreator === 1`),
  после удаления список загружается заново.

## Страница «Лента» — `/rhumbs/feed` и `/rhumbs/feed/:id`

- без id — первый румб, с id — румб с этим id;
- видео, название, описание с «Ещё» / «Свернуть», роза румбов, азимуты «Географический»
  и «Магнитный»;
- лайк — сердце с числом лайков: у гостя неактивен, у вошедшего ставит и снимает лайк;
- круглая кнопка со стрелкой (`aria-label="Следующий"`) — следующий румб по кругу.

## Страница «Добавление» — `/rhumbs/draft`

Только для вошедшего, гостя переводит на `/rhumbs`. Заголовок «Добавление румба», превью
изображения и видео друг под другом (без файла — `public/rhumbs-default.jpg` и
`public/rhumbs-default.mp4`).

- черновика нет: на превью кнопки «Выбрать» (выбранный файл сразу показывается в превью),
  поле «Название», кнопка «Далее» — создаёт черновик;
- черновик есть: превью из черновика, поля «Название», «Краткое описание»,
  «Географический азимут» (0–359, шаг 1), «Магнитный азимут» (0–359.9, шаг 0.1), кнопка
  «Опубликовать» — после публикации переход на `/rhumbs`.

## Страница «Вход» — `/rhumbs/login`

Заголовок «Вход», поля «Логин» и «Пароль», кнопка «Войти» (неактивна, пока идёт запрос).
Запрос — `axios.post('/api/users/login', { login, password })` в компоненте, ответ вручную
передаётся в Redux (`setRhumbsUser(login)`), затем переход на `/rhumbs`. При ошибке у полей
красная рамка. Регистрации нет.

Состояние входа живёт только в Redux: после обновления страницы приложение снова
гостевое, кука `sessionId` при этом остаётся.

## Redux

`src/rhumbsStore.ts` — `configureStore` со слайсами:

- `rhumbsUsers` (`src/slices/rhumbsUsersSlice.ts`): `{ login, isAuthenticated }`,
  `setRhumbsUser(login)`, `resetRhumbsUser()`;
- `rhumbs` (`src/slices/rhumbsSlice.ts`): `{ minAzimuth, rhumbsList, rhumbsFeed,
  rhumbsDraft, loading }`, `setMinAzimuth`, `resetRhumbsFilter` и 7 thunk.

| Thunk | Запрос |
|---|---|
| `getRhumbsList()` | `GET /api/rhumbs?minAzimuth=` (значение из store) |
| `getRhumbsFeed({ id, next })` | `GET /api/rhumbs/feed`, `GET /api/rhumbs/feed/:id`, `?next=true` — следующий |
| `getRhumbsDraft()` | `GET /api/rhumbs/draft`, 404 — черновика нет |
| `createRhumbs({ name, image, video })` | `POST /api/rhumbs`, multipart |
| `publishRhumbs({ name, description, geoAzimuth, magAzimuth })` | `PUT /api/rhumbs/draft/publish` |
| `deleteRhumbs(id)` | `DELETE /api/rhumbs/:id` |
| `likeRhumbs({ id, isLiked })` | `POST /api/rhumbs/:id/like` |

Пока выполняется thunk, `loading = true`: поверх экрана спиннер, кнопки «Найти», «Удалить»,
«Следующий», лайк, «Далее» и «Опубликовать» неактивны. Если бэкенд недоступен,
`getRhumbsList` и `getRhumbsFeed` у гостя возвращают mock из `src/modules/rhumbsData.ts`,
у вошедшего — ошибку без mock.

## Кодогенерация

```bash
npm run generate-api
```

`scripts/generate-api.mjs` (swagger-typescript-api) читает
http://localhost:3000/api/docs-json и создаёт `src/api/Api.ts` с клиентом на axios.
В клиент попадают только 7 методов тега `rhumbs`, маршруты `users` исключены. У ленты два
маршрута, поэтому функций две: `rhumbsControllerFeed0` и `rhumbsControllerFeed1`.
Экземпляр клиента — `api` в `src/api/index.ts`, thunk вызывают только `api.rhumbs.*`.

## Прокси Vite

`server.proxy` в `vite.config.ts`:

- `/api` → http://localhost:3000;
- `/minio` → http://localhost:9000, префикс `/minio` убирается.

Ссылки вида `http://localhost:9000/rhumbs/<ключ>` из API перед записью в store
превращаются в `/minio/rhumbs/<ключ>` (`src/modules/rhumbsMedia.ts`).

# Румбы — фронтенд (ЛР-5)

Время полёта Boeing-737 NG Лондон–Париж в зависимости от направления ветра.
Услуги — 8 румбов ветра. SPA для гостя на React + TypeScript: данные только из
mock, запросов к бэкенду нет.

## Запуск

```bash
npm install
npm run dev               # http://localhost:5173
```

Или в Docker — контейнер `rhumbs-frontend`, тот же адрес (локальный `npm run dev`
перед этим остановить: порт 5173 один):

```bash
docker compose up --build
docker compose down       # остановить и удалить контейнер
```

Стек: React, TypeScript, Vite, React-Bootstrap, react-router-dom; линтер — oxlint
(`npm run lint`).

## Показ ЛР-5

1. Плитка с mock — http://localhost:5173/rhumbs: 6 карточек из
   `src/modules/rhumbsMock.ts`.
2. Плитка с фильтром — слайдер «Азимут от» поставить на 135° и нажать «Найти»:
   остаются «Юго-восточный», «Южный», «Западный».
3. Лента — клик по карточке, например «Южный» → http://localhost:5173/rhumbs/feed/5:
   видео, название, описание с «Ещё», роза румбов, азимуты, лайк, круглая кнопка
   перехода к следующему.
4. Изображение по умолчанию — в плитке карточка «Северо-восточный» (id 2,
   `imageUrl: null`) показывает `public/rhumbs-default.jpg`. Код —
   `src/components/RhumbsTile/RhumbsTile.tsx`: `RHUMBS_DEFAULT_IMAGE`, проверка
   `imageUrl !== null` и `onError` у скрытого `img`; картинка — фон блока `Card.Img`,
   как в партиале rhumbs-image ЛР-2.
5. Видео по умолчанию — http://localhost:5173/rhumbs/feed/2 (`videoUrl: null`)
   играет `public/rhumbs-default.mp4`. Код —
   `src/pages/RhumbsFeedPage/RhumbsFeedPage.tsx`: `RHUMBS_DEFAULT_VIDEO`,
   проверка `videoUrl !== null` и `onError` у `video`.
6. Код компонента фильтра — `src/components/RhumbsFilter/RhumbsFilter.tsx`:
   `Form` со слайдером `Form.Range` 0–315 с шагом 45 и кнопкой «Найти», props `value`,
   `setValue`, `onSubmit`.
7. Передаваемые props — `src/pages/RhumbsTilesPage/RhumbsTilesPage.tsx`:
   `RhumbsFilter` получает `value={minAzimuth}`, `setValue={setMinAzimuth}` и
   `onSubmit`, `RhumbsTile` — `name`, `imageUrl`, `likesCount`, `geoAzimuth`,
   `magAzimuth`, `onClick`.
8. Хуки состояния `useState` — `src/RhumbsLayout.tsx`, `RhumbsTile.tsx`,
   `RhumbsFeedPage.tsx` (таблица в разделе «Хуки»).
9. Хуки роутера `useOutletContext`, `useNavigate`, `useParams`, `useLocation` —
   `RhumbsTilesPage.tsx`, `RhumbsFeedPage.tsx`, `RhumbsNavbar.tsx`. Общие данные
   страниц передаются через `<Outlet context>` в `src/RhumbsLayout.tsx`, React
   Context не используется.

## Маршруты

| Адрес | Страница |
|---|---|
| `/` | переход на `/rhumbs` |
| `/rhumbs` | плитка |
| `/rhumbs/feed/:id` | лента с румба `id` |

## Страницы

Мобильный макет, дизайн ЛР-2: экран шириной 390 px на всю высоту окна, по центру,
внизу закреплена панель вкладок.

### Плитка — `/rhumbs`

| Элемент | Что делает | Когда неактивен |
|---|---|---|
| Заголовок «Румбы ветра» | название страницы | — |
| Слайдер «Азимут от» | минимальный географический азимут 0–315 с шагом 45°, рядом значение в градусах; 0 — все румбы | — |
| Кнопка «Найти» | показывает румбы с географическим азимутом не меньше выбранного | — |
| Карточка румба | фото с названием, роза румбов (красный луч — географический азимут, стрелка — магнитный), число лайков, географический и магнитный азимуты; клик открывает ленту с этого румба | — |
| Текст «Румбы с таким азимутом не найдены» | показывается вместо карточек, если фильтру ничего не подошло | — |

Значение фильтра и найденный список хранятся в `RhumbsLayout` и сохраняются при
переходе в ленту и обратно.

### Лента — `/rhumbs/feed/:id`

| Элемент | Что делает | Когда неактивен |
|---|---|---|
| Видео | во всю высоту над панелью; воспроизводится сразу, по кругу, без звука | — |
| Название и описание | внизу поверх видео; описание обрезано до двух строк | — |
| «Ещё» / «Свернуть» | раскрывает и сворачивает описание (`details` / `summary`); у следующего румба описание снова свёрнуто | — |
| Роза румбов и азимуты | справа столбиком: роза (красный луч — географический азимут, стрелка — магнитный), географический и магнитный азимуты в градусах | — |
| Лайк с числом лайков | белое сердце и `likesCount`; при `isLiked = 1` сердце красное | у гостя всегда |
| Круглая кнопка со стрелкой («Следующий») | следующий румб по возрастанию id среди всех опубликованных, после последнего — первый | — |
| Текст «Румб не найден» | показывается вместо ленты, если румба с таким id нет (например, `/rhumbs/feed/6`) | — |

Лента идёт по всем опубликованным румбам из mock, как `GET /api/rhumbs/feed[/:id]?next=true`
бэкенда: фильтр плитки на неё не влияет.

### Нижняя панель

| Пункт | Что делает | Когда неактивен |
|---|---|---|
| Лента | открывает первый по id опубликованный румб, фильтр плитки не влияет | — |
| Добавление | — | всегда: в ЛР-5 этой страницы нет |
| Плитка | открывает плитку | — |
| Вход | — | всегда: в ЛР-5 этой страницы нет |

Пункт текущей страницы подсвечен: красная иконка, полужирная подпись с чёрной чертой.
Неактивные пункты полупрозрачные и не нажимаются.

## Данные

Тип `RhumbsResponse` (`src/modules/rhumbsTypes.ts`) повторяет румб в ответе API
бэкенда — всегда 10 полей, пустые значения `null`:

| Поле | Тип | Пояснение |
|---|---|---|
| `id` | number | идентификатор |
| `name` | string | название |
| `description` | string \| null | краткое описание |
| `imageUrl` | string \| null | ссылка на изображение в Minio, `null` — заглушка |
| `videoUrl` | string \| null | то же для видео |
| `geoAzimuth` | number \| null | географический азимут, градусы, целое 0–359 |
| `magAzimuth` | number \| null | магнитный азимут для Москвы, градусы с десятой долей |
| `likesCount` | number | число лайков |
| `isCreator` | number | 1, если создатель румба — текущий пользователь, иначе 0 |
| `isLiked` | number | 1, если лайк текущего пользователя уже стоит, иначе 0 |

У гостя `isCreator` и `isLiked` всегда 0.

Mock — `RHUMBS_MOCK` в `src/modules/rhumbsMock.ts`: 6 опубликованных румбов из
`scripts/seed.sql` бэкенда (id 1, 2, 3, 4, 5, 7; удалённый 6 и черновик 8 не
входят), лайки посчитаны по таблице `rhumbs_likes` сида. У румба id 2
«Северо-восточный» `imageUrl` и `videoUrl` равны `null`, у остальных — ссылки
`http://localhost:9000/rhumbs/<ключ>` на Minio бэкенда.

Функции `getRhumbsList(minAzimuth?)` (фильтр `geoAzimuth >= minAzimuth`, без
значения — все), `getRhumbsById(id)` и `getNextRhumbs(id?)` (следующий по возрастанию
id, после последнего и без `id` — первый) в `src/modules/rhumbsData.ts` работают с
mock; в ЛР-6 они заменятся запросами к API.

Заглушки — `public/rhumbs-default.jpg` и `public/rhumbs-default.mp4`. Подставляются,
если поле `null` или файл не загрузился (`onError`): изображение — в `RhumbsTile`,
видео — в `RhumbsFeedPage`. Если Minio бэкенда не запущен, заглушки будут у всех
румбов.

## Структура

```
src/
  main.tsx                               точка входа: CSS Bootstrap и темы, рендер RhumbsApp
  RhumbsApp.tsx                          BrowserRouter и маршруты
  RhumbsRoutes.ts                        RHUMBS_ROUTES, тип RhumbsRouteKey, подписи пунктов панели
  RhumbsLayout.tsx                       оболочка main.rhumbs-screen: rhumbsList и minAzimuth, Outlet, панель
  components/
    RhumbsNavbar/RhumbsNavbar.tsx        нижняя панель из 4 пунктов
    RhumbsFilter/RhumbsFilter.tsx        слайдер «Азимут от» и кнопка «Найти»
    RhumbsTile/RhumbsTile.tsx            карточка плитки с заглушкой изображения
    RhumbsCompass/RhumbsCompass.tsx      роза румбов (SVG из ЛР-2), props className, geoAzimuth, magAzimuth
  pages/
    RhumbsTilesPage/RhumbsTilesPage.tsx  плитка: заголовок, фильтр и карточки в 2 столбца
    RhumbsFeedPage/RhumbsFeedPage.tsx    лента: видео, надписи и кнопки поверх
  modules/
    rhumbsTypes.ts                       тип RhumbsResponse (10 полей API)
    rhumbsMock.ts                        RHUMBS_MOCK — 6 румбов из seed.sql
    rhumbsData.ts                        getRhumbsList, getRhumbsById и getNextRhumbs по mock
  styles/
    rhumbs.css                           весь CSS: rhumbs.css ЛР-2 байт в байт и блок добавок ЛР-5 в конце
```

## Хуки

| Компонент | Хук | Зачем |
|---|---|---|
| `RhumbsLayout` | `useState` | `rhumbsList` — текущий список румбов, по умолчанию все из mock |
| `RhumbsLayout` | `useState` | `minAzimuth` — значение фильтра |
| `RhumbsNavbar` | `useLocation` | подсветить пункт текущей страницы |
| `RhumbsTile` | `useState` | `imageFailed` — изображение не загрузилось, показать заглушку |
| `RhumbsTilesPage` | `useOutletContext` | получить из `RhumbsLayout` список, фильтр и функции их изменения |
| `RhumbsTilesPage` | `useNavigate` | открыть ленту по клику на карточку |
| `RhumbsFeedPage` | `useParams` | `id` румба из адреса |
| `RhumbsFeedPage` | `useNavigate` | перейти к следующему румбу по «Следующий» |
| `RhumbsFeedPage` | `useState` | `expandedId` — у какого румба раскрыто описание |
| `RhumbsFeedPage` | `useState` | `failedVideoId` — у какого румба не загрузилось видео |

`RhumbsFilter` хуков не использует — всё приходит через props. `useEffect` не
понадобился.

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
2. Плитка с фильтром — в поле «Мин. азимут, °» ввести 100 и нажать «Найти»:
   остаются «Юго-восточный», «Южный», «Западный».
3. Лента — клик по карточке, например «Южный» → http://localhost:5173/rhumbs/feed/5:
   видео, название, описание с «Ещё», азимуты, лайк, «Следующий».
4. Изображение по умолчанию — в плитке карточка «Северо-восточный» (id 2,
   `imageUrl: null`) показывает `public/rhumbs-default.jpg`. Код —
   `src/components/RhumbsTile/RhumbsTile.tsx`: `RHUMBS_DEFAULT_IMAGE`, проверка
   `imageUrl !== null` и `onError` у `Card.Img`.
5. Видео по умолчанию — http://localhost:5173/rhumbs/feed/2 (`videoUrl: null`)
   играет `public/rhumbs-default.mp4`. Код —
   `src/pages/RhumbsFeedPage/RhumbsFeedPage.tsx`: `RHUMBS_DEFAULT_VIDEO`,
   проверка `videoUrl !== null` и `onError` у `video`.
6. Код компонента фильтра — `src/components/RhumbsFilter/RhumbsFilter.tsx`:
   `Form` с полем number 0–359 и кнопкой «Найти», props `value`, `setValue`,
   `onSubmit`.
7. Передаваемые props — `src/pages/RhumbsTilesPage/RhumbsTilesPage.tsx`:
   `RhumbsFilter` получает `value={minAzimuth}`, `setValue={setMinAzimuth}` и
   `onSubmit`, `RhumbsTile` — `name`, `imageUrl`, `likesCount`, `geoAzimuth`,
   `onClick`; `RhumbsNavbar` в `src/RhumbsLayout.tsx` — `rhumbsList`.
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

Мобильный макет: колонка 390 px по центру окна, внизу закреплена панель.

### Плитка — `/rhumbs`

| Элемент | Что делает | Когда неактивен |
|---|---|---|
| Поле «Мин. азимут, °» | минимальный географический азимут, целое 0–359; пустое поле — все румбы; другое значение браузер не даёт отправить | — |
| Кнопка «Найти» | показывает румбы с географическим азимутом не меньше введённого; срабатывает и по Enter в поле | — |
| Карточка румба | изображение, название, число лайков, географический азимут; клик открывает ленту с этого румба | — |
| Текст «Румбов не найдено» | показывается вместо карточек, если фильтру ничего не подошло | — |

Значение фильтра и найденный список хранятся в `RhumbsLayout` и сохраняются при
переходе в ленту и обратно.

### Лента — `/rhumbs/feed/:id`

| Элемент | Что делает | Когда неактивен |
|---|---|---|
| Видео | во всю высоту над панелью; воспроизводится сразу, по кругу, без звука | — |
| Название и описание | внизу поверх видео; описание длиннее 80 символов обрезано по последнему пробелу | — |
| Кнопка «Ещё» / «Свернуть» | раскрывает и сворачивает описание; у следующего румба описание снова свёрнуто | не показывается, если описание не длиннее 80 символов |
| Азимуты | справа столбиком: географический и магнитный, в градусах | — |
| Лайк с числом лайков | сердце закрашено, если `isLiked = 1`, рядом `likesCount` | у гостя всегда |
| Кнопка «Следующий» | следующий румб по порядку в текущем списке плитки, после последнего — первый | если текущий список пуст |
| Текст «Румб не найден» | показывается вместо ленты, если румба с таким id нет (например, `/rhumbs/feed/6`) | — |

Румб берётся из текущего списка плитки, а если его там нет — из mock по id.

### Нижняя панель

| Пункт | Что делает | Когда неактивен |
|---|---|---|
| Лента | открывает первый румб текущего списка плитки | если список пуст |
| Добавление | — | всегда: в ЛР-5 этой страницы нет |
| Плитка | открывает плитку | — |
| Вход | — | всегда: в ЛР-5 этой страницы нет |

Пункт текущей страницы подсвечен: полужирная подпись с белой чертой.
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
значения — все) и `getRhumbsById(id)` в `src/modules/rhumbsData.ts` работают с
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
  RhumbsLayout.tsx                       оболочка: rhumbsList и minAzimuth, Outlet, нижняя панель
  RhumbsLayout.css                       колонка 390 px по центру, отступ под панель
  components/
    RhumbsNavbar/RhumbsNavbar.tsx        нижняя панель из 4 пунктов
    RhumbsNavbar/RhumbsNavbar.css        красная панель, закреплённая внизу
    RhumbsFilter/RhumbsFilter.tsx        поле «Мин. азимут, °» и кнопка «Найти»
    RhumbsFilter/RhumbsFilter.css        поле и кнопка в одну строку
    RhumbsTile/RhumbsTile.tsx            карточка плитки с заглушкой изображения
    RhumbsTile/RhumbsTile.css            белая карточка со светло-серой обводкой
  pages/
    RhumbsTilesPage/RhumbsTilesPage.tsx  плитка: фильтр и карточки в 2 столбца
    RhumbsTilesPage/RhumbsTilesPage.css  отступы страницы, текст «Румбов не найдено»
    RhumbsFeedPage/RhumbsFeedPage.tsx    лента: видео, надписи и кнопки поверх
    RhumbsFeedPage/RhumbsFeedPage.css    видео во весь экран, расположение надписей
  modules/
    rhumbsTypes.ts                       тип RhumbsResponse (10 полей API)
    rhumbsMock.ts                        RHUMBS_MOCK — 6 румбов из seed.sql
    rhumbsData.ts                        getRhumbsList и getRhumbsById по mock
  styles/
    rhumbs.css                           цвета темы и красная кнопка .rhumbsButton
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
| `RhumbsFeedPage` | `useOutletContext` | текущий список — найти румб и следующий за ним |
| `RhumbsFeedPage` | `useNavigate` | перейти к следующему румбу по «Следующий» |
| `RhumbsFeedPage` | `useState` | `expandedId` — у какого румба раскрыто описание |
| `RhumbsFeedPage` | `useState` | `failedVideoId` — у какого румба не загрузилось видео |

`RhumbsFilter` хуков не использует — всё приходит через props. `useEffect` не
понадобился.

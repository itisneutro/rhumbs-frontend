// Маршруты страниц
export const RHUMBS_ROUTES = {
  RHUMBS: '/rhumbs',
  RHUMBS_FEED: '/rhumbs/feed',
} as const

// Ключи маршрутов: два из RHUMBS_ROUTES и два пункта панели,
// у которых в ЛР-5 маршрутов ещё нет (Добавление и Вход)
export type RhumbsRouteKey = keyof typeof RHUMBS_ROUTES | 'RHUMBS_DRAFT' | 'RHUMBS_LOGIN'

// Подписи пунктов нижней панели в порядке показа.
// У Добавления и Входа в ЛР-5 маршрутов нет: эти пункты видны, но не нажимаются.
export const RHUMBS_ROUTE_LABELS: Record<RhumbsRouteKey, string> = {
  RHUMBS_FEED: 'Лента',
  RHUMBS_DRAFT: 'Добавление',
  RHUMBS: 'Плитка',
  RHUMBS_LOGIN: 'Вход',
}

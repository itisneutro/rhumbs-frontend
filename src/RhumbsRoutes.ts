export const RHUMBS_ROUTES = {
  RHUMBS: '/rhumbs',
  RHUMBS_FEED: '/rhumbs/feed',
  RHUMBS_DRAFT: '/rhumbs/draft',
  RHUMBS_LOGIN: '/rhumbs/login',
} as const

export type RhumbsRouteKey = keyof typeof RHUMBS_ROUTES

export const RHUMBS_ROUTE_LABELS: Record<RhumbsRouteKey, string> = {
  RHUMBS_FEED: 'Лента',
  RHUMBS_DRAFT: 'Добавление',
  RHUMBS: 'Плитка',
  RHUMBS_LOGIN: 'Вход',
}

export const RHUMBS_LOGOUT_LABEL = 'Выход'

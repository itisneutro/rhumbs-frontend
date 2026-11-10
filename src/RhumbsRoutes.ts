export const RHUMBS_ROUTES = {
  RHUMBS: '/rhumbs',
  RHUMBS_FEED: '/rhumbs/feed',
} as const

export type RhumbsRouteKey = keyof typeof RHUMBS_ROUTES | 'RHUMBS_DRAFT' | 'RHUMBS_LOGIN'

export const RHUMBS_ROUTE_LABELS: Record<RhumbsRouteKey, string> = {
  RHUMBS_FEED: 'Лента',
  RHUMBS_DRAFT: 'Добавление',
  RHUMBS: 'Плитка',
  RHUMBS_LOGIN: 'Вход',
}

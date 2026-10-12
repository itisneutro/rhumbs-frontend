import type { FC } from 'react'
import { Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import type { RhumbsResponse } from '../../modules/rhumbsTypes'
import { RHUMBS_ROUTE_LABELS, RHUMBS_ROUTES } from '../../RhumbsRoutes'

// Иконки пунктов: Лента, Добавление, Плитка — из ЛР-2; Вход — log-in из Lucide, лицензия ISC
const RHUMBS_FEED_ICON = (
  <svg className="rhumbs-tab-bar__icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M10 8.5v7l5.5-3.5Z" />
  </svg>
)

const RHUMBS_DRAFT_ICON = (
  <svg className="rhumbs-tab-bar__icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
)

const RHUMBS_TILES_ICON = (
  <svg className="rhumbs-tab-bar__icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
  </svg>
)

const RHUMBS_LOGIN_ICON = (
  <svg className="rhumbs-tab-bar__icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="m10 17 5-5-5-5" />
    <path d="M15 12H3" />
  </svg>
)

type RhumbsNavbarProps = {
  rhumbsList: RhumbsResponse[]
}

export const RhumbsNavbar: FC<RhumbsNavbarProps> = ({ rhumbsList }) => {
  const { pathname } = useLocation()

  // Пункты в порядке показа. Пункт без маршрута (to) виден, но не нажимается:
  // Добавление и Вход — в ЛР-5 этих страниц нет; Лента — если текущий список пуст
  const rhumbsNavbarLinks = [
    {
      label: RHUMBS_ROUTE_LABELS.RHUMBS_FEED,
      icon: RHUMBS_FEED_ICON,
      to: rhumbsList.length > 0 ? `${RHUMBS_ROUTES.RHUMBS_FEED}/${rhumbsList[0].id}` : undefined,
      active: pathname.startsWith(`${RHUMBS_ROUTES.RHUMBS_FEED}/`),
    },
    { label: RHUMBS_ROUTE_LABELS.RHUMBS_DRAFT, icon: RHUMBS_DRAFT_ICON, to: undefined, active: false },
    {
      label: RHUMBS_ROUTE_LABELS.RHUMBS,
      icon: RHUMBS_TILES_ICON,
      to: RHUMBS_ROUTES.RHUMBS,
      active: pathname === RHUMBS_ROUTES.RHUMBS,
    },
    { label: RHUMBS_ROUTE_LABELS.RHUMBS_LOGIN, icon: RHUMBS_LOGIN_ICON, to: undefined, active: false },
  ]

  return (
    <Nav as="nav" bsPrefix="rhumbs-tab-bar">
      {rhumbsNavbarLinks.map(({ label, icon, to, active }) =>
        to === undefined ? (
          <Nav.Link key={label} bsPrefix="rhumbs-tab-bar__tab" className="rhumbs-tab-bar__tab--disabled" disabled>
            {icon}
            <span className="rhumbs-tab-bar__label">{label}</span>
          </Nav.Link>
        ) : (
          <Nav.Link
            key={label}
            bsPrefix="rhumbs-tab-bar__tab"
            className={active ? 'rhumbs-tab-bar__tab--active' : undefined}
            as={Link}
            to={to}
          >
            {icon}
            <span className="rhumbs-tab-bar__label">{label}</span>
          </Nav.Link>
        ),
      )}
    </Nav>
  )
}

import axios from 'axios'
import type { FC, ReactNode } from 'react'
import { Nav } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../rhumbsStore'
import { RHUMBS_LOGOUT_LABEL, RHUMBS_ROUTE_LABELS, RHUMBS_ROUTES } from '../../RhumbsRoutes'
import { getRhumbsList, resetRhumbsFilter } from '../../slices/rhumbsSlice'
import { resetRhumbsUser } from '../../slices/rhumbsUsersSlice'

const RHUMBS_FEED_ICON = (
  <svg
    className="rhumbs-tab-bar__icon"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M10 8.5v7l5.5-3.5Z" />
  </svg>
)

const RHUMBS_DRAFT_ICON = (
  <svg
    className="rhumbs-tab-bar__icon"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
)

const RHUMBS_TILES_ICON = (
  <svg
    className="rhumbs-tab-bar__icon"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
  </svg>
)

const RHUMBS_LOGIN_ICON = (
  <svg
    className="rhumbs-tab-bar__icon"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="m10 17 5-5-5-5" />
    <path d="M15 12H3" />
  </svg>
)

const RHUMBS_LOGOUT_ICON = (
  <svg
    className="rhumbs-tab-bar__icon"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
)

type RhumbsNavbarLink = {
  label: string
  icon: ReactNode
  to?: string
  onClick?: () => void
  active: boolean
}

export const RhumbsNavbar: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isAuthenticated = useSelector((state: RootState) => state.rhumbsUsers.isAuthenticated)

  const logoutRhumbsUser = async () => {
    await axios.post('/api/users/logout').catch(() => null)
    dispatch(resetRhumbsUser())
    dispatch(resetRhumbsFilter())
    navigate(RHUMBS_ROUTES.RHUMBS)
    dispatch(getRhumbsList())
  }

  const rhumbsNavbarLinks: RhumbsNavbarLink[] = [
    {
      label: RHUMBS_ROUTE_LABELS.RHUMBS_FEED,
      icon: RHUMBS_FEED_ICON,
      to: RHUMBS_ROUTES.RHUMBS_FEED,
      active: pathname.startsWith(RHUMBS_ROUTES.RHUMBS_FEED),
    },
    {
      label: RHUMBS_ROUTE_LABELS.RHUMBS_DRAFT,
      icon: RHUMBS_DRAFT_ICON,
      to: isAuthenticated ? RHUMBS_ROUTES.RHUMBS_DRAFT : undefined,
      active: pathname === RHUMBS_ROUTES.RHUMBS_DRAFT,
    },
    {
      label: RHUMBS_ROUTE_LABELS.RHUMBS,
      icon: RHUMBS_TILES_ICON,
      to: RHUMBS_ROUTES.RHUMBS,
      active: pathname === RHUMBS_ROUTES.RHUMBS,
    },
    isAuthenticated
      ? {
          label: RHUMBS_LOGOUT_LABEL,
          icon: RHUMBS_LOGOUT_ICON,
          onClick: logoutRhumbsUser,
          active: false,
        }
      : {
          label: RHUMBS_ROUTE_LABELS.RHUMBS_LOGIN,
          icon: RHUMBS_LOGIN_ICON,
          to: RHUMBS_ROUTES.RHUMBS_LOGIN,
          active: pathname === RHUMBS_ROUTES.RHUMBS_LOGIN,
        },
  ]

  return (
    <Nav as="nav" bsPrefix="rhumbs-tab-bar">
      {rhumbsNavbarLinks.map(({ label, icon, to, onClick, active }) => {
        if (to !== undefined) {
          return (
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
          )
        }

        if (onClick !== undefined) {
          return (
            <Nav.Link key={label} bsPrefix="rhumbs-tab-bar__tab" onClick={onClick}>
              {icon}
              <span className="rhumbs-tab-bar__label">{label}</span>
            </Nav.Link>
          )
        }

        return (
          <Nav.Link
            key={label}
            bsPrefix="rhumbs-tab-bar__tab"
            className="rhumbs-tab-bar__tab--disabled"
            disabled
          >
            {icon}
            <span className="rhumbs-tab-bar__label">{label}</span>
          </Nav.Link>
        )
      })}
    </Nav>
  )
}

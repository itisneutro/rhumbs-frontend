import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { RhumbsLayout } from './RhumbsLayout'
import { RhumbsDraftPage } from './pages/RhumbsDraftPage/RhumbsDraftPage'
import { RhumbsFeedPage } from './pages/RhumbsFeedPage/RhumbsFeedPage'
import { RhumbsLoginPage } from './pages/RhumbsLoginPage/RhumbsLoginPage'
import { RhumbsTilesPage } from './pages/RhumbsTilesPage/RhumbsTilesPage'
import { RHUMBS_ROUTES } from './RhumbsRoutes'

const rhumbsRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<></>}>
      <Route path="/" element={<Navigate to={RHUMBS_ROUTES.RHUMBS} replace />} />
      <Route element={<RhumbsLayout />}>
        <Route path={RHUMBS_ROUTES.RHUMBS} element={<RhumbsTilesPage />} />
        <Route path={RHUMBS_ROUTES.RHUMBS_FEED} element={<RhumbsFeedPage />} />
        <Route path={`${RHUMBS_ROUTES.RHUMBS_FEED}/:id`} element={<RhumbsFeedPage />} />
        <Route path={RHUMBS_ROUTES.RHUMBS_DRAFT} element={<RhumbsDraftPage />} />
        <Route path={RHUMBS_ROUTES.RHUMBS_LOGIN} element={<RhumbsLoginPage />} />
      </Route>
    </Route>,
  ),
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') },
)

function RhumbsApp() {
  return <RouterProvider router={rhumbsRouter} />
}

export default RhumbsApp

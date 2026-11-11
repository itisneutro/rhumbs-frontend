import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RhumbsLayout } from './RhumbsLayout'
import { RhumbsDraftPage } from './pages/RhumbsDraftPage/RhumbsDraftPage'
import { RhumbsFeedPage } from './pages/RhumbsFeedPage/RhumbsFeedPage'
import { RhumbsLoginPage } from './pages/RhumbsLoginPage/RhumbsLoginPage'
import { RhumbsTilesPage } from './pages/RhumbsTilesPage/RhumbsTilesPage'
import { RHUMBS_ROUTES } from './RhumbsRoutes'

function RhumbsApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={RHUMBS_ROUTES.RHUMBS} replace />} />
        <Route element={<RhumbsLayout />}>
          <Route path={RHUMBS_ROUTES.RHUMBS} element={<RhumbsTilesPage />} />
          <Route path={RHUMBS_ROUTES.RHUMBS_FEED} element={<RhumbsFeedPage />} />
          <Route path={`${RHUMBS_ROUTES.RHUMBS_FEED}/:id`} element={<RhumbsFeedPage />} />
          <Route path={RHUMBS_ROUTES.RHUMBS_DRAFT} element={<RhumbsDraftPage />} />
          <Route path={RHUMBS_ROUTES.RHUMBS_LOGIN} element={<RhumbsLoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default RhumbsApp

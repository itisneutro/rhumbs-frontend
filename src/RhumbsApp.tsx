import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RhumbsLayout } from './RhumbsLayout'
import { RhumbsFeedPage } from './pages/RhumbsFeedPage/RhumbsFeedPage'
import { RhumbsTilesPage } from './pages/RhumbsTilesPage/RhumbsTilesPage'
import { RHUMBS_ROUTES } from './RhumbsRoutes'

function RhumbsApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={RHUMBS_ROUTES.RHUMBS} replace />} />
        <Route element={<RhumbsLayout />}>
          <Route path={RHUMBS_ROUTES.RHUMBS} element={<RhumbsTilesPage />} />
          <Route path={`${RHUMBS_ROUTES.RHUMBS_FEED}/:id`} element={<RhumbsFeedPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default RhumbsApp

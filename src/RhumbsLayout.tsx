import type { FC } from 'react'
import { Spinner } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { RhumbsNavbar } from './components/RhumbsNavbar/RhumbsNavbar'
import type { RootState } from './rhumbsStore'

export const RhumbsLayout: FC = () => {
  const rhumbsLoading = useSelector((state: RootState) => state.rhumbs.loading)

  return (
    <main className="rhumbs-screen">
      <Outlet />
      <RhumbsNavbar />
      {rhumbsLoading && (
        <div className="rhumbs-loading">
          <Spinner animation="border" />
        </div>
      )}
    </main>
  )
}

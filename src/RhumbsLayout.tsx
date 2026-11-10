import { useState, type FC } from 'react'
import { Outlet } from 'react-router-dom'
import { RhumbsNavbar } from './components/RhumbsNavbar/RhumbsNavbar'
import { getRhumbsList } from './modules/rhumbsData'
import type { RhumbsResponse } from './modules/rhumbsTypes'

export type RhumbsOutletData = {
  rhumbsList: RhumbsResponse[]
  setRhumbsList: (rhumbsList: RhumbsResponse[]) => void
  minAzimuth: number | undefined
  setMinAzimuth: (minAzimuth: number | undefined) => void
}

export const RhumbsLayout: FC = () => {
  const [rhumbsList, setRhumbsList] = useState<RhumbsResponse[]>(() => getRhumbsList())
  const [minAzimuth, setMinAzimuth] = useState<number | undefined>(undefined)

  const rhumbsOutletData: RhumbsOutletData = {
    rhumbsList,
    setRhumbsList,
    minAzimuth,
    setMinAzimuth,
  }

  return (
    <main className="rhumbs-screen">
      <Outlet context={rhumbsOutletData} />
      <RhumbsNavbar />
    </main>
  )
}

import { useState, type FC } from 'react'
import { Outlet } from 'react-router-dom'
import { RhumbsNavbar } from './components/RhumbsNavbar/RhumbsNavbar'
import { getRhumbsList } from './modules/rhumbsData'
import type { RhumbsResponse } from './modules/rhumbsTypes'

// Общие данные страниц: передаются в <Outlet context> и читаются страницами через useOutletContext
export type RhumbsOutletData = {
  rhumbsList: RhumbsResponse[]
  setRhumbsList: (rhumbsList: RhumbsResponse[]) => void
  minAzimuth: number | undefined
  setMinAzimuth: (minAzimuth: number | undefined) => void
}

export const RhumbsLayout: FC = () => {
  // Текущий список румбов (результат фильтра) и значение фильтра хранятся здесь,
  // поэтому сохраняются при переходе между плиткой и лентой
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

import { RHUMBS_MOCK } from './rhumbsMock'
import type { RhumbsResponse } from './rhumbsTypes'

export const getRhumbsList = (minAzimuth?: number): RhumbsResponse[] =>
  RHUMBS_MOCK.filter(
    (rhumbs) =>
      minAzimuth === undefined ||
      (rhumbs.geoAzimuth !== null && rhumbs.geoAzimuth >= minAzimuth),
  )

export const getRhumbsById = (id: number): RhumbsResponse | undefined =>
  RHUMBS_MOCK.find((rhumbs) => rhumbs.id === id)

export const getNextRhumbs = (id?: number): RhumbsResponse | undefined => {
  const rhumbsSorted = [...RHUMBS_MOCK].sort(
    (leftRhumbs, rightRhumbs) => leftRhumbs.id - rightRhumbs.id,
  )
  return rhumbsSorted.find((rhumbs) => id === undefined || rhumbs.id > id) ?? rhumbsSorted[0]
}

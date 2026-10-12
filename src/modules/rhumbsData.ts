import { RHUMBS_MOCK } from './rhumbsMock'
import type { RhumbsResponse } from './rhumbsTypes'

// Получение румбов из коллекции mock-объектов.
// В ЛР-6 эти функции заменятся запросами к API бэкенда:
// GET /api/rhumbs?minAzimuth=, GET /api/rhumbs/feed/:id и GET /api/rhumbs/feed[/:id]?next=true

// Список опубликованных румбов с географическим азимутом не меньше minAzimuth; без значения — все
export const getRhumbsList = (minAzimuth?: number): RhumbsResponse[] =>
  RHUMBS_MOCK.filter(
    (rhumbs) =>
      minAzimuth === undefined ||
      (rhumbs.geoAzimuth !== null && rhumbs.geoAzimuth >= minAzimuth),
  )

// Один румб по id; undefined — румб не найден
export const getRhumbsById = (id: number): RhumbsResponse | undefined =>
  RHUMBS_MOCK.find((rhumbs) => rhumbs.id === id)

// Следующий румб по возрастанию id, после последнего — первый; без id — первый
// (как findNextPublished и findFirstPublished в бэкенде)
export const getNextRhumbs = (id?: number): RhumbsResponse | undefined => {
  const rhumbsSorted = [...RHUMBS_MOCK].sort((leftRhumbs, rightRhumbs) => leftRhumbs.id - rightRhumbs.id)
  return rhumbsSorted.find((rhumbs) => id === undefined || rhumbs.id > id) ?? rhumbsSorted[0]
}

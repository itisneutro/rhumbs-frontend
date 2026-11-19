import { useSyncExternalStore } from 'react'

const RHUMBS_STILL_QUERY = '(hover: none), (max-width: 575px)'

const subscribeRhumbsStill = (onRhumbsStillChange: () => void) => {
  const rhumbsStillMedia = window.matchMedia(RHUMBS_STILL_QUERY)
  rhumbsStillMedia.addEventListener('change', onRhumbsStillChange)
  return () => rhumbsStillMedia.removeEventListener('change', onRhumbsStillChange)
}

const getRhumbsStill = () => window.matchMedia(RHUMBS_STILL_QUERY).matches

export const useRhumbsStill = () => useSyncExternalStore(subscribeRhumbsStill, getRhumbsStill)

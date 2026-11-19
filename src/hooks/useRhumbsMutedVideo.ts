import { useEffect, type RefObject } from 'react'

export const useRhumbsMutedVideo = (
  rhumbsVideoRef: RefObject<HTMLVideoElement | null>,
  rhumbsAutoplay: boolean,
) => {
  useEffect(() => {
    const rhumbsVideo = rhumbsVideoRef.current

    if (rhumbsVideo === null) {
      return
    }

    const muteRhumbsVideo = () => {
      rhumbsVideo.muted = true
      rhumbsVideo.defaultMuted = true
      rhumbsVideo.setAttribute('muted', '')
      rhumbsVideo.setAttribute('playsinline', '')
    }

    const playRhumbsVideo = () => {
      if (rhumbsAutoplay && rhumbsVideo.paused) {
        rhumbsVideo.play().catch(() => null)
      }
    }

    muteRhumbsVideo()
    playRhumbsVideo()
    rhumbsVideo.addEventListener('loadstart', muteRhumbsVideo)
    rhumbsVideo.addEventListener('canplay', playRhumbsVideo)

    return () => {
      rhumbsVideo.removeEventListener('loadstart', muteRhumbsVideo)
      rhumbsVideo.removeEventListener('canplay', playRhumbsVideo)
    }
  })
}

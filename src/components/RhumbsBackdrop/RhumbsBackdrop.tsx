import { useRef, type FC } from 'react'
import { useRhumbsMutedVideo } from '../../hooks/useRhumbsMutedVideo'
import { useRhumbsStill } from '../../hooks/useRhumbsStill'

const RHUMBS_BACKDROP_VIDEO = `${import.meta.env.BASE_URL}rhumbs-default.mp4`

export const RhumbsBackdrop: FC = () => {
  const rhumbsBackdropRef = useRef<HTMLVideoElement>(null)
  const rhumbsStill = useRhumbsStill()

  useRhumbsMutedVideo(rhumbsBackdropRef, true)

  return (
    <div className="rhumbs-backdrop">
      {!rhumbsStill && (
        <video
          ref={rhumbsBackdropRef}
          className="rhumbs-backdrop__video"
          src={RHUMBS_BACKDROP_VIDEO}
          muted
          autoPlay
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
    </div>
  )
}

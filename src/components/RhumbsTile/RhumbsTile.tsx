import { useRef, useState, useSyncExternalStore, type FC } from 'react'
import { Button, Card, Col, Form } from 'react-bootstrap'
import { useRhumbsMutedVideo } from '../../hooks/useRhumbsMutedVideo'
import { RhumbsCompass } from '../RhumbsCompass/RhumbsCompass'

const RHUMBS_DEFAULT_IMAGE = `${import.meta.env.BASE_URL}rhumbs-default.jpg`
const RHUMBS_HOVER_QUERY = '(hover: hover)'

const RHUMBS_HEART_PATH =
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2' +
  'A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'

const subscribeRhumbsHover = (onRhumbsHoverChange: () => void) => {
  const rhumbsHoverMedia = window.matchMedia(RHUMBS_HOVER_QUERY)
  rhumbsHoverMedia.addEventListener('change', onRhumbsHoverChange)
  return () => rhumbsHoverMedia.removeEventListener('change', onRhumbsHoverChange)
}

const getRhumbsHover = () => window.matchMedia(RHUMBS_HOVER_QUERY).matches

type RhumbsTileProps = {
  id: number
  leaving: boolean
  name: string
  imageUrl: string | null
  videoUrl: string | null
  likesCount: number
  geoAzimuth: number | null
  magAzimuth: number | null
  onClick: () => void
  onRemove?: () => void
  removeDisabled: boolean
}

export const RhumbsTile: FC<RhumbsTileProps> = ({
  id,
  leaving,
  name,
  imageUrl,
  videoUrl,
  likesCount,
  geoAzimuth,
  magAzimuth,
  onClick,
  onRemove,
  removeDisabled,
}) => {
  const [imageFailed, setImageFailed] = useState(false)
  const [rhumbsVideoPlaying, setRhumbsVideoPlaying] = useState(false)
  const rhumbsVideoRef = useRef<HTMLVideoElement>(null)
  const rhumbsHover = useSyncExternalStore(subscribeRhumbsHover, getRhumbsHover)

  useRhumbsMutedVideo(rhumbsVideoRef, false)

  const rhumbsTileImage = imageUrl !== null && !imageFailed ? imageUrl : RHUMBS_DEFAULT_IMAGE
  const rhumbsTileVideo = rhumbsHover ? videoUrl : null

  const playRhumbsVideo = () => {
    const rhumbsVideo = rhumbsVideoRef.current
    if (rhumbsVideo === null) {
      return
    }
    setRhumbsVideoPlaying(true)
    rhumbsVideo.play().catch(() => null)
  }

  const stopRhumbsVideo = () => {
    const rhumbsVideo = rhumbsVideoRef.current
    if (rhumbsVideo === null) {
      return
    }
    setRhumbsVideoPlaying(false)
    rhumbsVideo.pause()
    rhumbsVideo.currentTime = 0
  }

  return (
    <Col
      bsPrefix="rhumbs-tiles__tile"
      className={leaving ? 'rhumbs-tiles__tile--leaving' : undefined}
      data-rhumbs-id={id}
      onMouseEnter={playRhumbsVideo}
      onMouseLeave={stopRhumbsVideo}
    >
      <Card
        as="a"
        bsPrefix="rhumbs-tiles__link"
        href="#"
        onClick={(event) => {
          event.preventDefault()
          onClick()
        }}
      >
        <Card.Img
          as="div"
          bsPrefix="rhumbs-tiles__image"
          style={{
            backgroundImage:
              rhumbsTileImage === RHUMBS_DEFAULT_IMAGE
                ? `url('${RHUMBS_DEFAULT_IMAGE}')`
                : `url('${rhumbsTileImage}'), url('${RHUMBS_DEFAULT_IMAGE}')`,
          }}
        >
          {rhumbsTileVideo !== null && (
            <video
              ref={rhumbsVideoRef}
              className={[
                'rhumbs-tiles__video',
                rhumbsVideoPlaying && 'rhumbs-tiles__video--playing',
              ]
                .filter(Boolean)
                .join(' ')}
              src={rhumbsTileVideo}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
            />
          )}
          <span className="rhumbs-tiles__name">{name}</span>
          <RhumbsCompass
            className="rhumbs-rose--tile rhumbs-rose--dark"
            geoAzimuth={geoAzimuth}
            magAzimuth={magAzimuth}
          />
          <img hidden src={rhumbsTileImage} alt="" onError={() => setImageFailed(true)} />
        </Card.Img>
        <span className="rhumbs-tiles__azimuth">
          <span className="rhumbs-tiles__azimuth-label">Географический</span>
          <span className="rhumbs-tiles__azimuth-value">{`${geoAzimuth}°`}</span>
        </span>
        <span className="rhumbs-tiles__azimuth">
          <span className="rhumbs-tiles__azimuth-label">Магнитный</span>
          <span className="rhumbs-tiles__azimuth-value">{`${magAzimuth}°`}</span>
        </span>
        <span className="rhumbs-tiles__likes">
          <svg
            className="rhumbs-tiles__heart"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
          >
            <path d={RHUMBS_HEART_PATH} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <span className="rhumbs-tiles__likes-count">{likesCount}</span>
        </span>
      </Card>
      {onRemove !== undefined && (
        <Form
          className="rhumbs-tiles__remove"
          onSubmit={(event) => {
            event.preventDefault()
            onRemove()
          }}
        >
          <Button
            type="submit"
            bsPrefix="rhumbs-button"
            variant=""
            className="rhumbs-button--small rhumbs-tiles__remove-button"
            disabled={removeDisabled}
          >
            Удалить
          </Button>
        </Form>
      )}
    </Col>
  )
}

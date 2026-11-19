import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FC,
  type MouseEvent,
  type TouchEvent,
} from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { RhumbsCompass } from '../../components/RhumbsCompass/RhumbsCompass'
import { useRhumbsMutedVideo } from '../../hooks/useRhumbsMutedVideo'
import type { AppDispatch, RootState } from '../../rhumbsStore'
import { RHUMBS_ROUTES } from '../../RhumbsRoutes'
import { getRhumbsFeed, likeRhumbs } from '../../slices/rhumbsSlice'

const RHUMBS_DEFAULT_VIDEO = `${import.meta.env.BASE_URL}rhumbs-default.mp4`
const RHUMBS_DEFAULT_IMAGE = `${import.meta.env.BASE_URL}rhumbs-default.jpg`
const RHUMBS_WIDE_QUERY = '(min-width: 576px)'
const RHUMBS_SWIPE_DISTANCE = 60
const RHUMBS_WHEEL_DISTANCE = 50
const RHUMBS_WHEEL_SILENCE = 150
const RHUMBS_WHEEL_HOLD = 400
const RHUMBS_WHEEL_LINE = 16
const RHUMBS_DOUBLE_TAP = 300
const RHUMBS_COUNT_MS = 600

const RHUMBS_HEART_PATH =
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2' +
  'A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'

const subscribeRhumbsWide = (onRhumbsWideChange: () => void) => {
  const rhumbsWideMedia = window.matchMedia(RHUMBS_WIDE_QUERY)
  rhumbsWideMedia.addEventListener('change', onRhumbsWideChange)
  return () => rhumbsWideMedia.removeEventListener('change', onRhumbsWideChange)
}

const getRhumbsWide = () => window.matchMedia(RHUMBS_WIDE_QUERY).matches

const getRhumbsReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

type RhumbsFeedCountProps = {
  rhumbsAzimuth: number | null
}

const RhumbsFeedCount: FC<RhumbsFeedCountProps> = ({ rhumbsAzimuth }) => {
  const [rhumbsCount, setRhumbsCount] = useState(() =>
    rhumbsAzimuth === null || getRhumbsReducedMotion() ? rhumbsAzimuth : 0,
  )

  useEffect(() => {
    if (rhumbsAzimuth === null || getRhumbsReducedMotion()) {
      return
    }

    const rhumbsStep = Number.isInteger(rhumbsAzimuth) ? 1 : 0.5
    const rhumbsStart = performance.now()
    let rhumbsFrame = 0

    const countRhumbs = (rhumbsNow: number) => {
      const rhumbsProgress = Math.min(Math.max((rhumbsNow - rhumbsStart) / RHUMBS_COUNT_MS, 0), 1)
      const rhumbsEased = 1 - (1 - rhumbsProgress) ** 3

      setRhumbsCount(
        rhumbsProgress === 1
          ? rhumbsAzimuth
          : Math.round((rhumbsAzimuth * rhumbsEased) / rhumbsStep) * rhumbsStep,
      )

      if (rhumbsProgress < 1) {
        rhumbsFrame = window.requestAnimationFrame(countRhumbs)
      }
    }

    rhumbsFrame = window.requestAnimationFrame(countRhumbs)
    return () => window.cancelAnimationFrame(rhumbsFrame)
  }, [rhumbsAzimuth])

  return `${rhumbsCount}°`
}

export const RhumbsFeedPage: FC = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { rhumbsFeed, rhumbsList, loading } = useSelector((state: RootState) => state.rhumbs)
  const isAuthenticated = useSelector((state: RootState) => state.rhumbsUsers.isAuthenticated)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [failedVideoId, setFailedVideoId] = useState<number | null>(null)
  const [rhumbsFeedLoadedKey, setRhumbsFeedLoadedKey] = useState<string | null>(null)
  const [rhumbsPulseId, setRhumbsPulseId] = useState<number | null>(null)
  const [rhumbsReadyId, setRhumbsReadyId] = useState<number | null>(null)
  const [rhumbsBurstKey, setRhumbsBurstKey] = useState<number | null>(null)
  const rhumbsWide = useSyncExternalStore(subscribeRhumbsWide, getRhumbsWide)
  const rhumbsVideoRef = useRef<HTMLVideoElement>(null)
  const rhumbsAmbientRef = useRef<HTMLVideoElement>(null)
  const rhumbsProgressRef = useRef<HTMLSpanElement>(null)
  const rhumbsTouchRef = useRef<number | null>(null)
  const rhumbsTapRef = useRef(0)
  const rhumbsPosterRef = useRef<HTMLDivElement>(null)
  const rhumbsNextRef = useRef<() => void>(() => null)
  const rhumbsBusyRef = useRef(true)

  useRhumbsMutedVideo(rhumbsVideoRef, true)
  useRhumbsMutedVideo(rhumbsAmbientRef, true)

  const rhumbsFeedKey = id ?? ''
  const rhumbsId = id === undefined ? undefined : Number(id)

  useEffect(() => {
    dispatch(getRhumbsFeed({ id: rhumbsId })).then(() => setRhumbsFeedLoadedKey(rhumbsFeedKey))
  }, [dispatch, rhumbsId, rhumbsFeedKey])

  const rhumbsFeedLoaded = rhumbsFeedLoadedKey === rhumbsFeedKey
  const rhumbs =
    rhumbsFeedLoaded && (rhumbsId === undefined || rhumbsFeed?.id === rhumbsId) ? rhumbsFeed : null
  const rhumbsCurrentId = rhumbs?.id ?? null

  const showNextRhumbs = useCallback(() => {
    if (rhumbsCurrentId === null || loading) {
      return
    }

    dispatch(getRhumbsFeed({ id: rhumbsCurrentId, next: true }))
      .unwrap()
      .then((nextRhumbs) => {
        if (nextRhumbs !== null) {
          navigate(`${RHUMBS_ROUTES.RHUMBS_FEED}/${nextRhumbs.id}`)
        }
      })
      .catch(() => null)
  }, [dispatch, navigate, rhumbsCurrentId, loading])

  useEffect(() => {
    rhumbsNextRef.current = showNextRhumbs
    rhumbsBusyRef.current = loading || rhumbsCurrentId === null
  })

  useEffect(() => {
    const rhumbsScreen = rhumbsPosterRef.current?.closest<HTMLElement>('.rhumbs-screen')
    let rhumbsDelta = 0
    let rhumbsLocked = false
    let rhumbsLockedAt = 0
    let rhumbsTimer = 0

    const releaseRhumbsWheel = () => {
      if (!rhumbsLocked) {
        return
      }

      const rhumbsHold = RHUMBS_WHEEL_HOLD - (performance.now() - rhumbsLockedAt)

      if (rhumbsHold > 0 || rhumbsBusyRef.current) {
        rhumbsTimer = window.setTimeout(
          releaseRhumbsWheel,
          Math.max(rhumbsHold, RHUMBS_WHEEL_SILENCE),
        )
        return
      }

      rhumbsLocked = false
      rhumbsDelta = 0
    }

    const scrollRhumbs = (event: WheelEvent) => {
      if (
        event.deltaY <= 0 ||
        (event.target instanceof Element && event.target.closest('.rhumbs-feed__about[open]'))
      ) {
        return
      }

      window.clearTimeout(rhumbsTimer)
      rhumbsTimer = window.setTimeout(releaseRhumbsWheel, RHUMBS_WHEEL_SILENCE)

      if (rhumbsLocked || rhumbsBusyRef.current) {
        return
      }

      rhumbsDelta +=
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? event.deltaY * RHUMBS_WHEEL_LINE
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? event.deltaY * window.innerHeight
            : event.deltaY

      if (rhumbsDelta > RHUMBS_WHEEL_DISTANCE) {
        rhumbsLocked = true
        rhumbsLockedAt = performance.now()
        rhumbsDelta = 0
        rhumbsNextRef.current()
      }
    }

    const pressRhumbs = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        rhumbsNextRef.current()
      }
    }

    rhumbsScreen?.addEventListener('wheel', scrollRhumbs, { passive: true })
    window.addEventListener('keydown', pressRhumbs)

    return () => {
      window.clearTimeout(rhumbsTimer)
      rhumbsScreen?.removeEventListener('wheel', scrollRhumbs)
      window.removeEventListener('keydown', pressRhumbs)
    }
  }, [])

  useEffect(() => {
    let rhumbsFrame = 0

    const drawRhumbsProgress = () => {
      const rhumbsVideo = rhumbsVideoRef.current
      const rhumbsProgress = rhumbsProgressRef.current

      if (rhumbsVideo !== null && rhumbsProgress !== null && rhumbsVideo.duration > 0) {
        rhumbsProgress.style.width = `${(rhumbsVideo.currentTime / rhumbsVideo.duration) * 100}%`
      }

      rhumbsFrame = window.requestAnimationFrame(drawRhumbsProgress)
    }

    rhumbsFrame = window.requestAnimationFrame(drawRhumbsProgress)
    return () => window.cancelAnimationFrame(rhumbsFrame)
  }, [])

  if (rhumbsFeedLoaded && rhumbsFeed === null) {
    return (
      <div className="rhumbs-missing">
        <h1 className="rhumbs-missing__title">Румб не найден</h1>
      </div>
    )
  }

  const getRhumbsPendingImage = () => {
    if (rhumbsId === undefined) {
      return null
    }

    if (rhumbsFeed?.id === rhumbsId) {
      return rhumbsFeed.imageUrl
    }

    return rhumbsList.find((listedRhumbs) => listedRhumbs.id === rhumbsId)?.imageUrl ?? null
  }

  const rhumbsPoster =
    (rhumbs === null ? getRhumbsPendingImage() : rhumbs.imageUrl) ?? RHUMBS_DEFAULT_IMAGE

  const rhumbsPosterLayer = (
    <div
      key={`rhumbs-poster-${rhumbsFeedKey}`}
      ref={rhumbsPosterRef}
      className="rhumbs-feed__poster"
      style={{ backgroundImage: `url('${rhumbsPoster}')` }}
    />
  )

  if (rhumbs === null) {
    return <>{rhumbsPosterLayer}</>
  }

  const toggleRhumbsLike = () => {
    dispatch(likeRhumbs({ id: rhumbs.id, isLiked: rhumbs.isLiked === 1 ? 0 : 1 }))
      .unwrap()
      .then(() => setRhumbsPulseId(rhumbs.id))
      .catch(() => null)
  }

  const tapRhumbsVideo = (event: MouseEvent<HTMLVideoElement>) => {
    if (event.timeStamp - rhumbsTapRef.current > RHUMBS_DOUBLE_TAP) {
      rhumbsTapRef.current = event.timeStamp
      return
    }

    rhumbsTapRef.current = 0

    if (!isAuthenticated || (rhumbs.isLiked !== 1 && loading)) {
      return
    }

    setRhumbsBurstKey(event.timeStamp)

    if (rhumbs.isLiked !== 1) {
      toggleRhumbsLike()
    }
  }

  const touchRhumbsVideo = (event: TouchEvent<HTMLVideoElement>) => {
    rhumbsTouchRef.current = event.touches.item(0)?.clientY ?? null
  }

  const swipeRhumbsVideo = (event: TouchEvent<HTMLVideoElement>) => {
    const rhumbsTouchStart = rhumbsTouchRef.current
    const rhumbsTouchEnd = event.changedTouches.item(0)?.clientY

    rhumbsTouchRef.current = null

    if (
      rhumbsTouchStart !== null &&
      rhumbsTouchEnd !== undefined &&
      rhumbsTouchStart - rhumbsTouchEnd >= RHUMBS_SWIPE_DISTANCE
    ) {
      showNextRhumbs()
    }
  }

  const rhumbsVideo =
    rhumbs.videoUrl !== null && failedVideoId !== rhumbs.id
      ? rhumbs.videoUrl
      : RHUMBS_DEFAULT_VIDEO

  return (
    <>
      {rhumbsWide && (
        <video
          ref={rhumbsAmbientRef}
          className="rhumbs-feed__ambient"
          src={rhumbsVideo}
          poster={rhumbsPoster}
          muted
          autoPlay
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      {rhumbsPosterLayer}

      <video
        key={`rhumbs-video-${rhumbs.id}`}
        ref={rhumbsVideoRef}
        className={[
          'rhumbs-feed__video',
          rhumbsReadyId === rhumbs.id && 'rhumbs-feed__video--ready',
        ]
          .filter(Boolean)
          .join(' ')}
        src={rhumbsVideo}
        poster={rhumbsPoster}
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setRhumbsReadyId(rhumbs.id)}
        onError={() => setFailedVideoId(rhumbs.id)}
        onClick={tapRhumbsVideo}
        onTouchStart={touchRhumbsVideo}
        onTouchEnd={swipeRhumbsVideo}
      />

      <div className="rhumbs-feed__shade" aria-hidden="true">
        <span className="rhumbs-feed__progress">
          <span ref={rhumbsProgressRef} className="rhumbs-feed__progress-bar" />
        </span>
      </div>

      <div className="rhumbs-feed__rail">
        <div className="rhumbs-feed__gauge">
          <RhumbsCompass
            key={rhumbs.id}
            className="rhumbs-rose--feed rhumbs-rose--dark"
            geoAzimuth={rhumbs.geoAzimuth}
            magAzimuth={rhumbs.magAzimuth}
          />
          <div className="rhumbs-feed__azimuth">
            <span className="rhumbs-feed__azimuth-value">
              <RhumbsFeedCount key={rhumbs.id} rhumbsAzimuth={rhumbs.geoAzimuth} />
            </span>
            <span className="rhumbs-feed__azimuth-label">Географический</span>
          </div>
          <div className="rhumbs-feed__azimuth">
            <span className="rhumbs-feed__azimuth-value">
              <RhumbsFeedCount key={rhumbs.id} rhumbsAzimuth={rhumbs.magAzimuth} />
            </span>
            <span className="rhumbs-feed__azimuth-label">Магнитный</span>
          </div>
          <Button
            bsPrefix="rhumbs-feed__likes"
            variant=""
            disabled={!isAuthenticated || loading}
            onClick={toggleRhumbsLike}
          >
            <svg
              className={[
                'rhumbs-feed__heart',
                rhumbs.isLiked === 1 && 'rhumbs-feed__heart--liked',
                rhumbsPulseId === rhumbs.id && 'rhumbs-feed__heart--pulse',
              ]
                .filter(Boolean)
                .join(' ')}
              viewBox="0 0 24 24"
              width="22"
              height="22"
              aria-hidden="true"
              onAnimationEnd={() => setRhumbsPulseId(null)}
            >
              <path d={RHUMBS_HEART_PATH} strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <span className="rhumbs-feed__likes-count">{rhumbs.likesCount}</span>
          </Button>
        </div>
        <Button
          as="a"
          bsPrefix="rhumbs-feed__next"
          variant=""
          aria-label="Следующий"
          disabled={loading}
          onClick={showNextRhumbs}
        >
          <svg
            className="rhumbs-feed__chevron"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-hidden="true"
          >
            <path
              d="M5 9l7 7 7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>

      <div key={`rhumbs-info-${rhumbs.id}`} className="rhumbs-feed__info">
        <h1 className="rhumbs-feed__name">{rhumbs.name}</h1>
        {rhumbs.description !== null && (
          <details
            className="rhumbs-feed__about"
            open={expandedId === rhumbs.id}
            onToggle={(event) => setExpandedId(event.currentTarget.open ? rhumbs.id : null)}
          >
            <summary className="rhumbs-feed__summary">
              <span className="rhumbs-feed__description">
                <span className="rhumbs-feed__description-lines">{rhumbs.description}</span>
              </span>
              <span className="rhumbs-feed__more" />
            </summary>
          </details>
        )}
      </div>

      {rhumbsBurstKey !== null && (
        <svg
          key={rhumbsBurstKey}
          className="rhumbs-feed__burst"
          viewBox="0 0 24 24"
          aria-hidden="true"
          onAnimationEnd={() => setRhumbsBurstKey(null)}
        >
          <path d={RHUMBS_HEART_PATH} />
        </svg>
      )}
    </>
  )
}

import { useEffect, useState, type FC } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { RhumbsCompass } from '../../components/RhumbsCompass/RhumbsCompass'
import type { AppDispatch, RootState } from '../../rhumbsStore'
import { RHUMBS_ROUTES } from '../../RhumbsRoutes'
import { getRhumbsFeed, likeRhumbs } from '../../slices/rhumbsSlice'

const RHUMBS_DEFAULT_VIDEO = '/rhumbs-default.mp4'

const RHUMBS_HEART_PATH =
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2' +
  'A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'

export const RhumbsFeedPage: FC = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { rhumbsFeed, loading } = useSelector((state: RootState) => state.rhumbs)
  const isAuthenticated = useSelector((state: RootState) => state.rhumbsUsers.isAuthenticated)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [failedVideoId, setFailedVideoId] = useState<number | null>(null)
  const [rhumbsFeedLoadedKey, setRhumbsFeedLoadedKey] = useState<string | null>(null)

  const rhumbsFeedKey = id ?? ''
  const rhumbsId = id === undefined ? undefined : Number(id)

  useEffect(() => {
    dispatch(getRhumbsFeed({ id: rhumbsId })).then(() => setRhumbsFeedLoadedKey(rhumbsFeedKey))
  }, [dispatch, rhumbsId, rhumbsFeedKey])

  const rhumbsFeedLoaded = rhumbsFeedLoadedKey === rhumbsFeedKey

  if (rhumbsFeedLoaded && rhumbsFeed === null) {
    return (
      <div className="rhumbs-missing">
        <h1 className="rhumbs-missing__title">Румб не найден</h1>
      </div>
    )
  }

  const rhumbs =
    rhumbsFeedLoaded && (rhumbsId === undefined || rhumbsFeed?.id === rhumbsId) ? rhumbsFeed : null

  if (rhumbs === null) {
    return loading ? null : (
      <div className="rhumbs-loading">
        <Spinner animation="border" />
      </div>
    )
  }

  const showNextRhumbs = () => {
    dispatch(getRhumbsFeed({ id: rhumbs.id, next: true }))
      .unwrap()
      .then((nextRhumbs) => {
        if (nextRhumbs !== null) {
          navigate(`${RHUMBS_ROUTES.RHUMBS_FEED}/${nextRhumbs.id}`)
        }
      })
      .catch(() => null)
  }

  return (
    <>
      <video
        className="rhumbs-feed__video"
        src={
          rhumbs.videoUrl !== null && failedVideoId !== rhumbs.id
            ? rhumbs.videoUrl
            : RHUMBS_DEFAULT_VIDEO
        }
        autoPlay
        loop
        muted
        playsInline
        onError={() => setFailedVideoId(rhumbs.id)}
      />

      <div className="rhumbs-feed__rail">
        <div className="rhumbs-feed__gauge">
          <RhumbsCompass
            key={rhumbs.id}
            className="rhumbs-rose--feed rhumbs-rose--dark"
            geoAzimuth={rhumbs.geoAzimuth}
            magAzimuth={rhumbs.magAzimuth}
          />
          <div className="rhumbs-feed__azimuth">
            <span className="rhumbs-feed__azimuth-value">{`${rhumbs.geoAzimuth}°`}</span>
            <span className="rhumbs-feed__azimuth-label">Географический</span>
          </div>
          <div className="rhumbs-feed__azimuth">
            <span className="rhumbs-feed__azimuth-value">{`${rhumbs.magAzimuth}°`}</span>
            <span className="rhumbs-feed__azimuth-label">Магнитный</span>
          </div>
          <Button
            bsPrefix="rhumbs-feed__likes"
            variant=""
            disabled={!isAuthenticated || loading}
            onClick={() =>
              dispatch(likeRhumbs({ id: rhumbs.id, isLiked: rhumbs.isLiked === 1 ? 0 : 1 }))
            }
          >
            <svg
              className={
                rhumbs.isLiked === 1
                  ? 'rhumbs-feed__heart rhumbs-feed__heart--liked'
                  : 'rhumbs-feed__heart'
              }
              viewBox="0 0 24 24"
              width="22"
              height="22"
              aria-hidden="true"
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

      <div className="rhumbs-feed__info">
        <h1 className="rhumbs-feed__name">{rhumbs.name}</h1>
        {rhumbs.description !== null && (
          <details
            className="rhumbs-feed__about"
            open={expandedId === rhumbs.id}
            onToggle={(event) => setExpandedId(event.currentTarget.open ? rhumbs.id : null)}
          >
            <summary className="rhumbs-feed__summary">
              <span className="rhumbs-feed__description">{rhumbs.description}</span>
              <span className="rhumbs-feed__more" />
            </summary>
          </details>
        )}
      </div>
    </>
  )
}

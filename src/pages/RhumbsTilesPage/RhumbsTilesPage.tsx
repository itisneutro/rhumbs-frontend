import { useEffect, useLayoutEffect, useRef, useState, type FC } from 'react'
import { Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RhumbsFilter } from '../../components/RhumbsFilter/RhumbsFilter'
import { RhumbsTile } from '../../components/RhumbsTile/RhumbsTile'
import type { AppDispatch, RootState } from '../../rhumbsStore'
import { RHUMBS_ROUTES } from '../../RhumbsRoutes'
import { deleteRhumbs, getRhumbsList, setMinAzimuth } from '../../slices/rhumbsSlice'

const RHUMBS_SKELETONS = Array.from({ length: 6 }, (_, rhumbsIndex) => rhumbsIndex)
const RHUMBS_LEAVE_MS = 200
const RHUMBS_MOVE_MS = 300

type RhumbsTilePosition = {
  left: number
  top: number
}

const getRhumbsReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const RhumbsTilesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { minAzimuth, rhumbsList, loading } = useSelector((state: RootState) => state.rhumbs)
  const isAuthenticated = useSelector((state: RootState) => state.rhumbsUsers.isAuthenticated)
  const [rhumbsListLoaded, setRhumbsListLoaded] = useState(false)
  const [rhumbsShown, setRhumbsShown] = useState(rhumbsList)
  const [rhumbsSeen, setRhumbsSeen] = useState(rhumbsList)
  const [rhumbsLeavingIds, setRhumbsLeavingIds] = useState<number[]>([])
  const rhumbsGridRef = useRef<HTMLDivElement>(null)
  const rhumbsGridWidthRef = useRef(0)
  const rhumbsPositionsRef = useRef(new Map<string, RhumbsTilePosition>())

  if (rhumbsList !== rhumbsSeen) {
    const rhumbsNextIds = new Set(rhumbsList.map((rhumbs) => rhumbs.id))
    const rhumbsLeaving = rhumbsShown
      .filter((rhumbs) => !rhumbsNextIds.has(rhumbs.id))
      .map((rhumbs) => rhumbs.id)

    setRhumbsSeen(rhumbsList)

    if (rhumbsLeaving.length === 0 || getRhumbsReducedMotion()) {
      setRhumbsShown(rhumbsList)
      setRhumbsLeavingIds([])
    } else {
      setRhumbsLeavingIds(rhumbsLeaving)
    }
  }

  useEffect(() => {
    dispatch(getRhumbsList()).then(() => setRhumbsListLoaded(true))
  }, [dispatch])

  useEffect(() => {
    if (rhumbsLeavingIds.length === 0) {
      return
    }

    const rhumbsTimer = window.setTimeout(() => {
      setRhumbsShown(rhumbsSeen)
      setRhumbsLeavingIds([])
    }, RHUMBS_LEAVE_MS)

    return () => window.clearTimeout(rhumbsTimer)
  }, [rhumbsLeavingIds, rhumbsSeen])

  useLayoutEffect(() => {
    const rhumbsGrid = rhumbsGridRef.current

    if (rhumbsGrid === null) {
      return
    }

    const rhumbsGridRect = rhumbsGrid.getBoundingClientRect()
    const rhumbsAnimate =
      !getRhumbsReducedMotion() && Math.abs(rhumbsGridRect.width - rhumbsGridWidthRef.current) < 1
    const rhumbsPositions = new Map<string, RhumbsTilePosition>()

    for (const rhumbsTile of rhumbsGrid.querySelectorAll<HTMLElement>('[data-rhumbs-id]')) {
      const rhumbsRect = rhumbsTile.getBoundingClientRect()
      const rhumbsMatrix = new DOMMatrixReadOnly(getComputedStyle(rhumbsTile).transform)
      const rhumbsPosition = {
        left: rhumbsRect.left - rhumbsGridRect.left - rhumbsMatrix.m41,
        top: rhumbsRect.top - rhumbsGridRect.top - rhumbsMatrix.m42,
      }
      const rhumbsTileId = rhumbsTile.dataset.rhumbsId ?? ''
      const rhumbsPrevious = rhumbsPositionsRef.current.get(rhumbsTileId)

      rhumbsPositions.set(rhumbsTileId, rhumbsPosition)

      if (rhumbsAnimate && rhumbsPrevious !== undefined) {
        const rhumbsShiftX = rhumbsPrevious.left - rhumbsPosition.left
        const rhumbsShiftY = rhumbsPrevious.top - rhumbsPosition.top

        if (Math.abs(rhumbsShiftX) > 0.5 || Math.abs(rhumbsShiftY) > 0.5) {
          rhumbsTile.animate(
            [
              { transform: `translate(${rhumbsShiftX}px, ${rhumbsShiftY}px)` },
              { transform: 'none' },
            ],
            { duration: RHUMBS_MOVE_MS, easing: 'cubic-bezier(.2, .8, .2, 1)' },
          )
        }
      }
    }

    rhumbsGridWidthRef.current = rhumbsGridRect.width
    rhumbsPositionsRef.current = rhumbsPositions
  }, [rhumbsShown])

  const removeRhumbs = async (id: number) => {
    await dispatch(deleteRhumbs(id))
    dispatch(getRhumbsList())
  }

  return (
    <>
      <h1 className="rhumbs-tiles__title">Румбы ветра</h1>
      <RhumbsFilter
        minAzimuth={minAzimuth}
        setMinAzimuth={(rhumbsMinAzimuth) => dispatch(setMinAzimuth(rhumbsMinAzimuth))}
        onSubmit={() => dispatch(getRhumbsList())}
        disabled={loading}
      />
      <Row ref={rhumbsGridRef} bsPrefix="rhumbs-tiles__grid">
        {rhumbsShown.length === 0 && !rhumbsListLoaded
          ? RHUMBS_SKELETONS.map((rhumbsSkeleton) => (
              <div
                key={`rhumbs-skeleton-${rhumbsSkeleton}`}
                className="rhumbs-tiles__tile rhumbs-tiles__tile--skeleton"
                aria-hidden="true"
              >
                <span className="rhumbs-tiles__skeleton-image" />
                <span className="rhumbs-tiles__skeleton-row">
                  <span className="rhumbs-tiles__skeleton-azimuth" />
                  <span className="rhumbs-tiles__skeleton-azimuth" />
                </span>
              </div>
            ))
          : rhumbsShown.length === 0
            ? !loading && <p className="rhumbs-tiles__empty">Румбы с таким азимутом не найдены</p>
            : rhumbsShown.map((rhumbs) => (
                <RhumbsTile
                  key={rhumbs.id}
                  id={rhumbs.id}
                  leaving={rhumbsLeavingIds.includes(rhumbs.id)}
                  name={rhumbs.name}
                  imageUrl={rhumbs.imageUrl}
                  videoUrl={rhumbs.videoUrl}
                  likesCount={rhumbs.likesCount}
                  geoAzimuth={rhumbs.geoAzimuth}
                  magAzimuth={rhumbs.magAzimuth}
                  onClick={() => navigate(`${RHUMBS_ROUTES.RHUMBS_FEED}/${rhumbs.id}`)}
                  onRemove={
                    isAuthenticated && rhumbs.isCreator === 1
                      ? () => removeRhumbs(rhumbs.id)
                      : undefined
                  }
                  removeDisabled={loading}
                />
              ))}
      </Row>
    </>
  )
}

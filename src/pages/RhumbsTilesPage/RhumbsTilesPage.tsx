import { useEffect, type FC } from 'react'
import { Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RhumbsFilter } from '../../components/RhumbsFilter/RhumbsFilter'
import { RhumbsTile } from '../../components/RhumbsTile/RhumbsTile'
import type { AppDispatch, RootState } from '../../rhumbsStore'
import { RHUMBS_ROUTES } from '../../RhumbsRoutes'
import { deleteRhumbs, getRhumbsList, setMinAzimuth } from '../../slices/rhumbsSlice'

export const RhumbsTilesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { minAzimuth, rhumbsList, loading } = useSelector((state: RootState) => state.rhumbs)
  const isAuthenticated = useSelector((state: RootState) => state.rhumbsUsers.isAuthenticated)

  useEffect(() => {
    dispatch(getRhumbsList())
  }, [dispatch])

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
      <Row bsPrefix="rhumbs-tiles__grid">
        {rhumbsList.length === 0 ? (
          !loading && <p className="rhumbs-tiles__empty">Румбы с таким азимутом не найдены</p>
        ) : (
          rhumbsList.map((rhumbs) => (
            <RhumbsTile
              key={rhumbs.id}
              name={rhumbs.name}
              imageUrl={rhumbs.imageUrl}
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
          ))
        )}
      </Row>
    </>
  )
}

import type { FC } from 'react'
import { Row } from 'react-bootstrap'
import { useNavigate, useOutletContext } from 'react-router-dom'
import type { RhumbsOutletData } from '../../RhumbsLayout'
import { RhumbsFilter } from '../../components/RhumbsFilter/RhumbsFilter'
import { RhumbsTile } from '../../components/RhumbsTile/RhumbsTile'
import { getRhumbsList } from '../../modules/rhumbsData'
import { RHUMBS_ROUTES } from '../../RhumbsRoutes'

export const RhumbsTilesPage: FC = () => {
  // Список и значение фильтра хранятся в RhumbsLayout и приходят через Outlet context,
  // поэтому сохраняются при переходе в ленту и обратно
  const { rhumbsList, setRhumbsList, minAzimuth, setMinAzimuth } =
    useOutletContext<RhumbsOutletData>()
  const navigate = useNavigate()

  return (
    <>
      <h1 className="rhumbs-tiles__title">Румбы ветра</h1>
      <RhumbsFilter
        value={minAzimuth}
        setValue={setMinAzimuth}
        onSubmit={() => setRhumbsList(getRhumbsList(minAzimuth))}
      />
      <Row bsPrefix="rhumbs-tiles__grid">
        {rhumbsList.length === 0 ? (
          <p className="rhumbs-tiles__empty">Румбы с таким азимутом не найдены</p>
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
            />
          ))
        )}
      </Row>
    </>
  )
}

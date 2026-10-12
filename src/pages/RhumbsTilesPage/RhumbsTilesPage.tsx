import type { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useNavigate, useOutletContext } from 'react-router-dom'
import type { RhumbsOutletData } from '../../RhumbsLayout'
import { RhumbsFilter } from '../../components/RhumbsFilter/RhumbsFilter'
import { RhumbsTile } from '../../components/RhumbsTile/RhumbsTile'
import { getRhumbsList } from '../../modules/rhumbsData'
import { RHUMBS_ROUTES } from '../../RhumbsRoutes'
import './RhumbsTilesPage.css'

export const RhumbsTilesPage: FC = () => {
  // Список и значение фильтра хранятся в RhumbsLayout и приходят через Outlet context,
  // поэтому сохраняются при переходе в ленту и обратно
  const { rhumbsList, setRhumbsList, minAzimuth, setMinAzimuth } =
    useOutletContext<RhumbsOutletData>()
  const navigate = useNavigate()

  return (
    <div className="rhumbsTilesPage">
      <RhumbsFilter
        value={minAzimuth}
        setValue={setMinAzimuth}
        onSubmit={() => setRhumbsList(getRhumbsList(minAzimuth))}
      />
      {rhumbsList.length === 0 ? (
        <p className="rhumbsTilesEmpty">Румбов не найдено</p>
      ) : (
        <Row className="g-3">
          {rhumbsList.map((rhumbs) => (
            <Col xs={6} key={rhumbs.id}>
              <RhumbsTile
                name={rhumbs.name}
                imageUrl={rhumbs.imageUrl}
                likesCount={rhumbs.likesCount}
                geoAzimuth={rhumbs.geoAzimuth}
                onClick={() => navigate(`${RHUMBS_ROUTES.RHUMBS_FEED}/${rhumbs.id}`)}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

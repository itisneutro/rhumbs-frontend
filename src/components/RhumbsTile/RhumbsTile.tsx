import { useState, type FC } from 'react'
import { Card } from 'react-bootstrap'
import { RhumbsCompass } from '../RhumbsCompass/RhumbsCompass'
import './RhumbsTile.css'

// Заглушка из public: показывается, если imageUrl = null или изображение не загрузилось
const RHUMBS_DEFAULT_IMAGE = '/rhumbs-default.jpg'

type RhumbsTileProps = {
  name: string
  imageUrl: string | null
  likesCount: number
  geoAzimuth: number | null
  magAzimuth: number | null
  onClick: () => void
}

export const RhumbsTile: FC<RhumbsTileProps> = ({
  name,
  imageUrl,
  likesCount,
  geoAzimuth,
  magAzimuth,
  onClick,
}) => {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <Card className="rhumbs-tiles__tile" onClick={onClick}>
      <div className="rhumbs-tiles__image">
        <Card.Img
          className="rhumbs-tiles__photo"
          src={imageUrl !== null && !imageFailed ? imageUrl : RHUMBS_DEFAULT_IMAGE}
          alt={name}
          onError={() => setImageFailed(true)}
        />
        <span className="rhumbs-tiles__name">{name}</span>
        <RhumbsCompass geoAzimuth={geoAzimuth} magAzimuth={magAzimuth} />
      </div>
      <span className="rhumbs-tiles__azimuth">
        <span className="rhumbs-tiles__azimuth-label">Географический</span>
        <span className="rhumbs-tiles__azimuth-degrees">{geoAzimuth}°</span>
      </span>
      <span className="rhumbs-tiles__azimuth">
        <span className="rhumbs-tiles__azimuth-label">Магнитный</span>
        <span className="rhumbs-tiles__azimuth-degrees">{magAzimuth}°</span>
      </span>
      <span className="rhumbs-tiles__likes">
        <svg className="rhumbs-tiles__heart" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <span className="rhumbs-tiles__likes-count">{likesCount}</span>
      </span>
    </Card>
  )
}

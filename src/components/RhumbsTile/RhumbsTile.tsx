import { useState, type FC } from 'react'
import { Card } from 'react-bootstrap'
import './RhumbsTile.css'

// Заглушка из public: показывается, если imageUrl = null или изображение не загрузилось
const RHUMBS_DEFAULT_IMAGE = '/rhumbs-default.jpg'

type RhumbsTileProps = {
  name: string
  imageUrl: string | null
  likesCount: number
  geoAzimuth: number | null
  onClick: () => void
}

export const RhumbsTile: FC<RhumbsTileProps> = ({
  name,
  imageUrl,
  likesCount,
  geoAzimuth,
  onClick,
}) => {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <Card className="rhumbsTile" onClick={onClick}>
      <Card.Img
        variant="top"
        className="rhumbsTileImage"
        src={imageUrl !== null && !imageFailed ? imageUrl : RHUMBS_DEFAULT_IMAGE}
        alt={name}
        onError={() => setImageFailed(true)}
      />
      <Card.Body className="rhumbsTileBody">
        <Card.Title className="rhumbsTileName">{name}</Card.Title>
        <div className="rhumbsTileInfo">
          <span className="rhumbsTileLikes">
            <svg className="rhumbsTileHeart" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {likesCount}
          </span>
          <span className="rhumbsTileAzimuth">
            <span className="rhumbsTileAzimuthLabel">Географический</span>
            <span className="rhumbsTileAzimuthValue">{geoAzimuth}°</span>
          </span>
        </div>
      </Card.Body>
    </Card>
  )
}

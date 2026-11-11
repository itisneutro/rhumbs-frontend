import { useState, type FC } from 'react'
import { Button, Card, Col, Form } from 'react-bootstrap'
import { RhumbsCompass } from '../RhumbsCompass/RhumbsCompass'

const RHUMBS_DEFAULT_IMAGE = '/rhumbs-default.jpg'

const RHUMBS_HEART_PATH =
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2' +
  'A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'

type RhumbsTileProps = {
  name: string
  imageUrl: string | null
  likesCount: number
  geoAzimuth: number | null
  magAzimuth: number | null
  onClick: () => void
  onRemove?: () => void
  removeDisabled: boolean
}

export const RhumbsTile: FC<RhumbsTileProps> = ({
  name,
  imageUrl,
  likesCount,
  geoAzimuth,
  magAzimuth,
  onClick,
  onRemove,
  removeDisabled,
}) => {
  const [imageFailed, setImageFailed] = useState(false)
  const rhumbsTileImage = imageUrl !== null && !imageFailed ? imageUrl : RHUMBS_DEFAULT_IMAGE

  return (
    <Col bsPrefix="rhumbs-tiles__tile">
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

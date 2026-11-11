import { useEffect, useState, type ChangeEvent, type FC, type FormEvent } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../rhumbsStore'
import { RHUMBS_ROUTES } from '../../RhumbsRoutes'
import { createRhumbs, getRhumbsDraft, publishRhumbs } from '../../slices/rhumbsSlice'

const RHUMBS_DEFAULT_IMAGE = '/rhumbs-default.jpg'
const RHUMBS_DEFAULT_VIDEO = '/rhumbs-default.mp4'

type RhumbsDraftFile = {
  file: File
  url: string
}

const getRhumbsDraftFile = (event: ChangeEvent<HTMLInputElement>): RhumbsDraftFile | null => {
  const rhumbsFile = event.target.files?.[0]

  return rhumbsFile === undefined
    ? null
    : { file: rhumbsFile, url: URL.createObjectURL(rhumbsFile) }
}

export const RhumbsDraftPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state: RootState) => state.rhumbsUsers.isAuthenticated)
  const { rhumbsDraft, loading } = useSelector((state: RootState) => state.rhumbs)
  const [rhumbsImage, setRhumbsImage] = useState<RhumbsDraftFile | null>(null)
  const [rhumbsVideo, setRhumbsVideo] = useState<RhumbsDraftFile | null>(null)
  const [rhumbsName, setRhumbsName] = useState<string | null>(null)
  const [rhumbsDescription, setRhumbsDescription] = useState<string | null>(null)
  const [rhumbsGeoAzimuth, setRhumbsGeoAzimuth] = useState<string | null>(null)
  const [rhumbsMagAzimuth, setRhumbsMagAzimuth] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getRhumbsDraft())
    }
  }, [dispatch, isAuthenticated])

  useEffect(
    () => () => {
      if (rhumbsImage !== null) {
        URL.revokeObjectURL(rhumbsImage.url)
      }
    },
    [rhumbsImage],
  )

  useEffect(
    () => () => {
      if (rhumbsVideo !== null) {
        URL.revokeObjectURL(rhumbsVideo.url)
      }
    },
    [rhumbsVideo],
  )

  if (!isAuthenticated) {
    return <Navigate to={RHUMBS_ROUTES.RHUMBS} replace />
  }

  const rhumbsDraftName = rhumbsName ?? rhumbsDraft?.name ?? ''
  const rhumbsDraftDescription = rhumbsDescription ?? rhumbsDraft?.description ?? ''
  const rhumbsDraftGeoAzimuth = rhumbsGeoAzimuth ?? String(rhumbsDraft?.geoAzimuth ?? '')
  const rhumbsDraftMagAzimuth = rhumbsMagAzimuth ?? String(rhumbsDraft?.magAzimuth ?? '')
  const rhumbsDraftImage = rhumbsDraft === null ? (rhumbsImage?.url ?? null) : rhumbsDraft.imageUrl
  const rhumbsDraftVideo = rhumbsDraft === null ? (rhumbsVideo?.url ?? null) : rhumbsDraft.videoUrl

  const submitRhumbsDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (rhumbsDraft === null) {
      dispatch(
        createRhumbs({
          name: rhumbsDraftName,
          image: rhumbsImage?.file ?? null,
          video: rhumbsVideo?.file ?? null,
        }),
      )
      return
    }

    dispatch(
      publishRhumbs({
        name: rhumbsDraftName,
        description: rhumbsDraftDescription,
        geoAzimuth: Number(rhumbsDraftGeoAzimuth),
        magAzimuth: Number(rhumbsDraftMagAzimuth),
      }),
    )
      .unwrap()
      .then(() => navigate(RHUMBS_ROUTES.RHUMBS))
      .catch(() => null)
  }

  return (
    <>
      <h1 className="rhumbs-draft__title">Добавление румба</h1>
      <Form className="rhumbs-draft__form" onSubmit={submitRhumbsDraft}>
        <div className="rhumbs-draft__media">
          <div
            className="rhumbs-draft__preview"
            style={{
              backgroundImage:
                rhumbsDraftImage === null
                  ? `url('${RHUMBS_DEFAULT_IMAGE}')`
                  : `url('${rhumbsDraftImage}'), url('${RHUMBS_DEFAULT_IMAGE}')`,
            }}
          />
          {rhumbsDraft === null && (
            <Form.Label bsPrefix="rhumbs-button" className="rhumbs-button--small">
              Выбрать
              <input
                className="rhumbs-draft__file"
                type="file"
                accept="image/*"
                onChange={(event) => setRhumbsImage(getRhumbsDraftFile(event))}
              />
            </Form.Label>
          )}
        </div>

        <div className="rhumbs-draft__media">
          <video
            key={rhumbsDraftVideo ?? RHUMBS_DEFAULT_VIDEO}
            className="rhumbs-draft__preview"
            preload="metadata"
            muted
            playsInline
          >
            {rhumbsDraftVideo !== null && <source src={`${rhumbsDraftVideo}#t=0.5`} />}
            <source src={`${RHUMBS_DEFAULT_VIDEO}#t=0.5`} type="video/mp4" />
          </video>
          {rhumbsDraft === null && (
            <Form.Label bsPrefix="rhumbs-button" className="rhumbs-button--small">
              Выбрать
              <input
                className="rhumbs-draft__file"
                type="file"
                accept="video/*"
                onChange={(event) => setRhumbsVideo(getRhumbsDraftFile(event))}
              />
            </Form.Label>
          )}
        </div>

        <Form.Label bsPrefix="rhumbs-draft__label" htmlFor="rhumbs-name">
          Название
        </Form.Label>
        <Form.Control
          bsPrefix="rhumbs-draft__input"
          id="rhumbs-name"
          type="text"
          required
          maxLength={64}
          value={rhumbsDraftName}
          onChange={(event) => setRhumbsName(event.target.value)}
        />

        {rhumbsDraft === null ? (
          <Button
            type="submit"
            bsPrefix="rhumbs-button"
            variant=""
            className="rhumbs-draft__submit"
            disabled={loading}
          >
            Далее
          </Button>
        ) : (
          <>
            <Form.Label bsPrefix="rhumbs-draft__label" htmlFor="rhumbs-description">
              Краткое описание
            </Form.Label>
            <Form.Control
              as="textarea"
              bsPrefix="rhumbs-draft__area"
              id="rhumbs-description"
              required
              maxLength={512}
              value={rhumbsDraftDescription}
              onChange={(event) => setRhumbsDescription(event.target.value)}
            />

            <Form.Label bsPrefix="rhumbs-draft__label" htmlFor="rhumbs-geographic">
              Географический азимут
            </Form.Label>
            <Form.Control
              bsPrefix="rhumbs-draft__input"
              id="rhumbs-geographic"
              type="number"
              min={0}
              max={359}
              step={1}
              required
              value={rhumbsDraftGeoAzimuth}
              onChange={(event) => setRhumbsGeoAzimuth(event.target.value)}
            />

            <Form.Label bsPrefix="rhumbs-draft__label" htmlFor="rhumbs-magnetic">
              Магнитный азимут
            </Form.Label>
            <Form.Control
              bsPrefix="rhumbs-draft__input"
              id="rhumbs-magnetic"
              type="number"
              min={0}
              max={359.9}
              step={0.1}
              required
              value={rhumbsDraftMagAzimuth}
              onChange={(event) => setRhumbsMagAzimuth(event.target.value)}
            />

            <Button
              type="submit"
              bsPrefix="rhumbs-button"
              variant=""
              className="rhumbs-draft__submit"
              disabled={loading}
            >
              Опубликовать
            </Button>
          </>
        )}
      </Form>
    </>
  )
}

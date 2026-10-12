import { useState, type FC } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import type { RhumbsOutletData } from '../../RhumbsLayout'
import { getRhumbsById } from '../../modules/rhumbsData'
import { RHUMBS_ROUTES } from '../../RhumbsRoutes'
import './RhumbsFeedPage.css'

// Заглушка из public: показывается, если videoUrl = null или видео не загрузилось
const RHUMBS_DEFAULT_VIDEO = '/rhumbs-default.mp4'
// Длиннее этого описание показывается обрезанным, с кнопкой «Ещё»
const RHUMBS_SHORT_LENGTH = 80

// Краткое описание: обрезка по последнему пробелу до RHUMBS_SHORT_LENGTH символов
const getRhumbsShortDescription = (description: string): string => {
  const cutIndex = description.lastIndexOf(' ', RHUMBS_SHORT_LENGTH)
  return `${description.slice(0, cutIndex > 0 ? cutIndex : RHUMBS_SHORT_LENGTH)}…`
}

export const RhumbsFeedPage: FC = () => {
  const { id } = useParams()
  const { rhumbsList } = useOutletContext<RhumbsOutletData>()
  const navigate = useNavigate()
  // Состояния привязаны к id румба, поэтому при переходе к следующему сбрасываются сами:
  // у какого румба раскрыто описание и у какого не загрузилось видео
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [failedVideoId, setFailedVideoId] = useState<number | null>(null)

  const rhumbsId = Number(id)
  // Румб берётся из текущего списка плитки, а если его там нет — из mock по id
  const rhumbsIndex = rhumbsList.findIndex((listRhumbs) => listRhumbs.id === rhumbsId)
  const rhumbs = rhumbsIndex === -1 ? getRhumbsById(rhumbsId) : rhumbsList[rhumbsIndex]

  if (!rhumbs) {
    return <p className="rhumbsFeedMissing">Румб не найден</p>
  }

  // Следующий — по порядку в текущем списке, после последнего — первый
  const nextRhumbs =
    rhumbsList.length > 0 ? rhumbsList[(rhumbsIndex + 1) % rhumbsList.length] : undefined

  const description = rhumbs.description ?? ''
  const isLong = description.length > RHUMBS_SHORT_LENGTH
  const isExpanded = expandedId === rhumbs.id

  return (
    <div className="rhumbsFeedPage">
      <video
        className="rhumbsFeedVideo"
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

      <div className="rhumbsFeedInfo">
        <h1 className="rhumbsFeedName">{rhumbs.name}</h1>
        {description !== '' && (
          <p className="rhumbsFeedDescription">
            {isLong && !isExpanded ? getRhumbsShortDescription(description) : description}
          </p>
        )}
        {isLong && (
          <Button
            variant="link"
            className="rhumbsFeedMore"
            onClick={() => setExpandedId(isExpanded ? null : rhumbs.id)}
          >
            {isExpanded ? 'Свернуть' : 'Ещё'}
          </Button>
        )}
      </div>

      <div className="rhumbsFeedRail">
        <div className="rhumbsFeedAzimuth">
          <span className="rhumbsFeedAzimuthValue">{rhumbs.geoAzimuth}°</span>
          <span className="rhumbsFeedAzimuthLabel">Географический</span>
        </div>
        <div className="rhumbsFeedAzimuth">
          <span className="rhumbsFeedAzimuthValue">{rhumbs.magAzimuth}°</span>
          <span className="rhumbsFeedAzimuthLabel">Магнитный</span>
        </div>
        {/* У гостя лайк неактивен; иконка закрашена, если isLiked = 1 */}
        <Button variant="link" className="rhumbsFeedLike" disabled>
          <svg
            className={rhumbs.isLiked === 1 ? 'rhumbsFeedHeart rhumbsFeedHeartLiked' : 'rhumbsFeedHeart'}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          {rhumbs.likesCount}
        </Button>
        <Button
          size="sm"
          className="rhumbsButton"
          disabled={nextRhumbs === undefined}
          onClick={() => {
            if (nextRhumbs) {
              navigate(`${RHUMBS_ROUTES.RHUMBS_FEED}/${nextRhumbs.id}`)
            }
          }}
        >
          Следующий
        </Button>
      </div>
    </div>
  )
}

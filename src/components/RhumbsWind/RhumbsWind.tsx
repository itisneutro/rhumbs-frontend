import type { FC } from 'react'

const RHUMBS_WIND_LINES = Array.from({ length: 7 }, (_, rhumbsIndex) => rhumbsIndex)

export const RhumbsWind: FC = () => (
  <div className="rhumbs-wind" aria-hidden="true">
    {RHUMBS_WIND_LINES.map((rhumbsLine) => (
      <span key={rhumbsLine} className="rhumbs-wind__line" />
    ))}
  </div>
)

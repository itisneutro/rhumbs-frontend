import type { CSSProperties, FC } from 'react'

type RhumbsCompassProps = {
  className: string
  geoAzimuth: number | null
  magAzimuth: number | null
}

export const RhumbsCompass: FC<RhumbsCompassProps> = ({ className, geoAzimuth, magAzimuth }) => {
  if (geoAzimuth === null || magAzimuth === null) {
    return null
  }

  const rhumbsCompassAngles = {
    '--rhumbs-geo': `${geoAzimuth}deg`,
    '--rhumbs-mag': `${magAzimuth}deg`,
  } as CSSProperties

  return (
    <div className={`rhumbs-rose ${className}`} style={rhumbsCompassAngles}>
      <svg className="rhumbs-rose__star" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="rhumbs-rose__ring" cx="50" cy="50" r="47" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--hollow" points="56.36,43.64 54.77,35.23 69.09,30.91" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--filled" points="56.36,43.64 69.09,30.91 64.77,45.23" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--hollow" points="56.36,56.36 64.77,54.77 69.09,69.09" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--filled" points="56.36,56.36 69.09,69.09 54.77,64.77" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--hollow" points="43.64,56.36 45.23,64.77 30.91,69.09" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--filled" points="43.64,56.36 30.91,69.09 35.23,54.77" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--hollow" points="43.64,43.64 35.23,45.23 30.91,30.91" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--filled" points="43.64,43.64 30.91,30.91 45.23,35.23" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--hollow" points="50,50 43.64,43.64 50,10" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--filled" points="50,50 50,10 56.36,43.64" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--hollow" points="50,50 56.36,43.64 90,50" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--filled" points="50,50 90,50 56.36,56.36" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--hollow" points="50,50 56.36,56.36 50,90" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--filled" points="50,50 50,90 43.64,56.36" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--hollow" points="50,50 43.64,56.36 10,50" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <polygon className="rhumbs-rose__half rhumbs-rose__half--filled" points="50,50 10,50 43.64,43.64" />
        <polygon className="rhumbs-rose__ray" points="50,50 43.64,43.64 50,10 56.36,43.64" />
        <g className="rhumbs-rose__needle">
          <line x1="50" y1="50" x2="50" y2="11" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <polygon points="50,5 47.8,11 52.2,11" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </g>
        <circle className="rhumbs-rose__hub" cx="50" cy="50" r="3.5" />
      </svg>
    </div>
  )
}

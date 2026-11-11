import type { RhumbsResponseDto } from '../api/Api'
import type { RhumbsResponse } from './rhumbsTypes'

const RHUMBS_MINIO_URL = 'http://localhost:9000/'

const getRhumbsMediaUrl = (rhumbsUrl: string | null): string | null =>
  rhumbsUrl !== null && rhumbsUrl.startsWith(RHUMBS_MINIO_URL)
    ? `/minio/${rhumbsUrl.slice(RHUMBS_MINIO_URL.length)}`
    : rhumbsUrl

export const getRhumbsMedia = (rhumbsDto: RhumbsResponseDto): RhumbsResponse => {
  const rhumbs = rhumbsDto as unknown as RhumbsResponse

  return {
    ...rhumbs,
    imageUrl: getRhumbsMediaUrl(rhumbs.imageUrl),
    videoUrl: getRhumbsMediaUrl(rhumbs.videoUrl),
  }
}

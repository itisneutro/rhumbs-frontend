export type RhumbsResponse = {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  videoUrl: string | null
  geoAzimuth: number | null
  magAzimuth: number | null
  likesCount: number
  isCreator: number
  isLiked: number
}

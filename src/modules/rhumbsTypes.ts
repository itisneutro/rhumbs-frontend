// Румб в ответе API бэкенда: всегда ровно 10 полей, пустые значения — null
export type RhumbsResponse = {
  id: number
  name: string
  description: string | null
  imageUrl: string | null // http://localhost:9000/rhumbs/<ключ>
  videoUrl: string | null
  geoAzimuth: number | null // географический азимут, градусы, целое 0–359
  magAzimuth: number | null // магнитный азимут для Москвы, 0–359.9
  likesCount: number
  isCreator: number // 0/1 — создатель = текущий пользователь
  isLiked: number // 0/1 — текущий пользователь поставил лайк
}

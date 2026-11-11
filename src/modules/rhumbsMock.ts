import type { RhumbsResponse } from './rhumbsTypes'

export const RHUMBS_MOCK: RhumbsResponse[] = [
  {
    id: 1,
    name: 'Северный',
    description:
      'Ветер с севера. На путевом угле 130° даёт попутную составляющую около 0,64 ' +
      'скорости ветра и умеренный снос вправо. Время полёта Лондон–Париж сокращается.',
    imageUrl: '/rhumbs-mock/rhumbs-north.jpg',
    videoUrl: '/rhumbs-mock/rhumbs-north.mp4',
    geoAzimuth: 0,
    magAzimuth: 348.5,
    likesCount: 3,
    isCreator: 0,
    isLiked: 0,
  },
  {
    id: 2,
    name: 'Северо-восточный',
    description:
      'Ветер с северо-востока. Угол к путевому близок к 95°, продольная составляющая ' +
      'почти нулевая. Время полёта меняется незначительно, основной эффект — боковой снос.',
    imageUrl: null,
    videoUrl: null,
    geoAzimuth: 45,
    magAzimuth: 33.5,
    likesCount: 0,
    isCreator: 0,
    isLiked: 0,
  },
  {
    id: 3,
    name: 'Восточный',
    description:
      'Ветер с востока. Даёт встречную составляющую около 0,77 скорости ветра. ' +
      'Путевая скорость Boeing-737 NG падает, время полёта растёт.',
    imageUrl: '/rhumbs-mock/rhumbs-east.jpg',
    videoUrl: '/rhumbs-mock/rhumbs-east.mp4',
    geoAzimuth: 90,
    magAzimuth: 78.5,
    likesCount: 2,
    isCreator: 0,
    isLiked: 0,
  },
  {
    id: 4,
    name: 'Юго-восточный',
    description:
      'Ветер с юго-востока, почти строго навстречу путевому углу 130°. ' +
      'Наихудший румб маршрута: встречная составляющая близка к полной скорости ветра, ' +
      'время полёта максимально.',
    imageUrl: '/rhumbs-mock/rhumbs-south-east.jpg',
    videoUrl: '/rhumbs-mock/rhumbs-south-east.mp4',
    geoAzimuth: 135,
    magAzimuth: 123.5,
    likesCount: 2,
    isCreator: 0,
    isLiked: 0,
  },
  {
    id: 5,
    name: 'Южный',
    description:
      'Ветер с юга. Встречная составляющая около 0,64 скорости ветра при заметном сносе ' +
      'влево. Время полёта увеличивается умеренно.',
    imageUrl: '/rhumbs-mock/rhumbs-south.jpg',
    videoUrl: '/rhumbs-mock/rhumbs-south.mp4',
    geoAzimuth: 180,
    magAzimuth: 168.5,
    likesCount: 1,
    isCreator: 0,
    isLiked: 0,
  },
  {
    id: 7,
    name: 'Западный',
    description:
      'Ветер с запада. Попутная составляющая около 0,77 скорости ветра. ' +
      'Путевая скорость растёт, время полёта Лондон–Париж сокращается заметно.',
    imageUrl: '/rhumbs-mock/rhumbs-west.jpg',
    videoUrl: '/rhumbs-mock/rhumbs-west.mp4',
    geoAzimuth: 270,
    magAzimuth: 258.5,
    likesCount: 1,
    isCreator: 0,
    isLiked: 0,
  },
]

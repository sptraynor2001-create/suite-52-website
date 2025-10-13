export interface Song {
  id: string
  title: string
  artist?: string
  releaseDate: string
  coverImage?: string
  spotifyUrl?: string
  appleMusicUrl?: string
  youtubeUrl?: string
  description?: string
}

export interface Show {
  id: string
  date: string
  venue: string
  city: string
  state?: string
  country?: string
  ticketUrl?: string
  time?: string
  description?: string
  image?: string
  isSoldOut?: boolean
}

export interface SocialLinks {
  instagram?: string
  tiktok?: string
  spotify?: string
  appleMusic?: string
  youtube?: string
  facebook?: string
  twitter?: string
}


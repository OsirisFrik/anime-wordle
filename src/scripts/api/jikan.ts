import axios from 'axios'

const request = axios.create({
  baseURL: 'https://api.jikan.moe/v4'
})

export interface Character {
  character: {
    images: {
      jpg: {
        image_url: string
      }
      webp: {
        image_url: string
        small_image_url: string
      }
    }
    mal_id: number
    name: string
    url: string
  }
  role: string
  voice_actor: any[]
}

export async function getCharacters(animeId: string | number) {
  return request({
    url: `/anime/${animeId}/characters`,
    method: 'get'
  }).then(({ data }) => data.data as Character[])
}

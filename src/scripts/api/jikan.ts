import axios from 'axios'

const request = axios.create({
  baseURL: 'https://api.jikan.moe/v4'
})

export async function getCharacters(animeId: string | number) {
  return request({
    url: `/anime/${animeId}/characters`,
    method: 'get'
  }).then(({ data }) => data)
}

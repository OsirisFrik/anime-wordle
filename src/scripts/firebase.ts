import { initializeApp } from 'firebase/app'
import { getAnalytics, logEvent, setUserId } from 'firebase/analytics'
import config from './firebase-config'

export const app = initializeApp(config)
export const analytics = getAnalytics(app)



export async function LogEvent(name: string, params?: any) {
  logEvent(analytics, name, params)
}

export async function setUser(id: string) {
  setUserId(analytics, id)
}

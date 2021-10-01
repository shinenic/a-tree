import {
  TOKEN_VALUE_TTL,
  TOKEN_GUIDE_LOCAL_STORAGE_KEY,
  NEW_TOKEN_PATHNAME,
  PHASE,
} from 'constants/tokenPage'
import { toSafeInteger, values } from 'lodash'

export const storePhase = (phase = 0, prevUrl) => {
  if (phase === PHASE.NONE || !values(PHASE).includes(phase)) {
    localStorage.removeItem(TOKEN_GUIDE_LOCAL_STORAGE_KEY)
  } else {
    console.log({ prevUrl, a: window.location.href })
    const value = { phase, timestamp: new Date().getTime(), prevUrl }
    localStorage.setItem(TOKEN_GUIDE_LOCAL_STORAGE_KEY, JSON.stringify(value))
  }
}

export const getCurrentPhase = () => {
  try {
    const { phase, timestamp, prevUrl } = JSON.parse(
      localStorage.getItem(TOKEN_GUIDE_LOCAL_STORAGE_KEY)
    )

    if (new Date().getTime() - toSafeInteger(timestamp) > TOKEN_VALUE_TTL) {
      throw new Error('Timeout')
    }

    return { phase: toSafeInteger(phase), prevUrl }
  } catch {
    storePhase()
    return { phase: 0 }
  }
}

export const startTokenGuide = () => {
  storePhase(PHASE.START_TOUR, window.location.href)
  window.location.href = NEW_TOKEN_PATHNAME
}

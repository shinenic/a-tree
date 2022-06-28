import { useState, useEffect } from 'react'
import { isLocalMode } from 'constants/base'
import { listenTurboEvent } from 'utils/pjax'

const listenLocation = (callback) => {
  let currentLocation = { ...(window?.location ?? {}) }

  const handleCallback = () => {
    const newLocation = { ...(window?.location ?? {}) }

    if (newLocation?.pathname !== currentLocation?.pathname) {
      currentLocation = newLocation
      callback({ ...newLocation })
    }
  }

  return listenTurboEvent(handleCallback)
}

const useListenLocation = () => {
  const [currentLocation, setCurrentLocation] = useState({ ...window.location })

  useEffect(() => {
    const unlisten = listenLocation(setCurrentLocation)

    return unlisten
  }, [])

  return currentLocation
}

/**
 * @TODO Add dummy location listener for local development
 */
const useDummyListenLocation = () => {
  return {
    href: 'https://github.com/shinenic/a-tree/pull/123',
    origin: 'https://github.com',
    host: 'github.com',
    hostname: 'github.com',
    pathname: '/shinenic/a-tree/pull/19716'
  }
}

export default isLocalMode ? useDummyListenLocation : useListenLocation

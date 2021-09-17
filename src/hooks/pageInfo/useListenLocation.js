import { useState, useEffect } from 'react'
import { GLOBAL_MESSAGE_TYPE } from 'constants'
import { isLocalMode } from 'constants'

const useListenLocation = () => {
  const [currentLocation, setCurrentLocation] = useState({ ...window.location })

  useEffect(() => {
    const callback = (request) => {
      if (request?.type === GLOBAL_MESSAGE_TYPE.ON_HISTORY_UPDATED) {
        setCurrentLocation({ ...window.location })
      }
    }

    window.chrome.runtime.onMessage.addListener(callback)

    return () => window.chrome.runtime.onMessage.removeListener(callback)
  }, [])

  return currentLocation
}

/**
 * @TODO Add dummy location listener for local development
 */
const useDummyListenLocation = () => {
  return {
    href: 'https://github.com/shinenic/a-tree',
    origin: 'https://github.com',
    host: 'github.com',
    hostname: 'github.com',
    pathname: '/shinenic/a-tree',
  }
}

export default isLocalMode ? useDummyListenLocation : useListenLocation

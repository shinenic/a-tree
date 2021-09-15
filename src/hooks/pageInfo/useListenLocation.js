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

const useNativeListenLocation = () => {
  const [currentLocation, setCurrentLocation] = useState({ ...window.location })

  useEffect(() => {
    const callback = (event) => {
      setCurrentLocation({
        host: window.location.host,
        pathname: event.detail.pathname,
      })
    }

    window.addEventListener(GLOBAL_MESSAGE_TYPE.ON_HISTORY_UPDATED, callback)

    return () =>
      window.removeEventListener(
        GLOBAL_MESSAGE_TYPE.ON_HISTORY_UPDATED,
        callback
      )
  }, [])

  // return currentLocation
  return {
    href: 'https://github.com/shinenic/a-tree',
    origin: 'https://github.com',
    host: 'github.com',
    hostname: 'github.com',
    pathname: '/shinenic/a-tree',
  }
}

export default isLocalMode ? useNativeListenLocation : useListenLocation

import { useState, useEffect } from 'react'
import { GLOBAL_MESSAGE_TYPE, isLocalMode } from 'constants'
import useRequestEnd from '../useRequestEnd'

const useListenLocation = () => {
  const [currentLocation, setCurrentLocation] = useState({ ...window.location })
  const requestTimestamp = useRequestEnd()

  useEffect(() => {
    const callback = (request) => {
      if (request?.type === GLOBAL_MESSAGE_TYPE.ON_HISTORY_UPDATED) {
        setCurrentLocation({ ...window.location })
      }
    }

    window.chrome.runtime.onMessage.addListener(callback)

    return () => window.chrome.runtime.onMessage.removeListener(callback)
  }, [])

  useEffect(() => {
    if (requestTimestamp) {
      setCurrentLocation({ ...window.location })
    }
  }, [requestTimestamp])

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
    pathname: '/shinenic/a-tree/pull/123',
  }
}

export default isLocalMode ? useDummyListenLocation : useListenLocation

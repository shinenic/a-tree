import { useState, useEffect } from 'react'
import { GLOBAL_MESSAGE_TYPE } from 'constants'

const useListenLocation = () => {
  const [currentLocation, setCurrentLocation] = useState({ ...location })

  useEffect(() => {
    const callback = (request) => {
      if (request?.type === GLOBAL_MESSAGE_TYPE.ON_HISTORY_UPDATED) {
        setCurrentLocation({ ...location })
      }
    }

    chrome.runtime.onMessage.addListener(callback)

    return () => chrome.runtime.onMessage.removeListener(callback)
  }, [])

  return currentLocation
}

export default useListenLocation

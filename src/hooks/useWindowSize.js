import { useEffect, useState, useCallback } from 'react'
import { throttle } from 'lodash'

const useWindowSize = (wait = 500) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const updateSize = useCallback(
    throttle(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }, wait),
    []
  )

  useEffect(() => {
    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return windowSize
}

export default useWindowSize

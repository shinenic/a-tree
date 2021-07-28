import { useEffect, useRef } from 'react'

const defaultEvents = ['mousedown', 'touchstart']

const useClickAway = (onClickAway, events = defaultEvents) => {
  const containerRef = useRef(null)
  const savedCallback = useRef(onClickAway)

  useEffect(() => {
    savedCallback.current = onClickAway
  }, [onClickAway])

  useEffect(() => {
    const handler = (event) => {
      const { current: el } = containerRef
      el && !el.contains(event.target) && savedCallback.current(event)
    }

    for (const eventName of events) {
      document.addEventListener(eventName, handler)
    }

    return () => {
      for (const eventName of events) {
        document.removeEventListener(eventName, handler)
      }
    }
  }, [events, containerRef])

  return containerRef
}

export default useClickAway

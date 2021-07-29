import { useEffect, useRef } from 'react'

const useClickOutside = (onClickAway) => {
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

    document.addEventListener('mousedown', handler, { capture: false })
    return () => {
      document.removeEventListener('mousedown', handler, { capture: false })
    }
  }, [containerRef])

  return containerRef
}

export default useClickOutside

import { useEffect, useRef } from 'react'

const useClickOutside = (onClickAway, enabled = true, exceptIds = []) => {
  const containerRef = useRef(null)
  const savedCallback = useRef(onClickAway)

  useEffect(() => {
    savedCallback.current = onClickAway
  }, [onClickAway])

  useEffect(() => {
    if (!enabled) return

    const handler = (event) => {
      const { current: el } = containerRef

      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target)) return

      // Do nothing if clicking path doesn't contain any of the exceptIds
      if (
        exceptIds.length !== 0 &&
        event.path.some(({ id }) => exceptIds.includes(id))
      ) {
        return
      }

      savedCallback.current(event)
    }

    document.addEventListener('mousedown', handler, { capture: false })
    return () => {
      document.removeEventListener('mousedown', handler, { capture: false })
    }
  }, [containerRef, enabled, exceptIds])

  return containerRef
}

export default useClickOutside
